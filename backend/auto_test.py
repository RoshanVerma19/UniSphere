
import os
import requests
from urllib.parse import urljoin

BASE = "http://127.0.0.1:8081"
TIMEOUT = 15


def find_access_token(obj):
    if isinstance(obj, dict):
        token = obj.get("access_token")
        if isinstance(token, str):
            return token

        for value in obj.values():
            found = find_access_token(value)
            if found:
                return found

    elif isinstance(obj, list):
        for value in obj:
            found = find_access_token(value)
            if found:
                return found

    return None


def login(portal):
    email = os.getenv(f"UNISPHERE_{portal.upper()}_EMAIL")
    password = os.getenv(f"UNISPHERE_{portal.upper()}_PASSWORD")

    if not email or not password:
        print(f"SKIP {portal} login: credentials not configured.")
        return None

    client = requests.Session()
    client.headers.update({"Accept": "application/json"})

    try:
        response = client.post(
            f"{BASE}/api/v1/auth/login",
            json={
                "email": email,
                "password": password,
                "portal": portal,
            },
            timeout=TIMEOUT,
        )

        print(f"{response.status_code} POST /api/v1/auth/login [{portal}]")

        if not response.ok:
            print(f"{portal} login failed; response body hidden.")
            client.close()
            return None

        token = find_access_token(response.json())

        if not token:
            print(f"{portal} login returned no access token.")
            client.close()
            return None

        client.headers["Authorization"] = f"Bearer {token}"
        print(f"{portal.capitalize()} token obtained (hidden).")
        return client

    except (requests.RequestException, ValueError) as exc:
        print(f"{portal} login error: {type(exc).__name__}")
        client.close()
        return None


def main():
    clients = {}
    results = []
    skipped = 0

    anonymous = requests.Session()
    anonymous.headers.update({"Accept": "application/json"})

    try:
        spec_response = anonymous.get(
            f"{BASE}/openapi.json", timeout=TIMEOUT
        )
        spec_response.raise_for_status()
        spec = spec_response.json()
    except (requests.RequestException, ValueError) as exc:
        print(f"Cannot load backend OpenAPI spec: {exc}")
        return

    print("\n=== UNISPHERE AUTOMATED API TEST ===")

    # Health check does not need a user role.
    try:
        response = anonymous.get(
            f"{BASE}/api/health", timeout=TIMEOUT
        )
        results.append(("public", "/api/health", response.status_code))
        print(f"{response.status_code} GET /api/health")
    except requests.RequestException as exc:
        results.append(("public", "/api/health", "ERROR"))
        print(f"ERROR GET /api/health: {type(exc).__name__}")

    # Authenticate each portal separately.
    for portal in ("student", "faculty"):
        clients[portal] = login(portal)

    paths = spec.get("paths", {})

    for path, methods in paths.items():
        if path == "/api/health":
            continue

        if "{" in path or "}" in path:
            print(f"SKIP {path} (requires a resource ID)")
            skipped += 1
            continue

        operation = methods.get("get")
        if operation is None:
            continue

        # Select a client based on the route's role.
        if path.startswith("/api/v1/student/"):
            role = "student"
        elif path.startswith("/api/v1/faculty/"):
            role = "faculty"
        else:
            # Shared endpoints use faculty credentials if available;
            # otherwise test them without authentication.
            role = "faculty" if clients.get("faculty") else "public"

        client = clients.get(role) if role != "public" else anonymous

        if client is None:
            print(f"SKIP GET {path} (no {role} login)")
            skipped += 1
            continue

        params = {}
        required_missing = False

        all_params = (
            methods.get("parameters", [])
            + operation.get("parameters", [])
        )

        for param in all_params:
            if param.get("in") != "query":
                continue

            schema = param.get("schema", {})
            name = param.get("name")

            if "default" in schema:
                params[name] = schema["default"]
            elif param.get("required"):
                required_missing = True

        if required_missing:
            print(f"SKIP GET {path} (required query value unknown)")
            skipped += 1
            continue

        try:
            response = client.get(
                urljoin(BASE, path),
                params=params,
                timeout=TIMEOUT,
            )
            results.append((role, path, response.status_code))
            print(f"{response.status_code} GET {path} [{role}]")

        except requests.RequestException as exc:
            results.append((role, path, "ERROR"))
            print(f"ERROR GET {path}: {type(exc).__name__}")

    print("\n=== SUMMARY ===")
    print(f"GET requests tested: {len(results)}")
    print(f"2xx successful: {sum(isinstance(c, int) and 200 <= c < 300 for _, _, c in results)}")
    print(f"401 unauthorized: {sum(c == 401 for _, _, c in results)}")
    print(f"403 forbidden: {sum(c == 403 for _, _, c in results)}")
    print(f"422 validation: {sum(c == 422 for _, _, c in results)}")
    print(f"5xx server errors: {sum(isinstance(c, int) and 500 <= c < 600 for _, _, c in results)}")
    print(f"Network errors: {sum(c == 'ERROR' for _, _, c in results)}")
    print(f"Skipped endpoints: {skipped}")
    print("\nNote: A 403 may be an expected permission restriction.")
    print("Review results using the account role and API requirements.")

    anonymous.close()
    for client in clients.values():
        if client:
            client.close()


if __name__ == "__main__":
    main()

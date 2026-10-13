# 🎓 UniSphere — University Management Platform

A modern, user-friendly university management platform designed to connect students and faculty in one place.

UniSphere helps students access academic information and provides faculty with tools to manage their academic activities through a simple and intuitive interface.

## 🚀 Live Website

- **Website URL:** Deployment in progress
- **Google Search Status:** Search indexing pending verification
- **GitHub Repository:** https://github.com/kartikeypatel9621-source/UniSphere

> Once deployment is complete, add the live website URL here. A website being accessible online does not automatically mean it has been indexed by Google.

## 🔐 Demo Login Credentials

Use the following demo account to explore the application.

### 👨‍🏫 Faculty Login

| Field | Details |
|---|---|
| Role | Faculty |
| Email | `faculty@example.com` |
| Password | `FacultyPass123` |

**How to log in:**
1. Open the UniSphere website.
2. Navigate to the Login page.
3. Enter the faculty demo email and password.
4. Sign in to access the faculty dashboard.

### 👨‍🎓 Student Login

| Field | Details |
|---|---|
| Role | Student |
| Email | `student@example.com` |
| Password | Not yet verified |

The student email is present in the project's user records, but its password has not yet been confirmed. Verify or reset the account password before publishing these credentials for visitors.

**How to log in:**
1. Open the UniSphere website.
2. Navigate to the Login page.
3. Enter the verified student demo credentials.
4. Sign in to explore the student dashboard.

> **Demo account notice:** These credentials are intended for demonstration purposes. Do not use real personal information or sensitive data in demo accounts.

## ✨ Key Features

- 🔑 **Role-Based Login:** Separate access for students and faculty.
- 🎓 **Student Dashboard:** A central place for student-facing academic features.
- 👨‍🏫 **Faculty Dashboard:** Dedicated access for faculty activities.
- 🤖 **AI Success Coach:** An AI-powered chat feature to support users.
- 🖥️ **Modern Interface:** A responsive frontend built with React.
- ⚡ **API Backend:** Backend services powered by FastAPI.

*Feature availability may depend on the current deployment and configuration.*

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React | Frontend user interface |
| Vite | Frontend development and build tool |
| JavaScript | Frontend functionality |
| Python | Backend development |
| FastAPI | REST API |
| SQLite | Local development database |

## 💻 Run Locally

### Prerequisites

- Node.js and npm
- Python
- Git

### 1. Clone the repository

```bash
git clone https://github.com/kartikeypatel9621-source/UniSphere.git
cd UniSphere
```

### 2. Start the backend

Open a terminal:

```bash
cd backend
```

Create and activate a virtual environment if one does not already exist, then install the dependencies:

```bash
python -m venv .venv
```

On Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Configure the required environment variables using the project's environment example file. Never publish real API keys or secret values.

Start the API:

```powershell
python -m uvicorn app.main:app --host 127.0.0.1 --port 8080 --reload
```

Backend API documentation:

http://127.0.0.1:8080/docs

### 3. Start the frontend

Open a second terminal:

```powershell
cd frontend
npm install
```

Configure the frontend API URL in the local `.env` file:

```env
VITE_API_BASE_URL=http://127.0.0.1:8080
```

Start the development server:

```powershell
npm run dev
```

Open the local website:

http://localhost:5173

## 📦 Production Build

To create a production frontend build:

```powershell
cd frontend
npm run build
```

Vite generates the production files in the `dist` directory.

For deployment, configure the frontend to use the deployed backend URL instead of `localhost`. Configure database persistence, environment variables, and production CORS settings before going live.

## 🔎 Google Search Visibility

To help people discover UniSphere through Google:

1. Deploy the website using a publicly accessible URL.
2. Connect a custom domain when available.
3. Configure a valid sitemap and `robots.txt`.
4. Add the website to [Google Search Console](https://search.google.com/search-console/about).
5. Verify domain ownership and submit the sitemap.
6. Request indexing of the homepage.

Google indexing is not guaranteed and may take time.

## 🔒 Security

- Never commit `.env` files, API keys, passwords, or private credentials.
- Use secure authentication and role-based authorization.
- Use HTTPS for production.
- Replace demo passwords before allowing public access to demo accounts.
- Use persistent production storage for user data.

## 🎯 Project Goal

UniSphere aims to make university-related digital interactions more accessible by providing students and faculty with a unified platform.

## 👨‍💻 Repository

GitHub: https://github.com/kartikeypatel9621-source/UniSphere

---

**UniSphere — One platform. A connected university.**
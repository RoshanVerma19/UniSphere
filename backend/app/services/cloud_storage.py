import cloudinary
import cloudinary.uploader

from app.config import get_settings


def upload_study_material(content: bytes, filename: str) -> dict:
    settings = get_settings()

    if not settings.cloudinary_url:
        raise RuntimeError("Cloudinary is not configured")

    cloudinary.config(url=settings.cloudinary_url)

    result = cloudinary.uploader.upload(
        content,
        resource_type="raw",
        public_id=f"study-materials/{filename}",
        overwrite=False,
    )

    return {
        "url": result["secure_url"],
        "public_id": result["public_id"],
    }

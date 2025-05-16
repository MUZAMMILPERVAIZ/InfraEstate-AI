# construction/__init__.py

# Expose the API router at the package level
from .api.router import router as router

__all__ = [
    "router",
]

import os
from typing import Optional

from dotenv import load_dotenv
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pydantic import BaseModel
from pymongo import MongoClient

# Load environment variables
load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
MONGO_URL = os.getenv('MONGO_ENDPOINT')
ALGORITHM = "HS256"

# MongoDB setup
client = MongoClient(MONGO_URL)
db = client.infra_estate_ai
users_collection = db.users

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


# TokenData model


class TokenData(BaseModel):
    email: Optional[str] = None


# Helper functions
def get_user(email: str):
    """Get user from database by email"""
    return users_collection.find_one({"email": email})


def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = get_user(email=token_data.email)
    if user is None:
        raise credentials_exception
    return user


def get_current_admin_user(token: str = Depends(oauth2_scheme)):
    """
    Get the current authenticated admin user

    This function validates the JWT token, ensures the user is an admin,
    and returns the user object
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        user = get_user(email)
        if user is None or user.get('role') != 'admin':
            raise credentials_exception
        return user
    except JWTError:
        raise credentials_exception


def is_query_limit_reached(email: str) -> bool:
    """Check if the user has reached their daily query limit"""
    from datetime import datetime

    user = users_collection.find_one({"email": email})
    if not user:
        raise ValueError("User not found")

    today = datetime.now().date()
    last_query_date = user.get('last_query_date', datetime.now()).date()

    # Default values for 'query_count' and 'query_limit' if they are None
    user_query_count = user.get('query_count', 0)
    user_query_limit = user.get('query_limit', 5)  # Default to 5 if 'query_limit' is missing

    # Reset the daily query count if it's a new day
    if last_query_date < today:
        from pymongo import ReturnDocument
        user = users_collection.find_one_and_update(
            {"email": email},
            {"$set": {"query_count": 0, "last_query_date": datetime.now(), "query_limit": user_query_limit}},
            return_document=ReturnDocument.AFTER
        )
        return False  # Allow at least one query for today

    # Check if the user has reached their limit
    return user_query_count >= user_query_limit


def increment_query_count(email: str):
    """Increment the user's query count"""
    from datetime import datetime

    result = users_collection.update_one(
        {"email": email},
        {"$inc": {"query_count": 1}, "$set": {"last_query_date": datetime.now()}}
    )
    return result.modified_count == 1

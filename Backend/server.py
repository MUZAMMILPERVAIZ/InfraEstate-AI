import json
import os
import time
import uuid

from langchain_community.embeddings import HuggingFaceBgeEmbeddings

# Append /usr/bin to PATH
os.environ["PATH"] += os.pathsep + "/usr/bin"
# Append /usr/bin to PATH

import threading

from pymongo import ReturnDocument
from fastapi.staticfiles import StaticFiles

from dotenv import load_dotenv
from fastapi import Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from fastapi.security import OAuth2PasswordRequestForm
from longtrainer.trainer import LongTrainer
from passlib.context import CryptContext
from pydub import AudioSegment
from fastapi import status
from jose import JWTError, jwt
from datetime import timedelta, timezone
from typing import List
from fastapi import FastAPI, Depends, UploadFile, File
from pymongo import MongoClient, DESCENDING
import os
import shutil
from ghfd import router as ghfd_router
from construction import router as construction_router

AudioSegment.converter = "/usr/bin/ffmpeg"
AudioSegment.ffprobe = "/usr/bin/ffprobe"

'''
##############################################################################################################################################
                                                    ENVIRONMENT VARIABLES CONFIGURATION
##############################################################################################################################################
'''

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
MONGO_URL = os.getenv('MONGO_ENDPOINT')

# os.environ['DISABLE_NEST_ASYNCIO']="True"  --loop asyncio

'''
##############################################################################################################################################
                                                    FASTAPI CONFIGURATION
##############################################################################################################################################
'''

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# app.add_middleware(
#     SessionMiddleware,
#     secret_key=SESSION_MIDDLEWARE_KEY,
#     session_cookie='session'  # Optional: customize the name of the session cookie
# )

# Include the construction router
app.include_router(construction_router)
app.include_router(ghfd_router, prefix="/ghfd")
os.makedirs("static", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

'''
##############################################################################################################################################
                                                   LOGIN / SIGNUP MANAGEMENT FUNCTIONS
##############################################################################################################################################
'''

# MongoDB setup
client = MongoClient(MONGO_URL)
db = client.infra_estate_ai
otp_collection = db.otps
users_collection = db.users
longtrainer_db = client['longtrainer_db']

# Setup construction collections if they don't exist
if "construction_rates" not in db.list_collection_names():
    # Initialize with default rates
    from construction.api.models import ConstructionRates

    default_rates = ConstructionRates().dict()
    db.construction_rates.insert_one(default_rates)

# Secret key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 720
REFRESH_TOKEN_EXPIRE_DAYS = 7

# Pydantic models
from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime


class User(BaseModel):
    name: Optional[str] = None
    email: EmailStr
    password: Optional[str] = None
    role: Optional[str] = None
    auth_method: str = Field(default="local")
    created_at: datetime = Field(default_factory=datetime.now)  # Add this line
    query_count: int = 0
    query_limit: int = 5
    approval_status: str = 'Approved'
    subscription_status: str = "inactive"
    plan_name: str = "FREE"
    last_query_date: Optional[datetime] = None  # Track the last query date
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    phone_number: Optional[str] = None


class UserInDB(User):
    hashed_password: Optional[str] = None


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    id: str
    email: Optional[EmailStr] = None
    role: Optional[str] = None


def increment_query_count(email: str):
    result = db.users.update_one(
        {"email": email},
        {"$inc": {"query_count": 1}, "$set": {"last_query_date": datetime.now()}}
    )
    return result.modified_count == 1


def is_query_limit_reached(email: str) -> bool:
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
        new_daily_limit = 1 if user_query_count >= user_query_limit else user_query_limit
        user = users_collection.find_one_and_update(
            {"email": email},
            {"$set": {"query_count": 0, "last_query_date": datetime.now(), "query_limit": new_daily_limit}},
            return_document=ReturnDocument.AFTER
        )
        return False  # Allow at least one query for today

    # Use the potentially updated user document to check query count against limit
    return user_query_count >= user_query_limit


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Password hashing setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# Helper functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def get_user(email: str):
    return users_collection.find_one({"email": email})


class RefreshToken(BaseModel):
    refresh_token: str


def authenticate_user(email: str, password: str):
    user = get_user(email)
    if not user:
        return False
    if user["auth_method"] == "local" and not verify_password(password, user["hashed_password"]):
        return False
    return user


def create_access_token(*, data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def create_refresh_token(*, data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta if expires_delta else datetime.datetime.now(
        datetime.UTC) + timedelta(days=7)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


'''
##############################################################################################################################################
                                                    API & OTP CONFIGURATION 
##############################################################################################################################################
'''
import secrets
import string
from MailService import EMAIL_AGENT
import random


def generate_temporary_password(length=12):
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for i in range(length))


agent = EMAIL_AGENT()
LOGO_PATH = 'logo/Infra estate ai.png'


def send_admin_signup_email(email):
    global agent
    subject = "WELCOME TO INFRA-ESTATE AI"
    html_message = '''
    
     <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 20px;
                }
                .email-container {
                    max-width: 600px;
                    margin: auto;
                    background: #ffffff;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.15);
                }
                .email-header {
                    text-align: center;
                    padding: 20px 0;
                    background: #0073e6;
                    color: #ffffff;
                    border-radius: 10px 10px 0 0;
                }
                .email-body {
                    padding: 20px;
                    color: #333333;
                    line-height: 1.6;
                }
                .email-footer {
                    text-align: center;
                    font-size: 12px;
                    color: #777777;
                }
                .logo {
                    width: 120px;
                    margin-bottom: 10px;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="email-header">
                    <img class="logo" src="cid:logo" alt="INFRA-ESTATE AI Logo">
                    <h1>WELCOME TO INFRA-ESTATE AI</h1>
                </div>
                <div class="email-body">
                    <p>Thank you for signing up for INFRA-ESTATE AI. Your account is approved by  administrator.</p>
                </div>
                <div class="email-footer">
                    <p>Warm regards,<br>Team INFRA-ESTATE AI</p>
                </div>
            </div>
        </body>
    </html>
    '''
    attachments = {"logo": LOGO_PATH}
    return agent.send_email(subject, html_message, email, attachments=attachments)


def send_signup_email(email):
    global agent
    subject = "WELCOME TO INFRA-ESTATE AI"
    html_message = '''
    <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 20px;
                }
                .email-container {
                    max-width: 600px;
                    margin: auto;
                    background: #ffffff;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.15);
                }
                .email-header {
                    text-align: center;
                    padding: 20px 0;
                    background: #0073e6;
                    color: #ffffff;
                    border-radius: 10px 10px 0 0;
                }
                .email-body {
                    padding: 20px;
                    color: #333333;
                    line-height: 1.6;
                }
                .email-footer {
                    text-align: center;
                    font-size: 12px;
                    color: #777777;
                }
                .logo {
                    width: 120px;
                    margin-bottom: 10px;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="email-header">
                    <img class="logo" src="cid:logo" alt="INFRA-ESTATE AI Logo">
                    <h1>WELCOME TO INFRA-ESTATE AI</h1>
                </div>
                <div class="email-body">
                    <p> Thank you for signing up for INFRA-ESTATE AI.</p>
                </div>
                <div class="email-footer">
                    <p>Best regards,<br> Team INFRA-ESTATE AI</p>
                </div>
            </div>
        </body>
    </html>
    '''
    attachments = {"logo": LOGO_PATH}
    return agent.send_email(subject, html_message, email, attachments=attachments)


def send_otp_email(otp, email):
    global agent
    subject = "YOUR OTP for INFRA-ESTATE AI"

    html_message = f'''
        <html>
            <head>
                <style>
                    body {{
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 20px;
                    }}
                    .email-container {{
                        max-width: 600px;
                        margin: auto;
                        background: #ffffff;
                        padding: 20px;
                        border-radius: 10px;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.15);
                    }}
                    .email-header {{
                        text-align: center;
                        padding: 20px 0;
                        background: #0073e6;
                        color: #ffffff;
                        border-radius: 10px 10px 0 0;
                    }}
                    .email-body {{
                        padding: 20px;
                        color: #333333;
                        line-height: 1.6;
                    }}
                    .email-footer {{
                        text-align: center;
                        font-size: 12px;
                        color: #777777;
                    }}
                    .logo {{
                        width: 120px;
                        margin-bottom: 10px;
                    }}
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="email-header">
                        <img class="logo" src="cid:logo" alt="INFRA-ESTATE AI Logo">
                        <h1>YOUR OTP for INFRA-ESTATE AI</h1>
                    </div>
                    <div class="email-body">
                        <p>Your OTP is <strong>{otp}</strong>.</p>
                        <p>Please use this code to proceed. It will expire in 5 minutes.</p>
                    </div>
                    <div class="email-footer">
                        <p>Warm regards,<br>Team INFRA-ESTATE AI</p>
                    </div>
                </div>
            </body>
        </html>
        '''

    attachments = {"logo": LOGO_PATH}
    return agent.send_email(subject, html_message, email, attachments=attachments)


def generate_otp(email):
    otp = random.randint(100000, 999999)
    otp_collection.insert_one({
        "email": email,
        "otp": otp,
        "expires_at": datetime.utcnow() + timedelta(minutes=5)
    })
    return otp


@app.post("/generate-otp/")
async def send_otp(email: EmailStr):
    otp = generate_otp(email)
    send_otp_email(otp, email)
    return {"message": f"OTP sent to Email: {email}"}


@app.post("/verify-otp/")
async def verify_otp(email: EmailStr, otp: int):
    otp_record = otp_collection.find_one_and_delete({
        "email": email,
        "otp": otp,
        "expires_at": {"$gte": datetime.utcnow()}
    })
    if otp_record:
        return {"message": "OTP verified"}
    else:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")


@app.post("/signup/request-otp/")
async def signup_request_otp(email: EmailStr):
    # Check if user already exists
    existing_user = get_user(email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    otp = generate_otp(email)
    send_otp_email(otp, email)
    return {"message": "OTP sent to your email. Please verify to continue signup."}


'''
##############################################################################################################################################
                                                      FastAPI ENDPOINTS FOR USER MANAGEMENT
##############################################################################################################################################
'''


class SimplifiedUser(BaseModel):
    name: str
    email: EmailStr
    password: str
    otp: int


class SimplifiedAdmin(BaseModel):
    name: str
    email: EmailStr
    password: str
    otp: int


@app.post("/signup/user")
async def signup_user(user: SimplifiedUser):
    response_data = await common_signup_logic(user=user, role='user')
    return JSONResponse(content=response_data)


async def common_signup_logic(user: User, role: str):
    # Verify the OTP first
    otp_record = otp_collection.find_one_and_delete({
        "email": user.email,
        "otp": user.otp,
        "expires_at": {"$gte": datetime.utcnow()}
    })
    if not otp_record:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    db_user = get_user(user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = get_password_hash(user.password)
    users_collection.insert_one({
        "name": user.name,
        "email": user.email,
        "hashed_password": hashed_password,
        "role": role,
        "auth_method": "local",
        "is_active": True,
        "created_at": datetime.utcnow(),
    })

    send_signup_email(email=user.email)
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    refresh_token_expires = timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    access_token = create_access_token(data={"sub": user.email, "role": role},
                                       expires_delta=access_token_expires)
    refresh_token = create_refresh_token(data={"sub": user.email, "role": role},
                                         expires_delta=refresh_token_expires)
    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}


@app.post("/signup/admin")
async def signup_admin(admin: SimplifiedAdmin):
    response_data = await admin_signup_logic(user=admin, role='admin')
    return JSONResponse(content=response_data)


async def admin_signup_logic(user: User, role: str):
    # Verify the OTP first
    otp_record = otp_collection.find_one_and_delete({
        "email": user.email,
        "otp": user.otp,
        "expires_at": {"$gte": datetime.utcnow()}
    })
    if not otp_record:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    db_user = get_user(user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = get_password_hash(user.password)
    users_collection.insert_one({
        "name": user.name,
        "email": user.email,
        "hashed_password": hashed_password,
        "role": role,
        "auth_method": "local",
        "is_active": True,
        "created_at": datetime.utcnow(),
    })

    send_admin_signup_email(email=user.email)
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    refresh_token_expires = timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    access_token = create_access_token(data={"sub": user.email, "role": role},
                                       expires_delta=access_token_expires)
    refresh_token = create_refresh_token(data={"sub": user.email, "role": role},
                                         expires_delta=refresh_token_expires)
    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}


@app.post("/login/user", response_model=Token)
async def login_user(form_data: OAuth2PasswordRequestForm = Depends()):
    response_data = await common_login_logic(form_data, expected_role='user')
    return JSONResponse(content=response_data)


@app.post("/login/admin", response_model=Token)
async def login_admin(form_data: OAuth2PasswordRequestForm = Depends()):
    response_data = await common_login_logic(form_data, expected_role='admin')
    return JSONResponse(content=response_data)


async def common_login_logic(form_data: OAuth2PasswordRequestForm, expected_role: str):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password.")

    if user.get("is_active") == False and user.get("role") != 'admin':
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Account Suspended")

    # Check user role and approval status
    if user.get("role") != expected_role:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Role not matching.")

    # If approved, proceed to generate tokens
    refresh_token_expires = timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    access_token = create_access_token(data={"sub": user.get("email"), "role": user.get("role")},
                                       expires_delta=access_token_expires)
    refresh_token = create_refresh_token(data={"sub": user.get("email"), "role": user.get("role")},
                                         expires_delta=refresh_token_expires)
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "message": "Login successful"
    }


@app.post("/token/refresh")
async def refresh_token(refresh_token: str):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        user = get_user(email)
        if user is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": email, "role": user["role"]}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}


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
        if user is None or user['role'] != 'admin':
            raise credentials_exception
        return user
    except JWTError:
        raise credentials_exception


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    phone_number: Optional[str] = None


@app.put("/user/update")
async def update_user(update: UserUpdate, token: str = Depends(oauth2_scheme)):
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
        if user is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    update_data = {k: v for k, v in update.dict().items() if v is not None}
    if "password" in update_data:
        hashed_password = get_password_hash(update_data["password"])
        update_data["hashed_password"] = hashed_password
        del update_data["password"]

    print(update_data)
    users_collection.update_one({"email": update_data.get("email")}, {"$set": update_data})
    return {"message": "User updated successfully"}


class TokenData(BaseModel):
    email: Optional[str] = None


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


@app.get("/user/id")
async def get_user_id(current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("_id")
    if not user_id:
        raise HTTPException(status_code=404, detail="User not found")
    return {"user_id": str(user_id)}


@app.post("/password-reset/request")
async def password_reset_request(email: EmailStr):
    user = get_user(email)
    if user:
        otp = generate_otp(email)
        subject = "Your Password Reset OTP"
        message = f"Your OTP for password reset is: {otp}. It will expire in 5 minutes."
        response = agent.send_email(subject, message, email)
    return {"message": f"OTP sent to Email: {email}"}


@app.post("/password-reset/verify")
async def verify_otp_and_update_password(email: EmailStr, otp: int, new_password: str):
    otp_record = otp_collection.find_one_and_delete({
        "email": email,
        "otp": otp,
        "expires_at": {"$gte": datetime.now()}
    })
    if not otp_record:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    # Hash the new password
    hashed_password = get_password_hash(new_password)

    # Update the user's password
    update_result = users_collection.update_one(
        {"email": email},
        {"$set": {"hashed_password": hashed_password}}
    )
    if update_result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "Password has been updated successfully"}


@app.get("/user/me", response_model=User)
async def read_user_me(current_user: dict = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=404, detail="User not found")
    return current_user


@app.post("/admin/initialize-subscription-status/")
async def initialize_subscription_status(current_user: dict = Depends(get_current_admin_user)):
    if current_user['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Unauthorized access")

    # Update users where 'subscription_status' or 'plan_name' is not set
    update_result = users_collection.update_many(
        {
            "$or": [
                {"subscription_status": {"$exists": False}},
                {"plan_name": {"$exists": False}}
            ]
        },
        {
            "$set": {
                "subscription_status": "inactive",
                "plan_name": "FREE"
            }
        }
    )

    if update_result.modified_count == 0:
        return {"message": "No users needed updating."}

    return {"message": f"Updated {update_result.modified_count} users with default subscription values."}


@app.get("/user/status")
async def read_user_me(current_user: dict = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=404, detail="User not found")
    return {'status': current_user['approval_status']}


class subscriptionDetials(BaseModel):
    email: str
    plan_name: str
    subscription_status: str
    address: str
    city: str
    state: str
    country: str
    phone_number: str


@app.post("/admin/set-subscription/")
async def set_limit(data: subscriptionDetials, current_user: dict = Depends(get_current_admin_user)):
    if current_user['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Unauthorized")

    email = data.email
    plan_name = data.plan_name
    subscription_status = data.subscription_status
    address = data.address
    city = data.city
    state = data.state
    country = data.country
    phone_number = data.phone_number

    result = users_collection.update_one(
        {"email": email},
        {"$set": {
            "plan_name": plan_name,
            "subscription_status": subscription_status,
            "address": address,
            "city": city,
            "state": state,
            "country": country,
            "phone_number": phone_number
        }}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found or limit unchanged")
    return {"message": f"Subscription Status updated to {plan_name} for user {email}"}


'''
##############################################################################################################################################
                                                    LONGTRAINER CONFIGURATION
##############################################################################################################################################
'''

os.environ['AWS_ACCESS_KEY_ID'] = os.getenv('access_key')
os.environ['AWS_SECRET_ACCESS_KEY'] = os.getenv('access_secret')
os.environ['AWS_DEFAULT_REGION'] = os.getenv('region_name')

import boto3

bedrock_client = boto3.client(
    service_name='bedrock-runtime',
    region_name='us-east-1',
    aws_access_key_id=os.getenv('access_key'),
    aws_secret_access_key=os.getenv('access_secret')
)

from langchain_aws import ChatBedrock

#
# bedrock_embeddings = BedrockEmbeddings(
#     model_id="amazon.titan-embed-text-v2:0",
#     region_name="us-east-1",
#     client=bedrock_client
# )

MODEL_NAME = "BAAI/bge-small-en"  # Multilingual Embeddings
MODEL_KWARGS = {"device": "cpu"}
ENCODE_KWARGS = {"normalize_embeddings": True}

embeddings = HuggingFaceBgeEmbeddings(
    model_name=MODEL_NAME, model_kwargs=MODEL_KWARGS, encode_kwargs=ENCODE_KWARGS
)

bedrock_llm = ChatBedrock(
    model="us.anthropic.claude-3-5-sonnet-20241022-v2:0",
    # model_id="us.anthropic.claude-3-7-sonnet-20250219-v1:0",
    model_kwargs={"temperature": 0.5},
    client=bedrock_client
)

from langchain_google_genai import ChatGoogleGenerativeAI

os.environ["GOOGLE_API_KEY"] = "..."

llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash-exp-image-generation",
    temperature=0.2
)


def call_bedrock(prompt):
    response = bedrock_llm.invoke(prompt)
    # content = response.get('content')
    return response.content


ALLOWED_EXTENSIONS = {".txt", ".pdf", ".md", ".markdown", ".html", ".csv", ".docx", ".jpg", ".jpeg", ".png"}

prompt = """
Human: You are Infra AI, a highly specialized Pakistani Real Estate Advisory Assistant developed by ENDEVSOLS for the InfraEstate AI system. 
You are trained to assist users in real estate transactions, property buying/selling, market trend analysis, construction cost estimation, house design advice, and legal procedure guidance. 
You use Retrieval-Augmented Generation (RAG) from latest Pakistani real estate sources like Zameen.com, Graana.com, Lamudi.pk, and Business Recorder to ensure up-to-date, reliable, and factually correct answers.

When generating a response:
- First, clearly address the user's main question in 2-3 sentences.
- If applicable, offer additional practical tips.
- Ground your answers in real, retrieved information whenever possible.
- If insufficient information is available, politely inform the user and recommend trusted sites for verification.
- Maintain a friendly, professional tone with simple, actionable advice.
- Always end your reply with a small helpful follow-up suggestion (e.g., offering area guides, price estimation, or further help).

Avoid hallucination. Do not fabricate data or market values. Stick to the facts from your context.

Context: {context}

Chat History: {chat_history}

User Question: {question}

Assistant:
"""

trainer = LongTrainer(
    mongo_endpoint=MONGO_URL,
    llm=llm,
    embedding_model=embeddings,
    prompt_template=prompt,
    chunk_size=1024,
    num_k=15,
    chunk_overlap=100,
    max_token_limit=8192
)
trainer_lock = threading.Lock()

'''

##############################################################################################################################################
                                                    CHATBOTS MANAGEMENT FUNCTIONS
##############################################################################################################################################
'''

first_bot_id = None
if os.path.exists('bot.json'):
    first_bot_id = json.load(open('bot.json', 'r'))['bot_id']


class QueryData(BaseModel):
    query: str


def is_allowed_file(filename):
    return any(filename.endswith(ext) for ext in ALLOWED_EXTENSIONS)


def get_trainer():
    with trainer_lock:
        yield trainer


async def save_uploaded_file(file: UploadFile, bot_id: str) -> str:
    bot_folder = f"uploads/{bot_id}/files"
    os.makedirs(bot_folder, exist_ok=True)
    file_path = os.path.join(bot_folder, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    file.file.close()
    return file_path


def save_uploaded_images(files: List[UploadFile], bot_id: str):
    bot_folder = f"./uploads/{bot_id}/images"
    os.makedirs(bot_folder, exist_ok=True)
    image_paths = []
    for file in files:
        if not file.filename.lower().endswith(('.jpg', '.jpeg', '.png')):
            continue
        path = os.path.join(bot_folder, file.filename)
        with open(path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        file.file.close()
        image_paths.append(path)
    return image_paths


'''
##############################################################################################################################################
                                                      FastAPI ENDPOINTS FOR CHATBOT MANAGEMENT
##############################################################################################################################################
'''


def list_files_with_extensions(root_folder, extensions):
    all_paths = []
    for dirpath, _, filenames in os.walk(root_folder):
        for filename in filenames:
            if filename.startswith('~$'):
                continue
            if filename.lower().endswith(tuple(extensions)):
                all_paths.append(os.path.join(dirpath, filename))
    return all_paths


pakistan_real_estate_sources = [
    # Market Trends & Investment Insights
    # "https://www.zameen.com/trends/",
    # "https://www.graana.com/blog",
    # "https://www.ilaan.com/news",
    # "https://bloompakistan.com/category/real-estate/",
    # "https://www.brecorder.com/business-finance/real-estate",
    # "https://manahilestate.com/property-news/",
    # "https://www.worldpropertyjournal.com/real-estate-news/pakistan/",
    # "https://bloggers.feedspot.com/pakistan_real_estate_blogs/",
    # "https://alghanigarden.com/top-10-property-websites-in-pakistan-best-platforms-to-buy-sell-rent-real-estate/",
    # "https://www.urbancity.pk/best-real-estate-websites-in-pakistan-to-buy-sell-rent-proeprty/",

    # # Legal & Transactional Guidance
    # "https://www.zameen.com/news/category/legal-taxation",
    # "https://manahilestate.com/property-news/",
    # "https://bloompakistan.com/category/real-estate/",
    # "https://www.brecorder.com/business-finance/real-estate",
    # "https://www.ilaan.com/news",

    # Construction Cost Estimation & Design Assistance
    # "https://www.zameen.com/construction-cost-calculator.html",
    # "https://www.graana.com/blog/category/construction/",
    # "https://www.ilaan.com/blog/category/construction",
    # "https://www.lamudi.pk/blog/",
    # "https://www.zameen.com/blog/category/construction",
    #
    # Area Guides & Society Information
    # "https://www.zameen.com/area-guides/",
    # "https://www.graana.com/area-guide/",
    # "https://www.ilaan.com/area-guide",
    # "https://www.lamudi.pk/area-guides/",
    # "https://lahorerealestate.com/"
]

from langchain_community.document_loaders.mongodb import MongodbLoader


@app.on_event("startup")
async def startup_event():
    try:
        global first_bot_id
        bot_id = first_bot_id

        print(f'Initializing bot with ID:', bot_id)
        if os.path.exists(f"faiss_index_{bot_id}"):
            trainer.load_bot(bot_id=bot_id)
            trainer.set_custom_prompt_template(bot_id=bot_id, prompt_template=prompt)
            print(f'Bot with ID {bot_id} Loaded successfully.')
        else:
            bot_id = trainer.initialize_bot_id()
            print(f'Creating New bot with ID:', bot_id)

            trainer.add_document_from_path(path="Pakistani Real Estate Data Compilation_.pdf", bot_id=bot_id,
                                           use_unstructured=False)

            print(f'Loaded PDF Data...')

            loader = MongodbLoader(
                connection_string="mongodb://localhost:27017/",
                db_name="infra_estate_ai",
                collection_name="properties",
            )

            # Load documents
            mongodb_documents = await loader.aload()
            print(f"Loaded {len(mongodb_documents)} documents from MongoDB...")
            trainer.pass_documents(documents=mongodb_documents, bot_id=bot_id)

            trainer.create_bot(bot_id=bot_id)

            first_bot_id = bot_id

            with open('bot.json', 'w') as f:
                json.dump({"bot_id": bot_id}, f)
                f.close()

    except Exception as e:
        print(f"Error initializing model: {e}")


@app.post("/initialize_model/")
async def deploy_model(
        current_user: dict = Depends(get_current_user),
        trainer: LongTrainer = Depends(get_trainer)
):
    global first_bot_id
    user_id = current_user.get("_id")
    chat_id = trainer.new_chat(bot_id=first_bot_id)
    print(chat_id)

    # Store user_id, bot_id, and chat_id in the user_bots collection
    user_bots_collection = db.user_bots
    user_bots_collection.insert_one({
        "user_id": user_id,
        "bot_id": first_bot_id,
        "current_chat_id": chat_id,
        "chat_ids": [chat_id]  # Store chat IDs in a list
    })
    return {"message": "Bot initialized successfully"}


@app.post("/new_chat/")
async def new_chat(current_user: dict = Depends(get_current_user), trainer: LongTrainer = Depends(get_trainer)):
    user_id = current_user.get("_id")
    user_bot = db.user_bots.find_one({"user_id": user_id})
    if not user_bot:
        raise HTTPException(status_code=404, detail="User bot not found")

    bot_id = user_bot["bot_id"]
    try:
        chat_id = trainer.new_chat(bot_id=bot_id)
        print(chat_id)
        db.user_bots.update_one(
            {"user_id": user_id},
            {"$set": {"current_chat_id": chat_id}, "$addToSet": {"chat_ids": chat_id}}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return {"message": "New chat session started successfully"}


from google import genai
from pydantic import BaseModel
from typing import List
from fastapi.encoders import jsonable_encoder


class Property(BaseModel):
    id: str
    image_link: str
    location: str
    city: str
    price: float
    size: float
    bedrooms: int
    baths: int
    year: int
    type: str


class ResponseModel(BaseModel):
    response: str
    properties: List[Property]


gemini_client = genai.Client(
    api_key="AIzaSyDfCVlGiBq4Fd_S3PqchgTxEYpcyWm3qfs"
)

gemini_model = "gemini-2.0-flash-exp-image-generation"


def generate_response_from_gemini(query, chat_history):
    global first_bot_id

    # Perform hybrid search to get relevant documents
    relevant_docs = trainer.invoke_vectorstore(bot_id=first_bot_id, query=query)
    print(relevant_docs)

    # Prepare context from retrieved documents
    context = "\n".join([doc.page_content for doc in relevant_docs])

    # Construct the prompt
    prompt = f"""
    Human: You are Infra AI, a highly specialized Pakistani Real Estate Advisory Assistant developed  for the InfraEstate AI system.

    You can perform two types of tasks:

    1. **Property Search Tasks**  
    When the user's query is about finding properties — such as buying, selling, renting, exploring an area, searching based on location, price, size, bedrooms, property type, budget, or related keywords — you must:
    - First, generate a friendly, professional, and actionable **response** to the user.
    - Then, provide a structured **list of matching properties** in JSON format.
    - Each property must include fields: id, link, location, city, price, size, bedrooms, baths, year, and type.

    2. **General Inquiry Tasks**  
    When the user's query is a general conversation, greeting, thanking message, or non-property-related question (e.g., "hello", "what is InfraEstate AI?", "thanks", "who built you?"), you must:
    - Only generate a friendly **response** without returning any property list.
    - The properties field should be an empty list `[]`.

    ---

    Important Rules:
    - Always ground your property recommendations using the provided context.
    - If no suitable properties are found, still generate a helpful response and return an empty properties list `[]`.
    - Always include both fields: "response" (text) and "properties" (list).
    - Do not hallucinate properties or create fake listings.

    Your final output must be a structured JSON object like this:

    {{
    "response": "Your response text here",
      "properties": [list of properties if relevant, otherwise empty list]
    }}

    Context: {context}

    Chat History: {chat_history}

    User Question: {query}

    Assistant:
    """

    # Generate content using Gemini API
    response = gemini_client.models.generate_content(
        model=gemini_model,
        contents=prompt,
        config={
            'response_mime_type': 'application/json',
            'response_schema': ResponseModel,
        },
    )
    print(response.parsed)
    ai_response, properties_list = response.parsed.response, response.parsed.properties

    # Parse the response
    return ai_response, properties_list


@app.post("/response/")
async def get_response(query_data: QueryData, current_user: dict = Depends(get_current_user),
                       trainer: LongTrainer = Depends(get_trainer)):
    user_id = current_user.get("_id")
    user_bot = db.user_bots.find_one({"user_id": user_id})
    if not user_bot:
        raise HTTPException(status_code=404, detail="User bot not found")

    # if is_query_limit_reached(current_user['email']):
    #     raise HTTPException(status_code=429, detail="Query limit reached")

    bot_id = user_bot["bot_id"]
    chat_id = user_bot["current_chat_id"]

    try:

        chat_data = trainer.get_chat_by_id(chat_id, "oldest")
        response, properties_list = generate_response_from_gemini(query=query_data.query, chat_history=chat_data)

        # response, reference = trainer.get_response(query=query_data.query, bot_id=bot_id, chat_id=chat_id,
        #                                            web_search=False)
        #
        # if not increment_query_count(current_user['email']):
        #     raise HTTPException(status_code=500, detail="Failed to update query count")

        # Get current time as timestamp, timezone aware
        current_time = datetime.now(timezone.utc)

        # Insert the chat data along with web sources into MongoDB
        longtrainer_db.chats.insert_one({
            "bot_id": bot_id,
            "chat_id": chat_id,
            "timestamp": current_time,
            "question": query_data.query,
            "answer": response,
            "properties": jsonable_encoder(properties_list),
            "web_sources": [],  # Inserting web sources
            "uploaded_files": [],
            "trained": False  # Indicate this chat has not been trained yet
        })

        db.infra_estate_chats.insert_one({
            "question": query_data.query,
            "answer": response,
            "properties": jsonable_encoder(properties_list),
            "email": current_user['email'],
            "timestamp": datetime.now()
        })
        return {
            "response": response,
            "properties": jsonable_encoder(properties_list)
        }


    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/update_model/")
async def update_bot_model(files: List[UploadFile] = File(None), links: List[str] = Form(None),
                           current_user: dict = Depends(get_current_admin_user),
                           trainer: LongTrainer = Depends(get_trainer)):
    user_id = current_user.get("_id")
    user_bot = db.user_bots.find_one({"user_id": user_id})
    if not user_bot:
        raise HTTPException(status_code=404, detail="User bot not found")

    bot_id = user_bot["bot_id"]

    paths = [await save_uploaded_file(file, bot_id) for file in files if
             is_allowed_file(file.filename)] if files else []

    try:
        trainer.update_chatbot(paths=paths, links=links, search_query=None, bot_id=bot_id, use_unstructured=False)
        chat_id = trainer.new_chat(bot_id)
        db.user_bots.update_one({"user_id": user_id}, {"$set": {"current_chat_id": chat_id}})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {"message": "Bot Updated successfully"}


# @app.delete("/delete_model/")
# async def remove_model(current_user: dict = Depends(get_current_user),
#                        trainer: LongTrainer = Depends(get_trainer)):
#     user_id = current_user.get("_id")
#     user_bot = db.user_bots.find_one({"user_id": user_id})
#     if not user_bot:
#         raise HTTPException(status_code=404, detail="User bot not found")
#
#     bot_id = user_bot["bot_id"]
#
#     try:
#         trainer.delete_chatbot(bot_id)
#         db.user_bots.delete_one({"user_id": user_id})
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
#
#     return {"messgae": "Bot deleted successfully"}


class SwitchChat(BaseModel):
    chat_id: str


@app.post("/switch_chat/")
async def switch_chat(switch_chat: SwitchChat, current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("_id")
    user_bot = db.user_bots.find_one({"user_id": user_id})
    if not user_bot:
        raise HTTPException(status_code=404, detail="User bot not found")

    try:
        chat_id = switch_chat.chat_id
        print('[INFO] Switching to Chat-ID:', chat_id)
        db.user_bots.update_one({"user_id": user_id}, {"$set": {"current_chat_id": chat_id}})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return {"message": "Chat session Loaded successfully"}


@app.get("/get_chat_history/", response_model=List[dict])
async def get_chat_history(current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("_id")
    user_bot = db.user_bots.find_one({"user_id": user_id})
    if not user_bot:
        raise HTTPException(status_code=404, detail="User bot not found")

    chat_ids = user_bot["chat_ids"][::-1]
    chat_history = []
    for chat_id in chat_ids:
        chat = longtrainer_db.chats.find_one({"chat_id": chat_id, "archived": {"$ne": True}})
        if chat:
            question_preview = chat["question"][:20] + '...'
            timestamp = chat.get("timestamp", "No timestamp available")
            chat_history.append({
                "chat_id": chat_id,
                "question_preview": question_preview,
                "timestamp": timestamp
            })

    return chat_history


class GetChat(BaseModel):
    chat_id: str


@app.post("/get_chat/")
async def get_chat(getChat: GetChat, current_user: dict = Depends(get_current_user),
                   trainer: LongTrainer = Depends(get_trainer)):
    user_id = current_user.get("_id")
    user_bot = db.user_bots.find_one({"user_id": user_id})

    if not user_bot:
        raise HTTPException(status_code=404, detail="User bot not found")

    try:
        # Validate chat existence
        chat = trainer.get_chat_by_id(getChat.chat_id, order="oldest")
        if not chat:
            raise HTTPException(status_code=404, detail="Chat not found")

        # Fetch and sort chat data by timestamp (ascending)
        chat_data = list(longtrainer_db.chats.find({"chat_id": getChat.chat_id}).sort("timestamp", 1))
        if not chat_data:
            raise HTTPException(status_code=404, detail="No chat messages found")

        # Format all chat entries
        refined_chat = []
        for item in chat_data:
            chat_item = {
                "question": item.get("question", ""),
                "answer": item.get("answer", ""),
                "properties": jsonable_encoder(item.get("properties", [])),
                "timestamp": item.get("timestamp", "No timestamp")
            }
            refined_chat.append(chat_item)

        return {"chat": refined_chat}

    except Exception as e:
        print(f"Error retrieving chat: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/archive_chat/")
async def archive_chat(chat_id: str, current_user: dict = Depends(get_current_user)):
    user_bot = db.user_bots.find_one({"user_id": current_user.get("_id")})
    if not user_bot:
        raise HTTPException(status_code=404, detail="Admin user bot not found")

    result = longtrainer_db.chats.update_many(
        {"chat_id": chat_id},
        {"$set": {"archived": True}}
    )

    if result.modified_count:
        return {"message": "Chat archived successfully"}
    else:
        raise HTTPException(status_code=404, detail="Chat not found or already archived")


'''
##############################################################################################################################################
                                                      FastAPI ENDPOINTS FOR ADMIN 
##############################################################################################################################################
'''


class IncreaseLimit(BaseModel):
    email: str
    new_limit: int


@app.post("/admin/set-query-limit/")
async def set_limit(data: IncreaseLimit, current_user: dict = Depends(get_current_admin_user)):
    if current_user['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Unauthorized")

    email = data.email
    new_limit = data.new_limit
    result = users_collection.update_one(
        {"email": email},
        {"$set": {"query_limit": new_limit}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found or limit unchanged")
    return {"message": f"Query limit updated to {new_limit} for user {email}"}


@app.get("/admin/export-chats-to-csv/")
async def export_chats_to_csv(current_user: dict = Depends(get_current_admin_user)):
    if current_user['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Unauthorized Access")

    # Fetch all chat data
    chats_cursor = db.infra_estate_chats.find({})
    df = pd.DataFrame(list(chats_cursor))

    # Export to CSV
    csv_folder = f"./chat_exports"
    os.makedirs(csv_folder, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    csv_path = os.path.join(csv_folder, f"chats_export_{timestamp}.csv")
    df.to_csv(csv_path, index=False)

    return FileResponse(path=csv_path, filename=os.path.basename(csv_path), media_type='text/csv')


@app.get("/admin/user-stats")
async def get_user_statistics(
        current_user: dict = Depends(get_current_admin_user),
):
    user_id = current_user.get("_id")
    if not user_id:
        raise HTTPException(status_code=404, detail="User not found")

    now = datetime.now()

    # Total users
    total_users = users_collection.count_documents({})

    # New users in the last month
    last_month = now - timedelta(days=30)
    new_users_last_month = users_collection.count_documents({"created_at": {"$gte": last_month}})

    # New users in the previous month for comparison
    previous_month_start = last_month - timedelta(days=30)
    new_users_previous_month = users_collection.count_documents({
        "created_at": {"$gte": previous_month_start, "$lt": last_month}
    })

    # New users in the last week
    last_week = now - timedelta(days=7)
    new_users_last_week = users_collection.count_documents({"created_at": {"$gte": last_week}})

    # New users in the previous week for comparison
    previous_week_start = last_week - timedelta(days=7)
    new_users_previous_week = users_collection.count_documents({
        "created_at": {"$gte": previous_week_start, "$lt": last_week}
    })

    # New users in the last 24 hours
    last_day = now - timedelta(days=1)
    new_users_last_day = users_collection.count_documents({"created_at": {"$gte": last_day}})

    # Calculate percentage change for month and week to identify growth
    monthly_growth = ((
                              new_users_last_month - new_users_previous_month) / new_users_previous_month * 100) if new_users_previous_month > 0 else 0
    weekly_growth = ((
                             new_users_last_week - new_users_previous_week) / new_users_previous_week * 100) if new_users_previous_week > 0 else 0

    return {
        "total_users": total_users,
        "new_users_last_month": new_users_last_month,
        "monthly_growth": f"{monthly_growth:.2f}%",
        "new_users_last_week": new_users_last_week,
        "weekly_growth": f"{weekly_growth:.2f}%",
        "new_users_last_day": new_users_last_day
    }


class ReturnUser(BaseModel):
    name: str  # Since your user document uses 'name', not 'username'
    email: EmailStr
    role: str
    auth_method: Optional[str] = None  # Add other fields from your document as needed
    created_at: Optional[datetime] = None
    query_count: Optional[int] = 0  # Make query_count optional with a default value
    query_limit: int = 5  # Default query limit set here
    approval_status: Optional[str] = None

    subscription_status: str = "inactive"
    plan_name: str = "FREE"
    last_query_date: Optional[datetime] = None  # Track the last query date
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    phone_number: Optional[str] = None

    class Config:
        orm_mode = True  # If you're using ORMs to fetch data


@app.get("/admin/get-users/", response_model=List[ReturnUser])
async def list_users(current_user: dict = Depends(get_current_admin_user)):
    if not current_user.get("_id"):
        raise HTTPException(status_code=404, detail="Admin user not found")

    # Adding sorting by `created_at` in descending order
    users_cursor = users_collection.find({}, {"password": 0, "hashed_password": 0}).sort("created_at", -1)
    users = [ReturnUser(**user) for user in
             users_cursor]  # Using a list comprehension to convert cursor to list of model instances
    return users


class CreateUser(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Optional[str] = 'user'


@app.post("/admin/create-user/", response_model=dict)
async def add_user(user: CreateUser, current_user: dict = Depends(get_current_admin_user)):
    user_id = current_user.get("_id")
    if not user_id:
        raise HTTPException(status_code=404, detail="User not found")

    if users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = get_password_hash(user.password)
    new_user = user.dict(exclude={"password"})
    new_user["hashed_password"] = hashed_password
    new_user["role"] = user.role
    new_user["auth_method"] = "local"
    new_user["created_at"] = datetime.now()
    result = users_collection.insert_one(new_user)

    return {"message": "User Created successfully"}


class DeleteUser(BaseModel):
    email: EmailStr


@app.delete("/admin/delete-user/")
async def delete_user(deleteUser: DeleteUser, current_user: dict = Depends(get_current_admin_user)):
    user_id = current_user.get("_id")
    if not user_id:
        raise HTTPException(status_code=404, detail="Admin not found")

    result = users_collection.delete_one({"email": deleteUser.email})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"detail": "User deleted successfully"}


from pydantic import Field
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class ChatModel(BaseModel):
    chat_id: str
    question: str
    answer: str
    email: EmailStr
    timestamp: Optional[datetime]
    bot_name: str
    starred: bool  # Include the starred field

    class Config:
        allow_population_by_field_name = True
        orm_mode = True


from fastapi import Depends, Query
from typing import List


@app.get("/admin/conversations/", response_model=List[ChatModel])
async def list_conversations(page_size: int = Query(10, ge=1, le=100),
                             current_user: dict = Depends(get_current_admin_user)):
    if not current_user.get("_id"):
        raise HTTPException(status_code=404, detail="User not found")

    # Sort the results by 'timestamp' in descending order and limit the results to 'page_size'
    chats_cursor = db.infra_estate_chats.find().sort('timestamp', -1).limit(page_size)

    chats = []
    for chat in chats_cursor:
        # Fetch user data to get the sect information
        user_data = db.users.find_one({"email": chat.get("email")})
        if not user_data:
            continue  # Skip if no user data found (or handle as needed)

        chat_data = {
            "chat_id": str(chat["_id"]),  # Convert ObjectId to string
            "question": chat.get("question", ""),
            "answer": chat.get("answer", ""),
            "email": chat.get("email", ""),
            "timestamp": chat.get("timestamp"),
            "bot_name": chat.get("bot_name", ""),
            "starred": chat.get("starred", False)  # Default to False if not set
        }
        chats.append(ChatModel(**chat_data))

    return chats


from fastapi import Depends


@app.delete("/admin/delete_conversation/{chat_id}")
async def delete_conversation(chat_id: str, current_user: dict = Depends(get_current_admin_user)):
    if current_user['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Unauthorized access")

    result = db.infra_estate_chats.delete_one({"_id": ObjectId(chat_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Conversation not found or already deleted")

    return {"message": "Conversation deleted successfully"}


'''
FEEDBACKS
'''

from bson import ObjectId


class Feedback(BaseModel):
    name: str
    email: EmailStr
    message: str


class ReturnFeedback(BaseModel):
    id: str = Field(None, alias="_id")
    name: str
    email: EmailStr
    message: str
    submitted_at: datetime

    class Config:
        orm_mode = True
        allow_population_by_field_name = True


@app.post("/submit_feedback/")
async def submit_feedback(feedback: Feedback, current_user: dict = Depends(get_current_user)):
    if not current_user.get("_id"):
        raise HTTPException(status_code=404, detail="User not found")

    feedback_doc = {
        "user_id": current_user.get("_id"),
        "name": feedback.name,
        "email": feedback.email,
        "message": feedback.message,
        "submitted_at": datetime.now()
    }
    db.feedback.insert_one(feedback_doc)
    return {"message": "Feedback submitted successfully"}


@app.get("/admin/view_feedback/", response_model=List[ReturnFeedback])
async def view_feedback(page: int = Query(1, ge=1), page_size: int = Query(10, ge=1, le=100),
                        current_user: dict = Depends(get_current_admin_user)):
    if not current_user.get("_id"):
        raise HTTPException(status_code=404, detail="Admin user not found")

    skip = (page - 1) * page_size
    feedback_cursor = db.feedback.find().sort("submitted_at", -1).skip(skip).limit(page_size)

    feedback_list = []
    for feedback in feedback_cursor:
        feedback_dict = {
            "_id": str(feedback["_id"]),  # Convert ObjectId to string if using MongoDB
            "name": feedback.get("name", ""),
            "email": feedback.get("email", ""),
            "message": feedback.get("message", ""),
            "submitted_at": feedback.get("submitted_at")
        }
        feedback_list.append(feedback_dict)

    return feedback_list


@app.delete("/admin/delete_feedback/{feedback_id}")
async def delete_feedback(feedback_id: str, current_user: dict = Depends(get_current_admin_user)):
    if current_user['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Unauthorized access")

    result = db.feedback.delete_one({"_id": ObjectId(feedback_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Feedback not found or already deleted")

    return {"message": "Feedback deleted successfully"}


'''
##############################################################################################################################################
                                                    INFRA-ESTATE AI PROPERTIES MANAGEMENT
##############################################################################################################################################
'''

properties_collection = db.properties


# Property Model
class Property(BaseModel):
    location: str
    city: str
    price: int
    size: float
    bedrooms: int
    baths: int
    year: int
    type: str  # residential, commercial, land, etc.
    image_link: Optional[str] = None
    owner_email: Optional[str] = None  # Set by the server when adding properties


# Property Update Model
class PropertyUpdate(BaseModel):
    location: Optional[str]
    city: Optional[str]
    price: Optional[int]
    size: Optional[float]
    bedrooms: Optional[int]
    baths: Optional[int]
    year: Optional[int]
    type: Optional[str]
    image_link: Optional[str]


# Ensure the images directory exists
os.makedirs("images", exist_ok=True)

app.mount("/images", StaticFiles(directory="images"), name="images")


# Helper function to save images
def save_image(file: UploadFile) -> str:
    """Save the uploaded image to the images folder and return its path."""
    filename = f"{str(uuid.uuid4())}_{file.filename}"
    file_path = os.path.join("images", filename)
    with open(file_path, "wb") as buffer:
        buffer.write(file.file.read())
    return file_path


# Create Property Endpoint
@app.post("/properties/")
async def create_property(
        location: str = Form(...),
        city: str = Form(...),
        price: int = Form(...),
        size: float = Form(...),
        bedrooms: int = Form(...),
        baths: int = Form(...),
        year: int = Form(...),
        type: str = Form(...),
        image: Optional[UploadFile] = File(None),
        current_user: dict = Depends(get_current_user),
):
    # Save image if provided
    image_link = None
    if image:
        image_link = save_image(image)

    # Construct the property data
    property_data = {
        "location": location,
        "city": city,
        "price": price,
        "size": size,
        "bedrooms": bedrooms,
        "baths": baths,
        "year": year,
        "type": type,
        "image_link": image_link,
        "owner_email": current_user["email"],
        "created_at": datetime.now(),
    }

    # Insert into the database
    result = properties_collection.insert_one(property_data)

    # Create or update the text index
    properties_collection.create_index(
        [("location", "text"), ("city", "text"), ("type", "text")],
        name="property_text_index",
    )

    return {"message": "Property added successfully", "id": str(result.inserted_id)}


# Edit Property Endpoint
@app.put("/properties/{property_id}")
async def update_property(
        property_id: str,
        location: Optional[str] = Form(None),
        city: Optional[str] = Form(None),
        price: Optional[int] = Form(None),
        size: Optional[float] = Form(None),
        bedrooms: Optional[int] = Form(None),
        baths: Optional[int] = Form(None),
        year: Optional[int] = Form(None),
        type: Optional[str] = Form(None),
        image: Optional[UploadFile] = File(None),
        current_user: dict = Depends(get_current_user),
):
    # Save new image if provided
    property_data = {}
    if location is not None:
        property_data["location"] = location
    if city is not None:
        property_data["city"] = city
    if price is not None:
        property_data["price"] = price
    if size is not None:
        property_data["size"] = size
    if bedrooms is not None:
        property_data["bedrooms"] = bedrooms
    if baths is not None:
        property_data["baths"] = baths
    if year is not None:
        property_data["year"] = year
    if type is not None:
        property_data["type"] = type
    if image:
        image_link = save_image(image)
        property_data["image_link"] = image_link

    # Update the property in the database
    result = properties_collection.update_one(
        {"_id": ObjectId(property_id), "owner_email": current_user["email"]},
        {"$set": property_data},
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Property not found or not authorized to edit")

    # Create or update the text index
    properties_collection.create_index(
        [("location", "text"), ("city", "text"), ("type", "text")],
        name="property_text_index",
    )

    return {"message": "Property updated successfully"}


# Delete Property Endpoint
@app.delete("/properties/{property_id}")
async def delete_property(property_id: str, current_user: dict = Depends(get_current_user)):
    result = properties_collection.delete_one({"_id": ObjectId(property_id), "owner_email": current_user["email"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Property not found or not authorized to delete")
    return {"message": "Property deleted successfully"}


from typing import List
from fastapi import Query
from pydantic import BaseModel


# Extend Property model to include ID in the response
class PropertyWithID(Property):
    id: str  # Add the ID field

    class Config:
        orm_mode = True


# Get All Properties Endpoint
@app.get("/properties/", response_model=List[PropertyWithID])
async def get_all_properties(page: int = Query(1, ge=1), page_size: int = Query(100, ge=1, le=100)):
    skip = (page - 1) * page_size
    cursor = properties_collection.find({}).sort("created_at", DESCENDING).skip(skip).limit(page_size)

    # Include the ID field explicitly
    properties = []
    for prop in cursor:
        prop["id"] = str(prop["_id"])  # Convert ObjectId to string
        del prop["_id"]  # Remove the original _id field
        properties.append(PropertyWithID(**prop))

    print(properties)
    return properties


# Get All Properties Endpoint
@app.get("/my-properties/", response_model=List[PropertyWithID])
async def get_all_properties(page: int = Query(1, ge=1), page_size: int = Query(10, ge=1, le=100),
                             current_user: dict = Depends(get_current_user)):
    skip = (page - 1) * page_size
    cursor = properties_collection.find({"owner_email": current_user["email"],
                                         }).sort("created_at", DESCENDING).skip(skip).limit(page_size)

    # Include the ID field explicitly
    properties = []
    for prop in cursor:
        prop["id"] = str(prop["_id"])  # Convert ObjectId to string
        del prop["_id"]  # Remove the original _id field
        properties.append(PropertyWithID(**prop))

    return properties


# Endpoint to get property details by ID
@app.get("/properties/{property_id}", response_model=PropertyWithID)
async def get_property_by_id(property_id: str):
    try:
        # Validate the property ID and fetch the property
        property_data = properties_collection.find_one({"_id": ObjectId(property_id)})
        if not property_data:
            raise HTTPException(status_code=404, detail="Property not found")

        # Convert MongoDB ObjectId to string and prepare the response
        property_data["id"] = str(property_data["_id"])
        del property_data["_id"]  # Remove the original _id field for consistency
        return PropertyWithID(**property_data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid property ID: {e}")


# Search Properties Endpoint
@app.get("/properties/search/")
async def search_properties(keyword: str):
    cursor = properties_collection.find({"$text": {"$search": keyword}})
    return [Property(**prop) for prop in cursor]


# Import Properties from CSV
@app.post("/properties/import/")
async def import_properties(file: UploadFile = File(...), current_user: dict = Depends(get_current_admin_user)):
    temp_dir = "./temp_uploads"
    os.makedirs(temp_dir, exist_ok=True)
    file_path = os.path.join(temp_dir, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    df = pd.read_csv(file_path)
    os.remove(file_path)
    properties = df.to_dict(orient="records")
    for property in properties:
        property["created_at"] = datetime.now()
        properties_collection.insert_one(property)

    properties_collection.create_index(
        [("location", "text"), ("city", "text"), ("type", "text")],
        name="property_text_index"
    )

    return {"message": f"Imported {len(properties)} properties successfully"}


# Export Properties to CSV
@app.get("/properties/export/")
async def export_properties(current_user: dict = Depends(get_current_admin_user)):
    cursor = properties_collection.find({})
    df = pd.DataFrame(list(cursor))
    if "_id" in df:
        df.drop(columns=["_id"], inplace=True)
    file_path = "./properties_export.csv"
    df.to_csv(file_path, index=False)
    return FileResponse(path=file_path, filename="properties_export.csv", media_type="text/csv")


# Admin Delete Property
@app.delete("/admin/properties/{property_id}")
async def admin_delete_property(property_id: str, current_user: dict = Depends(get_current_admin_user)):
    result = properties_collection.delete_one({"_id": property_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Property not found")
    return {"message": "Property deleted successfully"}


# Admin Get All Properties
@app.get("/admin/properties/")
async def admin_get_all_properties():
    cursor = properties_collection.find({})
    return [Property(**prop) for prop in cursor]


@app.post("/admin/create-property-index/")
async def create_property_index(current_user: dict = Depends(get_current_admin_user)):
    """
    Admin-only endpoint to create or refresh text indexes on the properties collection.
    """
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Unauthorized access")

    # Create or refresh text indexes
    index_name = properties_collection.create_index(
        [("location", "text"), ("city", "text"), ("type", "text")],
        name="property_text_index"
    )
    return {"message": f"Index '{index_name}' created or updated successfully"}


'''
##############################################################################################################################################
                                                    INFRA-ESTATE AI CORE ENDPOINTS
##############################################################################################################################################
'''
from fastapi import HTTPException
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
import pickle
import torch
import torch.nn as nn
from fastapi.responses import JSONResponse
from fastapi.responses import FileResponse
import os
from fastapi.staticfiles import StaticFiles

os.makedirs("charts", exist_ok=True)

app.mount("/charts", StaticFiles(directory="charts"), name="charts")

# Load necessary encoders and scalers
with open("encoders/city_encoder.pkl", "rb") as f:
    city_encoder = pickle.load(f)

with open("encoders/location_encoder.pkl", "rb") as f:
    location_encoder = pickle.load(f)

with open("scalers/scaler_x.pkl", "rb") as f:
    scaler_x = pickle.load(f)


class PakReNOVate(nn.Module):
    def __init__(
            self,
            num_cities,
            num_locations,
            emb_dim_city=8,
            emb_dim_loc=8,
            d_model=64,
            nhead=4,
            num_layers=2,
            dim_feedforward=128
    ):
        super().__init__()

        # Embeddings for city & location
        self.city_emb = nn.Embedding(num_cities, emb_dim_city)
        self.loc_emb = nn.Embedding(num_locations, emb_dim_loc)

        # The rest of the columns are numeric
        self.emb_total = emb_dim_city + emb_dim_loc
        self.num_numeric = 6  # (size, bedrooms, baths, time_index, month_sin, month_cos)

        # Convert (embedding + numeric) -> d_model
        self.input_fc = nn.Linear(self.emb_total + self.num_numeric, d_model)

        # Standard Transformer Encoder
        self.encoder_layer = nn.TransformerEncoderLayer(
            d_model=d_model,
            nhead=nhead,
            dim_feedforward=dim_feedforward
        )
        self.transformer_encoder = nn.TransformerEncoder(self.encoder_layer, num_layers=num_layers)

        # Final output
        self.output_fc = nn.Linear(d_model, 1)

    def forward(self, x):
        """
        x shape: [batch_size, 8]
          x[:,0] = city index
          x[:,1] = location index
          x[:,2:] = numeric columns
        """
        city_idx = x[:, 0].long()
        loc_idx = x[:, 1].long()

        # numeric part (size, bedrooms, baths, time_index, month_sin, month_cos)
        numeric = x[:, 2:]  # shape [batch_size, 6]

        # embeddings
        city_vec = self.city_emb(city_idx)
        loc_vec = self.loc_emb(loc_idx)

        # Combine embedding vectors: shape [batch_size, emb_dim_city + emb_dim_loc]
        combined_emb = torch.cat([city_vec, loc_vec], dim=1)

        # Concatenate numeric features
        combined = torch.cat([combined_emb, numeric], dim=1)

        # Map to d_model
        out = self.input_fc(combined)  # [batch_size, d_model]

        # For TransformerEncoder we need [sequence_len, batch_size, d_model],
        # but if we only treat each example as a "sequence" of length 1:
        out = out.unsqueeze(1)  # [batch_size, 1, d_model]
        out = out.permute(1, 0, 2)  # [1, batch_size, d_model]

        # Run through transformer
        encoded = self.transformer_encoder(out)  # [1, batch_size, d_model]
        encoded = encoded.mean(dim=0)  # => [batch_size, d_model]

        # Final linear layer => 1
        pred = self.output_fc(encoded)  # [batch_size, 1]
        return pred


model = PakReNOVate(
    num_cities=114,
    num_locations=10000,
    emb_dim_city=8,
    emb_dim_loc=8,
    d_model=64,
    nhead=4,
    num_layers=4,
    dim_feedforward=128
)

model.load_state_dict(torch.load("model/PakReNOVate_best_model.pth", map_location=torch.device('cpu')))
model.eval()

import math

feature_cols = ['city', 'location', 'size', 'bedrooms', 'baths', 'time_index', 'month_sin', 'month_cos']


def predict_price(model, record):
    """
    record: dict with keys:
      city, location, size, bedrooms, baths, year, month
    We'll build the same features:
      [city, location, size, bedrooms, baths, time_index, month_sin, month_cos]
    """
    # 1) city / location => int
    record_city = city_encoder.transform([record['city']])[0]
    record_loc = location_encoder.transform([record['location']])[0]

    # 2) Construct time features
    base_year = 2018
    time_index = (record['year'] - base_year) * 12 + record['month']
    month_sin = math.sin(2 * math.pi * record['month'] / 12)
    month_cos = math.cos(2 * math.pi * record['month'] / 12)

    # 3) Numeric array
    row = np.array([
        record_city,
        record_loc,
        record['size'],
        record['bedrooms'],
        record['baths'],
        time_index,
        month_sin,
        month_cos
    ], dtype=np.float32).reshape(1, -1)

    # 4) Scale numeric columns
    #    city, location are left as is (integer),
    #    so we only transform columns 2..7

    num_cols = ['size', 'bedrooms', 'baths', 'time_index', 'month_sin', 'month_cos']

    row_df = pd.DataFrame(row, columns=feature_cols)
    row_df[num_cols] = scaler_x.transform(row_df[num_cols])

    # 5) Model inference
    row_tensor = torch.tensor(row_df.values, dtype=torch.float32)
    model.eval()
    with torch.no_grad():
        log_price_pred = model(row_tensor).item()

    # 6) Inverse of log1p => expm1
    predicted_price = np.expm1(log_price_pred)
    return predicted_price


from google import genai
from google.genai.types import Tool, GenerateContentConfig, GoogleSearch


def generate(query):
    try:
        client_g = genai.Client(
            api_key="..."
        )

        model = "gemini-2.0-flash-exp-image-generation"

        google_search_tool = Tool(
            google_search=GoogleSearch()
        )

        response = client_g.models.generate_content(
            model=model,
            contents=query,
            config=GenerateContentConfig(
                tools=[google_search_tool],
                response_modalities=["TEXT"],
            )
        )

        for each in response.candidates[0].content.parts:
            print("==+==" * 10)
            print(each.text)
            return each.text
        return None
    except Exception as e:
        return None


import re


def process_text(content):
    # Step 1: Replace specific LaTeX delimiters with $$
    content = re.sub(r'\\\[', '$$', content)
    content = re.sub(r'\\\]', '$$', content)
    content = re.sub(r'\\\(', '$$', content)
    content = re.sub(r'\\\)', '$$', content)

    return content


class PropertyDetails(BaseModel):
    location: str
    city: str
    size: int
    bedrooms: int
    baths: int
    current_price: int


# Endpoint: Generate Report and Charts
@app.post("/generate-report/")
async def generate_property_report(property_info: PropertyDetails, current_user: dict = Depends(get_current_user)):
    try:
        # Extract property data
        location = property_info.location
        city = property_info.city
        size = property_info.size
        bedrooms = property_info.bedrooms
        baths = property_info.baths
        current_price = property_info.current_price

        data = {
            "location": location,
            "city": city,
            "size": size,
            "bedrooms": bedrooms,
            "baths": baths,
            "current_price": current_price,
            "year": datetime.now().year,
        }
        print(data)

        # Let's forecast from 2023 to 2032 => short term (up to 2025) & long term (up to 2032)
        short_term_years = [2025, 2026, 2027]
        long_term_years = list(range(2025, 2035))  # 10 years

        short_term_preds = []
        long_term_preds = []
        prices = []
        for year in long_term_years:
            # Build a copy of the record with the future year
            fut_record = data
            fut_record['year'] = year
            fut_record['month'] = 1  # fix the month to January, for example

            print("[Info] Predicting..")
            try:
                price_pred = predict_price(model, fut_record)
            except Exception as e:
                print("[ERROR] ", e)

            # For plotting
            if year in short_term_years:
                short_term_preds.append((year, price_pred))
            long_term_preds.append((year, price_pred))
            prices.append(price_pred)

        # Convert results to arrays
        short_term_preds = np.array(short_term_preds)
        long_term_preds = np.array(long_term_preds)

        print("[Info] Generating Plot..")

        # Plotting short-term and long-term price predictions using line plot
        plt.figure(figsize=(10, 5))

        # short-term
        plt.plot(short_term_preds[:, 0], short_term_preds[:, 1],
                 marker='o', color='blue', label='Short-Term (3 yrs)')

        # long-term
        plt.plot(long_term_preds[:, 0], long_term_preds[:, 1],
                 marker='o', linestyle='--', color='green',
                 label='Long-Term (10 yrs)')

        plt.title("Short-Term (3yr) vs. Long-Term (10yr) Price Forecast")
        plt.xlabel("Year")
        plt.ylabel("Predicted Price")
        plt.grid(True)
        plt.legend()
        chart_path_1 = f"charts/forecast_chart_{str(uuid.uuid4())}.png"
        plt.savefig(chart_path_1)
        plt.close()

        # Plotting short-term and long-term price predictions using bar plot

        plt.figure(figsize=(10, 5))
        plt.bar(short_term_preds[:, 0], short_term_preds[:, 1], label="Short-Term")
        plt.bar(long_term_preds[:, 0], long_term_preds[:, 1], label="Long-Term", alpha=0.5)

        min_price = min(short_term_preds[:, 1].min(), long_term_preds[:, 1].min())
        max_price = max(short_term_preds[:, 1].max(), long_term_preds[:, 1].max())
        padding = (max_price - min_price) * 0.05  # 5% padding
        plt.ylim(min_price - padding, max_price + padding)

        import matplotlib.ticker as ticker

        ax = plt.gca()
        ax.yaxis.set_major_formatter(
            ticker.FuncFormatter(lambda x, p: f"{x:,.0f} PKR")  # no decimals
        )

        plt.title("Short-Term (3yr) vs. Long-Term (10yr) Price Forecast (Bar)")
        plt.xlabel("Year")
        plt.ylabel("Predicted Price")
        plt.legend()

        chart_path_2 = f"charts/forecast_chart_{str(uuid.uuid4())}.png"
        plt.savefig(chart_path_2)
        plt.close()

        print("[Info] Fetching News..")

        facilities = generate(
            f"search for Facilities Near By, Healthcare, Parks, School, Universities for City: {city} Location: {location} ")
        # time.sleep(5)
        real_estate_market = generate(
            f"search for  Real Estate Market size/value/worth for City: {city} Location: {location} ")

        # time.sleep(5)

        security_situation = generate(
            f"search for Security Situation for City: {city} Location: {location} ")
        # time.sleep(5)

        news_group = []
        if facilities:
            news_group.append([f"Facilities Near By: {facilities}"])
        if real_estate_market:
            news_group.append([f"Real Estate Market size/value/worth: {real_estate_market}"])
        if security_situation:
            news_group.append([f"Security Situation: {security_situation}"])

        # Generate report using LLM
        print("[Info] Generating Report..")

        prompt = f"""
        Human:
        
        Real Estate Market Analysis and Prediction for {city} {location}
        
        ### Property Details:
        - Location: {location}
        - City: {city}
        - Size: {size}
        - Bedrooms: {bedrooms}
        - Bathrooms: {baths}
        - Current Price: {current_price}

        Price Forecast for Future Years:
        {long_term_preds}

        Facilities Near By:
        {facilities}

        Security Situation:
        {security_situation}
        
        Real Estate Market In This Area:
        {real_estate_market}
        
        
        Your task:
        1. Provide an in-depth discussion of market trends in {city} real estate.
        2. Include risk analysis for the next 3-5 years.
        3. Estimate potential price range and opportunities for profit.
        4. Highlight the benefits of investing in this property (location, projected appreciation, etc.).
        5. Summarize in a professional, decision-oriented format.
        6. Use **Proper Headings** and HTML or **Markdown** for creating a well structured Report.
        
        
        FOCUS ON:
        
        **Market Trend Analysis**
           - Historical price movement (last 5 years) in {city}
           - Supply & demand drivers: new developments, zoning changes, population growth
           - Macro-economic factors: interest rates, currency trends, regulation
        
        **Risk Assessment (3–5 Year Horizon)**
           - Identify top 3 upside risks (e.g. infrastructure projects)
           - Identify top 3 downside risks (e.g. regulatory changes, economic slowdown)
           - Suggest mitigation strategies
        
        **Price Range & Investment Opportunities**
           - Projected low-mid-high price bands
           - Break-even & target-ROI scenarios
           - Exit strategies: hold vs. flip vs. rent
        
        **Property-Specific Value Drivers**
           - Location advantages (connectivity, schools, commercial centers)
           - Unique selling points of this unit
           - Forecasted appreciation drivers
        
        Assistant:
        """

        try:
            report = call_bedrock(prompt)
        except Exception as e:
            print("[ERROR] ", e)

        report = report.replace("\\n", "\n")
        print(report)

        # Return JSON response with report and chart
        return JSONResponse(content={
            "report": process_text(report),
            "price_forecast": prices,
            "news": news_group,
            "chart_urls": [chart_path_1, chart_path_2],
        })
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))

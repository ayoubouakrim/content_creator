from fastapi import APIRouter, Depends, HTTPException,  status
from sqlalchemy.orm import Session
from db.session import getdb
from schemas.user import UserCreate, UserLogin, UserResponse
from crud import user as user_crud
from core.security import create_access_token

router = APIRouter()

@router.post("/register", response_model=User, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session = Depends(getdb)):
    # check if user already exists
    existing_user = user_crud.get_user_by_email(db, user_data.email)
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    
    # create new user
    user = user_crud.create_user(db, email=user_data.email, password=user_data.password)

    return user

@router.post("/login")
def login(credentials: UserLogin, db: Session = Depends(getdb)):
    # authenticate user
    user = user_crud.aurthenticate_user(db, email=credentials.email, password=credentials.password)

    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    
    # create access token
    access_token = create_access_token(user_id=user.id)

    return {"access_token": access_token, "token_type": "bearer", "user": {"id": user.id, "email": user.email}}
from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
import jwt
from enum import Enum

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT configuration
SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

app = FastAPI()
api_router = APIRouter(prefix="/api")

class UserRole(str, Enum):
    FRESHER = "fresher"
    SENIOR = "senior"

class ClubDomain(str, Enum):
    TECHNICAL = "Technical"
    CULTURAL = "Cultural"
    SPORTS = "Sports"
    MANAGEMENT = "Management"
    LITERARY = "Literary"
    SOCIAL = "Social"

class RecruitmentStatus(str, Enum):
    OPEN = "Open"
    CLOSED = "Closed"
    UPCOMING = "Upcoming"

# Pydantic Models
class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: UserRole

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    role: UserRole
    verified: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    verified: bool

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class Club(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    domain: ClubDomain
    skills: List[str]
    time_commitment: str
    recruitment_status: RecruitmentStatus
    contact: str
    image_url: str
    tags: List[str] = []
    member_count: int = 0

class ClubResponse(BaseModel):
    id: str
    name: str
    description: str
    domain: str
    skills: List[str]
    time_commitment: str
    recruitment_status: str
    contact: str
    image_url: str
    tags: List[str]
    member_count: int

class QuizAnswer(BaseModel):
    question_id: int
    answer: str

class QuizSubmission(BaseModel):
    answers: List[QuizAnswer]

class ClubRecommendation(BaseModel):
    club_id: str
    club_name: str
    match_percentage: int
    reason: str

class QuizResult(BaseModel):
    personality_type: str
    personality_description: str
    recommendations: List[ClubRecommendation]

class QuizResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    answers: List[Dict[str, Any]]
    personality_type: str
    personality_description: str
    recommendations: List[Dict[str, Any]]
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class BookmarkCreate(BaseModel):
    club_id: str

class Bookmark(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    club_id: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Q&A System Models
class QuestionCreate(BaseModel):
    title: str
    description: str
    is_anonymous: bool = False

class ReplyCreate(BaseModel):
    content: str

class Reply(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    content: str
    user_id: str
    user_name: str
    user_role: str
    user_verified: bool
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Question(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    user_id: str
    user_name: str
    user_role: str
    is_anonymous: bool = False
    replies: List[Reply] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class QuestionResponse(BaseModel):
    id: str
    title: str
    description: str
    user_id: str
    user_name: str
    user_role: str
    is_anonymous: bool
    replies: List[Dict[str, Any]]
    reply_count: int
    created_at: str

# Helper functions
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        
        user = await db.users.find_one({"id": user_id}, {"_id": 0})
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Quiz questions and algorithm
QUIZ_QUESTIONS = [
    {
        "id": 1,
        "question": "How do you prefer to spend your free time?",
        "options": [
            {"text": "Coding or building tech projects", "weights": {"technical": 3, "creative": 1}},
            {"text": "Creating art, music, or performing", "weights": {"creative": 3, "social": 1}},
            {"text": "Playing sports or exercising", "weights": {"sports": 3, "teamwork": 2}},
            {"text": "Reading, writing, or debating", "weights": {"literary": 3, "communication": 2}}
        ]
    },
    {
        "id": 2,
        "question": "What motivates you the most?",
        "options": [
            {"text": "Solving complex problems", "weights": {"technical": 3, "analytical": 2}},
            {"text": "Expressing myself creatively", "weights": {"creative": 3, "independent": 1}},
            {"text": "Competing and winning", "weights": {"competitive": 3, "sports": 2}},
            {"text": "Making a social impact", "weights": {"social": 3, "leadership": 2}}
        ]
    },
    {
        "id": 3,
        "question": "How do you work best?",
        "options": [
            {"text": "Independently with clear goals", "weights": {"independent": 3, "technical": 1}},
            {"text": "In a team with collaborative energy", "weights": {"teamwork": 3, "social": 2}},
            {"text": "Leading and organizing others", "weights": {"leadership": 3, "management": 2}},
            {"text": "Flexible, adapting to situations", "weights": {"adaptable": 2, "creative": 1}}
        ]
    },
    {
        "id": 4,
        "question": "What kind of events excite you?",
        "options": [
            {"text": "Hackathons and tech competitions", "weights": {"technical": 3, "competitive": 2}},
            {"text": "Cultural festivals and performances", "weights": {"creative": 3, "social": 2}},
            {"text": "Sports tournaments", "weights": {"sports": 3, "competitive": 2}},
            {"text": "Debates and literary events", "weights": {"literary": 3, "communication": 2}}
        ]
    },
    {
        "id": 5,
        "question": "How much time can you commit weekly?",
        "options": [
            {"text": "2-4 hours (Light commitment)", "weights": {"time_light": 3}},
            {"text": "5-8 hours (Moderate commitment)", "weights": {"time_moderate": 3}},
            {"text": "9-12 hours (High commitment)", "weights": {"time_high": 3}},
            {"text": "12+ hours (Very high commitment)", "weights": {"time_very_high": 3}}
        ]
    },
    {
        "id": 6,
        "question": "Are you more introverted or extroverted?",
        "options": [
            {"text": "Very introverted - prefer working alone", "weights": {"introvert": 3, "technical": 1}},
            {"text": "Somewhat introverted", "weights": {"introvert": 2}},
            {"text": "Somewhat extroverted", "weights": {"extrovert": 2, "social": 1}},
            {"text": "Very extroverted - love social interactions", "weights": {"extrovert": 3, "social": 2}}
        ]
    },
    {
        "id": 7,
        "question": "What skills do you want to develop?",
        "options": [
            {"text": "Programming and technical skills", "weights": {"technical": 3}},
            {"text": "Creative and artistic skills", "weights": {"creative": 3}},
            {"text": "Leadership and management", "weights": {"leadership": 3, "management": 2}},
            {"text": "Communication and public speaking", "weights": {"communication": 3, "social": 1}}
        ]
    },
    {
        "id": 8,
        "question": "How competitive are you?",
        "options": [
            {"text": "Very competitive - I love challenges", "weights": {"competitive": 3, "sports": 1}},
            {"text": "Moderately competitive", "weights": {"competitive": 2}},
            {"text": "Not very competitive", "weights": {"collaborative": 2}},
            {"text": "I prefer collaboration over competition", "weights": {"collaborative": 3, "teamwork": 2}}
        ]
    },
    {
        "id": 9,
        "question": "What's your approach to learning?",
        "options": [
            {"text": "Hands-on experimentation", "weights": {"technical": 2, "practical": 3}},
            {"text": "Creative exploration", "weights": {"creative": 3, "independent": 1}},
            {"text": "Structured guidance", "weights": {"analytical": 2, "management": 1}},
            {"text": "Discussion and debate", "weights": {"communication": 3, "literary": 2}}
        ]
    },
    {
        "id": 10,
        "question": "What kind of projects interest you?",
        "options": [
            {"text": "Building apps, robots, or tech solutions", "weights": {"technical": 3, "practical": 2}},
            {"text": "Creating art, music, or performances", "weights": {"creative": 3, "social": 1}},
            {"text": "Organizing events or campaigns", "weights": {"management": 3, "leadership": 2}},
            {"text": "Writing, research, or advocacy", "weights": {"literary": 3, "social": 2}}
        ]
    }
]

def calculate_quiz_result(answers: List[QuizAnswer]) -> QuizResult:
    scores = {}
    
    for answer in answers:
        question = next((q for q in QUIZ_QUESTIONS if q["id"] == answer.question_id), None)
        if question:
            selected_option = next((opt for opt in question["options"] if opt["text"] == answer.answer), None)
            if selected_option:
                for trait, weight in selected_option["weights"].items():
                    scores[trait] = scores.get(trait, 0) + weight
    
    # Determine personality type based on dominant traits
    personality_type = ""
    personality_description = ""
    
    technical_score = scores.get("technical", 0)
    creative_score = scores.get("creative", 0)
    sports_score = scores.get("sports", 0)
    social_score = scores.get("social", 0)
    literary_score = scores.get("literary", 0)
    leadership_score = scores.get("leadership", 0)
    
    max_score = max(technical_score, creative_score, sports_score, social_score, literary_score, leadership_score)
    
    if technical_score == max_score:
        personality_type = "Tech Explorer 🚀"
        personality_description = "You're a problem solver who loves building and creating with technology. Technical clubs will help you thrive!"
    elif creative_score == max_score:
        personality_type = "Creative Innovator 🎨"
        personality_description = "You express yourself through art and creativity. Cultural and creative clubs are perfect for you!"
    elif sports_score == max_score:
        personality_type = "Athletic Champion 🏆"
        personality_description = "You're competitive and love physical challenges. Sports clubs will channel your energy perfectly!"
    elif social_score == max_score:
        personality_type = "Social Changemaker 🌟"
        personality_description = "You're passionate about people and making an impact. Social and community clubs suit you best!"
    elif literary_score == max_score:
        personality_type = "Literary Thinker 📚"
        personality_description = "You love ideas, words, and meaningful discussions. Literary and debate clubs are your domain!"
    elif leadership_score == max_score:
        personality_type = "Natural Leader 👑"
        personality_description = "You excel at organizing and leading others. Management and leadership clubs will polish your skills!"
    else:
        personality_type = "Versatile All-Rounder 🌈"
        personality_description = "You have diverse interests and can thrive in multiple types of clubs. Explore different options!"
    
    return personality_type, personality_description, scores

async def generate_recommendations(scores: dict, user_id: str) -> List[ClubRecommendation]:
    clubs = await db.clubs.find({}, {"_id": 0}).to_list(100)
    
    club_matches = []
    
    for club in clubs:
        match_score = 0
        reasons = []
        
        # Match based on domain
        domain_lower = club["domain"].lower()
        if domain_lower == "technical" and scores.get("technical", 0) > 5:
            match_score += scores.get("technical", 0) * 10
            reasons.append("strong technical interest")
        elif domain_lower == "cultural" and scores.get("creative", 0) > 5:
            match_score += scores.get("creative", 0) * 10
            reasons.append("creative mindset")
        elif domain_lower == "sports" and scores.get("sports", 0) > 5:
            match_score += scores.get("sports", 0) * 10
            reasons.append("athletic inclination")
        elif domain_lower == "management" and scores.get("leadership", 0) > 5:
            match_score += scores.get("leadership", 0) * 10
            reasons.append("leadership qualities")
        elif domain_lower == "literary" and scores.get("literary", 0) > 5:
            match_score += scores.get("literary", 0) * 10
            reasons.append("literary interests")
        elif domain_lower == "social" and scores.get("social", 0) > 5:
            match_score += scores.get("social", 0) * 10
            reasons.append("social consciousness")
        
        # Match based on personality traits
        if scores.get("competitive", 0) > 4:
            match_score += 20
            reasons.append("competitive spirit")
        
        if scores.get("teamwork", 0) > 4:
            match_score += 15
            reasons.append("team player")
        
        if scores.get("communication", 0) > 4:
            match_score += 15
            reasons.append("strong communication skills")
        
        # Normalize to percentage
        match_percentage = min(int(match_score), 95) + 5
        
        club_matches.append({
            "club_id": club["id"],
            "club_name": club["name"],
            "match_percentage": match_percentage,
            "reason": f"You'd be great here because of your {', '.join(reasons[:2]) if reasons else 'diverse skills'}!",
            "score": match_score
        })
    
    # Sort by match score and get top 3
    club_matches.sort(key=lambda x: x["score"], reverse=True)
    top_matches = club_matches[:3]
    
    return [
        ClubRecommendation(
            club_id=match["club_id"],
            club_name=match["club_name"],
            match_percentage=match["match_percentage"],
            reason=match["reason"]
        )
        for match in top_matches
    ]

# Authentication endpoints
@api_router.post("/auth/signup", response_model=Token)
async def signup(user_data: UserSignup):
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_dict = user_data.model_dump()
    hashed_password = hash_password(user_dict.pop("password"))
    
    user = User(**user_dict)
    user_doc = user.model_dump()
    user_doc["password"] = hashed_password
    user_doc["created_at"] = user_doc["created_at"].isoformat()
    
    await db.users.insert_one(user_doc)
    
    access_token = create_access_token(data={"sub": user.id})
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(
            id=user.id,
            name=user.name,
            email=user.email,
            role=user.role,
            verified=user.verified
        )
    )

@api_router.post("/auth/login", response_model=Token)
async def login(user_data: UserLogin):
    user = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not verify_password(user_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    access_token = create_access_token(data={"sub": user["id"]})
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(
            id=user["id"],
            name=user["name"],
            email=user["email"],
            role=user["role"],
            verified=user["verified"]
        )
    )

@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    return UserResponse(
        id=current_user["id"],
        name=current_user["name"],
        email=current_user["email"],
        role=current_user["role"],
        verified=current_user["verified"]
    )

# Club endpoints
@api_router.get("/clubs", response_model=List[ClubResponse])
async def get_clubs(domain: Optional[str] = None):
    query = {} if not domain else {"domain": domain}
    clubs = await db.clubs.find(query, {"_id": 0}).to_list(100)
    return clubs

@api_router.get("/clubs/{club_id}", response_model=ClubResponse)
async def get_club(club_id: str):
    club = await db.clubs.find_one({"id": club_id}, {"_id": 0})
    if not club:
        raise HTTPException(status_code=404, detail="Club not found")
    return club

# Quiz endpoints
@api_router.get("/quiz/questions")
async def get_quiz_questions():
    return {"questions": [{"id": q["id"], "question": q["question"], "options": [opt["text"] for opt in q["options"]]} for q in QUIZ_QUESTIONS]}

@api_router.post("/quiz/submit", response_model=QuizResult)
async def submit_quiz(submission: QuizSubmission, current_user: dict = Depends(get_current_user)):
    personality_type, personality_description, scores = calculate_quiz_result(submission.answers)
    recommendations = await generate_recommendations(scores, current_user["id"])
    
    # Save quiz response
    quiz_response = QuizResponse(
        user_id=current_user["id"],
        answers=[ans.model_dump() for ans in submission.answers],
        personality_type=personality_type,
        personality_description=personality_description,
        recommendations=[rec.model_dump() for rec in recommendations]
    )
    
    quiz_doc = quiz_response.model_dump()
    quiz_doc["created_at"] = quiz_doc["created_at"].isoformat()
    
    await db.quiz_responses.insert_one(quiz_doc)
    
    return QuizResult(
        personality_type=personality_type,
        personality_description=personality_description,
        recommendations=recommendations
    )

@api_router.get("/quiz/result")
async def get_quiz_result(current_user: dict = Depends(get_current_user)):
    result = await db.quiz_responses.find_one(
        {"user_id": current_user["id"]},
        {"_id": 0},
        sort=[("created_at", -1)]
    )
    
    if not result:
        return None
    
    return {
        "personality_type": result["personality_type"],
        "personality_description": result["personality_description"],
        "recommendations": result["recommendations"]
    }

# Bookmark endpoints
@api_router.post("/bookmarks")
async def create_bookmark(bookmark_data: BookmarkCreate, current_user: dict = Depends(get_current_user)):
    existing = await db.bookmarks.find_one({"user_id": current_user["id"], "club_id": bookmark_data.club_id})
    if existing:
        raise HTTPException(status_code=400, detail="Club already bookmarked")
    
    bookmark = Bookmark(user_id=current_user["id"], club_id=bookmark_data.club_id)
    bookmark_doc = bookmark.model_dump()
    bookmark_doc["created_at"] = bookmark_doc["created_at"].isoformat()
    
    await db.bookmarks.insert_one(bookmark_doc)
    return {"message": "Club bookmarked successfully"}

@api_router.delete("/bookmarks/{club_id}")
async def delete_bookmark(club_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.bookmarks.delete_one({"user_id": current_user["id"], "club_id": club_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Bookmark not found")
    return {"message": "Bookmark removed successfully"}

@api_router.get("/bookmarks", response_model=List[ClubResponse])
async def get_bookmarks(current_user: dict = Depends(get_current_user)):
    bookmarks = await db.bookmarks.find({"user_id": current_user["id"]}, {"_id": 0}).to_list(100)
    club_ids = [b["club_id"] for b in bookmarks]
    
    if not club_ids:
        return []
    
    clubs = await db.clubs.find({"id": {"$in": club_ids}}, {"_id": 0}).to_list(100)
    return clubs

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
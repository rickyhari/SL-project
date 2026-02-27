import asyncio
from motor.motor_asyncio import AsyncIOMotorClient # type: ignore
import os
from dotenv import load_dotenv # type: ignore
from pathlib import Path
import uuid

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

CLUBS_DATA = [
    {
        "id": str(uuid.uuid4()),
        "name": "CodeCraft - Coding Club",
        "description": "Learn programming, participate in hackathons, and build amazing projects. From web development to AI, we cover it all!",
        "domain": "Technical",
        "skills": ["Programming", "Problem Solving", "Web Development", "App Development", "AI/ML"],
        "time_commitment": "5-8 hours/week",
        "recruitment_status": "Open",
        "contact": "codecraft@college.edu",
        "image_url": "https://images.pexels.com/photos/1181260/pexels-photo-1181260.jpeg",
        "tags": ["Coding", "Hackathons", "Tech", "Competitive Programming"],
        "member_count": 150
    },
    {
        "id": str(uuid.uuid4()),
        "name": "RoboMinds - Robotics Club",
        "description": "Design, build, and program robots. Participate in national robotics competitions and learn cutting-edge automation technologies.",
        "domain": "Technical",
        "skills": ["Robotics", "Arduino", "Raspberry Pi", "Automation", "Hardware Design"],
        "time_commitment": "8-12 hours/week",
        "recruitment_status": "Open",
        "contact": "robominds@college.edu",
        "image_url": "https://images.pexels.com/photos/31868218/pexels-photo-31868218.jpeg",
        "tags": ["Robotics", "Hardware", "Innovation", "Competitions"],
        "member_count": 85
    },
    {
        "id": str(uuid.uuid4()),
        "name": "DesignHub - UI/UX Club",
        "description": "Master the art of design thinking, UI/UX, and visual communication. Work on real projects and build impressive portfolios.",
        "domain": "Technical",
        "skills": ["UI/UX Design", "Figma", "Adobe XD", "Design Thinking", "Prototyping"],
        "time_commitment": "4-6 hours/week",
        "recruitment_status": "Open",
        "contact": "designhub@college.edu",
        "image_url": "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800",
        "tags": ["Design", "UI/UX", "Creative", "Portfolio"],
        "member_count": 95
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Nrityanjali - Dance Club",
        "description": "Express yourself through various dance forms - from classical to contemporary. Perform at college festivals and compete nationally!",
        "domain": "Cultural",
        "skills": ["Dance", "Choreography", "Stage Performance", "Teamwork", "Creativity"],
        "time_commitment": "6-10 hours/week",
        "recruitment_status": "Upcoming",
        "contact": "nrityanjali@college.edu",
        "image_url": "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800",
        "tags": ["Dance", "Performance", "Cultural", "Team"],
        "member_count": 120
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Melodia - Music Club",
        "description": "Unleash your musical talent! Learn instruments, create bands, compose original music, and perform at major college events.",
        "domain": "Cultural",
        "skills": ["Music", "Instruments", "Vocals", "Music Production", "Performance"],
        "time_commitment": "5-8 hours/week",
        "recruitment_status": "Open",
        "contact": "melodia@college.edu",
        "image_url": "https://images.unsplash.com/photo-1770844049822-583611b8efb3?w=800",
        "tags": ["Music", "Band", "Performance", "Creative"],
        "member_count": 110
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Dramatics Society",
        "description": "Explore theatre, acting, and storytelling. From street plays to full-scale productions, unleash your dramatic potential!",
        "domain": "Cultural",
        "skills": ["Acting", "Theatre", "Direction", "Scriptwriting", "Stage Management"],
        "time_commitment": "8-12 hours/week",
        "recruitment_status": "Open",
        "contact": "dramatics@college.edu",
        "image_url": "https://images.unsplash.com/photo-1503095396549-807759245b35?w=800",
        "tags": ["Drama", "Theatre", "Acting", "Creative"],
        "member_count": 75
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Athletics Club",
        "description": "Train in track and field events. Compete at inter-college sports meets and represent our college at state and national levels.",
        "domain": "Sports",
        "skills": ["Running", "Jumping", "Throwing", "Endurance", "Discipline"],
        "time_commitment": "10-15 hours/week",
        "recruitment_status": "Open",
        "contact": "athletics@college.edu",
        "image_url": "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800",
        "tags": ["Athletics", "Sports", "Competition", "Fitness"],
        "member_count": 90
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Cricket Club",
        "description": "Practice, play, and compete in inter-college cricket tournaments. Professional coaching and state-level exposure guaranteed!",
        "domain": "Sports",
        "skills": ["Cricket", "Teamwork", "Strategy", "Fitness", "Sportsmanship"],
        "time_commitment": "8-12 hours/week",
        "recruitment_status": "Closed",
        "contact": "cricket@college.edu",
        "image_url": "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800",
        "tags": ["Cricket", "Team Sports", "Competition"],
        "member_count": 45
    },
    {
        "id": str(uuid.uuid4()),
        "name": "DebateSoc - Debate Club",
        "description": "Sharpen your argumentation skills, participate in parliamentary debates, MUNs, and develop critical thinking abilities.",
        "domain": "Literary",
        "skills": ["Public Speaking", "Critical Thinking", "Research", "Argumentation", "Confidence"],
        "time_commitment": "4-6 hours/week",
        "recruitment_status": "Open",
        "contact": "debatesoc@college.edu",
        "image_url": "https://images.unsplash.com/photo-1648250537652-a648421c588c?w=800",
        "tags": ["Debate", "MUN", "Public Speaking", "Critical Thinking"],
        "member_count": 70
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Literary Society",
        "description": "For lovers of literature, poetry, and creative writing. Publish magazines, organize poetry slams, and literary festivals.",
        "domain": "Literary",
        "skills": ["Writing", "Poetry", "Literature", "Editing", "Publishing"],
        "time_commitment": "3-5 hours/week",
        "recruitment_status": "Open",
        "contact": "litsoc@college.edu",
        "image_url": "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800",
        "tags": ["Literature", "Writing", "Poetry", "Creative"],
        "member_count": 60
    },
    {
        "id": str(uuid.uuid4()),
        "name": "EnactUs - Social Entrepreneurship",
        "description": "Create social impact through entrepreneurial ventures. Work on real-world problems and compete in national EnactUs competitions.",
        "domain": "Social",
        "skills": ["Entrepreneurship", "Social Impact", "Project Management", "Teamwork", "Innovation"],
        "time_commitment": "6-10 hours/week",
        "recruitment_status": "Open",
        "contact": "enactus@college.edu",
        "image_url": "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800",
        "tags": ["Social Impact", "Entrepreneurship", "Innovation"],
        "member_count": 80
    },
    {
        "id": str(uuid.uuid4()),
        "name": "NSS - National Service Scheme",
        "description": "Serve the community through various social service activities. From teaching underprivileged kids to organizing health camps.",
        "domain": "Social",
        "skills": ["Community Service", "Leadership", "Organizing", "Empathy", "Social Work"],
        "time_commitment": "5-8 hours/week",
        "recruitment_status": "Open",
        "contact": "nss@college.edu",
        "image_url": "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800",
        "tags": ["Social Service", "Community", "Volunteering"],
        "member_count": 200
    },
    {
        "id": str(uuid.uuid4()),
        "name": "E-Cell - Entrepreneurship Cell",
        "description": "Build your startup dreams! Learn from successful entrepreneurs, participate in business plan competitions, and get mentorship.",
        "domain": "Management",
        "skills": ["Entrepreneurship", "Business Planning", "Marketing", "Pitching", "Networking"],
        "time_commitment": "5-8 hours/week",
        "recruitment_status": "Upcoming",
        "contact": "ecell@college.edu",
        "image_url": "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800",
        "tags": ["Entrepreneurship", "Startup", "Business", "Innovation"],
        "member_count": 130
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Marketing Club",
        "description": "Master marketing strategies, digital marketing, branding, and organize major college events. Build real-world marketing skills.",
        "domain": "Management",
        "skills": ["Marketing", "Digital Marketing", "Event Management", "Branding", "Social Media"],
        "time_commitment": "4-7 hours/week",
        "recruitment_status": "Open",
        "contact": "marketingclub@college.edu",
        "image_url": "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800",
        "tags": ["Marketing", "Events", "Digital", "Management"],
        "member_count": 100
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Photography Club",
        "description": "Capture moments and tell stories through your lens. Learn professional photography, editing, and showcase your work at exhibitions.",
        "domain": "Cultural",
        "skills": ["Photography", "Photo Editing", "Visual Storytelling", "Lightroom", "Photoshop"],
        "time_commitment": "4-6 hours/week",
        "recruitment_status": "Open",
        "contact": "photoclub@college.edu",
        "image_url": "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800",
        "tags": ["Photography", "Art", "Visual", "Creative"],
        "member_count": 85
    }
]

async def seed_clubs():
    print("Seeding clubs data...")
    
    # Clear existing clubs
    await db.clubs.delete_many({})
    
    # Insert new clubs
    await db.clubs.insert_many(CLUBS_DATA)
    
    print(f"Successfully seeded {len(CLUBS_DATA)} clubs!")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_clubs())

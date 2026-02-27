# College Club Compass 🎯

A full-stack web application that helps first-year college students discover the perfect clubs based on their interests using an AI-powered quiz system.

## 🌟 Features

### Core Features ✅
- **Smart Quiz System**: 10-question personality assessment with weighted algorithm
- **AI-Powered Recommendations**: Get top 3 club matches with percentage scores
- **Personality Types**: 6+ unique personality profiles (Tech Explorer, Creative Innovator, etc.)
- **Club Explorer**: Browse 15 pre-seeded clubs across 6 domains
- **Bookmark System**: Save favorite clubs for later
- **Role-Based Access**: Separate experiences for Freshers and Seniors
- **Dark Mode**: Beautiful light/dark theme toggle with persistence

### User Roles
- **Fresher**: First-year students looking to join clubs
- **Senior**: Club members with verified badges

## 🎨 Design

- **Theme**: Neo-Brutalism Lite with vibrant "Electric Campus" colors
- **Light Mode**: Electric Lime (#CCFF00) primary, Hot Pink (#FF0099) secondary
- **Dark Mode**: Cyan (#00FFFF) primary, Electric Purple (#BF00FF) secondary
- **Typography**: Syne (headings), Manrope (body)
- **Style**: Bold borders, hard shadows, energetic student-focused design

## 🚀 Tech Stack

### Frontend
- React 19
- React Router DOM
- Tailwind CSS
- Framer Motion (animations)
- React Fast Marquee
- Shadcn UI Components
- Axios

### Backend
- FastAPI (Python)
- Motor (async MongoDB)
- JWT Authentication
- Bcrypt (password hashing)
- Pydantic (data validation)

### Database
- MongoDB (15 pre-seeded clubs)

## 📦 Installation

### Prerequisites
- Node.js 16+ and Yarn
- Python 3.11+
- MongoDB running on localhost:27017

### Backend Setup
```bash
cd /app/backend
pip install -r requirements.txt

# Seed the database with clubs
python seed_data.py

# Start the backend (via supervisor)
sudo supervisorctl restart backend
```

### Frontend Setup
```bash
cd /app/frontend
yarn install

# Start the frontend (via supervisor)
sudo supervisorctl restart frontend
```

## 🔧 Environment Variables

### Backend (.env)
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=test_database
CORS_ORIGINS=*
JWT_SECRET_KEY=your-secret-key-change-in-production
```

### Frontend (.env)
```
REACT_APP_BACKEND_URL=https://college-club-guide.preview.emergentagent.com
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Clubs
- `GET /api/clubs` - Get all clubs (optional query: ?domain=Technical)
- `GET /api/clubs/{club_id}` - Get club details

### Quiz
- `GET /api/quiz/questions` - Get 10 quiz questions
- `POST /api/quiz/submit` - Submit quiz answers
- `GET /api/quiz/result` - Get user's quiz result

### Bookmarks
- `POST /api/bookmarks` - Bookmark a club
- `GET /api/bookmarks` - Get user's bookmarked clubs
- `DELETE /api/bookmarks/{club_id}` - Remove bookmark

## 🎯 Quiz Algorithm

The quiz uses a weighted scoring system that evaluates:
- Technical interest (coding, robotics)
- Creative inclination (art, music, performance)
- Athletic ability (sports, fitness)
- Social consciousness (community service, impact)
- Literary interests (writing, debate)
- Leadership qualities (management, organizing)

**Personality Types Generated:**
1. Tech Explorer 🚀 - For problem solvers and tech enthusiasts
2. Creative Innovator 🎨 - For artists and creative minds
3. Athletic Champion 🏆 - For sports and competition lovers
4. Social Changemaker 🌟 - For community-focused students
5. Literary Thinker 📚 - For readers and debaters
6. Natural Leader 👑 - For organizers and managers
7. Versatile All-Rounder 🌈 - For diverse interests

## 🗂️ Project Structure

```
/app/
├── backend/
│   ├── server.py           # Main FastAPI application
│   ├── seed_data.py        # Database seeding script
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Backend environment variables
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   └── ui/        # Shadcn UI components
│   │   ├── contexts/
│   │   │   ├── AuthContext.js
│   │   │   └── ThemeContext.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Signup.js
│   │   │   ├── Quiz.js
│   │   │   ├── QuizResult.js
│   │   │   ├── Clubs.js
│   │   │   ├── ClubDetail.js
│   │   │   └── Dashboard.js
│   │   ├── lib/
│   │   │   └── api.js     # Axios instance
│   │   ├── App.js
│   │   └── index.css      # Tailwind + custom styles
│   ├── package.json
│   ├── tailwind.config.js
│   └── .env              # Frontend environment variables
└── design_guidelines.json # Design system specification
```

## 🎮 How to Use

### For Freshers:
1. **Sign Up**: Create account with email and password, select "Fresher" role
2. **Take Quiz**: Answer 10 questions about your interests and preferences
3. **Get Results**: View your personality type and top 3 recommended clubs
4. **Explore Clubs**: Browse all 15 clubs, search, and filter by domain
5. **Bookmark**: Save clubs you're interested in
6. **Dashboard**: View your quiz results and bookmarked clubs

### For Seniors:
1. **Sign Up**: Create account with "Senior" role
2. **Get Badge**: Receive verified senior badge
3. **Explore**: Browse clubs and help freshers with guidance

## 🧪 Testing

All core features tested and verified:
- ✅ Authentication (signup, login, protected routes)
- ✅ Quiz system (10 questions, personality calculation)
- ✅ Recommendations (match percentages, explanations)
- ✅ Club explorer (search, filters)
- ✅ Bookmarking (add, remove, persist)
- ✅ Dark mode toggle
- ✅ Responsive design
- ✅ API integration

### Test Accounts Created:
- `emma@college.edu` / `emma123` (Fresher - has taken quiz)
- `test@college.edu` / `test123` (Fresher)
- `fresher1@college.edu` / `test123` (Fresher)

### Manual API Testing:
```bash
# Get all clubs
curl https://college-club-guide.preview.emergentagent.com/api/clubs

# Login
curl -X POST https://college-club-guide.preview.emergentagent.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"emma@college.edu","password":"emma123"}'
```

## 📊 Database

### Collections:
- **users**: User accounts with roles and verification status
- **clubs**: 15 pre-seeded clubs across domains
- **quiz_responses**: User quiz submissions and results
- **bookmarks**: User-club bookmarking relationships

### Sample Clubs:
- Technical: CodeCraft, RoboMinds, DesignHub
- Cultural: Nrityanjali (Dance), Melodia (Music), Dramatics Society, Photography Club
- Sports: Athletics Club, Cricket Club
- Literary: DebateSoc, Literary Society
- Social: EnactUs, NSS
- Management: E-Cell, Marketing Club

## 🔒 Security Features

- JWT-based authentication
- Bcrypt password hashing
- Protected routes on frontend
- Token-based API authorization
- CORS configuration
- Input validation with Pydantic

## 🚀 Deployment

The application is deployed at:
- **URL**: https://college-club-guide.preview.emergentagent.com
- **Backend**: FastAPI on port 8001 (internal)
- **Frontend**: React on port 3000 (internal)
- **Ingress**: Kubernetes routing with `/api` prefix for backend

## 🎓 Key Learnings & Future Enhancements

### What Works Great:
- Vibrant, student-focused design stands out
- Quiz algorithm accurately matches interests to clubs
- Smooth user flow from signup → quiz → recommendations → exploration
- Dark mode implementation is clean

### Potential Enhancements:
1. **Q&A System**: Add forum for freshers to ask seniors questions
2. **Recruitment Alerts**: Notification system for club openings
3. **Senior Features**: Club management dashboard for seniors
4. **Social Features**: Student profiles, club member directory
5. **Advanced Filters**: Filter by time commitment, skills, competition level
6. **Email Integration**: Send quiz results and recommendations via email
7. **Analytics**: Track popular clubs, successful matches
8. **Mobile App**: React Native version for better mobile experience

## 📝 Code Quality

- Clean, commented code
- Consistent naming conventions
- Modular component structure
- Proper error handling
- Type validation with Pydantic
- Responsive design patterns
- Accessibility considerations (data-testid attributes)

## 👥 Credits

- **Design System**: Neo-Brutalism Lite / Electric Campus palette
- **UI Components**: Shadcn UI
- **Images**: Unsplash & Pexels
- **Icons**: Lucide React

## 📄 License

This project is built for educational purposes as part of the College Club Compass platform.

---

**Built with ❤️ using React, FastAPI, and MongoDB**

*Helping students find their tribe, one quiz at a time!* 🎯

import requests
import sys
import json
from datetime import datetime

class CollegeClubAPITester:
    def __init__(self, base_url="https://college-club-guide.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.created_club_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=10)

            print(f"   Status: {response.status_code}")
            
            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, dict) and len(str(response_data)) < 500:
                        print(f"   Response: {response_data}")
                    elif isinstance(response_data, list):
                        print(f"   Response: List with {len(response_data)} items")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Error: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_signup(self, email, password, name, role):
        """Test user signup"""
        success, response = self.run_test(
            f"Signup ({role})",
            "POST",
            "auth/signup",
            200,
            data={
                "email": email,
                "password": password,
                "name": name,
                "role": role
            }
        )
        if success and 'access_token' in response:
            self.token = response['access_token']
            self.user_id = response['user']['id']
            print(f"   Token obtained for {email}")
            return True
        return False

    def test_login(self, email, password):
        """Test user login"""
        success, response = self.run_test(
            "Login",
            "POST",
            "auth/login",
            200,
            data={"email": email, "password": password}
        )
        if success and 'access_token' in response:
            self.token = response['access_token']
            self.user_id = response['user']['id']
            print(f"   Token obtained for {email}")
            return True
        return False

    def test_get_me(self):
        """Test get current user"""
        success, response = self.run_test(
            "Get Current User",
            "GET",
            "auth/me",
            200
        )
        return success

    def test_get_clubs(self):
        """Test get all clubs"""
        success, response = self.run_test(
            "Get All Clubs",
            "GET",
            "clubs",
            200
        )
        if success and isinstance(response, list):
            print(f"   Found {len(response)} clubs")
            if len(response) > 0:
                self.created_club_id = response[0].get('id')
                print(f"   Sample club: {response[0].get('name', 'Unknown')}")
        return success

    def test_get_club_by_id(self, club_id):
        """Test get specific club"""
        success, response = self.run_test(
            "Get Club by ID",
            "GET",
            f"clubs/{club_id}",
            200
        )
        return success

    def test_get_quiz_questions(self):
        """Test get quiz questions"""
        success, response = self.run_test(
            "Get Quiz Questions",
            "GET",
            "quiz/questions",
            200
        )
        if success and 'questions' in response:
            print(f"   Found {len(response['questions'])} questions")
        return success

    def test_submit_quiz(self):
        """Test quiz submission"""
        # Sample quiz answers
        quiz_answers = [
            {"question_id": 1, "answer": "Coding or building tech projects"},
            {"question_id": 2, "answer": "Solving complex problems"},
            {"question_id": 3, "answer": "Independently with clear goals"},
            {"question_id": 4, "answer": "Hackathons and tech competitions"},
            {"question_id": 5, "answer": "5-8 hours (Moderate commitment)"},
            {"question_id": 6, "answer": "Somewhat introverted"},
            {"question_id": 7, "answer": "Programming and technical skills"},
            {"question_id": 8, "answer": "Very competitive - I love challenges"},
            {"question_id": 9, "answer": "Hands-on experimentation"},
            {"question_id": 10, "answer": "Building apps, robots, or tech solutions"}
        ]
        
        success, response = self.run_test(
            "Submit Quiz",
            "POST",
            "quiz/submit",
            200,
            data={"answers": quiz_answers}
        )
        if success:
            print(f"   Personality: {response.get('personality_type', 'Unknown')}")
            print(f"   Recommendations: {len(response.get('recommendations', []))}")
        return success

    def test_get_quiz_result(self):
        """Test get quiz result"""
        success, response = self.run_test(
            "Get Quiz Result",
            "GET",
            "quiz/result",
            200
        )
        return success

    def test_create_bookmark(self, club_id):
        """Test create bookmark"""
        success, response = self.run_test(
            "Create Bookmark",
            "POST",
            "bookmarks",
            200,
            data={"club_id": club_id}
        )
        return success

    def test_get_bookmarks(self):
        """Test get bookmarks"""
        success, response = self.run_test(
            "Get Bookmarks",
            "GET",
            "bookmarks",
            200
        )
        if success and isinstance(response, list):
            print(f"   Found {len(response)} bookmarked clubs")
        return success

    def test_delete_bookmark(self, club_id):
        """Test delete bookmark"""
        success, response = self.run_test(
            "Delete Bookmark",
            "DELETE",
            f"bookmarks/{club_id}",
            200
        )
        return success

    def test_duplicate_signup(self, email):
        """Test duplicate email signup (should fail)"""
        success, response = self.run_test(
            "Duplicate Signup (should fail)",
            "POST",
            "auth/signup",
            400,
            data={
                "email": email,
                "password": "password123",
                "name": "Duplicate User",
                "role": "fresher"
            }
        )
        return success

    def test_invalid_login(self):
        """Test invalid login credentials"""
        success, response = self.run_test(
            "Invalid Login (should fail)",
            "POST",
            "auth/login",
            401,
            data={"email": "invalid@test.com", "password": "wrongpassword"}
        )
        return success

def main():
    print("🚀 Starting College Club Compass API Tests")
    print("=" * 60)
    
    tester = CollegeClubAPITester()
    
    # Test 1: Basic club data (no auth required)
    print("\n📋 Testing Public Endpoints...")
    tester.test_get_clubs()
    
    if tester.created_club_id:
        tester.test_get_club_by_id(tester.created_club_id)
    
    tester.test_get_quiz_questions()
    
    # Test 2: Authentication Flow
    print("\n🔐 Testing Authentication...")
    
    # Test signup for fresher
    fresher_email = f"alice@college.edu"
    if not tester.test_signup(fresher_email, "password123", "Alice Johnson", "fresher"):
        print("❌ Fresher signup failed, stopping tests")
        return 1
    
    # Test protected endpoints with fresher
    print("\n👤 Testing Fresher User Endpoints...")
    tester.test_get_me()
    
    # Test quiz flow
    tester.test_submit_quiz()
    tester.test_get_quiz_result()
    
    # Test bookmark flow
    if tester.created_club_id:
        tester.test_create_bookmark(tester.created_club_id)
        tester.test_get_bookmarks()
        tester.test_delete_bookmark(tester.created_club_id)
    
    # Test senior signup
    print("\n👨‍🎓 Testing Senior User...")
    senior_email = f"bob@college.edu"
    tester.test_signup(senior_email, "password123", "Bob Smith", "senior")
    
    # Test login with first user
    print("\n🔄 Testing Login Flow...")
    tester.test_login(fresher_email, "password123")
    
    # Test error cases
    print("\n❌ Testing Error Cases...")
    tester.test_duplicate_signup(fresher_email)
    tester.test_invalid_login()
    
    # Print final results
    print("\n" + "=" * 60)
    print(f"📊 Final Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All backend API tests passed!")
        return 0
    else:
        print(f"⚠️  {tester.tests_run - tester.tests_passed} tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())
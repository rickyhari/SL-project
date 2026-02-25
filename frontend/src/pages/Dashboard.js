import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";
import {
  Trophy,
  Bookmark,
  Sparkles,
  Target,
  ArrowRight,
  Award,
  Users,
} from "lucide-react";
import api from "../lib/api";
import { toast } from "sonner";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quizResult, setQuizResult] = useState(null);
  const [bookmarkedClubs, setBookmarkedClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === "fresher") {
      fetchFresherData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchFresherData = async () => {
    try {
      const [resultResponse, bookmarksResponse] = await Promise.all([
        api.get("/quiz/result"),
        api.get("/bookmarks"),
      ]);

      setQuizResult(resultResponse.data);
      setBookmarkedClubs(bookmarksResponse.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (clubId) => {
    try {
      await api.delete(`/bookmarks/${clubId}`);
      setBookmarkedClubs(bookmarkedClubs.filter((club) => club.id !== clubId));
      toast.success("Bookmark removed");
    } catch (error) {
      console.error("Error removing bookmark:", error);
      toast.error("Failed to remove bookmark");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Fresher Dashboard
  if (user.role === "fresher") {
    return (
      <div className="min-h-[calc(100vh-80px)] px-6 py-12">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1
              className="font-syne text-4xl md:text-5xl font-extrabold mb-2"
              data-testid="dashboard-title"
            >
              Welcome back, {user.name}! 👋
            </h1>
            <p className="text-muted-foreground text-lg">
              Here's your club discovery journey
            </p>
          </motion.div>

          {/* Quiz Result Section */}
          {quizResult ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <div className="bg-gradient-to-br from-primary/20 to-secondary/20 p-8 rounded-xl border-2 border-border shadow-brutal">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center border-2 border-border flex-shrink-0">
                    <Trophy className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="font-syne text-2xl font-bold mb-2">
                      Your Personality: {quizResult.personality_type}
                    </h2>
                    <p className="text-muted-foreground">
                      {quizResult.personality_description}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-syne text-xl font-bold flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Your Top Recommendations
                  </h3>

                  <div className="grid md:grid-cols-3 gap-4">
                    {quizResult.recommendations.map((rec, index) => (
                      <motion.div
                        key={rec.club_id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        data-testid={`recommended-club-${index}`}
                        className="bg-card p-6 rounded-xl border-2 border-border hover:shadow-brutal-sm transition-all cursor-pointer"
                        onClick={() => navigate(`/clubs/${rec.club_id}`)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-syne text-3xl font-extrabold text-primary">
                            #{index + 1}
                          </span>
                          <span className="text-2xl font-bold text-primary">
                            {rec.match_percentage}%
                          </span>
                        </div>
                        <h4 className="font-bold mb-2">{rec.club_name}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {rec.reason}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => navigate("/clubs")}
                  data-testid="explore-more-clubs-button"
                  className="mt-6 rounded-full border-2 border-border shadow-brutal-sm hover:translate-y-[-2px] hover:shadow-brutal transition-all"
                >
                  Explore More Clubs
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <div className="bg-card p-8 rounded-xl border-2 border-border shadow-brutal text-center">
                <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
                <h2 className="font-syne text-2xl font-bold mb-2">
                  Take the Quiz!
                </h2>
                <p className="text-muted-foreground mb-6">
                  Discover which clubs are perfect for you with our AI-powered
                  quiz
                </p>
                <Button
                  onClick={() => navigate("/quiz")}
                  data-testid="take-quiz-dashboard-button"
                  size="lg"
                  className="rounded-full border-2 border-border shadow-brutal-sm hover:translate-y-[-2px] hover:shadow-brutal transition-all"
                >
                  Start Quiz Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Bookmarked Clubs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="font-syne text-2xl font-bold mb-6 flex items-center gap-2">
              <Bookmark className="w-6 h-6 text-primary" />
              Saved Clubs ({bookmarkedClubs.length})
            </h2>

            {bookmarkedClubs.length === 0 ? (
              <div className="bg-card p-12 rounded-xl border-2 border-border text-center">
                <div className="text-6xl mb-4">📌</div>
                <h3 className="font-syne text-xl font-bold mb-2">
                  No saved clubs yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  Start exploring and bookmark clubs you're interested in!
                </p>
                <Button
                  onClick={() => navigate("/clubs")}
                  variant="outline"
                  className="rounded-full border-2"
                >
                  Browse Clubs
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookmarkedClubs.map((club, index) => (
                  <motion.div
                    key={club.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    data-testid={`bookmarked-club-${index}`}
                    className="bg-card rounded-xl border-2 border-border shadow-brutal hover:shadow-brutal-lg transition-all overflow-hidden"
                  >
                    <div
                      className="relative h-40 overflow-hidden cursor-pointer"
                      onClick={() => navigate(`/clubs/${club.id}`)}
                    >
                      <img
                        src={club.image_url}
                        alt={club.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3 px-2 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                        {club.domain}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-syne text-lg font-bold mb-1">
                        {club.name}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                        {club.description}
                      </p>
                      <div className="flex items-center justify-between gap-2">
                        <Button
                          onClick={() => navigate(`/clubs/${club.id}`)}
                          size="sm"
                          variant="outline"
                          className="flex-1 rounded-full border-2"
                        >
                          View Details
                        </Button>
                        <Button
                          onClick={() => handleRemoveBookmark(club.id)}
                          data-testid={`remove-bookmark-${index}`}
                          size="sm"
                          variant="ghost"
                          className="rounded-full"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  // Senior Dashboard
  return (
    <div className="min-h-[calc(100vh-80px)] px-6 py-12">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full border-2 border-border mb-6">
            <Award className="w-5 h-5" />
            <span className="font-bold">
              {user.verified ? "Verified Senior" : "Senior Member"}
            </span>
          </div>

          <h1 className="font-syne text-4xl md:text-5xl font-extrabold mb-4">
            Welcome, {user.name}!
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Help freshers find their perfect club match
          </p>

          <div className="bg-card p-12 rounded-xl border-2 border-border shadow-brutal">
            <Users className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="font-syne text-2xl font-bold mb-4">
              Senior Features Coming Soon
            </h2>
            <p className="text-muted-foreground mb-6">
              We're building club management features for seniors. Stay tuned!
            </p>
            <Button
              onClick={() => navigate("/clubs")}
              className="rounded-full border-2 border-border shadow-brutal-sm"
            >
              Explore Clubs
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;

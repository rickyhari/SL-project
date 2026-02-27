import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Mail,
  Users,
  Clock,
  Award,
} from "lucide-react";
import api from "../lib/api";
import { toast } from "sonner";

const ClubDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarking, setBookmarking] = useState(false);

  useEffect(() => {
    fetchClubDetails();
    checkBookmarkStatus();
  }, [id]);

  const fetchClubDetails = async () => {
    try {
      const response = await api.get(`/clubs/${id}`);
      setClub(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching club details:", error);
      toast.error("Failed to load club details");
      setLoading(false);
    }
  };

  const checkBookmarkStatus = async () => {
    try {
      const response = await api.get("/bookmarks");
      const bookmarkedClubIds = response.data.map((club) => club.id);
      setIsBookmarked(bookmarkedClubIds.includes(id));
    } catch (error) {
      console.error("Error checking bookmark status:", error);
    }
  };

  const handleBookmark = async () => {
    setBookmarking(true);
    try {
      if (isBookmarked) {
        await api.delete(`/bookmarks/${id}`);
        setIsBookmarked(false);
        toast.success("Removed from bookmarks");
      } else {
        await api.post("/bookmarks", { club_id: id });
        setIsBookmarked(true);
        toast.success("Added to bookmarks!");
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast.error("Failed to update bookmark");
    } finally {
      setBookmarking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading club details...</p>
        </div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="font-syne text-2xl font-bold mb-2">Club not found</h2>
          <Button onClick={() => navigate("/clubs")} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Clubs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] px-6 py-12">
      <div className="container mx-auto max-w-5xl">
        {/* Back Button */}
        <Button
          onClick={() => navigate("/clubs")}
          data-testid="back-to-clubs-button"
          variant="ghost"
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Clubs
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl border-2 border-border shadow-brutal overflow-hidden"
        >
          {/* Hero Image */}
          <div className="relative h-64 md:h-80 overflow-hidden">
            <img
              src={club.image_url}
              alt={club.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="inline-block px-3 py-1 bg-primary text-primary-foreground text-sm font-bold rounded-full border border-border mb-3">
                    {club.domain}
                  </div>
                  <h1
                    className="font-syne text-3xl md:text-4xl font-extrabold text-background dark:text-foreground"
                    data-testid="club-name"
                  >
                    {club.name}
                  </h1>
                </div>
                <Button
                  onClick={handleBookmark}
                  disabled={bookmarking}
                  data-testid="bookmark-button"
                  size="icon"
                  className="rounded-full border-2 w-12 h-12 shadow-brutal-sm"
                  variant={isBookmarked ? "default" : "secondary"}
                >
                  {isBookmarked ? (
                    <BookmarkCheck className="w-5 h-5" />
                  ) : (
                    <Bookmark className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Quick Info */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg border-2 border-border">
                <Clock className="w-6 h-6 text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground font-medium">
                    Time Commitment
                  </div>
                  <div className="font-bold">{club.time_commitment}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg border-2 border-border">
                <Users className="w-6 h-6 text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground font-medium">
                    Members
                  </div>
                  <div className="font-bold">{club.member_count} students</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg border-2 border-border">
                <Award className="w-6 h-6 text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground font-medium">
                    Recruitment
                  </div>
                  <div
                    className={`font-bold ${
                      club.recruitment_status === "Open"
                        ? "text-green-600 dark:text-green-400"
                        : club.recruitment_status === "Upcoming"
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {club.recruitment_status}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="font-syne text-2xl font-bold mb-4">About</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {club.description}
              </p>
            </div>

            {/* Skills */}
            <div>
              <h2 className="font-syne text-2xl font-bold mb-4">
                Skills You'll Gain
              </h2>
              <div className="flex flex-wrap gap-3">
                {club.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-primary/10 text-primary border-2 border-primary rounded-full font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Tags */}
            {club.tags.length > 0 && (
              <div>
                <h2 className="font-syne text-2xl font-bold mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {club.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-muted rounded-md text-sm font-medium border border-border"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact */}
            <div className="p-6 bg-primary/5 rounded-xl border-2 border-primary/20">
              <h2 className="font-syne text-xl font-bold mb-3">
                Interested? Get in Touch!
              </h2>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <a
                  href={`mailto:${club.contact}`}
                  data-testid="contact-email"
                  className="text-primary font-medium hover:underline"
                >
                  {club.contact}
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ClubDetail;

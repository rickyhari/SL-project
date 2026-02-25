import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Trophy,
  Target,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";

const QuizResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState(location.state?.result);

  useEffect(() => {
    if (!result) {
      // If no result in state, user might have refreshed - redirect to dashboard
      navigate("/dashboard");
    }
  }, [result, navigate]);

  if (!result) {
    return null;
  }

  const { personality_type, personality_description, recommendations } = result;

  return (
    <div className="min-h-[calc(100vh-80px)] px-6 py-12">
      <div className="container mx-auto max-w-4xl">
        {/* Personality Result */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="text-center mb-12"
        >
          <div className="inline-block mb-6">
            <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center border-4 border-border shadow-brutal mx-auto">
              <Trophy className="w-12 h-12 text-primary-foreground\" />
            </div>
          </div>

          <h1
            className="font-syne text-4xl md:text-5xl font-extrabold mb-4"
            data-testid="personality-type"
          >
            You are a {personality_type}
          </h1>

          <p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            data-testid="personality-description"
          >
            {personality_description}
          </p>
        </motion.div>

        {/* Recommendations Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground font-bold text-sm uppercase tracking-widest rounded-full border-2 border-border shadow-brutal-sm mb-4">
            <Sparkles className="w-4 h-4" />
            Top Matches For You
          </div>

          <p className="text-muted-foreground">
            Based on your quiz responses, these clubs are perfect for you!
          </p>
        </motion.div>

        {/* Recommended Clubs */}
        <div className="space-y-6 mb-12">
          {recommendations.map((rec, index) => (
            <motion.div
              key={rec.club_id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.2 }}
              data-testid={`recommendation-${index}`}
              className="bg-card p-8 rounded-xl border-2 border-border shadow-brutal hover:shadow-brutal-lg transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-3">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-syne font-extrabold text-xl border-2 border-border">
                      #{index + 1}
                    </div>
                    <div>
                      <h3 className="font-syne text-2xl font-bold mb-2">
                        {rec.club_name}
                      </h3>
                      <p className="text-muted-foreground mb-3">
                        {rec.reason}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex md:flex-col items-center gap-4">
                  <div className="text-center">
                    <div className="font-syne text-4xl font-extrabold text-primary mb-1">
                      {rec.match_percentage}%
                    </div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">
                      Match
                    </div>
                  </div>

                  <Button
                    onClick={() => navigate(`/clubs/${rec.club_id}`)}
                    data-testid={`view-club-${index}-button`}
                    size=\"sm\"\n                    className=\"rounded-full border-2 border-border shadow-brutal-sm hover:translate-y-[-2px] hover:shadow-brutal transition-all\"\n                  >\n                    View Club\n                    <ArrowRight className=\"w-4 h-4 ml-2\" />\n                  </Button>\n                </div>\n              </div>\n            </motion.div>\n          ))}\n        </div>\n\n        {/* Action Buttons */}\n        <motion.div\n          initial={{ opacity: 0, y: 20 }}\n          animate={{ opacity: 1, y: 0 }}\n          transition={{ delay: 1 }}\n          className=\"flex flex-col sm:flex-row gap-4 justify-center\"\n        >\n          <Button\n            onClick={() => navigate(\"/clubs\")}\n            data-testid=\"explore-all-button\"\n            size=\"lg\"\n            className=\"rounded-full border-2 border-border shadow-brutal-sm hover:translate-y-[-2px] hover:shadow-brutal transition-all px-8\"\n          >\n            <Target className=\"w-5 h-5 mr-2\" />\n            Explore All Clubs\n          </Button>\n\n          <Button\n            onClick={() => navigate(\"/dashboard\")}\n            data-testid=\"go-to-dashboard-button\"\n            variant=\"outline\"\n            size=\"lg\"\n            className=\"rounded-full border-2 px-8\"\n          >\n            Go to Dashboard\n            <TrendingUp className=\"w-5 h-5 ml-2\" />\n          </Button>\n        </motion.div>\n      </div>\n    </div>\n  );\n};\n\nexport default QuizResult;

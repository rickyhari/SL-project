import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";
import {
  Sparkles,
  Target,
  Users,
  Zap,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useEffect, useState } from "react";
import api from "../lib/api";
import Marquee from "react-fast-marquee";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const response = await api.get("/clubs");
      setClubs(response.data.slice(0, 6));
    } catch (error) {
      console.error("Error fetching clubs:", error);
    }
  };

  const handleTakeQuiz = () => {
    if (!user) {
      navigate("/signup");
    } else {
      navigate("/quiz");
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 px-6 overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
        />

        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-block"
            >
              <span className="inline-block px-6 py-2 bg-primary text-primary-foreground font-bold text-sm uppercase tracking-widest rounded-full border-2 border-border shadow-brutal-sm">
                🎯 Find Your Perfect Club
              </span>
            </motion.div>

            <h1
              className="font-syne text-5xl md:text-7xl font-extrabold tracking-tight leading-none"
              data-testid="hero-title"
            >
              Confused about{" "}
              <span className="relative inline-block">
                <span className="relative z-10">which club</span>
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="absolute bottom-2 left-0 h-3 bg-secondary -rotate-1"
                />
              </span>
              <br />
              to join?
            </h1>

            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Discover the perfect club based on your interests with our
              intelligent quiz system. Get personalized recommendations in
              minutes!
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleTakeQuiz}
                data-testid="take-quiz-cta-button"
                size="lg"
                className="text-lg px-10 py-6 rounded-full border-2 border-border shadow-brutal hover:translate-y-[-4px] hover:shadow-brutal-lg transition-all font-bold bg-primary text-primary-foreground"
              >
                Take Quiz Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Marquee Section */}
      <div className="border-y-2 border-border bg-accent text-accent-foreground py-3">
        <Marquee speed={50}>
          {[
            "15+ Amazing Clubs",
            "AI-Powered Recommendations",
            "Join Your Tribe",
            "Unlock Your Potential",
            "Free for All Students",
            "Verified Senior Guidance",
          ].map((text, i) => (
            <span
              key={i}
              className="mx-8 font-syne font-bold text-lg uppercase tracking-wider"
            >
              {text} •
            </span>
          ))}
        </Marquee>
      </div>

      {/* How It Works Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-syne text-4xl md:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg">
              Three simple steps to find your perfect club match
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Sparkles className="w-12 h-12" />,
                title: "Take Quiz",
                description:
                  "Answer 10 quick questions about your interests, skills, and goals",
                step: "01",
              },
              {
                icon: <Target className="w-12 h-12" />,
                title: "Get Recommendations",
                description:
                  "Our AI analyzes your answers and finds the best club matches for you",
                step: "02",
              },
              {
                icon: <Users className="w-12 h-12" />,
                title: "Join Clubs",
                description:
                  "Connect with club members and start your amazing college journey!",
                step: "03",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -8 }}
                className="relative"
              >
                <div className="bg-card p-8 rounded-xl border-2 border-border shadow-brutal hover:shadow-brutal-lg transition-all h-full">
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center border-2 border-border font-syne font-bold text-primary-foreground">
                    {item.step}
                  </div>
                  <div className="text-primary mb-4">{item.icon}</div>
                  <h3 className="font-syne text-2xl font-bold mb-3">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Clubs Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-syne text-4xl md:text-5xl font-bold mb-4">
              Popular Clubs
            </h2>
            <p className="text-muted-foreground text-lg">
              Explore some of our most active clubs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubs.map((club, index) => (
              <motion.div
                key={club.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                data-testid={`club-card-${index}`}
                className="bg-card rounded-xl border-2 border-border shadow-brutal hover:shadow-brutal-lg transition-all overflow-hidden cursor-pointer"
                onClick={() => user && navigate(`/clubs/${club.id}`)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={club.image_url}
                    alt={club.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full border border-border">
                    {club.domain}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-syne text-xl font-bold mb-2">
                    {club.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {club.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      👥 {club.member_count} members
                    </span>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full border ${
                        club.recruitment_status === "Open"
                          ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-700"
                          : club.recruitment_status === "Upcoming"
                          ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 border-yellow-700"
                          : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border-red-700"
                      }`}
                    >
                      {club.recruitment_status}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button
              onClick={() => (user ? navigate("/clubs") : navigate("/signup"))}
              data-testid="explore-all-clubs-button"
              variant="outline"
              size="lg"
              className="rounded-full border-2 px-8 py-6"
            >
              Explore All Clubs
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="font-syne text-4xl md:text-5xl font-extrabold">
              Ready to Find Your Club?
            </h2>
            <p className="text-lg opacity-90">
              Join hundreds of students who've already discovered their perfect
              club match!
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleTakeQuiz}
                data-testid="cta-take-quiz-button"
                size="lg"
                variant="secondary"
                className="text-lg px-10 py-6 rounded-full border-2 border-border shadow-brutal-sm font-bold"
              >
                Start Quiz Now
                <Zap className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;

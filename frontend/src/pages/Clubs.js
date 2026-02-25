import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";
import api from "../lib/api";
import { Input } from "../components/ui/input";

const Clubs = () => {
  const navigate = useNavigate();
  const [clubs, setClubs] = useState([]);
  const [filteredClubs, setFilteredClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("All");

  const domains = [
    "All",
    "Technical",
    "Cultural",
    "Sports",
    "Management",
    "Literary",
    "Social",
  ];

  useEffect(() => {
    fetchClubs();
  }, []);

  useEffect(() => {
    filterClubs();
  }, [clubs, searchQuery, selectedDomain]);

  const fetchClubs = async () => {
    try {
      const response = await api.get("/clubs");
      setClubs(response.data);
      setFilteredClubs(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching clubs:", error);
      setLoading(false);
    }
  };

  const filterClubs = () => {
    let filtered = clubs;

    if (selectedDomain !== "All") {
      filtered = filtered.filter((club) => club.domain === selectedDomain);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (club) =>
          club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          club.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredClubs(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading clubs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] px-6 py-12">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12">
          <h1 className="font-syne text-4xl md:text-5xl font-extrabold mb-4">
            Explore All Clubs
          </h1>
          <p className="text-muted-foreground text-lg">
            Find the perfect club that matches your interests and passion
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search clubs by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="club-search-input"
              className="pl-12 pr-4 py-6 border-2 rounded-full text-center"
            />
          </div>

          {/* Domain Filter */}
          <div className="flex flex-wrap justify-center gap-3">
            {domains.map((domain) => (
              <Button
                key={domain}
                onClick={() => setSelectedDomain(domain)}
                data-testid={`filter-${domain.toLowerCase()}`}
                variant={selectedDomain === domain ? "default" : "outline"}
                size="sm"
                className="rounded-full border-2 px-6"
              >
                {domain}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 text-center text-sm text-muted-foreground"
        >
          Showing {filteredClubs.length} club{filteredClubs.length !== 1 ? "s" : ""}
        </motion.div>

        {/* Clubs Grid */}
        {filteredClubs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-syne text-2xl font-bold mb-2">
              No clubs found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClubs.map((club, index) => (
              <motion.div
                key={club.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -8 }}
                data-testid={`club-card-${index}`}
                className="bg-card rounded-xl border-2 border-border shadow-brutal hover:shadow-brutal-lg transition-all overflow-hidden cursor-pointer"
                onClick={() => navigate(`/clubs/${club.id}`)}
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
                  <div className="absolute bottom-3 left-3 px-3 py-1 bg-background/90 backdrop-blur-sm text-xs font-bold rounded-full border border-border">
                    {club.time_commitment}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-syne text-xl font-bold mb-2">
                    {club.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {club.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {club.tags.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 bg-muted rounded-md font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
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
        )}
      </div>
    </div>
  );
};

export default Clubs;
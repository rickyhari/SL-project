import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, GitCompare, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { toast } from "sonner";

const CompareClubs = () => {
  const navigate = useNavigate();
  const [allClubs, setAllClubs] = useState([]);
  const [selectedClubs, setSelectedClubs] = useState([]);
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const response = await api.get("/clubs");
      setAllClubs(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching clubs:", error);
      setLoading(false);
    }
  };

  const handleSelectClub = (clubId) => {
    if (selectedClubs.includes(clubId)) {
      setSelectedClubs(selectedClubs.filter((id) => id !== clubId));
    } else if (selectedClubs.length < 2) {
      setSelectedClubs([...selectedClubs, clubId]);
    } else {
      toast.error("You can only compare 2 clubs at a time");
    }
  };

  const handleCompare = async () => {
    if (selectedClubs.length !== 2) {
      toast.error("Please select exactly 2 clubs to compare");
      return;
    }

    try {
      const response = await api.post("/clubs/compare", selectedClubs);
      setComparisonData(response.data);
    } catch (error) {
      console.error("Error comparing clubs:", error);
      toast.error("Failed to compare clubs");
    }
  };

  const resetComparison = () => {
    setSelectedClubs([]);
    setComparisonData(null);
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
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate("/clubs")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Clubs
          </Button>

          <h1 className="font-syne text-4xl md:text-5xl font-extrabold mb-4">
            Compare Clubs ⚖️
          </h1>
          <p className="text-muted-foreground text-lg">
            Select two clubs to see a side-by-side comparison
          </p>
        </motion.div>

        {!comparisonData ? (
          /* Club Selection */
          <>
            <div className="bg-card p-6 rounded-xl border-2 border-border shadow-brutal mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-syne text-xl font-bold">
                    Selected Clubs: {selectedClubs.length}/2
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Click on clubs below to select them for comparison
                  </p>
                </div>
                <Button
                  onClick={handleCompare}
                  disabled={selectedClubs.length !== 2}
                  data-testid="compare-button"
                  className="rounded-full border-2 border-border shadow-brutal-sm hover:translate-y-[-2px] hover:shadow-brutal transition-all"
                >
                  <GitCompare className="w-5 h-5 mr-2" />
                  Compare
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allClubs.map((club, index) => {
                const isSelected = selectedClubs.includes(club.id);
                return (
                  <motion.div
                    key={club.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    data-testid={`club-select-${index}`}
                    onClick={() => handleSelectClub(club.id)}
                    className={`bg-card rounded-xl border-2 shadow-brutal hover:shadow-brutal-lg transition-all overflow-hidden cursor-pointer ${
                      isSelected
                        ? "border-primary ring-4 ring-primary/20"
                        : "border-border"
                    }`}
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={club.image_url}
                        alt={club.name}
                        className="w-full h-full object-cover"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center border-2 border-border">
                            <Check className="w-6 h-6 text-primary-foreground" />
                          </div>
                        </div>
                      )}
                      <div className="absolute top-3 right-3 px-2 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                        {club.domain}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-syne text-lg font-bold mb-1">
                        {club.name}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {club.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        ) : (
          /* Comparison Table */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Button
              onClick={resetComparison}
              data-testid="reset-comparison-button"
              variant="outline"
              className="mb-6 rounded-full border-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Select Different Clubs
            </Button>

            <div className="bg-card rounded-xl border-2 border-border shadow-brutal overflow-hidden">
              {/* Header Images */}
              <div className="grid md:grid-cols-2 gap-4 p-6 border-b-2 border-border">
                {comparisonData.map((club, idx) => (
                  <div key={club.id} data-testid={`comparison-club-${idx}`}>
                    <div className="relative h-48 rounded-lg overflow-hidden mb-3">
                      <img
                        src={club.image_url}
                        alt={club.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h2 className="font-syne text-2xl font-bold text-center">
                      {club.name}
                    </h2>
                  </div>
                ))}
              </div>

              {/* Comparison Rows */}
              <div className="divide-y-2 divide-border">
                {/* Domain */}
                <div className="grid md:grid-cols-3 gap-4 p-6">
                  <div className="font-bold">Domain</div>
                  <div className="text-center">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full border border-primary">
                      {comparisonData[0].domain}
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full border border-primary">
                      {comparisonData[1].domain}
                    </span>
                  </div>
                </div>

                {/* Time Commitment */}
                <div className="grid md:grid-cols-3 gap-4 p-6 bg-muted/30">
                  <div className="font-bold">Time Commitment</div>
                  <div className="text-center">{comparisonData[0].time_commitment}</div>
                  <div className="text-center">{comparisonData[1].time_commitment}</div>
                </div>

                {/* Members */}
                <div className="grid md:grid-cols-3 gap-4 p-6">
                  <div className="font-bold">Members</div>
                  <div className="text-center">{comparisonData[0].member_count} students</div>
                  <div className="text-center">{comparisonData[1].member_count} students</div>
                </div>

                {/* Recruitment Status */}
                <div className="grid md:grid-cols-3 gap-4 p-6 bg-muted/30">
                  <div className="font-bold">Recruitment Status</div>
                  <div className="text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        comparisonData[0].recruitment_status === "Open"
                          ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                          : comparisonData[0].recruitment_status === "Upcoming"
                          ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"
                          : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                      }`}
                    >
                      {comparisonData[0].recruitment_status}
                    </span>
                  </div>
                  <div className="text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        comparisonData[1].recruitment_status === "Open"
                          ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                          : comparisonData[1].recruitment_status === "Upcoming"
                          ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"
                          : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                      }`}
                    >
                      {comparisonData[1].recruitment_status}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="grid md:grid-cols-3 gap-4 p-6">
                  <div className="font-bold">About</div>
                  <div className="text-sm">{comparisonData[0].description}</div>
                  <div className="text-sm">{comparisonData[1].description}</div>
                </div>

                {/* Skills */}
                <div className="grid md:grid-cols-3 gap-4 p-6 bg-muted/30">
                  <div className="font-bold">Skills You'll Gain</div>
                  <div>
                    <div className="flex flex-wrap gap-2">
                      {comparisonData[0].skills.map((skill, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-1 bg-background rounded-md border border-border"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-wrap gap-2">
                      {comparisonData[1].skills.map((skill, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-1 bg-background rounded-md border border-border"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div className="grid md:grid-cols-3 gap-4 p-6">
                  <div className="font-bold">Contact</div>
                  <div className="text-sm">
                    <a
                      href={`mailto:${comparisonData[0].contact}`}
                      className="text-primary hover:underline"
                    >
                      {comparisonData[0].contact}
                    </a>
                  </div>
                  <div className="text-sm">
                    <a
                      href={`mailto:${comparisonData[1].contact}`}
                      className="text-primary hover:underline"
                    >
                      {comparisonData[1].contact}
                    </a>
                  </div>
                </div>
              </div>

              {/* View Details Buttons */}
              <div className="grid md:grid-cols-2 gap-4 p-6 border-t-2 border-border">
                {comparisonData.map((club) => (
                  <Button
                    key={club.id}
                    onClick={() => navigate(`/clubs/${club.id}`)}
                    className="w-full rounded-full border-2 border-border shadow-brutal-sm"
                  >
                    View {club.name} Details
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CompareClubs;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import api from "../lib/api";
import { toast } from "sonner";

const Quiz = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await api.get("/quiz/questions");
      setQuestions(response.data.questions);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast.error("Failed to load quiz questions");
      setLoading(false);
    }
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    if (!selectedOption) {
      toast.error("Please select an option");
      return;
    }

    const newAnswers = [
      ...answers,
      {
        question_id: questions[currentQuestion].id,
        answer: selectedOption,
      },
    ];
    setAnswers(newAnswers);
    setSelectedOption("");

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitQuiz(newAnswers);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      // Restore previous answer
      const prevAnswer = answers[currentQuestion - 1];
      if (prevAnswer) {
        setSelectedOption(prevAnswer.answer);
      }
      setAnswers(answers.slice(0, -1));
    }
  };

  const submitQuiz = async (finalAnswers) => {
    setSubmitting(true);
    try {
      const response = await api.post("/quiz/submit", {
        answers: finalAnswers,
      });
      toast.success("Quiz completed! See your results");
      navigate("/quiz/result", { state: { result: response.data } });
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast.error("Failed to submit quiz. Please try again.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (submitting) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="font-syne text-xl font-bold mb-2">
            Analyzing your responses...
          </p>
          <p className="text-muted-foreground">
            Finding your perfect club matches!
          </p>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col px-6 py-12">
      <div className="container mx-auto max-w-3xl flex-1 flex flex-col">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm font-bold text-primary">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-3 border-2 border-border" />
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex-1 flex flex-col"
          >
            <div className="bg-card p-8 md:p-12 rounded-xl border-2 border-border shadow-brutal mb-8">
              <h2
                className="font-syne text-2xl md:text-3xl font-bold mb-8"
                data-testid="quiz-question"
              >
                {question.question}
              </h2>

              <div className="space-y-4">
                {question.options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOptionSelect(option)}
                    data-testid={`quiz-option-${index}`}
                    className={`w-full p-6 rounded-xl border-2 text-left transition-all ${
                      selectedOption === option
                        ? "bg-primary text-primary-foreground border-border shadow-brutal"
                        : "bg-card border-border hover:shadow-brutal-sm"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium pr-4">{option}</span>
                      {selectedOption === option && (
                        <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between gap-4">
              <Button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                data-testid="quiz-previous-button"
                variant="outline"
                size="lg"
                className="rounded-full border-2 px-8"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Previous
              </Button>

              <Button
                onClick={handleNext}
                disabled={!selectedOption}
                data-testid="quiz-next-button"
                size="lg"
                className="rounded-full border-2 border-border shadow-brutal-sm hover:translate-y-[-2px] hover:shadow-brutal transition-all px-8"
              >
                {currentQuestion === questions.length - 1
                  ? "Submit Quiz"
                  : "Next"}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Quiz;

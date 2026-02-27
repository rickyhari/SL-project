import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { motion } from "framer-motion";
import { MessageCircle, Send, User, Award, Trash2, MessageSquare } from "lucide-react";
import api from "../lib/api";
import { toast } from "sonner";
import { Switch } from "../components/ui/switch";

const QnA = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewQuestion, setShowNewQuestion] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  
  // New Question Form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  // Reply Form
  const [replyContent, setReplyContent] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await api.get("/questions");
      setQuestions(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setLoading(false);
    }
  };

  const handlePostQuestion = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await api.post("/questions", {
        title,
        description,
        is_anonymous: isAnonymous,
      });
      
      toast.success("Question posted successfully!");
      setTitle("");
      setDescription("");
      setIsAnonymous(false);
      setShowNewQuestion(false);
      fetchQuestions();
    } catch (error) {
      console.error("Error posting question:", error);
      toast.error("Failed to post question");
    }
  };

  const handleAddReply = async (questionId) => {
    if (!replyContent.trim()) {
      toast.error("Please enter a reply");
      return;
    }

    try {
      await api.post(`/questions/${questionId}/replies`, {
        content: replyContent,
      });
      
      toast.success("Reply added successfully!");
      setReplyContent("");
      setReplyingTo(null);
      fetchQuestions();
      
      // Update selected question if viewing details
      if (selectedQuestion?.id === questionId) {
        const response = await api.get(`/questions/${questionId}`);
        setSelectedQuestion(response.data);
      }
    } catch (error) {
      console.error("Error adding reply:", error);
      toast.error("Failed to add reply");
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm("Are you sure you want to delete this question?")) {
      return;
    }

    try {
      await api.delete(`/questions/${questionId}`);
      toast.success("Question deleted successfully");
      fetchQuestions();
      if (selectedQuestion?.id === questionId) {
        setSelectedQuestion(null);
      }
    } catch (error) {
      console.error("Error deleting question:", error);
      toast.error(error.response?.data?.detail || "Failed to delete question");
    }
  };

  const viewQuestionDetails = async (questionId) => {
    try {
      const response = await api.get(`/questions/${questionId}`);
      setSelectedQuestion(response.data);
    } catch (error) {
      console.error("Error fetching question details:", error);
      toast.error("Failed to load question details");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] px-6 py-12">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-syne text-4xl md:text-5xl font-extrabold mb-4">
            Ask Seniors 💬
          </h1>
          <p className="text-muted-foreground text-lg mb-6">
            Get guidance from experienced club members
          </p>

          <Button
            onClick={() => setShowNewQuestion(!showNewQuestion)}
            data-testid="ask-question-button"
            className="rounded-full border-2 border-border shadow-brutal-sm hover:translate-y-[-2px] hover:shadow-brutal transition-all"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Ask a Question
          </Button>
        </motion.div>

        {/* New Question Form */}
        {showNewQuestion && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card p-6 rounded-xl border-2 border-border shadow-brutal mb-8"
          >
            <h2 className="font-syne text-2xl font-bold mb-4">Post a Question</h2>
            <form onSubmit={handlePostQuestion} className="space-y-4">
              <div>
                <Label htmlFor="title">Question Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What would you like to know?"
                  data-testid="question-title-input"
                  className="border-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide more details about your question..."
                  data-testid="question-description-input"
                  className="border-2 min-h-[120px]"
                  required
                />
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  id="anonymous"
                  checked={isAnonymous}
                  onCheckedChange={setIsAnonymous}
                  data-testid="anonymous-toggle"
                />
                <Label htmlFor="anonymous" className="cursor-pointer">
                  Post anonymously
                </Label>
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  data-testid="submit-question-button"
                  className="rounded-full border-2 border-border shadow-brutal-sm"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Post Question
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNewQuestion(false)}
                  className="rounded-full border-2"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Question Details View */}
        {selectedQuestion ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-card p-8 rounded-xl border-2 border-border shadow-brutal mb-8"
          >
            <Button
              variant="ghost"
              onClick={() => setSelectedQuestion(null)}
              className="mb-4"
            >
              ← Back to all questions
            </Button>

            <div className="mb-6">
              <h2 className="font-syne text-3xl font-bold mb-4">
                {selectedQuestion.title}
              </h2>
              <p className="text-muted-foreground mb-4">
                {selectedQuestion.description}
              </p>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{selectedQuestion.user_name}</span>
                  <span className="text-xs px-2 py-1 bg-muted rounded-full">
                    {selectedQuestion.user_role}
                  </span>
                </div>
                <span className="text-muted-foreground">
                  {new Date(selectedQuestion.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Replies */}
            <div className="border-t-2 border-border pt-6">
              <h3 className="font-syne text-xl font-bold mb-4">
                Replies ({selectedQuestion.replies.length})
              </h3>

              {selectedQuestion.replies.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No replies yet. Be the first to help!
                </p>
              ) : (
                <div className="space-y-4 mb-6">
                  {selectedQuestion.replies.map((reply) => (
                    <div
                      key={reply.id}
                      className="bg-muted/50 p-4 rounded-lg border border-border"
                    >
                      <p className="mb-3">{reply.content}</p>
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4" />
                        <span className="font-medium">{reply.user_name}</span>
                        {reply.user_verified && reply.user_role === "senior" && (
                          <Award className="w-4 h-4 text-primary" />
                        )}
                        <span className="text-xs px-2 py-1 bg-background rounded-full">
                          {reply.user_role}
                        </span>
                        <span className="text-muted-foreground ml-auto">
                          {new Date(reply.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Form */}
              <div className="bg-muted/30 p-4 rounded-lg border-2 border-border">
                <Textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write your reply..."
                  data-testid="reply-content-input"
                  className="mb-3 border-2"
                />
                <Button
                  onClick={() => handleAddReply(selectedQuestion.id)}
                  data-testid="submit-reply-button"
                  className="rounded-full border-2 border-border shadow-brutal-sm"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Post Reply
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Questions List */
          <div className="space-y-4">
            {questions.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-xl border-2 border-border">
                <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-syne text-2xl font-bold mb-2">
                  No questions yet
                </h3>
                <p className="text-muted-foreground">
                  Be the first to ask a question!
                </p>
              </div>
            ) : (
              questions.map((question, index) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  data-testid={`question-${index}`}
                  className="bg-card p-6 rounded-xl border-2 border-border shadow-brutal hover:shadow-brutal-lg transition-all cursor-pointer"
                  onClick={() => viewQuestionDetails(question.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-syne text-xl font-bold mb-2">
                        {question.title}
                      </h3>
                      <p className="text-muted-foreground mb-3 line-clamp-2">
                        {question.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span className="font-medium">{question.user_name}</span>
                          <span className="text-xs px-2 py-1 bg-muted rounded-full">
                            {question.user_role}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MessageCircle className="w-4 h-4" />
                          <span>{question.reply_count} replies</span>
                        </div>
                        <span className="text-muted-foreground ml-auto">
                          {new Date(question.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    {user && question.user_id === user.id && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteQuestion(question.id);
                        }}
                        data-testid={`delete-question-${index}`}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QnA;
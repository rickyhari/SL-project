import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { motion } from "framer-motion";
import { UserPlus, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.role) {
      toast.error("Please select your role");
      return;
    }

    setLoading(true);

    try {
      await signup(formData.name, formData.email, formData.password, formData.role);
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-card p-8 rounded-xl border-2 border-border shadow-brutal">
          <div className="mb-8">
            <Link
              to="/"
              data-testid="back-to-home-link"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <h1 className="font-syne text-3xl font-bold mb-2">Join Club Compass</h1>
            <p className="text-muted-foreground">
              Create your account and discover your perfect club match
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" data-testid="signup-form">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                data-testid="name-input"
                className="border-2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@college.edu"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                data-testid="email-input"
                className="border-2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                data-testid="password-input"
                className="border-2"
              />
            </div>

            <div className="space-y-3">
              <Label>I am a:</Label>
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFormData({ ...formData, role: "fresher" })}
                  data-testid="role-fresher-button"
                  className={`p-6 rounded-xl border-2 transition-all ${
                    formData.role === "fresher"
                      ? "bg-primary text-primary-foreground border-border shadow-brutal"
                      : "bg-card border-border hover:shadow-brutal-sm"
                  }`}
                >
                  <div className="text-3xl mb-2">🎓</div>
                  <div className="font-bold">Fresher</div>
                  <div className="text-xs opacity-80">First-year student</div>
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFormData({ ...formData, role: "senior" })}
                  data-testid="role-senior-button"
                  className={`p-6 rounded-xl border-2 transition-all ${
                    formData.role === "senior"
                      ? "bg-primary text-primary-foreground border-border shadow-brutal"
                      : "bg-card border-border hover:shadow-brutal-sm"
                  }`}
                >
                  <div className="text-3xl mb-2">👨‍🎓</div>
                  <div className="font-bold">Senior</div>
                  <div className="text-xs opacity-80">Club member</div>
                </motion.button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              data-testid="signup-submit-button"
              className="w-full rounded-full border-2 border-border shadow-brutal-sm hover:translate-y-[-2px] hover:shadow-brutal transition-all py-6"
            >
              {loading ? "Creating Account..." : "Create Account"}
              <UserPlus className="ml-2 w-4 h-4" />
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                data-testid="login-link"
                className="font-bold text-primary hover:underline"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
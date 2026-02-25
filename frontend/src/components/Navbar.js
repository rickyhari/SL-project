import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { Moon, Sun, LogOut, User, BookMarked, Home, Compass } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b-2 border-border"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" data-testid="nav-home-link">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="font-syne text-2xl font-extrabold flex items-center gap-2"
            >
              <Compass className="w-7 h-7" />
              <span className="hidden sm:inline">Club Compass</span>
              <span className="sm:hidden">CC</span>
            </motion.div>
          </Link>

          <div className="flex items-center gap-3">
            {user && (
              <>
                <Link to="/clubs" data-testid="nav-clubs-link">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden sm:flex items-center gap-2"
                  >
                    <Home className="w-4 h-4" />
                    Clubs
                  </Button>
                </Link>
                <Link to="/dashboard" data-testid="nav-dashboard-link">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden sm:flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>
              </>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              data-testid="theme-toggle-button"
              className="rounded-full"
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </Button>

            {user ? (
              <Button
                onClick={logout}
                data-testid="logout-button"
                variant="outline"
                size="sm"
                className="rounded-full border-2 px-4"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            ) : (
              <Link to="/login" data-testid="nav-login-link">
                <Button
                  className="rounded-full border-2 border-border shadow-brutal-sm hover:translate-y-[-2px] hover:shadow-brutal transition-all px-6"
                >
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
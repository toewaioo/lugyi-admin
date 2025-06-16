import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
// import { Briefcase, Eye, EyeOff } from 'lucide-react';
import EyeClose from "../../../icons/EyeClose";
import Eye from "../../../icons/Eye";
import BriefCase from "../../../icons/BriefCase";
import Card from "./card";
import CardHeader from "./card";
import CardTitle from "./card";
import CardDescription from "./card";
import CardContent from "./card";
import { Label } from "./ui/Label";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
const  Page= () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoadingState, setIsLoadingState] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoadingState(true);
    try {
      await dispatch(login({ email, password }));
      navigate("/dashboard"); // Redirect to dashboard on successful login
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  if (isLoadingState || isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm shadow-xl rounded-lg">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto mb-3 flex items-center justify-center h-16 w-16 rounded-full bg-primary/10">
            <BriefCase className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-headline text-foreground">
            Admin Login
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Access your Clarity Admin panel.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2 pb-6 px-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoadingState}
                className="text-base h-11 rounded-md focus:ring-primary focus:border-primary"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoadingState}
                  className="text-base h-11 rounded-md focus:ring-primary focus:border-primary pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeClose className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
            </div>
            {error && (
              <p className="text-sm text-destructive text-center bg-destructive/10 p-2 rounded-md">
                {error}
              </p>
            )}
            <Button
              type="submit"
              className="w-full text-base py-3 h-11 rounded-md font-semibold"
              disabled={isLoadingState}
            >
              {isLoadingState ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Logging in...
                </>
              ) : (
                "Log In"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      <footer className="mt-10 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} Clarity Admin. All rights reserved.
      </footer>
    </div>
  );
}
export default Page;

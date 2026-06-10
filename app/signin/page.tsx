"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) router.replace("/dashboard");
    };
    checkUser();
  }, [router, supabase.auth]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage("Check your email for the confirmation link!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/dashboard");
      }
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    background: "var(--bg-primary)",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    color: "var(--text-primary)",
    fontSize: "14px",
    fontFamily: "var(--font-display)",
    outline: "none",
    transition: "border-color 0.2s",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
      }}
    >
      {/* Background grid */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          opacity: 0.3,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "420px",
        }}
        className="animate-fade-in"
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                background:
                  "linear-gradient(135deg, var(--accent), var(--accent-2))",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M3 4h14M3 10h10M3 16h7"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span
              style={{
                fontSize: "32px",
                fontWeight: 700,
                letterSpacing: "-0.5px",
              }}
            >
              Nova<span style={{ color: "var(--accent)" }}>Brief</span>
            </span>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: "18px" }}>
            {isSignUp
              ? "Create your account to get started"
              : "Sign in to your briefing hub"}
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "32px",
          }}
        >
          {error && (
            <div
              style={{
                marginBottom: "20px",
                padding: "12px 14px",
                background: "rgba(255, 79, 106, 0.08)",
                border: "1px solid rgba(255, 79, 106, 0.3)",
                borderRadius: "8px",
                color: "var(--danger)",
                fontSize: "15px",
              }}
            >
              {error}
            </div>
          )}
          {message && (
            <div
              style={{
                marginBottom: "20px",
                padding: "12px 14px",
                background: "var(--accent-glow)",
                border: "1px solid rgba(0, 212, 170, 0.3)",
                borderRadius: "8px",
                color: "var(--accent)",
                fontSize: "15px",
              }}
            >
              {message}
            </div>
          )}

          <form
            onSubmit={handleAuth}
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "var(--text-secondary)",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                style={inputStyle}
                onFocus={(e) =>
                  ((e.target as HTMLInputElement).style.borderColor =
                    "var(--accent)")
                }
                onBlur={(e) =>
                  ((e.target as HTMLInputElement).style.borderColor =
                    "var(--border)")
                }
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "var(--text-secondary)",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={isSignUp ? "new-password" : "current-password"}
                style={inputStyle}
                onFocus={(e) =>
                  ((e.target as HTMLInputElement).style.borderColor =
                    "var(--accent)")
                }
                onBlur={(e) =>
                  ((e.target as HTMLInputElement).style.borderColor =
                    "var(--border)")
                }
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "12px",
                background: isLoading ? "var(--bg-elevated)" : "var(--accent)",
                border: "none",
                borderRadius: "8px",
                color: isLoading ? "var(--text-muted)" : "var(--bg-primary)",
                fontSize: "16px",
                fontWeight: 600,
                fontFamily: "var(--font-display)",
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                letterSpacing: "0.2px",
              }}
            >
              {isLoading
                ? "Please wait..."
                : isSignUp
                  ? "Create Account"
                  : "Sign In"}
            </button>
          </form>

          <div
            style={{
              textAlign: "center",
              marginTop: "20px",
              fontSize: "16px",
              fontFamily: "var(--font-display)",
              background: "none",
            }}
          >
            {isSignUp ? "Already have an account? " : "No account yet? "}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
                setMessage(null);
              }}
              style={{
                border: "none",
                cursor: "pointer",
                color: "var(--accent)",
              }}
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

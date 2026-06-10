"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

interface UserPreferences {
  categories: string[];
  frequency: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

const categoryIcons: Record<string, string> = {
  technology: "⚡",
  business: "📊",
  science: "🔬",
  health: "💊",
  sports: "🏆",
  entertainment: "🎬",
  politics: "🏛️",
  environment: "🌿",
};

export default function DashboardPage() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    fetch("/api/user-preferences")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setPreferences(data);
      })
      .catch(() => router.replace("/subscribe"))
      .finally(() => setIsLoading(false));
  }, [router]);

  const handleDeactivateNewsletter = async () => {
    if (!user) return;
    try {
      const r = await fetch("/api/user-preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: false }),
      });
      if (r.ok)
        setPreferences((prev) => (prev ? { ...prev, is_active: false } : null));
    } catch {
      alert("Failed to deactivate newsletter");
    }
  };

  const handleActivateNewsletter = async () => {
    if (!user) return;
    try {
      const r = await fetch("/api/user-preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: true }),
      });
      if (r.ok)
        setPreferences((prev) => (prev ? { ...prev, is_active: true } : null));
    } catch {
      alert("Failed to activate newsletter");
    }
  };

  const statBox = (label: string, value: string) => (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        padding: "20px 24px",
      }}
    >
      <div
        style={{
          fontSize: "11px",
          color: "var(--text-muted)",
          fontFamily: "var(--font-mono)",
          letterSpacing: "0.5px",
          marginBottom: "8px",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
      <div
        style={{ fontSize: "20px", fontWeight: 600, letterSpacing: "-0.5px" }}
      >
        {value}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--bg-primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "2px solid var(--border)",
              borderTopColor: "var(--accent)",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "14px",
              fontFamily: "var(--font-mono)",
            }}
          >
            Loading briefing hub...
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
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

      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "40px" }} className="animate-fade-in">
          <h1
            style={{
              fontSize: "34px",
              fontWeight: 700,
              letterSpacing: "-0.8px",
              marginBottom: "6px",
            }}
          >
            Your Briefing Hub
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "18px" }}>
            Manage your NovaBrief newsletter preferences and delivery settings.
          </p>
        </div>

        {preferences ? (
          <>
            {/* Stats row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "12px",
                marginBottom: "28px",
              }}
              className="animate-fade-in-delay-1"
            >
              {statBox("Categories", `${preferences.categories.length} active`)}
              {statBox(
                "Frequency",
                preferences.frequency.charAt(0).toUpperCase() +
                  preferences.frequency.slice(1),
              )}
              {statBox(
                "Status",
                preferences.is_active ? "🟢 Active" : "🔴 Paused",
              )}
              {statBox(
                "Member since",
                new Date(preferences.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                }),
              )}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 300px",
                gap: "20px",
              }}
              className="animate-fade-in-delay-2"
            >
              {/* Preferences card */}
              <div
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "14px",
                  padding: "28px",
                }}
              >
                <h2
                  style={{
                    fontSize: "18px",
                    fontWeight: 600,
                    marginBottom: "20px",
                  }}
                >
                  Current Preferences
                </h2>

                <div style={{ marginBottom: "24px" }}>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "var(--text-muted)",
                      fontFamily: "var(--font-mono)",
                      letterSpacing: "0.5px",
                      marginBottom: "10px",
                      textTransform: "uppercase",
                    }}
                  >
                    Categories
                  </div>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}
                  >
                    {preferences.categories.map((cat) => (
                      <span
                        key={cat}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          padding: "4px 12px",
                          background: "var(--bg-elevated)",
                          border: "1px solid var(--border-bright)",
                          borderRadius: "100px",
                          fontSize: "15px",
                          fontWeight: 500,
                          color: "var(--text-primary)",
                        }}
                      >
                        <span>{categoryIcons[cat] || "📰"}</span>
                        <span style={{ textTransform: "capitalize" }}>
                          {cat}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: "24px" }}>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "var(--text-muted)",
                      fontFamily: "var(--font-mono)",
                      letterSpacing: "0.5px",
                      marginBottom: "10px",
                      textTransform: "uppercase",
                    }}
                  >
                    Email
                  </div>
                  <span
                    style={{
                      fontSize: "15px",
                      color: "var(--text-secondary)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {preferences.email}
                  </span>
                </div>

                <div
                  style={{
                    padding: "14px 16px",
                    background: "var(--bg-elevated)",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <span
                    style={{ fontSize: "14px", color: "var(--text-muted)" }}
                  >
                    ✉️ Newsletters delivered to your inbox at 9 AM on your
                    schedule.
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "14px",
                  padding: "28px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <h2
                  style={{
                    fontSize: "18px",
                    fontWeight: 600,
                    marginBottom: "8px",
                  }}
                >
                  Actions
                </h2>

                <button
                  onClick={() => router.push("/select?md=update")}
                  style={{
                    width: "100%",
                    padding: "11px 16px",
                    background: "var(--accent)",
                    border: "none",
                    borderRadius: "8px",
                    color: "var(--bg-primary)",
                    fontSize: "16px",
                    fontWeight: 600,
                    fontFamily: "var(--font-display)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    transition: "all 0.2s",
                  }}
                >
                  ✏️ Update Preferences
                </button>

                {preferences.is_active ? (
                  <button
                    onClick={handleDeactivateNewsletter}
                    style={{
                      width: "100%",
                      padding: "11px 16px",
                      background: "transparent",
                      border: "1px solid rgba(255, 79, 106, 0.3)",
                      borderRadius: "8px",
                      color: "var(--danger)",
                      fontSize: "16px",
                      fontWeight: 500,
                      fontFamily: "var(--font-display)",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    ⏸ Pause Newsletter
                  </button>
                ) : (
                  <button
                    onClick={handleActivateNewsletter}
                    style={{
                      width: "100%",
                      padding: "11px 16px",
                      background: "transparent",
                      border: "1px solid rgba(0, 212, 170, 0.3)",
                      borderRadius: "8px",
                      color: "var(--accent)",
                      fontSize: "16px",
                      fontWeight: 500,
                      fontFamily: "var(--font-display)",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    ▶ Resume Newsletter
                  </button>
                )}

                <Link
                  href="/subscribe"
                  style={{
                    width: "100%",
                    padding: "11px 16px",
                    background: "transparent",
                    border: "1px solid var(--border-bright)",
                    borderRadius: "8px",
                    color: "var(--text-secondary)",
                    fontSize: "16px",
                    fontWeight: 500,
                    fontFamily: "var(--font-display)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    textDecoration: "none",
                    transition: "all 0.2s",
                  }}
                >
                  💳 Manage Subscription
                </Link>
              </div>
            </div>
          </>
        ) : (
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "14px",
              padding: "60px",
              textAlign: "center",
            }}
            className="animate-fade-in-delay-1"
          >
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📭</div>
            <h2
              style={{ fontSize: "20px", fontWeight: 600, marginBottom: "8px" }}
            >
              No preferences set yet
            </h2>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "14px",
                marginBottom: "24px",
              }}
            >
              Set up your newsletter to start receiving curated briefings.
            </p>
            <Link
              href="/select"
              style={{
                display: "inline-block",
                padding: "12px 28px",
                background: "var(--accent)",
                borderRadius: "8px",
                color: "var(--bg-primary)",
                fontWeight: 600,
                fontSize: "18px",
                textDecoration: "none",
              }}
            >
              Set Up Newsletter
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

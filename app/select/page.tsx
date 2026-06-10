"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const allCategories = [
  {
    id: "technology",
    name: "Technology",
    icon: "⚡",
    description: "Latest tech news and innovations",
  },
  {
    id: "business",
    name: "Business",
    icon: "📊",
    description: "Business trends and market updates",
  },
  {
    id: "science",
    name: "Science",
    icon: "🔬",
    description: "Scientific discoveries and research",
  },
  {
    id: "health",
    name: "Health",
    icon: "💊",
    description: "Health and wellness updates",
  },
  // — Free tier stops above; locked below —
  {
    id: "sports",
    name: "Sports",
    icon: "🏆",
    description: "Sports news and highlights",
  },
  {
    id: "entertainment",
    name: "Entertainment",
    icon: "🎬",
    description: "Movies, TV, and celebrity news",
  },
  {
    id: "politics",
    name: "Politics",
    icon: "🏛️",
    description: "Political news and current events",
  },
  {
    id: "environment",
    name: "Environment",
    icon: "🌿",
    description: "Climate and environmental news",
  },
];

// First 4 are free-tier accessible
const FREE_CATEGORY_LIMIT = 4;

const frequencyOptions = [
  { id: "daily", name: "Daily", description: "Every day", icon: "☀️" },
  { id: "weekly", name: "Weekly", description: "Every week", icon: "📅" },
  {
    id: "biweekly",
    name: "Bi-weekly",
    description: "Twice a week",
    icon: "📆",
  },
];

const LockIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    style={{ flexShrink: 0 }}
  >
    <rect
      x="2.5"
      y="6"
      width="9"
      height="7"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="1.3"
    />
    <path
      d="M4.5 6V4.5a3 3 0 016 0V6"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
);

export default function SelectPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedFrequency, setSelectedFrequency] = useState<string>("weekly");
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const isFreePlan = searchParams.get("plan") === "free";
  const isUpdate = searchParams.get("md") === "update";

  const handleCategoryToggle = (categoryId: string, idx: number) => {
    // Free users can only select the first FREE_CATEGORY_LIMIT categories
    if (isFreePlan && idx >= FREE_CATEGORY_LIMIT) return;
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCategories.length === 0) {
      alert("Please select at least one category");
      return;
    }
    if (!user) {
      alert("Please sign in to continue");
      return;
    }
    setIsSaving(true);
    try {
      const response = await fetch("/api/user-preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categories: selectedCategories,
          frequency: selectedFrequency,
          email: user.email,
        }),
      });
      if (!response.ok) throw new Error("Failed to save preferences");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to save preferences. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // const handleUpdatePreferences = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (selectedCategories.length === 0) {
  //     alert("Please select at least one category");
  //     return;
  //   }
  //   if (!user) {
  //     alert("Please sign in to continue");
  //     return;
  //   }

  //   setIsSaving(true);
  //   try {
  //     const response = await fetch("/api/user-preferences", {
  //       method: "PATCH",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         categories: selectedCategories,
  //         frequency: selectedFrequency,
  //         email: user.email,
  //       }),
  //     });
  //     if (!response.ok) throw new Error("Failed to save preferences");
  //     router.push("/dashboard");
  //   } catch (error) {
  //     console.error("Error:", error);
  //     alert("Failed to save preferences. Please try again.");
  //   } finally {
  //     setIsSaving(false);
  //   }
  // };

  const cardBase = {
    padding: "16px 18px",
    borderRadius: "10px",
    border: "1px solid var(--border)",
    cursor: "pointer",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "flex-start",
    gap: "14px",
    background: "var(--bg-card)",
  };

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

      <div style={{ maxWidth: "860px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "40px" }} className="animate-fade-in">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                padding: "4px 12px",
                background: "var(--accent-glow)",
                border: "1px solid rgba(0,212,170,0.25)",
                borderRadius: "100px",
                fontSize: "11px",
                fontFamily: "var(--font-mono)",
                color: "var(--accent)",
                letterSpacing: "0.5px",
              }}
            >
              {isFreePlan ? "FREE PLAN" : "PRO PLAN"}
            </div>
          </div>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: 700,
              letterSpacing: "-0.8px",
              marginBottom: "8px",
            }}
          >
            Customize your briefing
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "16px" }}>
            {isFreePlan
              ? "Select up to 4 categories (free plan). Upgrade for all 8 + flexible delivery."
              : "Pick any combination of categories and your preferred delivery cadence."}
          </p>
        </div>

        <form
          // onSubmit={isUpdate ? handleUpdatePreferences : handleSavePreferences}
          onSubmit={handleSavePreferences}
          style={{ display: "flex", flexDirection: "column", gap: "36px" }}
        >
          {/* Categories */}
          <section className="animate-fade-in-delay-1">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  letterSpacing: "-0.3px",
                }}
              >
                News Categories
              </h2>
              <span
                style={{
                  fontSize: "14px",
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {selectedCategories.length} selected
              </span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: "10px",
              }}
            >
              {allCategories.map((category, idx) => {
                const isLocked = isFreePlan && idx >= FREE_CATEGORY_LIMIT;
                const isSelected =
                  selectedCategories.includes(category.id) && !isLocked;

                return (
                  <div
                    key={category.id}
                    onClick={() => handleCategoryToggle(category.id, idx)}
                    style={{
                      ...cardBase,
                      cursor: isLocked ? "not-allowed" : "pointer",
                      background: isSelected
                        ? "var(--bg-elevated)"
                        : isLocked
                          ? "var(--bg-secondary)"
                          : "var(--bg-card)",
                      border: `1px solid ${isSelected ? "var(--accent)" : "var(--border)"}`,
                      opacity: isLocked ? 0.5 : 1,
                      boxShadow: isSelected
                        ? "0 0 20px var(--accent-glow)"
                        : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected && !isLocked)
                        (e.currentTarget as HTMLDivElement).style.borderColor =
                          "var(--border-bright)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected && !isLocked)
                        (e.currentTarget as HTMLDivElement).style.borderColor =
                          "var(--border)";
                    }}
                  >
                    {/* Checkbox */}
                    <div
                      style={{
                        flexShrink: 0,
                        width: "18px",
                        height: "18px",
                        borderRadius: "5px",
                        border: `1.5px solid ${isSelected ? "var(--accent)" : "var(--border-bright)"}`,
                        background: isSelected
                          ? "var(--accent)"
                          : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: "1px",
                      }}
                    >
                      {isSelected && (
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 10 10"
                          fill="none"
                        >
                          <path
                            d="M1.5 5l2.5 2.5 4.5-5"
                            stroke="var(--bg-primary)"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          marginBottom: "3px",
                        }}
                      >
                        <span style={{ fontSize: "16px", lineHeight: 1 }}>
                          {category.icon}
                        </span>
                        <span style={{ fontSize: "18px", fontWeight: 600 }}>
                          {category.name}
                        </span>
                        {isLocked && (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              color: "var(--text-muted)",
                              marginLeft: "auto",
                            }}
                          >
                            <LockIcon />
                            <span
                              style={{
                                fontSize: "14px",
                                fontFamily: "var(--font-mono)",
                              }}
                            >
                              PRO
                            </span>
                          </span>
                        )}
                      </div>
                      <p
                        style={{
                          fontSize: "14px",
                          color: "var(--text-muted)",
                          margin: 0,
                        }}
                      >
                        {category.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {isFreePlan && (
              <div
                style={{
                  marginTop: "14px",
                  padding: "12px 16px",
                  background: "rgba(123, 94, 167, 0.08)",
                  border: "1px solid rgba(123, 94, 167, 0.2)",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <LockIcon />
                <span
                  style={{ fontSize: "13px", color: "var(--text-secondary)" }}
                >
                  4 categories are locked on the free plan.{" "}
                  <button
                    type="button"
                    onClick={() => router.push("/subscribe")}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--accent)",
                      fontSize: "13px",
                      fontFamily: "inherit",
                      padding: 0,
                      textDecoration: "underline",
                    }}
                  >
                    Upgrade to Pro
                  </button>{" "}
                  to unlock all categories.
                </span>
              </div>
            )}
          </section>

          {/* Frequency */}
          <section className="animate-fade-in-delay-2">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <h2
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  letterSpacing: "-0.3px",
                }}
              >
                Delivery Frequency
              </h2>
              {isFreePlan && (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "3px 10px",
                    background: "rgba(123, 94, 167, 0.1)",
                    border: "1px solid rgba(123, 94, 167, 0.2)",
                    borderRadius: "100px",
                    fontSize: "11px",
                    color: "var(--text-secondary)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  <LockIcon /> Free: weekly only
                </div>
              )}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "10px",
              }}
            >
              {frequencyOptions.map((freq) => {
                const isLocked = isFreePlan && freq.id !== "weekly";
                const isSelected = selectedFrequency === freq.id;

                return (
                  <div
                    key={freq.id}
                    onClick={() => {
                      if (!isLocked) setSelectedFrequency(freq.id);
                    }}
                    style={{
                      ...cardBase,
                      cursor: isLocked ? "not-allowed" : "pointer",
                      background:
                        isSelected && !isLocked
                          ? "var(--bg-elevated)"
                          : isLocked
                            ? "var(--bg-secondary)"
                            : "var(--bg-card)",
                      border: `1px solid ${isSelected && !isLocked ? "var(--accent)" : "var(--border)"}`,
                      opacity: isLocked ? 0.5 : 1,
                      boxShadow:
                        isSelected && !isLocked
                          ? "0 0 20px var(--accent-glow)"
                          : "none",
                      alignItems: "center",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected && !isLocked)
                        (e.currentTarget as HTMLDivElement).style.borderColor =
                          "var(--border-bright)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected && !isLocked)
                        (e.currentTarget as HTMLDivElement).style.borderColor =
                          "var(--border)";
                    }}
                  >
                    {/* Radio */}
                    <div
                      style={{
                        flexShrink: 0,
                        width: "18px",
                        height: "18px",
                        borderRadius: "50%",
                        border: `1.5px solid ${isSelected && !isLocked ? "var(--accent)" : "var(--border-bright)"}`,
                        background:
                          isSelected && !isLocked
                            ? "var(--accent)"
                            : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {isSelected && !isLocked && (
                        <div
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: "var(--bg-primary)",
                          }}
                        />
                      )}
                    </div>

                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <span style={{ fontSize: "14px" }}>{freq.icon}</span>
                        <span style={{ fontSize: "18px", fontWeight: 600 }}>
                          {freq.name}
                        </span>
                        {isLocked && <LockIcon />}
                      </div>
                      <p
                        style={{
                          fontSize: "14px",
                          color: "var(--text-muted)",
                          margin: 0,
                        }}
                      >
                        {freq.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Submit */}
          <div
            className="animate-fade-in-delay-3"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: "8px",
            }}
          >
            <span
              style={{
                fontSize: "14px",
                color: "var(--text-muted)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {selectedCategories.length} categor
              {selectedCategories.length !== 1 ? "ies" : "y"} ·{" "}
              {selectedFrequency}
            </span>
            <button
              type="submit"
              disabled={isSaving || selectedCategories.length === 0}
              style={{
                padding: "12px 32px",
                background:
                  selectedCategories.length === 0 || isSaving
                    ? "var(--bg-elevated)"
                    : "var(--accent)",
                border: "none",
                borderRadius: "8px",
                color:
                  selectedCategories.length === 0 || isSaving
                    ? "var(--text-muted)"
                    : "var(--bg-primary)",
                fontSize: "18px",
                fontWeight: 600,
                fontFamily: "var(--font-display)",
                cursor:
                  selectedCategories.length === 0 || isSaving
                    ? "not-allowed"
                    : "pointer",
                transition: "all 0.2s",
              }}
            >
              {isSaving ? "Saving..." : "Save Preferences →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

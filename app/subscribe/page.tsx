"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { availablePlans } from "@/lib/plans";
import { useAuth } from "@/contexts/AuthContext";

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path
      d="M2 7l3.5 3.5L12 3"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <rect
      x="2"
      y="5"
      width="8"
      height="6"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="1.2"
    />
    <path
      d="M4 5V4a2 2 0 014 0v1"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

const planFeatures: Record<string, { text: string; included: boolean }[]> = {
  free: [
    { text: "4 news categories", included: true },
    { text: "Weekly delivery only", included: true },
    { text: "AI-generated summaries", included: true },
    { text: "All 8 categories", included: false },
    { text: "Daily & bi-weekly delivery", included: false },
    { text: "Priority AI processing", included: false },
  ],
  month: [
    { text: "All 8 news categories", included: true },
    { text: "Daily, weekly & bi-weekly", included: true },
    { text: "Priority AI processing", included: true },
    { text: "Newsletter history", included: true },
    { text: "Custom delivery schedule", included: true },
    { text: "Cancel anytime", included: true },
  ],
  year: [
    { text: "All 8 news categories", included: true },
    { text: "Daily, weekly & bi-weekly", included: true },
    { text: "Priority AI processing", included: true },
    { text: "Newsletter history", included: true },
    { text: "Custom delivery schedule", included: true },
    { text: "Save 17% vs monthly", included: true },
  ],
};

export default function SubscribePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<
    "free" | "month" | "year"
  >("month");
  const { user } = useAuth();
  const router = useRouter();

  const handleSubscribe = async () => {
    if (!user || !user.id) {
      alert("Please sign in to continue");
      return;
    }

    setIsLoading(true);
    try {
      const selectedPlan = availablePlans.find((p) => p.id === selectedPlanId);
      console.log("selectedPlanId: ", selectedPlanId);
      // Free plan — go directly to preferences
      if (selectedPlan?.isFree) {
        router.push("/select?plan=free");
        return;
      }

      const { url } = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: selectedPlanId,
          userId: user.id,
          email: user.email,
        }),
      }).then((r) => r.json());

      if (!url) throw new Error("Checkout error");
      window.location.href = url;
    } catch (err) {
      console.error(err);
      alert("Could not start checkout.");
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        padding: "60px 24px",
      }}
    >
      {/* Background accent */}
      {/* <div style={{
        position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)",
        width: "600px", height: "300px",
        background: "radial-gradient(ellipse at center, rgba(0,212,170,0.05) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} /> */}

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
          maxWidth: "1100px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header */}
        <div
          style={{ textAlign: "center", marginBottom: "56px" }}
          className="animate-fade-in"
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "4px 14px",
              marginBottom: "20px",
              background: "var(--accent-glow)",
              border: "1px solid rgba(0,212,170,0.25)",
              borderRadius: "100px",
            }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "var(--accent)",
              }}
            />
            <span
              style={{
                fontSize: "14px",
                fontFamily: "var(--font-mono)",
                color: "var(--accent)",
                letterSpacing: "0.5px",
              }}
            >
              CHOOSE YOUR PLAN
            </span>
          </div>
          <h1
            style={{
              fontSize: "clamp(32px, 5vw, 54px)",
              fontWeight: 700,
              letterSpacing: "-1.5px",
              marginBottom: "16px",
              lineHeight: 1.15,
            }}
          >
            Intelligence, delivered
            <br />
            <span style={{ color: "var(--accent)" }}>on your terms</span>
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "18px",
              // maxWidth: "480px",
              margin: "0 auto",
            }}
          >
            Start free or unlock the full NovaBrief experience with a Pro plan.
          </p>
        </div>

        {/* Plans Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          {availablePlans.map((plan, idx) => {
            const isSelected = selectedPlanId === plan.id;
            const isPopular = plan.id === "year";
            const features = planFeatures[plan.id] || [];

            return (
              <div
                key={plan.id}
                className={`animate-fade-in-delay-${idx + 1}`}
                onClick={() => setSelectedPlanId(plan.id)}
                style={{
                  position: "relative",
                  background: isSelected
                    ? "var(--bg-elevated)"
                    : "var(--bg-card)",
                  border: `1px solid ${isSelected ? "var(--accent)" : "var(--border)"}`,
                  borderRadius: "16px",
                  padding: "28px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: isSelected
                    ? `0 0 0 1px var(--accent), 0 0 30px var(--accent-glow)`
                    : "none",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected)
                    (e.currentTarget as HTMLDivElement).style.borderColor =
                      "var(--border-bright)";
                }}
                onMouseLeave={(e) => {
                  if (!isSelected)
                    (e.currentTarget as HTMLDivElement).style.borderColor =
                      "var(--border)";
                }}
              >
                {isPopular && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-12px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      padding: "3px 14px",
                      background:
                        "linear-gradient(135deg, var(--accent), var(--accent-2))",
                      borderRadius: "100px",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "white",
                      whiteSpace: "nowrap",
                      letterSpacing: "0.3px",
                    }}
                  >
                    BEST VALUE
                  </div>
                )}

                {plan.isFree && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-12px",
                      right: "20px",
                      padding: "3px 12px",
                      background: "var(--bg-elevated)",
                      border: "1px solid var(--border-bright)",
                      borderRadius: "100px",
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "var(--text-secondary)",
                    }}
                  >
                    NO CARD NEEDED
                  </div>
                )}

                {/* Plan header */}
                <div style={{ marginBottom: "24px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "8px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        letterSpacing: "0.5px",
                        color: isSelected
                          ? "var(--accent)"
                          : "var(--text-secondary)",
                        textTransform: "uppercase",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {plan.name}
                    </span>
                    {isSelected && (
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          background: "var(--accent)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
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
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "4px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "38px",
                        fontWeight: 700,
                        letterSpacing: "-2px",
                        lineHeight: 1,
                      }}
                    >
                      ${plan.price.toFixed(plan.price === 0 ? 0 : 2)}
                    </span>
                    {plan.interval !== "free" && (
                      <span
                        style={{ color: "var(--text-muted)", fontSize: "14px" }}
                      >
                        /{plan.interval}
                      </span>
                    )}
                  </div>
                  {plan.id === "year" && (
                    <p
                      style={{
                        fontSize: "14px",
                        color: "var(--accent)",
                        marginTop: "4px",
                      }}
                    >
                      ~$8.33/month · save $19.89/year
                    </p>
                  )}
                  {plan.id === "free" && (
                    <p
                      style={{
                        fontSize: "14px",
                        color: "var(--text-muted)",
                        marginTop: "4px",
                      }}
                    >
                      Always free, limited access
                    </p>
                  )}
                </div>

                {/* Divider */}
                <div
                  style={{
                    height: "1px",
                    background: "var(--border)",
                    marginBottom: "20px",
                  }}
                />

                {/* Features */}
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {features.map((feature, fi) => (
                    <li
                      key={fi}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        color: feature.included
                          ? "var(--text-primary)"
                          : "var(--text-muted)",
                      }}
                    >
                      <span
                        style={{
                          flexShrink: 0,
                          width: "18px",
                          height: "18px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: feature.included
                            ? "var(--accent-glow)"
                            : "var(--bg-elevated)",
                          color: feature.included
                            ? "var(--accent)"
                            : "var(--text-muted)",
                        }}
                      >
                        {feature.included ? <CheckIcon /> : <LockIcon />}
                      </span>
                      <span
                        style={{
                          fontSize: "16px",
                          textDecoration: feature.included
                            ? "none"
                            : "line-through",
                        }}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div
          style={{ textAlign: "center" }}
          className="animate-fade-in-delay-3"
        >
          <button
            onClick={handleSubscribe}
            disabled={isLoading}
            style={{
              padding: "14px 48px",
              background: isLoading ? "var(--bg-elevated)" : "var(--accent)",
              border: "none",
              borderRadius: "10px",
              color: isLoading ? "var(--text-muted)" : "var(--bg-primary)",
              fontSize: "18px",
              fontWeight: 700,
              fontFamily: "var(--font-display)",
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              letterSpacing: "0.2px",
              marginBottom: "16px",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {isLoading ? (
              "Processing..."
            ) : selectedPlanId === "free" ? (
              <>Get Started Free →</>
            ) : (
              <>Continue to Checkout →</>
            )}
          </button>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "16px",
              fontFamily: "var(--font-mono)",
            }}
          >
            {selectedPlanId === "free"
              ? "No credit card required"
              : "Secured by Stripe · Cancel anytime · 30-day money back"}
          </p>
        </div>
      </div>
    </div>
  );
}

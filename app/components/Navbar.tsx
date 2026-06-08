"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/signin");
  };

  if (!user) return null;

  return (
    <header
      style={{
        background: "var(--bg-secondary)",
        borderBottom: "1px solid var(--border)",
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(12px)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "60px",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "28px",
                height: "28px",
                background:
                  "linear-gradient(135deg, var(--accent), var(--accent-2))",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2 3h10M2 7h7M2 11h5"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "24px",
                color: "var(--text-primary)",
                letterSpacing: "-0.3px",
              }}
            >
              Nova<span style={{ color: "var(--accent)" }}>Brief</span>
            </span>
          </div>

          {/* User */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span
              style={{
                fontSize: "16px",
                color: "var(--text-muted)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {user.email}
            </span>
            <button
              onClick={handleLogout}
              style={{
                padding: "6px 14px",
                background: "transparent",
                border: "1px solid var(--border-bright)",
                borderRadius: "6px",
                color: "var(--text-secondary)",
                fontSize: "16px",
                fontFamily: "var(--font-display)",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.borderColor =
                  "var(--danger)";
                (e.target as HTMLButtonElement).style.color = "var(--danger)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.borderColor =
                  "var(--border-bright)";
                (e.target as HTMLButtonElement).style.color =
                  "var(--text-secondary)";
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

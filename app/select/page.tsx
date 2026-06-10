import { Suspense } from "react";
import Select from "../components/select";

export default function SelectPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            background: "var(--bg-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-muted)",
            fontFamily: "var(--font-mono)",
            fontSize: "14px",
          }}
        >
          Loading...
        </div>
      }
    >
      <Select />
    </Suspense>
  );
}

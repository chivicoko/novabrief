import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("subscriptions")
    .select("status, current_period_end")
    .eq("user_id", user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("DB error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Paid subscriber with active subscription
  if (
    data?.status === "active" &&
    new Date(data.current_period_end) > new Date()
  ) {
    return NextResponse.json({
      active: true,
      status: "active",
      expires_at: data.current_period_end,
    });
  }

  // No subscription row — check if they're a free plan user (have preferences saved)
  if (!data) {
    const { data: prefs } = await supabase
      .from("user_preferences")
      .select("user_id")
      .eq("user_id", user.id)
      .single();

    return NextResponse.json({
      active: !!prefs,
      status: prefs ? "free" : "none",
      expires_at: null,
    });
  }

  // Has a subscription row but it's not active (cancelled, past_due, etc.)
  return NextResponse.json({
    active: false,
    status: data.status || "none",
    expires_at: data.current_period_end || null,
  });
}

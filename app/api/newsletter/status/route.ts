import { NextRequest, NextResponse } from "next/server";
// import { Inngest } from "inngest";
// import { inngest } from "@/inngest/client";

const INNGEST_API = "http://localhost:8288/v1";

/** Fetch all runs for a given event ID */
async function getRuns(eventId: string) {
  const res = await fetch(`${INNGEST_API}/events/${eventId}/runs`, {
    headers: {
      Authorization: `Bearer ${process.env.INNGEST_SIGNING_KEY}`,
    },
  });
  console.log("Inngest Runs List: ", res);
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Inngest list-runs error: ${err}`);
  }
  const json = await res.json();
  return json.data;
}

/** Poll until the first run is Completed/Failed/Cancelled */
async function getRunOutput(eventId: string) {
  const runs = await getRuns(eventId);
  if (!runs.length) {
    throw new Error("No runs found for event");
  }
  const run = runs[0];
  // If still in progress, return current status without waiting
  if (
    run.status !== "Completed" &&
    run.status !== "Failed" &&
    run.status !== "Cancelled"
  ) {
    return run;
  }
  // Already terminal
  return run;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("runId"); // still named runId on client
    if (!eventId) {
      return NextResponse.json(
        { error: "Missing runId (event ID)" },
        { status: 400 },
      );
    }

    const run = await getRunOutput(eventId);
    console.log("Inngest Run Output: ", run);

    // Map Inngest run.status to your client statuses
    let status: "fetching" | "summarizing" | "completed" | "error" = "fetching";
    if (run.status === "Completed") status = "completed";
    else if (run.status === "Failed" || run.status === "Cancelled")
      status = "error";

    return NextResponse.json({
      status,
      // run.output is whatever your function returned
      result: run.output,
      error: run.output?.error || undefined,
    });
  } catch (e: unknown) {
    return NextResponse.json(
      {
        error: e instanceof Error ? e.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}

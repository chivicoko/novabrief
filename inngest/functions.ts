// import { inngest } from "./client";
// import scheduledNewsletterFunction from "@/inngest/functions/scheduled-newsletter";
import scheduledNewsletterFunction from "./functions/scheduled-newsletter";

// Register all functions
export const functions = [scheduledNewsletterFunction];

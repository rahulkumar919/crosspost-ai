import { redirect } from "next/navigation";

/**
 * Analytics has been merged into History.
 * Redirect anyone who navigates to /analytics to /history.
 */
export default function AnalyticsPage() {
    redirect("/history");
}

import { getAnalyses } from "@/lib/db/analysis";
import { InstagramProfilesClient } from "./instagram-profiles-client";

export default async function InstagramProfilesPage() {
  const analyses = await getAnalyses();

  return <InstagramProfilesClient analyses={analyses} />;
}

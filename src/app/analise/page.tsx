import { getAnalyses } from "@/lib/db/analysis";
import { AnaliseClient } from "./analise-client";

export default async function AnalisePage() {
  const savedAnalyses = await getAnalyses();

  return <AnaliseClient savedAnalyses={savedAnalyses} />;
}

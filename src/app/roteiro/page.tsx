import { Suspense } from "react";
import { getAnalysis } from "@/lib/db/analysis";
import { getAnalyses } from "@/lib/db/analysis";
import { RoteiroContent } from "./roteiro-content";

export const dynamic = "force-dynamic";

export default async function RoteiroPage(props: { searchParams: Promise<{ analiseId?: string; profileId?: string }> }) {
  const searchParams = await props.searchParams;
  let analysisData = null;

  if (searchParams.analiseId) {
    const analysis = await getAnalysis(searchParams.analiseId);
    if (analysis) {
      analysisData = {
        id: analysis.id,
        username: analysis.username,
        publicName: analysis.publicName,
        bioSummary: analysis.bioSummary,
        detectedTone: analysis.detectedTone,
        frequentThemes: analysis.frequentThemes,
        probableAudience: analysis.probableAudience,
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
        contentOpportunities: analysis.contentOpportunities,
        communicationRisks: analysis.communicationRisks,
        hashtagSuggestions: analysis.hashtagSuggestions,
      };
    }
  }

  const savedProfiles = await getAnalyses();

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    }>
      <RoteiroContent
        initialAnaliseId={searchParams.analiseId}
        initialProfileId={searchParams.profileId}
        analysisData={analysisData}
        savedProfiles={savedProfiles}
      />
    </Suspense>
  );
}

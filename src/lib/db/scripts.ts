"use server";

import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";

interface ScriptProfile {
  id: string;
  name: string;
  role: string;
  city: string;
  party: string | null;
  instagram: string;
  mainAudience: string;
  mainThemes: string;
  desiredTone: string;
  languageRules: string;
  avoidWords: string;
  useWords: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ScriptAnalysis {
  id: string;
  profileUrl: string;
  username: string;
  publicName: string;
  bioSummary: string;
  detectedTone: string;
  frequentThemes: string;
  status: string;
  createdAt: Date;
}

export type ScriptWithRelations = {
  id: string;
  profileId: string | null;
  instagramAnalysisId: string | null;
  profileName: string | null;
  instagramUsername: string | null;
  title: string;
  type: string;
  duration: string;
  style: string;
  theme: string;
  format: string;
  hook: string;
  fullScript: string;
  pauseMarks: string;
  cameraDir: string;
  sceneSuggestion: string;
  captionSuggestion: string;
  ctaSuggestion: string;
  hashtags: string;
  shortVersion: string;
  emotionalVersion: string;
  institutionalVersion: string;
  isPublic: boolean;
  estimatedWords: number | null;
  objective: string | null;
  scriptText: string | null;
  captionText: string | null;
  cta: string | null;
  scenarioSuggestion: string | null;
  framingSuggestion: string | null;
  strategicNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
  profile: ScriptProfile | null;
  analysis: ScriptAnalysis | null;
};

export async function createScript(data: {
  title: string;
  profileId?: string;
  instagramAnalysisId?: string;
  profileName?: string;
  instagramUsername?: string;
  type: string;
  duration: string;
  style: string;
  theme: string;
  format?: string;
  hook?: string;
  fullScript?: string;
  pauseMarks?: string;
  cameraDir?: string;
  sceneSuggestion?: string;
  captionSuggestion?: string;
  ctaSuggestion?: string;
  hashtags?: string;
  shortVersion?: string;
  emotionalVersion?: string;
  institutionalVersion?: string;
  estimatedWords?: number;
  objective?: string;
  scriptText?: string;
  captionText?: string;
  cta?: string;
  scenarioSuggestion?: string;
  framingSuggestion?: string;
  strategicNotes?: string;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const script = await prisma.script.create({ data: data as any });
  revalidatePath("/roteiro");
  revalidatePath("/discursos");
  revalidatePath("/instagram-profiles");
  return script;
}

export async function updateScript(
  id: string,
  data: Partial<{
    title: string;
    scriptText: string;
    captionText: string;
    hashtags: string;
    cta: string;
    scenarioSuggestion: string;
    framingSuggestion: string;
    strategicNotes: string;
    estimatedWords: number;
  }>
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const script = await prisma.script.update({ where: { id }, data: data as any });
  revalidatePath("/roteiro");
  revalidatePath("/discursos");
  return script;
}

export async function getScripts(filters?: {
  theme?: string;
  duration?: string;
  type?: string;
  style?: string;
  profileId?: string;
  instagramAnalysisId?: string;
}) {
  const where: Record<string, unknown> = {};
  if (filters?.theme) where.theme = filters.theme;
  if (filters?.duration) where.duration = filters.duration;
  if (filters?.type) where.type = filters.type;
  if (filters?.style) where.style = filters.style;
  if (filters?.profileId) where.profileId = filters.profileId;
  if (filters?.instagramAnalysisId) where.instagramAnalysisId = filters.instagramAnalysisId;

  return prisma.script.findMany({
    where: where as Record<string, unknown>,
    include: { profile: true, analysis: true },
    orderBy: { createdAt: "desc" },
  }) as Promise<ScriptWithRelations[]>;
}

export async function getScript(id: string) {
  return prisma.script.findUnique({
    where: { id },
    include: { profile: true, analysis: true },
  }) as Promise<ScriptWithRelations | null>;
}

export async function deleteScript(id: string) {
  await prisma.script.delete({ where: { id } });
  revalidatePath("/discursos");
}

export async function duplicateScript(id: string) {
  const original = await prisma.script.findUnique({ where: { id } });
  if (!original) return null;

  const dup = await prisma.script.create({
    data: {
      title: `${original.title} (cópia)`,
      profileId: original.profileId,
      instagramAnalysisId: original.instagramAnalysisId,
      profileName: original.profileName,
      instagramUsername: original.instagramUsername,
      type: original.type,
      duration: original.duration,
      style: original.style,
      theme: original.theme,
      format: original.format || "gancho_forte",
      hook: original.hook || "",
      fullScript: original.fullScript || "",
      pauseMarks: original.pauseMarks || "",
      cameraDir: original.cameraDir || "",
      sceneSuggestion: original.sceneSuggestion || "",
      captionSuggestion: original.captionSuggestion || "",
      ctaSuggestion: original.ctaSuggestion || "",
      hashtags: original.hashtags || "",
      shortVersion: original.shortVersion || "",
      emotionalVersion: original.emotionalVersion || "",
      institutionalVersion: original.institutionalVersion || "",
      estimatedWords: original.estimatedWords,
      objective: original.objective,
      scriptText: original.scriptText,
      captionText: original.captionText,
      cta: original.cta,
      scenarioSuggestion: original.scenarioSuggestion,
      framingSuggestion: original.framingSuggestion,
      strategicNotes: original.strategicNotes,
    },
  });

  revalidatePath("/discursos");
  return dup;
}

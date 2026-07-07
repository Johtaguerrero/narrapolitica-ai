"use server";

import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";
import type { InstagramAnalysisResult } from "@/lib/instagram/instagram-analyzer";

interface AnalysisProfile {
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

interface AnalysisScript {
  id: string;
  title: string;
  type: string;
  createdAt: Date;
}

export interface AnalysisWithRelations {
  id: string;
  profileId: string | null;
  profileUrl: string;
  username: string;
  publicName: string;
  bioSummary: string;
  detectedTone: string;
  frequentThemes: string;
  probableAudience: string;
  strengths: string;
  weaknesses: string;
  contentOpportunities: string;
  reelIdeas: string;
  speechIdeas: string;
  communicationRisks: string;
  captionSuggestions: string;
  hashtagSuggestions: string;
  rawAnalysis: string;
  status: string;
  city: string | null;
  createdAt: Date;
  updatedAt: Date;
  profile: AnalysisProfile | null;
  scripts: AnalysisScript[];
}

export async function createAnalysis(data: InstagramAnalysisResult & { profileId?: string; city?: string }) {
  const { profileId, ...rest } = data;
  const analysis = await prisma.instagramAnalysis.create({
    data: profileId ? { ...rest, profileId } : rest,
  });
  revalidatePath("/analise");
  revalidatePath("/instagram-profiles");
  return analysis;
}

export async function updateAnalysis(
  id: string,
  data: Partial<InstagramAnalysisResult & { profileId?: string; city?: string }>
) {
  const analysis = await prisma.instagramAnalysis.update({
    where: { id },
    data,
  });
  revalidatePath("/analise");
  revalidatePath("/instagram-profiles");
  return analysis;
}

export async function getAnalyses() {
  return prisma.instagramAnalysis.findMany({
    include: { profile: true, scripts: true },
    orderBy: { createdAt: "desc" },
  }) as Promise<AnalysisWithRelations[]>;
}

export async function getAnalysesByFilters(filters: {
  search?: string;
  city?: string;
  theme?: string;
  tone?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}) {
  const where: Record<string, unknown> = {};
  const AND: Record<string, unknown>[] = [];

  if (filters.search) {
    AND.push({
      OR: [
        { username: { contains: filters.search } },
        { publicName: { contains: filters.search } },
        { frequentThemes: { contains: filters.search } },
        { bioSummary: { contains: filters.search } },
      ],
    });
  }
  if (filters.city) where.city = filters.city;
  if (filters.theme) where.frequentThemes = { contains: filters.theme };
  if (filters.tone) where.detectedTone = { contains: filters.tone };
  if (filters.status) where.status = filters.status;
  if (filters.startDate) AND.push({ createdAt: { gte: new Date(filters.startDate) } });
  if (filters.endDate) AND.push({ createdAt: { lte: new Date(filters.endDate) } });

  if (AND.length > 0) where.AND = AND;

  return prisma.instagramAnalysis.findMany({
    where: where as Record<string, unknown>,
    include: { profile: true, scripts: true },
    orderBy: { createdAt: "desc" },
  }) as Promise<AnalysisWithRelations[]>;
}

export async function getAnalysis(id: string) {
  return prisma.instagramAnalysis.findUnique({
    where: { id },
    include: { profile: true, scripts: true },
  }) as Promise<AnalysisWithRelations | null>;
}

export async function deleteAnalysis(id: string) {
  await prisma.instagramAnalysis.delete({ where: { id } });
  revalidatePath("/analise");
  revalidatePath("/instagram-profiles");
}

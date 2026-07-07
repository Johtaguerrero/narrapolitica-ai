"use server";

import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";

export async function createProfile(data: {
  name: string;
  role: string;
  city: string;
  party?: string;
  instagram: string;
  mainAudience: string;
  mainThemes: string;
  desiredTone: string;
  languageRules: string;
  avoidWords: string;
  useWords: string;
}) {
  const profile = await prisma.politicalProfile.create({ data });
  revalidatePath("/perfil");
  return profile;
}

export async function updateProfile(id: string, data: Partial<{
  name: string;
  role: string;
  city: string;
  party: string;
  instagram: string;
  mainAudience: string;
  mainThemes: string;
  desiredTone: string;
  languageRules: string;
  avoidWords: string;
  useWords: string;
}>) {
  const profile = await prisma.politicalProfile.update({ where: { id }, data });
  revalidatePath("/perfil");
  return profile;
}

export async function deleteProfile(id: string) {
  await prisma.politicalProfile.delete({ where: { id } });
  revalidatePath("/perfil");
}

export async function getProfiles() {
  return prisma.politicalProfile.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getProfile(id: string) {
  return prisma.politicalProfile.findUnique({ where: { id } });
}

"use server";

import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";

export async function createReelCard(data: {
  scriptId?: string;
  title: string;
  theme: string;
  duration: string;
  status: string;
  suggestedDate?: string;
}) {
  const card = await prisma.reelCard.create({
    data: {
      ...data,
      suggestedDate: data.suggestedDate ? new Date(data.suggestedDate) : null,
    },
  });
  revalidatePath("/caixa-reels");
  return card;
}

export async function getReelCards() {
  return prisma.reelCard.findMany({
    include: { script: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateReelCardStatus(id: string, status: string) {
  const card = await prisma.reelCard.update({ where: { id }, data: { status } });
  revalidatePath("/caixa-reels");
  return card;
}

export async function updateReelCard(id: string, data: Partial<{
  title: string;
  theme: string;
  duration: string;
  status: string;
  suggestedDate: string;
}>) {
  const card = await prisma.reelCard.update({
    where: { id },
    data: {
      ...data,
      ...(data.suggestedDate ? { suggestedDate: new Date(data.suggestedDate) } : {}),
    },
  });
  revalidatePath("/caixa-reels");
  return card;
}

export async function deleteReelCard(id: string) {
  await prisma.reelCard.delete({ where: { id } });
  revalidatePath("/caixa-reels");
}

export async function duplicateReelCard(id: string) {
  const original = await prisma.reelCard.findUnique({ where: { id } });
  if (!original) return null;

  const dup = await prisma.reelCard.create({
    data: {
      title: `${original.title} (cópia)`,
      theme: original.theme,
      duration: original.duration,
      status: "ideia",
      scriptId: original.scriptId,
    },
  });

  revalidatePath("/caixa-reels");
  return dup;
}

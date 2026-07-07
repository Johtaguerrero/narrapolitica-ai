import { notFound } from "next/navigation";
import { getProfile } from "@/lib/db/profiles";
import { ProfileForm } from "../profile-form";

export default async function EditarPerfilPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await getProfile(id);
  if (!profile) notFound();

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Editar Perfil</h1>
        <p className="text-muted-foreground mt-1">Atualize os dados do perfil político.</p>
      </div>
      <ProfileForm profile={profile} />
    </div>
  );
}

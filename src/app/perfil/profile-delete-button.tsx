"use client";

import { useRouter } from "next/navigation";
import { deleteProfile } from "@/lib/db/profiles";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ProfileDeleteButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Tem certeza que deseja excluir este perfil?")) return;
    await deleteProfile(id);
    toast.success("Perfil excluído");
    router.refresh();
  }

  return (
    <Button variant="outline" size="sm" onClick={handleDelete} className="text-destructive hover:text-destructive">
      Excluir
    </Button>
  );
}

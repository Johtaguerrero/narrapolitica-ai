"use client";

import { useRouter } from "next/navigation";
import { deleteScript } from "@/lib/db/scripts";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function DeleteButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Excluir este roteiro?")) return;
    await deleteScript(id);
    toast.success("Roteiro excluído");
    router.refresh();
  }

  return (
    <Button variant="outline" size="sm" onClick={handleDelete} className="text-destructive hover:text-destructive">
      Excluir
    </Button>
  );
}

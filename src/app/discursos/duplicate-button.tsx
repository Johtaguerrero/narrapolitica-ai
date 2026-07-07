"use client";

import { useRouter } from "next/navigation";
import { duplicateScript } from "@/lib/db/scripts";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function DuplicateButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleDuplicate() {
    await duplicateScript(id);
    toast.success("Roteiro duplicado");
    router.refresh();
  }

  return (
    <Button variant="outline" size="sm" onClick={handleDuplicate}>
      Duplicar
    </Button>
  );
}

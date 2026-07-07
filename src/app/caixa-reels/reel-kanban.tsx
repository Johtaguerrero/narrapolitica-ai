"use client";

import { useRouter } from "next/navigation";
import { updateReelCardStatus, duplicateReelCard, deleteReelCard } from "@/lib/db/reel-cards";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { labelMap } from "@/data/content-types";

interface ReelCardData {
  id: string;
  title: string;
  theme: string;
  duration: string;
  status: string;
  suggestedDate: Date | null;
  script: { id: string } | null;
}

interface Column {
  key: string;
  label: string;
  cards: ReelCardData[];
}

export function ReelKanban({ columns }: { columns: Column[] }) {
  const router = useRouter();

  async function handleStatusChange(id: string, newStatus: string) {
    await updateReelCardStatus(id, newStatus);
    toast.success("Status atualizado");
    router.refresh();
  }

  async function handleDuplicate(id: string) {
    await duplicateReelCard(id);
    toast.success("Card duplicado");
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir este card?")) return;
    await deleteReelCard(id);
    toast.success("Card excluído");
    router.refresh();
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {columns.map((col) => (
        <div key={col.key} className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm uppercase tracking-wider">{col.label}</h3>
            <Badge variant="secondary">{col.cards.length}</Badge>
          </div>

          <div className="space-y-3 min-h-[200px]">
            {col.cards.map((card) => (
              <Card key={card.id} className="glass">
                <CardContent className="p-4 space-y-2">
                  <p className="font-medium text-sm leading-tight">{card.title}</p>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">
                      {labelMap[card.theme] || card.theme}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {labelMap[card.duration] || card.duration}
                    </Badge>
                  </div>
                  {card.suggestedDate && (
                    <p className="text-xs text-muted-foreground">
                      {new Date(card.suggestedDate).toLocaleDateString("pt-BR")}
                    </p>
                  )}
                  <div className="flex gap-1 pt-1">
                    {card.script && (
                      <Button variant="outline" size="sm" className="text-xs h-7 px-2" onClick={() => router.push(`/discursos/${card.script!.id}`)}>
                        Ver roteiro
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="text-xs h-7 px-2" onClick={() => handleDuplicate(card.id)}>
                      Duplicar
                    </Button>
                  </div>
                  <div className="flex gap-1">
                    <select
                      value={card.status}
                      onChange={(e) => handleStatusChange(card.id, e.target.value)}
                      className="text-xs bg-transparent border border-border rounded px-1 py-0.5 flex-1"
                    >
                      <option value="ideia">Ideia</option>
                      <option value="roteirizado">Roteirizado</option>
                      <option value="gravado">Gravado</option>
                      <option value="editado">Editado</option>
                      <option value="publicado">Publicado</option>
                      <option value="arquivado">Arquivado</option>
                    </select>
                    <Button variant="outline" size="sm" className="text-xs h-7 px-2 text-destructive" onClick={() => handleDelete(card.id)}>
                      X
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

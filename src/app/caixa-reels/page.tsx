import { getReelCards } from "@/lib/db/reel-cards";
import { ReelKanban } from "./reel-kanban";

export default async function CaixaReelsPage() {
  const cards = await getReelCards();

  const grouped = {
    ideia: cards.filter((c) => c.status === "ideia"),
    roteirizado: cards.filter((c) => c.status === "roteirizado"),
    gravado: cards.filter((c) => c.status === "gravado"),
    editado: cards.filter((c) => c.status === "editado"),
    publicado: cards.filter((c) => c.status === "publicado"),
    arquivado: cards.filter((c) => c.status === "arquivado"),
  };

  const columns = [
    { key: "ideia", label: "Ideias", cards: grouped.ideia },
    { key: "roteirizado", label: "Roteirizado", cards: grouped.roteirizado },
    { key: "gravado", label: "Gravado", cards: grouped.gravado },
    { key: "editado", label: "Editado", cards: grouped.editado },
    { key: "publicado", label: "Publicado", cards: grouped.publicado },
    { key: "arquivado", label: "Arquivado", cards: grouped.arquivado },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Caixa de Reels</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie sua produção de conteúdo em estilo kanban.
        </p>
      </div>

      <ReelKanban columns={columns} />
    </div>
  );
}

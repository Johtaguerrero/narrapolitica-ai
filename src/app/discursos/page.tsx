import Link from "next/link";
import { getScripts } from "@/lib/db/scripts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { labelMap } from "@/data/content-types";
import { DuplicateButton } from "./duplicate-button";
import { DeleteButton } from "./delete-button";

export const dynamic = "force-dynamic";

const themeKeys = ["cultura","juventude","educacao","saude","seguranca","emprego","moradia","mobilidade","esporte","mulher","familia","empreendedorismo","periferia","transparencia","comunidade","combate_fome","projetos_sociais"];
const typeKeys = ["reels","discurso_curto","discurso_medio","discurso_longo","texto_instagram","legenda","carrossel","resposta_comentario","fala_bastidor","video_rua","video_institucional","video_emocional","video_prestacao_contas"];
const styleKeys = ["natural_rua","institucional_leve","popular_direto","emocional","tecnico_acessivel","juventude_cultura","periferia_respeito","fe_familia_comunidade","prestacao_contas","critica_sem_ataque","propositivo","bastidor_real","lideranca_tranquila"];

export default async function DiscursosPage({
  searchParams,
}: {
  searchParams: Promise<{ theme?: string; type?: string; style?: string }>;
}) {
  const params = await searchParams;
  const scripts = await getScripts(params);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Discursos Salvos</h1>
          <p className="text-muted-foreground mt-1">
            Todos os roteiros criados, com busca e filtros.
          </p>
        </div>
        <Link href="/roteiro">
          <Button>Novo Roteiro</Button>
        </Link>
      </div>

      <div className="flex gap-3 flex-wrap">
        <form className="flex gap-3 flex-wrap">
          <select
            name="theme"
            defaultValue={params.theme || ""}
            className="bg-card border border-border rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Todos os temas</option>
            {themeKeys.map((k) => (
              <option key={k} value={k}>{labelMap[k] || k}</option>
            ))}
          </select>
          <select
            name="type"
            defaultValue={params.type || ""}
            className="bg-card border border-border rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Todos os tipos</option>
            {typeKeys.map((k) => (
              <option key={k} value={k}>{labelMap[k] || k}</option>
            ))}
          </select>
          <select
            name="style"
            defaultValue={params.style || ""}
            className="bg-card border border-border rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Todos os estilos</option>
            {styleKeys.map((k) => (
              <option key={k} value={k}>{labelMap[k] || k}</option>
            ))}
          </select>
          <Button type="submit" variant="outline" size="sm">Filtrar</Button>
        </form>
      </div>

      {scripts.length === 0 ? (
        <Card className="glass">
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground">Nenhum roteiro encontrado.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {scripts.map((script) => (
            <Card key={script.id} className="glass hover:shadow-md transition-all">
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <Link href={`/discursos/${script.id}`} className="hover:underline">
                      <p className="font-medium truncate">{script.title}</p>
                    </Link>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="text-xs bg-muted px-2 py-0.5 rounded">{labelMap[script.type] || script.type}</span>
                      <span className="text-xs bg-muted px-2 py-0.5 rounded">{labelMap[script.duration] || script.duration}</span>
                      <span className="text-xs bg-muted px-2 py-0.5 rounded">{labelMap[script.theme] || script.theme}</span>
                      <span className="text-xs bg-muted px-2 py-0.5 rounded">{labelMap[script.style] || script.style}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(script.createdAt).toLocaleDateString("pt-BR")}
                      {script.profile && ` · ${script.profile.name}`}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <DuplicateButton id={script.id} />
                    <DeleteButton id={script.id} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

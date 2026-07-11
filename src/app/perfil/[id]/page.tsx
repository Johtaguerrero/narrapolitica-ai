import { notFound } from "next/navigation";
import { getProfile } from "@/lib/db/profiles";
import { getSavedTerritories, getTerritoryAnalyses } from "@/lib/territory/territory-actions";
import { ProfileForm } from "../profile-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function EditarPerfilPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await getProfile(id);
  if (!profile) notFound();

  const [territories, analyses] = await Promise.all([
    getSavedTerritories(id),
    getTerritoryAnalyses(id),
  ]);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Editar Perfil</h1>
        <p className="text-muted-foreground mt-1">Atualize os dados do perfil político.</p>
      </div>

      <ProfileForm profile={profile} />

      <Card className="glass">
        <CardHeader>
          <CardTitle>Territórios Salvos</CardTitle>
        </CardHeader>
        <CardContent>
          {territories.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              Nenhum território salvo para este perfil.
            </p>
          ) : (
            <div className="space-y-2">
              {territories.map(t => (
                <div key={t.id} className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">{t.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.administrativeRegion.officialName}
                      {t.sector && ` — ${t.sector}`}
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                    t.status === 'ACTIVE' ? 'bg-emerald-900/40 text-emerald-400' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {t.status === 'ACTIVE' ? 'Ativo' : t.status}
                  </span>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4">
            <Link
              href="/territories"
              className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
            >
              Gerenciar territórios →
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Análises Territoriais</CardTitle>
        </CardHeader>
        <CardContent>
          {analyses.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              Nenhuma análise territorial realizada.
            </p>
          ) : (
            <div className="space-y-2">
              {analyses.map(a => (
                <div key={a.id} className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">{a.administrativeRegion.officialName}</p>
                    <p className="text-xs text-muted-foreground">
                      {a.status === 'READY' ? a.mainTheme || 'Análise concluída' : 'Análise pendente'}
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                    a.status === 'READY' ? 'bg-violet-900/40 text-violet-400' :
                    a.status === 'WAITING' ? 'bg-amber-900/40 text-amber-400' :
                    'bg-zinc-800 text-zinc-400'
                  }`}>
                    {a.status === 'READY' ? 'Pronto' :
                     a.status === 'WAITING' ? 'Pendente' : a.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

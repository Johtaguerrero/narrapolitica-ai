import Link from "next/link";
import { getScripts } from "@/lib/db/scripts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

const quickActions = [
  { href: "/roteiro", title: "Novo Roteiro", desc: "Crie roteiros com base no perfil do político", icon: "▷" },
  { href: "/analise", title: "Analisar Instagram", desc: "Diagnóstico de posicionamento digital", icon: "◎" },
  { href: "/instagram-profiles", title: "Perfis Salvos", desc: "Gerencie perfis de Instagram analisados", icon: "◆" },
  { href: "/discursos", title: "Discursos Salvos", desc: "Acesse roteiros criados anteriormente", icon: "▥" },
  { href: "/biblioteca", title: "Biblioteca de Estilos", desc: "Estilos prontos de comunicação", icon: "▤" },
  { href: "/caixa-reels", title: "Caixa de Reels", desc: "Gerencie sua produção de conteúdo", icon: "▣" },
  { href: "/calendario", title: "Calendário Editorial", desc: "Planejamento semanal de postagens", icon: "▦" },
];

export default async function DashboardPage() {
  const scripts = await getScripts();
  const recentScripts = scripts.slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Bem-vindo ao NarraPolítica AI. Crie comunicação pública responsável e eficiente.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickActions.map((action) => (
          <Link key={action.href} href={action.href}>
            <Card className="h-full glass hover:shadow-md transition-all cursor-pointer group">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg">
                  <span className="text-2xl">{action.icon}</span>
                  {action.title}
                </CardTitle>
                <CardDescription>{action.desc}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Últimos Roteiros</h2>
          <Link href="/discursos">
            <Button variant="outline" size="sm">Ver todos</Button>
          </Link>
        </div>

        {recentScripts.length === 0 ? (
          <Card className="glass">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Nenhum roteiro criado ainda.</p>
              <Link href="/roteiro">
                <Button className="mt-4">Criar primeiro roteiro</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {recentScripts.map((script) => (
              <Link key={script.id} href={`/discursos/${script.id}`}>
                <Card className="glass hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="flex items-center justify-between py-4">
                    <div>
                      <p className="font-medium">{script.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {script.type.replace(/_/g, " ")} · {script.duration} ·{" "}
                        {new Date(script.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

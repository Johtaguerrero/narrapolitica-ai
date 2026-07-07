import { notFound } from "next/navigation";
import Link from "next/link";
import { getScript } from "@/lib/db/scripts";
import type { ScriptWithRelations } from "@/lib/db/scripts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { labelMap } from "@/data/content-types";
import { estimateReadingTime } from "@/lib/generators/time-calculator";
import { DuplicateButton } from "../duplicate-button";

export const dynamic = "force-dynamic";

export default async function ScriptViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const script = await getScript(id) as ScriptWithRelations | null;
  if (!script) notFound();

  const readingTime = script.estimatedWords
    ? estimateReadingTime(script.estimatedWords, script.type)
    : "";

  const hasNewFields = script.scriptText || script.captionText;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/discursos" className="text-sm text-muted-foreground hover:text-foreground">
              ← Discursos
            </Link>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{script.title}</h1>
          <p className="text-muted-foreground mt-1">
            {labelMap[script.type] || script.type} · {labelMap[script.duration] || script.duration} ·{" "}
            {labelMap[script.theme] || script.theme} · {labelMap[script.style] || script.style}
            {script.estimatedWords && ` · ~${script.estimatedWords} palavras`}
            {readingTime && ` · ${readingTime}`}
          </p>
        </div>
        <div className="flex gap-2">
          <DuplicateButton id={script.id} />
          <Link href={`/roteiro${script.profileId ? `?profileId=${script.profileId}` : ""}`}>
            <Button variant="outline">Criar similar</Button>
          </Link>
        </div>
      </div>

      {hasNewFields ? (
        <>
          {script.scriptText && (
            <Card className="glass">
              <CardHeader>
                <CardTitle>Roteiro para Leitura Contínua</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                  {script.scriptText}
                </p>
              </CardContent>
            </Card>
          )}

          {script.captionText && (
            <Card className="glass">
              <CardHeader>
                <CardTitle>Legenda</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {script.captionText}
                </p>
              </CardContent>
            </Card>
          )}

          {script.hashtags && (
            <Card className="glass">
              <CardHeader>
                <CardTitle>Hashtags</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{script.hashtags}</p>
              </CardContent>
            </Card>
          )}

          {script.cta && (
            <Card className="glass">
              <CardHeader>
                <CardTitle>CTA</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{script.cta}</p>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {script.scenarioSuggestion && (
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Cenário</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{script.scenarioSuggestion}</p>
                </CardContent>
              </Card>
            )}
            {script.framingSuggestion && (
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Enquadramento</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{script.framingSuggestion}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {script.strategicNotes && (
            <Card className="glass">
              <CardHeader>
                <CardTitle>Observações Estratégicas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {script.strategicNotes}
                </p>
              </CardContent>
            </Card>
          )}

          {script.objective && (
            <Card className="glass">
              <CardHeader>
                <CardTitle>Objetivo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground capitalize">{script.objective.replace(/_/g, " ")}</p>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card className="glass">
          <CardHeader>
            <CardTitle>Roteiro</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="completo">
              <TabsList className="mb-4">
                <TabsTrigger value="completo">Completo</TabsTrigger>
                <TabsTrigger value="curto">Versão Curta</TabsTrigger>
                <TabsTrigger value="emocional">Versão Emocional</TabsTrigger>
                <TabsTrigger value="institucional">Versão Institucional</TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[500px] pr-4">
                <TabsContent value="completo" className="space-y-6">
                  <Section label="Gancho Inicial" content={script.hook} />
                  <Section label="Roteiro Completo" content={script.fullScript} />
                  <Section label="Marcações de Pausa" content={script.pauseMarks} />
                  <Section label="Direção de Câmera" content={script.cameraDir} />
                  <Section label="Sugestão de Cenário" content={script.sceneSuggestion} />
                  <Section label="Sugestão de Legenda" content={script.captionSuggestion} />
                  <Section label="Sugestão de CTA" content={script.ctaSuggestion} />
                  <Section label="Hashtags" content={script.hashtags} />
                </TabsContent>

                <TabsContent value="curto">
                  <Section label="Versão Curta" content={script.shortVersion} />
                </TabsContent>

                <TabsContent value="emocional">
                  <Section label="Versão Emocional" content={script.emotionalVersion} />
                </TabsContent>

                <TabsContent value="institucional">
                  <Section label="Versão Institucional" content={script.institutionalVersion} />
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {script.profile && (
        <Card className="glass">
          <CardHeader>
            <CardTitle>Perfil associado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{script.profile.name}</p>
            <p className="text-sm text-muted-foreground">{script.profile.role} · {script.profile.city}</p>
          </CardContent>
        </Card>
      )}

      <p className="text-xs text-muted-foreground">
        Criado em {new Date(script.createdAt).toLocaleDateString("pt-BR")} ·{" "}
        Atualizado em {new Date(script.updatedAt).toLocaleDateString("pt-BR")}
      </p>
    </div>
  );
}

function Section({ label, content }: { label: string; content: string }) {
  if (!content) return null;
  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-sm text-foreground/80 uppercase tracking-wider">{label}</h3>
      <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{content}</p>
    </div>
  );
}

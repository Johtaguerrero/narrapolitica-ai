"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { analyzeInstagramProfile } from "@/lib/instagram/instagram-analyzer";
import type { InstagramAnalysisResult } from "@/lib/instagram/instagram-analyzer";
import { createAnalysis, updateAnalysis } from "@/lib/db/analysis";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Link from "next/link";

type Status = "idle" | "searching" | "generating" | "ready";

const statusMessages: Record<Status, string> = {
  idle: "Aguardando link",
  searching: "Pesquisando perfil",
  generating: "Gerando diagnóstico",
  ready: "Análise pronta",
};

const statusVariants: Record<Status, "default" | "secondary" | "outline" | "destructive"> = {
  idle: "secondary",
  searching: "outline",
  generating: "outline",
  ready: "default",
};

const fields: { key: keyof InstagramAnalysisResult; label: string }[] = [
  { key: "publicName", label: "Nome público" },
  { key: "bioSummary", label: "Bio / Resumo do perfil" },
  { key: "detectedTone", label: "Tom de voz percebido" },
  { key: "frequentThemes", label: "Temas mais frequentes" },
  { key: "probableAudience", label: "Público provável" },
  { key: "strengths", label: "Pontos fortes" },
  { key: "weaknesses", label: "Pontos fracos" },
  { key: "contentOpportunities", label: "Oportunidades de conteúdo" },
  { key: "reelIdeas", label: "Ideias de Reels" },
  { key: "speechIdeas", label: "Ideias de discursos" },
  { key: "communicationRisks", label: "Riscos de comunicação" },
  { key: "captionSuggestions", label: "Sugestões de legenda" },
  { key: "hashtagSuggestions", label: "Hashtags prováveis" },
];

interface SavedAnalysis {
  id: string;
  profileUrl: string | null;
  username: string;
  publicName: string | null;
  bioSummary: string | null;
  detectedTone: string | null;
  frequentThemes: string | null;
  status: string;
  createdAt: Date;
}

export function AnaliseClient({ savedAnalyses }: { savedAnalyses: SavedAnalysis[] }) {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<InstagramAnalysisResult | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [editable, setEditable] = useState<Record<string, string>>({});

  const handleAnalyze = useCallback(async () => {
    if (!input.trim()) {
      toast.error("Informe o link ou @ do Instagram");
      return;
    }

    setStatus("searching");
    setResult(null);
    setSavedId(null);

    try {
      await new Promise((r) => setTimeout(r, 1500));
      setStatus("generating");

      const analysis = await analyzeInstagramProfile(input);
      setResult(analysis);
      setEditable(analysis as unknown as Record<string, string>);
      setStatus("ready");
    } catch {
      toast.error("Erro ao analisar perfil");
      setStatus("idle");
    }
  }, [input]);

  const handleFieldChange = (key: string, value: string) => {
    setEditable((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!result) return;
    try {
      const saved = await createAnalysis(editable as unknown as InstagramAnalysisResult);
      setSavedId(saved.id);
      toast.success("Análise salva");
      router.refresh();
    } catch {
      toast.error("Erro ao salvar");
    }
  };

  const handleUpdate = async () => {
    if (!savedId) return;
    try {
      await updateAnalysis(savedId, editable);
      toast.success("Análise atualizada");
      router.refresh();
    } catch {
      toast.error("Erro ao atualizar");
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Análise de Instagram</h1>
        <p className="text-muted-foreground mt-1">
          Informe o link ou @ do Instagram do político. O sistema analisa e preenche automaticamente.
        </p>
      </div>

      <Card className="glass">
        <CardContent className="pt-6">
          <div className="flex items-end gap-3">
            <div className="flex-1 space-y-2">
              <Label htmlFor="instagram-input">Link ou @ do Instagram</Label>
              <Input
                id="instagram-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="@usuario ou https://instagram.com/usuario"
                disabled={status === "searching" || status === "generating"}
              />
            </div>
            <Button
              onClick={handleAnalyze}
              disabled={status === "searching" || status === "generating" || !input.trim()}
              className="min-w-[160px]"
            >
              {status === "searching" || status === "generating" ? "Analisando..." : "Analisar perfil"}
            </Button>
          </div>

          {status !== "idle" && (
            <div className="mt-4 flex items-center gap-3">
              <Badge variant={statusVariants[status]}>{statusMessages[status]}</Badge>
              {(status === "searching" || status === "generating") && (
                <div className="w-4 h-4 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {result && (
        <>
          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Resultado da Análise</CardTitle>
              <div className="flex gap-2">
                <Button onClick={savedId ? handleUpdate : handleSave}>
                  {savedId ? "Atualizar" : "Salvar análise"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {fields.map(({ key, label }) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={`field-${key}`}>{label}</Label>
                  {(editable[key]?.length || 0) > 120 ? (
                    <Textarea
                      id={`field-${key}`}
                      value={editable[key] || ""}
                      onChange={(e) => handleFieldChange(key, e.target.value)}
                      rows={4}
                    />
                  ) : (
                    <Input
                      id={`field-${key}`}
                      value={editable[key] || ""}
                      onChange={(e) => handleFieldChange(key, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {savedId && (
            <div className="flex gap-3">
              <Link href={`/roteiro?analiseId=${savedId}`}>
                <Button variant="outline">Criar roteiro com esta análise</Button>
              </Link>
              <Link href={`/caixa-reels?analiseId=${savedId}`}>
                <Button variant="outline">Enviar para Caixa de Reels</Button>
              </Link>
            </div>
          )}
        </>
      )}

      <Separator className="my-8" />

      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Análises Salvas</h2>

        {savedAnalyses.length === 0 ? (
          <Card className="glass">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Nenhuma análise salva ainda.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {savedAnalyses.map((analysis) => (
              <Card key={analysis.id} className="glass hover:shadow-md transition-all">
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{analysis.publicName || analysis.username}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {analysis.bioSummary}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">{analysis.detectedTone?.slice(0, 30)}</Badge>
                        <Badge variant="outline" className="text-xs">{analysis.status}</Badge>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {new Date(analysis.createdAt).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Link href={`/roteiro?analiseId=${analysis.id}`}>
                        <Button variant="outline" size="sm">Usar no roteiro</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

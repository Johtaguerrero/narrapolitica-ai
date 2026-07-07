"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { deleteAnalysis, updateAnalysis } from "@/lib/db/analysis";
import type { AnalysisWithRelations } from "@/lib/db/analysis";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

const statusBadge: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  pronto: "default",
  rascunho: "secondary",
  pendente: "outline",
};

const statusLabel: Record<string, string> = {
  pronto: "Analisado",
  rascunho: "Rascunho",
  pendente: "Pendente",
};

interface Props {
  analyses: AnalysisWithRelations[];
}

export function InstagramProfilesClient({ analyses }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [themeFilter, setThemeFilter] = useState("");
  const [toneFilter, setToneFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Record<string, string>>({});

  const allCities = [...new Set(analyses.map((a) => a.city).filter(Boolean))] as string[];
  const allThemes = [
    ...new Set(
      analyses.flatMap((a) =>
        (a.frequentThemes || "").split(",").map((t) => t.trim()).filter(Boolean)
      )
    ),
  ];
  const allTones = [
    ...new Set(
      analyses.flatMap((a) =>
        (a.detectedTone || "").split(",").map((t) => t.trim()).filter(Boolean)
      )
    ),
  ];

  const filtered = analyses.filter((a) => {
    if (search) {
      const q = search.toLowerCase();
      const match =
        a.username.toLowerCase().includes(q) ||
        (a.publicName || "").toLowerCase().includes(q) ||
        (a.frequentThemes || "").toLowerCase().includes(q) ||
        (a.bioSummary || "").toLowerCase().includes(q);
      if (!match) return false;
    }
    if (cityFilter && a.city !== cityFilter) return false;
    if (themeFilter && !(a.frequentThemes || "").toLowerCase().includes(themeFilter.toLowerCase())) return false;
    if (toneFilter && !(a.detectedTone || "").toLowerCase().includes(toneFilter.toLowerCase())) return false;
    if (statusFilter && a.status !== statusFilter) return false;
    return true;
  });

  const handleDelete = async (id: string) => {
    try {
      await deleteAnalysis(id);
      toast.success("Perfil excluído");
      router.refresh();
    } catch {
      toast.error("Erro ao excluir");
    }
  };

  const openEdit = (a: AnalysisWithRelations) => {
    setEditingId(a.id);
    setEditData({
      publicName: a.publicName || "",
      username: a.username || "",
      bioSummary: a.bioSummary || "",
      detectedTone: a.detectedTone || "",
      frequentThemes: a.frequentThemes || "",
      probableAudience: a.probableAudience || "",
      strengths: a.strengths || "",
      weaknesses: a.weaknesses || "",
      contentOpportunities: a.contentOpportunities || "",
      communicationRisks: a.communicationRisks || "",
      hashtagSuggestions: a.hashtagSuggestions || "",
      city: a.city || "",
      status: a.status || "",
    });
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    try {
      await updateAnalysis(editingId, editData);
      toast.success("Perfil atualizado");
      setEditingId(null);
      router.refresh();
    } catch {
      toast.error("Erro ao atualizar");
    }
  };

  const editFields: { key: string; label: string; multiline?: boolean }[] = [
    { key: "publicName", label: "Nome público" },
    { key: "username", label: "Instagram" },
    { key: "city", label: "Cidade/UF" },
    { key: "bioSummary", label: "Bio / Resumo", multiline: true },
    { key: "detectedTone", label: "Tom de voz" },
    { key: "frequentThemes", label: "Temas principais", multiline: true },
    { key: "probableAudience", label: "Público provável", multiline: true },
    { key: "strengths", label: "Pontos fortes", multiline: true },
    { key: "weaknesses", label: "Pontos fracos", multiline: true },
    { key: "contentOpportunities", label: "Oportunidades", multiline: true },
    { key: "communicationRisks", label: "Riscos", multiline: true },
    { key: "hashtagSuggestions", label: "Hashtags", multiline: true },
    { key: "status", label: "Status" },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Perfis Salvos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie todos os perfis de Instagram analisados.
          </p>
        </div>
        <Link href="/analise">
          <Button>Nova análise</Button>
        </Link>
      </div>

      <Card className="glass">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div>
              <Label className="text-xs">Buscar</Label>
              <Input
                placeholder="Nome, @, tema..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-xs">Cidade</Label>
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm"
              >
                <option value="">Todas</option>
                {allCities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-xs">Tema</Label>
              <select
                value={themeFilter}
                onChange={(e) => setThemeFilter(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm"
              >
                <option value="">Todos</option>
                {allThemes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-xs">Tom de voz</Label>
              <select
                value={toneFilter}
                onChange={(e) => setToneFilter(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm"
              >
                <option value="">Todos</option>
                {allTones.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-xs">Status</Label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm"
              >
                <option value="">Todos</option>
                <option value="pronto">Analisado</option>
                <option value="rascunho">Rascunho</option>
                <option value="pendente">Pendente</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <Card className="glass">
          <CardContent className="py-16 text-center space-y-4">
            <p className="text-muted-foreground text-lg">
              {analyses.length === 0
                ? "Nenhum perfil analisado ainda. Analise um Instagram antes de criar roteiros."
                : "Nenhum perfil encontrado com esses filtros."}
            </p>
            {analyses.length === 0 && (
              <Link href="/analise">
                <Button>Analisar novo Instagram</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((a) => (
            <Card key={a.id} className="glass hover:shadow-md transition-all">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-foreground/10 flex items-center justify-center text-foreground/40 text-xl font-bold shrink-0">
                    {(a.publicName || a.username || "?").charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-base truncate">{a.publicName || a.username}</h3>
                        <p className="text-sm text-muted-foreground">@{a.username}</p>
                      </div>
                      <Badge variant={statusBadge[a.status] || "outline"}>
                        {statusLabel[a.status] || a.status}
                      </Badge>
                    </div>

                    {a.city && (
                      <p className="text-xs text-muted-foreground mt-1">{a.city}</p>
                    )}

                    {a.bioSummary && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{a.bioSummary}</p>
                    )}

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {a.detectedTone && (
                        <Badge variant="outline" className="text-xs">{a.detectedTone.slice(0, 35)}</Badge>
                      )}
                      {a.frequentThemes && (
                        <Badge variant="outline" className="text-xs">
                          {a.frequentThemes.split(",").slice(0, 2).join(", ").trim().slice(0, 40)}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                      <span className="text-xs text-muted-foreground">
                        {new Date(a.createdAt).toLocaleDateString("pt-BR")}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {a.scripts.length} roteiro{(a.scripts.length !== 1 ? "s" : "")}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border">
                      <Link href={`/roteiro?analiseId=${a.id}`}>
                        <Button variant="default" size="sm">Criar roteiro</Button>
                      </Link>
                      <Dialog>
                        <DialogTrigger
                          render={
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEdit(a)}
                            >
                              Editar
                            </Button>
                          }
                        />
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Editar análise — {a.publicName || a.username}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            {editFields.map(({ key, label, multiline }) => (
                              <div key={key} className="space-y-1.5">
                                <Label htmlFor={`edit-${key}`} className="text-sm">{label}</Label>
                                {multiline ? (
                                  <Textarea
                                    id={`edit-${key}`}
                                    value={editData[key] || ""}
                                    onChange={(e) =>
                                      setEditData((prev) => ({ ...prev, [key]: e.target.value }))
                                    }
                                    rows={3}
                                  />
                                ) : (
                                  <Input
                                    id={`edit-${key}`}
                                    value={editData[key] || ""}
                                    onChange={(e) =>
                                      setEditData((prev) => ({ ...prev, [key]: e.target.value }))
                                    }
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-end gap-3">
                            <DialogClose
                              render={<Button variant="outline">Cancelar</Button>}
                            />
                            <DialogClose
                              render={<Button onClick={handleSaveEdit}>Salvar</Button>}
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(a.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        Excluir
                      </Button>
                    </div>
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

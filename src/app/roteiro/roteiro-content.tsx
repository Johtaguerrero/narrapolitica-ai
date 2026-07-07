"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { contentTypes, durations, speechStyles, themes } from "@/data/content-types";
import { generateScript } from "@/lib/generators";
import { createScript } from "@/lib/db/scripts";
import { createReelCard } from "@/lib/db/reel-cards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { toast } from "sonner";
import { calculateWordRange, estimateReadingTime } from "@/lib/generators/time-calculator";
import { downloadScriptTxt } from "@/lib/generators/export-script-txt";
import type {
  ContentType,
  Duration,
  SpeechStyle,
  Theme,
  Objective,
  GeneratedScript,
  AnalysisData,
} from "@/types";

const objectives: { value: Objective; label: string }[] = [
  { value: "conscientizar", label: "Conscientizar" },
  { value: "informar", label: "Informar" },
  { value: "mobilizar", label: "Mobilizar" },
  { value: "engajar", label: "Engajar" },
  { value: "prestar_contas", label: "Prestar contas" },
  { value: "inspirar", label: "Inspirar" },
  { value: "educar", label: "Educar" },
  { value: "dialogar", label: "Dialogar" },
];

interface SavedProfile {
  id: string;
  username: string;
  publicName: string;
  bioSummary: string;
  detectedTone: string;
  frequentThemes: string;
  probableAudience: string;
  strengths: string;
  weaknesses: string;
  contentOpportunities: string;
  communicationRisks: string;
  hashtagSuggestions: string;
  status: string;
  city: string | null;
  createdAt: Date;
  scripts: { id: string }[];
}

interface Props {
  initialAnaliseId?: string;
  initialProfileId?: string;
  analysisData?: (AnalysisData & { id: string }) | null;
  savedProfiles: SavedProfile[];
}

export function RoteiroContent({ analysisData: initialAnalysisData, savedProfiles }: Props) {
  const router = useRouter();
  const [modoLivre, setModoLivre] = useState(!initialAnalysisData && savedProfiles.length === 0);
  const [selectedProfileId, setSelectedProfileId] = useState(initialAnalysisData?.id || "");
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(initialAnalysisData || null);

  const [mlName, setMlName] = useState("");
  const [mlTheme, setMlTheme] = useState("");
  const [mlAudience, setMlAudience] = useState("");
  const [mlTone, setMlTone] = useState("");

  const [selectedType, setSelectedType] = useState<ContentType>("reels");
  const [selectedDuration, setSelectedDuration] = useState<Duration>("30s");
  const [selectedStyle, setSelectedStyle] = useState<SpeechStyle>("natural_rua");
  const [selectedTheme, setSelectedTheme] = useState<Theme>("cultura");
  const [selectedObjective, setSelectedObjective] = useState<Objective>("conscientizar");

  const [result, setResult] = useState<GeneratedScript | null>(null);
  const [loading, setLoading] = useState(false);

  const [editTitle, setEditTitle] = useState("");
  const [editScriptText, setEditScriptText] = useState("");
  const [editCaptionText, setEditCaptionText] = useState("");
  const [editHashtags, setEditHashtags] = useState("");

  const wordRange = useMemo(
    () => calculateWordRange(selectedDuration, selectedType),
    [selectedDuration, selectedType]
  );

  const readingTime = useMemo(
    () => (result && result.estimatedWords ? estimateReadingTime(result.estimatedWords, selectedType) : ""),
    [result, selectedType]
  );

  const initialStyle = useMemo(() => {
    if (analysisData) {
      const lower = (analysisData.detectedTone || "").toLowerCase();
      if (lower.includes("direto") || lower.includes("popular")) return "popular_direto" as SpeechStyle;
      if (lower.includes("institucional")) return "institucional_leve" as SpeechStyle;
      if (lower.includes("emocional")) return "emocional" as SpeechStyle;
      if (lower.includes("técnico") || lower.includes("informativo")) return "tecnico_acessivel" as SpeechStyle;
      if (lower.includes("jovem") || lower.includes("cultural")) return "juventude_cultura" as SpeechStyle;
      if (lower.includes("liderança") || lower.includes("tranquila")) return "lideranca_tranquila" as SpeechStyle;
    }
    return "natural_rua" as SpeechStyle;
  }, [analysisData]);

  const initialTheme = useMemo(() => {
    if (analysisData) {
      const lower = (analysisData.frequentThemes || "").toLowerCase();
      const mapping: Record<string, Theme> = {
        educação: "educacao",
        saúde: "saude",
        moradia: "moradia",
        emprego: "emprego",
        cultura: "cultura",
        juventude: "juventude",
        esporte: "esporte",
        transparência: "transparencia",
        comunidade: "comunidade",
        empreendedorismo: "empreendedorismo",
        segurança: "seguranca",
        mobilidade: "mobilidade",
        mulher: "mulher",
        periferia: "periferia",
        família: "familia",
        "combate à fome": "combate_fome",
        "projetos sociais": "projetos_sociais",
      };
      for (const [keyword, theme] of Object.entries(mapping)) {
        if (lower.includes(keyword)) return theme;
      }
    }
    return "cultura" as Theme;
  }, [analysisData]);

  const handleProfileChange = (profileId: string) => {
    setSelectedProfileId(profileId);
    setResult(null);
    if (!profileId) {
      setAnalysisData(null);
      return;
    }
    const profile = savedProfiles.find((p) => p.id === profileId);
    if (profile) {
      setAnalysisData({
        publicName: profile.publicName || "",
        username: profile.username || "",
        bioSummary: profile.bioSummary || "",
        detectedTone: profile.detectedTone || "",
        frequentThemes: profile.frequentThemes || "",
        probableAudience: profile.probableAudience || "",
        strengths: profile.strengths || "",
        weaknesses: profile.weaknesses || "",
        contentOpportunities: profile.contentOpportunities || "",
        communicationRisks: profile.communicationRisks || "",
        hashtagSuggestions: profile.hashtagSuggestions || "",
      });
    }
  };

  const canGenerate = modoLivre ? mlName.trim() && mlTheme.trim() : selectedProfileId;

  async function handleGenerate() {
    if (!canGenerate) {
      toast.error(modoLivre ? "Preencha nome e tema" : "Selecione um perfil");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    const script = generateScript({
      type: selectedType,
      duration: selectedDuration,
      style: selectedStyle,
      theme: selectedTheme,
      objective: selectedObjective,
      instagramAnalysisId: modoLivre ? undefined : selectedProfileId,
      analysisData: analysisData || undefined,
      modoLivre,
      modoLivreData: modoLivre
        ? { name: mlName, theme: mlTheme, audience: mlAudience, tone: mlTone }
        : undefined,
    });

    setResult(script);
    setEditTitle(script.title || "");
    setEditScriptText(script.scriptText || "");
    setEditCaptionText(script.captionText || "");
    setEditHashtags(script.hashtags || "");
    setLoading(false);
  }

  async function handleSave() {
    if (!result) return;
    try {
      const saved = await createScript({
        title: editTitle || result.title,
        instagramAnalysisId: modoLivre ? undefined : selectedProfileId,
        profileName: analysisData?.publicName || mlName || undefined,
        instagramUsername: analysisData?.username || undefined,
        type: selectedType,
        duration: selectedDuration,
        style: selectedStyle,
        theme: selectedTheme,
        format: "gancho_forte",
        hook: result.hook,
        fullScript: result.fullScript,
        scriptText: editScriptText,
        captionText: editCaptionText,
        hashtags: editHashtags,
        cta: result.cta,
        scenarioSuggestion: result.scenarioSuggestion,
        framingSuggestion: result.framingSuggestion,
        strategicNotes: result.strategicNotes,
        estimatedWords: result.estimatedWords,
        objective: selectedObjective,
      });

      await createReelCard({
        scriptId: saved.id,
        title: editTitle || result.title,
        theme: selectedTheme,
        duration: selectedDuration,
        status: "ideia",
      });

      const profileDisplay = analysisData?.publicName || analysisData?.username || mlName || "Modo Livre";
      toast.success(`Roteiro salvo: ${editTitle || result.title} — ${profileDisplay}`);
      router.refresh();
    } catch {
      toast.error("Erro ao salvar");
    }
  }

  const handleDownloadTxt = () => {
    if (!result) return;
    downloadScriptTxt({
      profileName: analysisData?.publicName || mlName,
      instagramUsername: analysisData?.username,
      title: editTitle || result.title,
      theme: selectedTheme,
      contentType: selectedType,
      duration: selectedDuration,
      estimatedWords: result.estimatedWords || undefined,
      style: selectedStyle,
      objective: selectedObjective,
      scriptText: editScriptText,
      captionText: editCaptionText,
      hashtags: editHashtags,
      cta: result.cta || undefined,
      scenarioSuggestion: result.scenarioSuggestion || undefined,
      framingSuggestion: result.framingSuggestion || undefined,
      strategicNotes: result.strategicNotes || undefined,
    });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Criador de Roteiros</h1>
        <p className="text-muted-foreground mt-1">
          Gere roteiros profissionais para Reels, discursos, videos institucionais e mais.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Perfil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {modoLivre ? (
                <div className="grid grid-cols-1 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Nome*</Label>
                    <Input value={mlName} onChange={(e) => setMlName(e.target.value)} placeholder="Nome do político" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Tema principal</Label>
                    <Input value={mlTheme} onChange={(e) => setMlTheme(e.target.value)} placeholder="Ex: educação" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Público</Label>
                    <Input value={mlAudience} onChange={(e) => setMlAudience(e.target.value)} placeholder="Ex: jovens" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Tom de voz</Label>
                    <Input value={mlTone} onChange={(e) => setMlTone(e.target.value)} placeholder="Ex: direto" />
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setModoLivre(false)} className="text-xs">
                    Usar perfil salvo
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedProfiles.length === 0 ? (
                    <div className="text-center space-y-2 py-4">
                      <p className="text-sm text-muted-foreground">Nenhum perfil analisado.</p>
                      <Link href="/analise">
                        <Button variant="outline" size="sm">Analisar Instagram</Button>
                      </Link>
                      <div>
                        <Button variant="ghost" size="sm" onClick={() => setModoLivre(true)} className="text-xs">
                          Criar sem perfil
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <select
                        value={selectedProfileId}
                        onChange={(e) => handleProfileChange(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm"
                      >
                        <option value="">Selecionar perfil</option>
                        {savedProfiles.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.publicName || p.username}
                          </option>
                        ))}
                      </select>
                      <Button variant="ghost" size="sm" onClick={() => setModoLivre(true)} className="text-xs">
                        Criar sem perfil analisado
                      </Button>
                    </>
                  )}
                </div>
              )}

              {analysisData && !modoLivre && (
                <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t border-border">
                  {analysisData.publicName && <p>Nome: {analysisData.publicName}</p>}
                  {analysisData.username && <p>Instagram: @{analysisData.username}</p>}
                  {analysisData.detectedTone && <p>Tom: {analysisData.detectedTone}</p>}
                  {analysisData.probableAudience && <p>Público: {analysisData.probableAudience}</p>}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
               <CardTitle>Tipo de Conteúdo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {contentTypes.map((ct) => (
                  <button
                    key={ct.value}
                    onClick={() => setSelectedType(ct.value)}
                    className={`text-left px-3 py-2 rounded-lg text-xs transition-all border ${
                      selectedType === ct.value
                        ? "bg-foreground text-background border-foreground font-medium"
                        : "bg-card text-foreground border-border hover:border-foreground/30"
                    }`}
                  >
                    {ct.label}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle>Tempo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {durations.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setSelectedDuration(d.value)}
                    className={`text-center px-2 py-2 rounded-lg text-xs transition-all border ${
                      selectedDuration === d.value
                        ? "bg-foreground text-background border-foreground font-medium"
                        : "bg-card text-foreground border-border hover:border-foreground/30"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                ~{wordRange.min}-{wordRange.max} palavras estimadas
              </p>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle>Tema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {themes.map((t) => {
                  const suggested = initialTheme === t.value && !!analysisData;
                  return (
                    <button
                      key={t.value}
                      onClick={() => setSelectedTheme(t.value)}
                      className={`text-left px-3 py-2 rounded-lg text-xs transition-all border relative ${
                        selectedTheme === t.value
                          ? "bg-foreground text-background border-foreground font-medium"
                          : "bg-card text-foreground border-border hover:border-foreground/30"
                      } ${suggested ? "ring-1 ring-foreground/30" : ""}`}
                    >
                      {t.label}
                      {suggested && <span className="ml-1 text-[10px] opacity-60">(sugerido)</span>}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle>Estilo de Fala</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-1.5">
                {speechStyles.map((s) => {
                  const suggested = initialStyle === s.value && !!analysisData;
                  return (
                    <button
                      key={s.value}
                      onClick={() => setSelectedStyle(s.value)}
                      className={`text-left px-3 py-2 rounded-lg text-xs transition-all border relative ${
                        selectedStyle === s.value
                          ? "bg-foreground text-background border-foreground font-medium"
                          : "bg-card text-foreground border-border hover:border-foreground/30"
                      } ${suggested ? "ring-1 ring-foreground/30" : ""}`}
                    >
                      {s.label}
                      {suggested && <span className="ml-1 text-[10px] opacity-60">(sugerido)</span>}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle>Objetivo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {objectives.map((o) => (
                  <button
                    key={o.value}
                    onClick={() => setSelectedObjective(o.value)}
                    className={`text-left px-3 py-2 rounded-lg text-xs transition-all border ${
                      selectedObjective === o.value
                        ? "bg-foreground text-background border-foreground font-medium"
                        : "bg-card text-foreground border-border hover:border-foreground/30"
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handleGenerate}
            disabled={loading || !canGenerate}
            className="w-full h-12 text-base"
          >
            {loading ? "Gerando..." : "Gerar Roteiro"}
          </Button>
        </div>

        <div className="xl:col-span-3 space-y-6">
          {!result ? (
            <Card className="glass h-full">
              <CardContent className="flex items-center justify-center h-[400px]">
                <div className="text-center space-y-3">
                  <p className="text-muted-foreground text-lg">
                    Preencha as opções ao lado e clique em &ldquo;Gerar Roteiro&rdquo;
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Todos os campos são obrigatórios exceto no modo livre
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card className="glass">
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="text-xl font-semibold border-0 px-0 h-auto focus-visible:ring-0"
                    />
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                      <span>
                        {contentTypes.find((c) => c.value === selectedType)?.label}
                      </span>
                      <span>
                        {durations.find((d) => d.value === selectedDuration)?.label}
                      </span>
                      <span>~{result.estimatedWords} palavras</span>
                      <span>{readingTime} de leitura</span>
                      <span>
                        {speechStyles.find((s) => s.value === selectedStyle)?.label}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button variant="outline" size="sm" onClick={handleDownloadTxt}>
                      Baixar TXT
                    </Button>
                    <Button size="sm" onClick={handleSave}>Salvar</Button>
                  </div>
                </CardHeader>
              </Card>

              <Card className="glass">
                <CardHeader>
                  <CardTitle>Roteiro para Leitura Contínua</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Edite o texto antes de salvar se necessário
                  </p>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={editScriptText}
                    onChange={(e) => setEditScriptText(e.target.value)}
                    rows={16}
                    className="text-sm leading-relaxed resize-y min-h-[300px]"
                  />
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader>
                  <CardTitle>Legenda para Postagem</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={editCaptionText}
                    onChange={(e) => setEditCaptionText(e.target.value)}
                    rows={6}
                    className="text-sm resize-y"
                  />
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader>
                  <CardTitle>Hashtags</CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    value={editHashtags}
                    onChange={(e) => setEditHashtags(e.target.value)}
                    className="text-sm"
                  />
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle>Cenário Sugerido</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                      {result.scenarioSuggestion}
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass">
                  <CardHeader>
                    <CardTitle>Enquadramento</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                      {result.framingSuggestion}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card className="glass">
                <CardHeader>
                  <CardTitle>Observações Estratégicas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {result.strategicNotes || "Nenhuma observação adicional."}
                  </p>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader>
                  <CardTitle>CTA</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{result.cta}</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

import type { ScriptFormData, GeneratedScript } from "@/types";
import { generateReelScript } from "./reel-generator";
import { generateSpeechScript } from "./speech-generator";
import { generateTextScript } from "./text-generator";
import { buildPrompt } from "./script-prompt-builder";

export function generateScript(formData: ScriptFormData): GeneratedScript {
  const promptResult = buildPrompt({
    contentType: formData.type,
    duration: formData.duration,
    theme: formData.theme,
    style: formData.style,
    objective: formData.objective || "conscientizar",
    analysisData: formData.analysisData,
    modoLivreData: formData.modoLivreData,
  });

  let legacy: GeneratedScript;

  switch (formData.type) {
    case "reels":
    case "video_rua":
    case "video_institucional":
    case "video_emocional":
    case "video_prestacao_contas":
      legacy = generateReelScript(formData);
      break;
    case "discurso_curto":
    case "discurso_medio":
    case "discurso_longo":
      legacy = generateSpeechScript(formData);
      break;
    case "texto_instagram":
    case "legenda":
    case "carrossel":
    case "resposta_comentario":
    case "fala_bastidor":
      legacy = generateTextScript(formData);
      break;
    default:
      legacy = generateReelScript(formData);
  }

  return {
    ...legacy,
    scriptText: promptResult.scriptText,
    captionText: promptResult.captionText,
    cta: promptResult.cta,
    scenarioSuggestion: promptResult.scenarioSuggestion,
    framingSuggestion: promptResult.framingSuggestion,
    strategicNotes: promptResult.strategicNotes,
    estimatedWords: promptResult.estimatedWords,
  };
}

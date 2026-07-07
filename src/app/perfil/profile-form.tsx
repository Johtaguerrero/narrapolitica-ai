"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { createProfile, updateProfile } from "@/lib/db/profiles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface ProfileFormProps {
  profile?: {
    id: string;
    name: string;
    role: string;
    city: string;
    party: string | null;
    instagram: string;
    mainAudience: string;
    mainThemes: string;
    desiredTone: string;
    languageRules: string;
    avoidWords: string;
    useWords: string;
  };
}

interface FormData {
  name: string;
  role: string;
  city: string;
  party: string;
  instagram: string;
  mainAudience: string;
  mainThemes: string;
  desiredTone: string;
  languageRules: string;
  avoidWords: string;
  useWords: string;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormData>({
    defaultValues: profile ? {
      name: profile.name,
      role: profile.role,
      city: profile.city,
      party: profile.party || "",
      instagram: profile.instagram,
      mainAudience: profile.mainAudience,
      mainThemes: profile.mainThemes,
      desiredTone: profile.desiredTone,
      languageRules: profile.languageRules,
      avoidWords: profile.avoidWords,
      useWords: profile.useWords,
    } : undefined,
  });

  async function onSubmit(data: FormData) {
    try {
      if (profile) {
        await updateProfile(profile.id, data);
        toast.success("Perfil atualizado");
      } else {
        await createProfile(data);
        toast.success("Perfil criado");
      }
      router.push("/perfil");
      router.refresh();
    } catch {
      toast.error("Erro ao salvar perfil");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="glass">
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome público</Label>
              <Input id="name" {...register("name", { required: true })} placeholder="Nome do político" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Cargo ou pré-cargo</Label>
              <Input id="role" {...register("role", { required: true })} placeholder="Ex: Vereador, Pré-candidato" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Cidade/UF</Label>
              <Input id="city" {...register("city", { required: true })} placeholder="Ex: São Paulo/SP" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="party">Partido ou movimento (opcional)</Label>
              <Input id="party" {...register("party")} placeholder="Ex: Partido, Movimento" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram</Label>
            <Input id="instagram" {...register("instagram", { required: true })} placeholder="@usuario" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mainAudience">Público principal</Label>
            <Textarea id="mainAudience" {...register("mainAudience", { required: true })} placeholder="Ex: Jovens de periferia, servidores públicos, empreendedores locais" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mainThemes">Temas principais</Label>
            <Textarea id="mainThemes" {...register("mainThemes", { required: true })} placeholder="Ex: Educação, saúde, moradia, emprego" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="desiredTone">Tom desejado</Label>
            <Textarea id="desiredTone" {...register("desiredTone", { required: true })} placeholder="Ex: Próximo, direto, acolhedor, técnico mas acessível" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="languageRules">Restrições de linguagem</Label>
            <Textarea id="languageRules" {...register("languageRules")} placeholder="Ex: Evitar jargões jurídicos, usar linguagem inclusiva" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="avoidWords">Palavras que devem evitar</Label>
              <Textarea id="avoidWords" {...register("avoidWords")} placeholder="Palavras separadas por vírgula" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="useWords">Palavras que devem usar</Label>
              <Textarea id="useWords" {...register("useWords")} placeholder="Palavras separadas por vírgula" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
          {isSubmitting ? "Salvando..." : profile ? "Atualizar" : "Criar Perfil"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/perfil")}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

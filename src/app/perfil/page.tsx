import Link from "next/link";
import { getProfiles } from "@/lib/db/profiles";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ProfileDeleteButton } from "./profile-delete-button";

export const dynamic = "force-dynamic";

export default async function PerfilPage() {
  const profiles = await getProfiles();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Perfil Político</h1>
          <p className="text-muted-foreground mt-1">
            Cadastre o perfil do político para gerar roteiros personalizados.
          </p>
        </div>
        <Link href="/perfil/novo">
          <Button>Novo Perfil</Button>
        </Link>
      </div>

      {profiles.length === 0 ? (
        <Card className="glass">
          <CardContent className="py-16 text-center space-y-4">
            <p className="text-muted-foreground text-lg">Nenhum perfil cadastrado</p>
            <Link href="/perfil/novo">
              <Button>Cadastrar Perfil</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profiles.map((profile) => (
            <Card key={profile.id} className="glass">
              <CardHeader>
                <CardTitle>{profile.name}</CardTitle>
                <CardDescription>
                  {profile.role} · {profile.city}
                  {profile.party && ` · ${profile.party}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p><span className="text-muted-foreground">Instagram:</span> @{profile.instagram}</p>
                  <p><span className="text-muted-foreground">Público:</span> {profile.mainAudience}</p>
                  <p><span className="text-muted-foreground">Temas:</span> {profile.mainThemes}</p>
                  <p><span className="text-muted-foreground">Tom:</span> {profile.desiredTone}</p>
                </div>
                <div className="flex gap-2 mt-4">
                  <Link href={`/perfil/${profile.id}`}>
                    <Button variant="outline" size="sm">Editar</Button>
                  </Link>
                  <Link href={`/roteiro?profileId=${profile.id}`}>
                    <Button variant="outline" size="sm">Criar Roteiro</Button>
                  </Link>
                  <ProfileDeleteButton id={profile.id} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

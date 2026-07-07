import { ProfileForm } from "../profile-form";

export default function NovoPerfilPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Novo Perfil</h1>
        <p className="text-muted-foreground mt-1">Cadastre os dados do político para personalizar os roteiros.</p>
      </div>
      <ProfileForm />
    </div>
  );
}

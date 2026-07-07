import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { stylePresetsData } from "@/data/content-types";

export default function BibliotecaPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Biblioteca de Estilos</h1>
        <p className="text-muted-foreground mt-1">
          Estilos prontos de comunicação para diferentes contextos políticos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stylePresetsData.map((style) => (
          <Card key={style.id} className="glass">
            <CardHeader>
              <CardTitle className="text-lg">{style.name}</CardTitle>
              <CardDescription>{style.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Tom</h4>
                <p className="text-sm">{style.tone}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Dicas</h4>
                <p className="text-sm">{style.tips}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 border border-border">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Exemplo</h4>
                <p className="text-sm italic">&ldquo;{style.example}&rdquo;</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

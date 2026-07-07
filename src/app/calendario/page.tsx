import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calendarData } from "@/data/content-types";

const dayNames = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

export default function CalendarioPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calendário Editorial</h1>
        <p className="text-muted-foreground mt-1">
          Planejamento semanal de conteúdo para manter a comunicação consistente.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
        {[...calendarData]
          .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
          .map((day) => (
            <Card key={day.dayOfWeek} className="glass">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider">
                  {dayNames[day.dayOfWeek]}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-lg font-bold">{day.label}</div>
                <p className="text-sm text-muted-foreground">{day.description}</p>
                <div className="pt-2 space-y-2">
                  <div className="bg-muted/50 rounded p-2 text-xs text-muted-foreground border border-border">
                    <span className="font-medium text-foreground">Sugestão:</span> Prepare o conteúdo de {day.label.toLowerCase()} com antecedência
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Dicas para o Calendário</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Adapte os dias conforme a agenda do político e eventos locais.</p>
          <p>• Mantenha pelo menos 1 post institucional por semana para prestação de contas.</p>
          <p>• Alterne Reels com posts de feed para manter o engajamento.</p>
          <p>• Use os bastidores para humanizar o perfil e mostrar o dia a dia.</p>
          <p>• Reserve espaço para responder comentários e interagir com o público.</p>
          <p>• Nunca publique conteúdo enganoso ou com promessas impossíveis.</p>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center space-y-4">
        <p className="text-muted-foreground">Erro ao carregar caixa de reels.</p>
        <button onClick={reset} className="text-sm underline text-foreground">Tentar novamente</button>
      </div>
    </div>
  );
}

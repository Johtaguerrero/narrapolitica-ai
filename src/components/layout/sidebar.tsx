"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "◈" },
  { href: "/perfil", label: "Perfil Político", icon: "◇" },
  { href: "/analise", label: "Análise Instagram", icon: "◎" },
  { href: "/instagram-profiles", label: "Perfis Salvos", icon: "◆" },
  { href: "/roteiro", label: "Criar Roteiro", icon: "▷" },
  { href: "/caixa-reels", label: "Caixa de Reels", icon: "▣" },
  { href: "/biblioteca", label: "Biblioteca de Estilos", icon: "▤" },
  { href: "/discursos", label: "Discursos Salvos", icon: "▥" },
  { href: "/calendario", label: "Calendário Editorial", icon: "▦" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 lg:hidden w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center text-foreground"
        aria-label="Menu"
      >
        <span className="text-lg">{open ? "✕" : "☰"}</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-[280px] border-r border-border bg-card flex flex-col z-40 transition-transform duration-200",
          "lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 border-b border-border">
          <Link href="/dashboard" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <div className="w-9 h-9 rounded-lg bg-foreground text-background flex items-center justify-center text-sm font-bold">
              NP
            </div>
            <div>
              <h1 className="text-base font-semibold leading-tight tracking-tight">NarraPolítica</h1>
              <p className="text-xs text-muted-foreground">AI</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? "bg-foreground text-background shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Comunicação política responsável
          </p>
        </div>
      </aside>
    </>
  );
}

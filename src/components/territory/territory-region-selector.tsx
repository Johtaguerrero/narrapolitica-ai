'use client'

import { useState, useEffect } from 'react'

interface Region {
  id: string
  officialNumber: number
  romanNumber: string
  officialName: string
  slug: string
}

interface Props {
  regions: Region[]
  selectedId?: string
  onSelect: (regionId: string) => void
}

export function TerritoryRegionSelector({ regions, selectedId, onSelect }: Props) {
  const [query, setQuery] = useState('')

  const filtered = query
    ? regions.filter(r =>
        r.officialName.toLowerCase().includes(query.toLowerCase()) ||
        r.romanNumber.toLowerCase().includes(query.toLowerCase()) ||
        r.slug.includes(query.toLowerCase())
      )
    : regions

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Região Administrativa
      </label>
      <input
        className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-violet-500"
        placeholder="Buscar RA por nome ou número..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <div className="max-h-48 overflow-y-auto space-y-1 rounded-lg border border-border p-1">
        {filtered.map(r => (
          <button
            key={r.id}
            onClick={() => onSelect(r.id)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
              selectedId === r.id
                ? 'bg-foreground text-background'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            <span className="font-mono text-xs opacity-60">RA {r.romanNumber}</span>{' '}
            {r.officialName}
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="px-3 py-2 text-xs text-muted-foreground">Nenhuma região encontrada</p>
        )}
      </div>
    </div>
  )
}

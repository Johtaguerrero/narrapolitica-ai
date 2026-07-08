'use client'

import { SHORTLIST_ITEMS } from '@/types/assembly'
import { GripVertical } from 'lucide-react'

interface Props {
  onDragStart: (type: string, label: string) => void
}

export function AssemblyShortlist({ onDragStart }: Props) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
        Shortlist
      </h3>
      <div className="space-y-1">
        {SHORTLIST_ITEMS.map(item => (
          <div
            key={item.type}
            draggable
            onDragStart={e => {
              e.dataTransfer.setData('text/plain', JSON.stringify({ type: item.type, title: item.label }))
              onDragStart(item.type, item.label)
            }}
            className="flex cursor-grab items-center gap-2 rounded-lg border border-zinc-700/50 bg-zinc-900/60 px-3 py-2 text-xs text-zinc-300 transition-colors hover:border-violet-500/50 hover:bg-zinc-800/60 active:cursor-grabbing"
          >
            <GripVertical className="h-3 w-3 text-zinc-600" />
            {item.label}
          </div>
        ))}
      </div>
    </div>
  )
}

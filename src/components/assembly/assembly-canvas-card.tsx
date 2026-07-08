'use client'

import { useRef, useCallback } from 'react'
import { X, Copy, GripHorizontal, Edit3 } from 'lucide-react'

interface Props {
  id: string
  type: string
  title: string
  content: string
  x: number
  y: number
  color?: string
  isSelected?: boolean
  onMove: (id: string, x: number, y: number) => void
  onEdit: (id: string) => void
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
  onSelect: (id: string) => void
}

const CARD_COLORS: Record<string, string> = {
  gancho_inicial: '#8b5cf6',
  cena_principal: '#3b82f6',
  cena_apoio: '#10b981',
  bastidor: '#f59e0b',
  entrevistado: '#ec4899',
  cta: '#ef4444',
  legenda: '#06b6d4',
  default: '#6366f1',
}

export function AssemblyCanvasCard({
  id, type, title, content, x, y, color,
  isSelected, onMove, onEdit, onDuplicate, onDelete, onSelect,
}: Props) {
  const dragRef = useRef({ startX: 0, startY: 0, cardX: 0, cardY: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onSelect(id)
    dragRef.current.startX = e.clientX
    dragRef.current.startY = e.clientY
    dragRef.current.cardX = x
    dragRef.current.cardY = y

    const handleMouseMove = (ev: MouseEvent) => {
      const dx = ev.clientX - dragRef.current.startX
      const dy = ev.clientY - dragRef.current.startY
      onMove(id, dragRef.current.cardX + dx, dragRef.current.cardY + dy)
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleUp)
    }

    const handleUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleUp)
  }, [id, x, y, onMove, onSelect])

  const accent = color || CARD_COLORS[type] || CARD_COLORS.default

  return (
    <div
      ref={cardRef}
      className={`absolute cursor-default rounded-xl border p-3 shadow-lg transition-shadow ${
        isSelected
          ? 'border-violet-500 shadow-violet-500/20'
          : 'border-zinc-700/50 shadow-black/20'
      }`}
      style={{
        left: x, top: y, width: 200,
        background: 'rgba(24,24,27,0.92)',
        backdropFilter: 'blur(12px)',
      }}
      onMouseDown={() => onSelect(id)}
    >
      <div
        className="mb-2 flex cursor-grab items-center gap-1.5 active:cursor-grabbing"
        onMouseDown={handleMouseDown}
      >
        <GripHorizontal className="h-3 w-3 text-zinc-600" />
        <span
          className="rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
          style={{ background: accent, color: '#fff' }}
        >
          {type.replace(/_/g, ' ')}
        </span>
      </div>
      <div className="mb-2 text-xs font-medium text-zinc-200">{title}</div>
      {content && (
        <div className="mb-2 text-[11px] leading-relaxed text-zinc-400">{content}</div>
      )}
      <div className="flex items-center justify-end gap-1 border-t border-zinc-800 pt-1.5">
        <button onClick={() => onEdit(id)} className="rounded p-1 text-zinc-600 hover:text-zinc-300">
          <Edit3 className="h-3 w-3" />
        </button>
        <button onClick={() => onDuplicate(id)} className="rounded p-1 text-zinc-600 hover:text-zinc-300">
          <Copy className="h-3 w-3" />
        </button>
        <button onClick={() => onDelete(id)} className="rounded p-1 text-zinc-600 hover:text-red-400">
          <X className="h-3 w-3" />
        </button>
      </div>
    </div>
  )
}

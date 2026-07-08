'use client'

import { useRef, useCallback, useState, useEffect } from 'react'
import { AssemblyCanvasCard } from './assembly-canvas-card'
import type { AssemblyCanvasCard as CardType } from '@/types/assembly'

interface Props {
  items: CardType[]
  selectedId: string | null
  onItemsChange: (items: CardType[]) => void
  onSelect: (id: string | null) => void
  onEditCard: (id: string) => void
}

export function AssemblyInfiniteCanvas({ items, selectedId, onItemsChange, onSelect, onEditCard }: Props) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const panStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 })
  const [dropHighlight, setDropHighlight] = useState(false)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDropHighlight(false)
    const raw = e.dataTransfer.getData('text/plain')
    if (!raw) return
    try {
      const data = JSON.parse(raw)
      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return
      const newItem: CardType = {
        id: `card_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        type: data.type,
        title: data.title,
        content: '',
        x: e.clientX - rect.left + pan.x - 100,
        y: e.clientY - rect.top + pan.y - 50,
        width: 200,
        height: 100,
        position: items.length,
        color: '',
        metadata: '',
      }
      onItemsChange([...items, newItem])
    } catch { /* ignore */ }
  }, [items, onItemsChange, pan])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDropHighlight(true)
  }, [])

  const handleDragLeave = useCallback(() => setDropHighlight(false), [])

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[class*="canvas-card"]')) return
    onSelect(null)
    if (e.button === 0) {
      setIsPanning(true)
      panStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y }
    }
  }, [onSelect, pan])

  useEffect(() => {
    if (!isPanning) return
    const handleMove = (e: MouseEvent) => {
      setPan({
        x: panStart.current.panX - (e.clientX - panStart.current.x),
        y: panStart.current.panY - (e.clientY - panStart.current.y),
      })
    }
    const handleUp = () => setIsPanning(false)
    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseup', handleUp)
    return () => {
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', handleUp)
    }
  }, [isPanning])

  const handleMove = useCallback((id: string, nx: number, ny: number) => {
    onItemsChange(items.map(i => i.id === id ? { ...i, x: nx, y: ny } : i))
  }, [items, onItemsChange])

  const handleDuplicate = useCallback((id: string) => {
    const item = items.find(i => i.id === id)
    if (!item) return
    const newItem: CardType = {
      ...item,
      id: `card_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      x: item.x + 30,
      y: item.y + 30,
      position: items.length,
    }
    onItemsChange([...items, newItem])
  }, [items, onItemsChange])

  const handleDelete = useCallback((id: string) => {
    onItemsChange(items.filter(i => i.id !== id))
    if (selectedId === id) onSelect(null)
  }, [items, onItemsChange, selectedId, onSelect])

  const handleSelect = useCallback((id: string) => {
    onSelect(id)
  }, [onSelect])

  return (
    <div
      ref={canvasRef}
      className={`relative h-full w-full overflow-hidden rounded-xl ${
        isPanning ? 'cursor-grabbing' : 'cursor-default'
      } ${dropHighlight ? 'ring-2 ring-violet-500/30' : ''}`}
      style={{ background: 'rgba(24,24,27,0.3)', minHeight: '500px' }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onMouseDown={handleCanvasMouseDown}
    >
      <div
        style={{
          transform: `translate(${-pan.x}px, ${-pan.y}px)`,
          width: '4000px',
          height: '4000px',
          position: 'relative',
        }}
      >
        {items.map(item => (
          <AssemblyCanvasCard
            key={item.id}
            {...item}
            isSelected={selectedId === item.id}
            onMove={handleMove}
            onEdit={onEditCard}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
            onSelect={handleSelect}
          />
        ))}
      </div>
      {items.length === 0 && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <p className="text-sm text-zinc-600">Arraste cards da shortlist para o canvas</p>
        </div>
      )}
    </div>
  )
}

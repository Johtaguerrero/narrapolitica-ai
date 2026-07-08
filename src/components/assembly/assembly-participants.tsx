'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import type { AssemblyParticipantData } from '@/types/assembly'

interface Props {
  participants: AssemblyParticipantData[]
  onAdd: (data: { name: string; role: string; phone?: string; instagram?: string; responsibility?: string }) => void
  onUpdate: (id: string, data: Record<string, unknown>) => void
  onDelete: (id: string) => void
}

export function AssemblyParticipants({ participants, onAdd, onUpdate, onDelete }: Props) {
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [showForm, setShowForm] = useState(false)

  const handleAdd = () => {
    if (!name.trim()) return
    onAdd({ name: name.trim(), role: role.trim() })
    setName('')
    setRole('')
    setShowForm(false)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Participantes</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 rounded-lg border border-zinc-700 px-2 py-1 text-[11px] text-zinc-400 hover:text-zinc-200"
        >
          <Plus className="h-3 w-3" /> Adicionar
        </button>
      </div>

      {showForm && (
        <div className="space-y-2 rounded-lg border border-zinc-700 bg-zinc-900/60 p-3">
          <input
            className="w-full rounded border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-xs text-zinc-200 outline-none focus:border-violet-500"
            placeholder="Nome"
            value={name} onChange={e => setName(e.target.value)}
          />
          <input
            className="w-full rounded border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-xs text-zinc-200 outline-none focus:border-violet-500"
            placeholder="Função"
            value={role} onChange={e => setRole(e.target.value)}
          />
          <button
            onClick={handleAdd}
            className="w-full rounded-lg bg-violet-600 py-1.5 text-xs font-medium text-white hover:bg-violet-500"
          >
            Salvar
          </button>
        </div>
      )}

      {participants.length === 0 && !showForm && (
        <p className="text-[11px] text-zinc-600">Nenhum participante adicionado</p>
      )}

      <div className="space-y-1">
        {participants.map(p => (
          <div key={p.id} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/40 px-3 py-2">
            <div>
              <p className="text-xs font-medium text-zinc-200">{p.name}</p>
              <p className="text-[11px] text-zinc-500">{p.role}</p>
            </div>
            <div className="flex items-center gap-2">
              <select
                className="rounded border border-zinc-700 bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-300 outline-none"
                value={p.status}
                onChange={e => onUpdate(p.id, { status: e.target.value })}
              >
                <option value="pendente">Pendente</option>
                <option value="confirmado">Confirmado</option>
                <option value="cancelado">Cancelado</option>
              </select>
              <button onClick={() => onDelete(p.id)} className="text-zinc-600 hover:text-red-400">
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import type { AssemblyIntervieweeData } from '@/types/assembly'

interface Props {
  interviewees: AssemblyIntervieweeData[]
  disabled?: boolean
  onAdd: (data: { name: string; profile?: string; speechTheme?: string; mainQuestion?: string; supportQuestions?: string }) => void
  onUpdate: (id: string, data: Record<string, unknown>) => void
  onDelete: (id: string) => void
}

export function AssemblyInterviewees({ interviewees, disabled, onAdd, onUpdate, onDelete }: Props) {
  const [name, setName] = useState('')
  const [profile, setProfile] = useState('')
  const [showForm, setShowForm] = useState(false)

  const handleAdd = () => {
    if (!name.trim()) return
    onAdd({ name: name.trim(), profile: profile.trim() })
    setName('')
    setProfile('')
    setShowForm(false)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Entrevistados</h3>
        {!disabled && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1 rounded-lg border border-zinc-700 px-2 py-1 text-[11px] text-zinc-400 hover:text-zinc-200"
          >
            <Plus className="h-3 w-3" /> Adicionar
          </button>
        )}
      </div>

      {disabled && (
        <p className="text-[11px] text-zinc-600">Vídeo solo — seção de entrevistados oculta</p>
      )}

      {showForm && !disabled && (
        <div className="space-y-2 rounded-lg border border-zinc-700 bg-zinc-900/60 p-3">
          <input
            className="w-full rounded border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-xs text-zinc-200 outline-none focus:border-violet-500"
            placeholder="Nome"
            value={name} onChange={e => setName(e.target.value)}
          />
          <input
            className="w-full rounded border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-xs text-zinc-200 outline-none focus:border-violet-500"
            placeholder="Perfil"
            value={profile} onChange={e => setProfile(e.target.value)}
          />
          <button
            onClick={handleAdd}
            className="w-full rounded-lg bg-violet-600 py-1.5 text-xs font-medium text-white hover:bg-violet-500"
          >
            Salvar
          </button>
        </div>
      )}

      {interviewees.length === 0 && !showForm && !disabled && (
        <p className="text-[11px] text-zinc-600">Nenhum entrevistado adicionado</p>
      )}

      <div className="space-y-1">
        {interviewees.map(i => (
          <div key={i.id} className="rounded-lg border border-zinc-800 bg-zinc-900/40 px-3 py-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-zinc-200">{i.name}</p>
                {i.profile && <p className="text-[11px] text-zinc-500">{i.profile}</p>}
              </div>
              <div className="flex items-center gap-2">
                <select
                  className="rounded border border-zinc-700 bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-300 outline-none"
                  value={i.imageAuthorizationStatus}
                  onChange={e => onUpdate(i.id, { imageAuthorizationStatus: e.target.value })}
                >
                  <option value="pendente">Autorização pendente</option>
                  <option value="sim">Autorizado</option>
                  <option value="nao">Não autorizado</option>
                </select>
                <button onClick={() => onDelete(i.id)} className="text-zinc-600 hover:text-red-400">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
            {i.mainQuestion && (
              <p className="mt-1 text-[11px] text-zinc-400">Pergunta: {i.mainQuestion}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

'use client'

import { useRouter } from 'next/navigation'

interface Profile {
  id: string
  name: string
  instagram: string
}

interface Props {
  profiles: Profile[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function AssemblyProfileSelector({ profiles, selectedId, onSelect }: Props) {
  const router = useRouter()

  return (
    <select
      className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-violet-500"
      value={selectedId || ''}
      onChange={e => {
        const val = e.target.value
        if (val) onSelect(val)
      }}
    >
      <option value="" disabled>Selecionar perfil salvo</option>
      {profiles.map(p => (
        <option key={p.id} value={p.id}>
          {p.name} (@{p.instagram})
        </option>
      ))}
    </select>
  )
}

'use client'

interface Script {
  id: string
  title: string
  type: string
}

interface Props {
  scripts: Script[]
  selectedId: string | null
  onSelect: (id: string) => void
  disabled?: boolean
}

export function AssemblyScriptSelector({ scripts, selectedId, onSelect, disabled }: Props) {
  return (
    <select
      className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-violet-500 disabled:opacity-50"
      value={selectedId || ''}
      onChange={e => { const val = e.target.value; if (val) onSelect(val) }}
      disabled={disabled}
    >
      <option value="" disabled>Selecionar roteiro</option>
      {scripts.map(s => (
        <option key={s.id} value={s.id}>
          {s.title} ({s.type})
        </option>
      ))}
    </select>
  )
}

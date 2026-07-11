'use client'

import { VIDEO_TYPE_OPTIONS, STRATEGY_STATUS_OPTIONS } from '@/types/assembly'

interface Region {
  id: string
  officialNumber: number
  romanNumber: string
  officialName: string
  slug: string
}

interface Props {
  videoType: string
  objective: string
  centralMessage: string
  visualHook: string
  firstLine: string
  recordingLocation: string
  recordingAddress: string
  recordingDate: string | null
  recordingTime: string | null
  postingDate: string | null
  postingTime: string | null
  status: string
  notes: string
  administrativeRegionId: string | null
  alternativeLocation: string | null
  recordingReferencePoint: string | null
  regions: Region[]
  onChange: (field: string, value: string) => void
}

export function AssemblyDetailsPanel(props: Props) {
  const { onChange } = props

  const field = (label: string, key: string, type: 'text' | 'textarea' | 'select' = 'text', opts?: { value: string; label: string }[]) => {
    const value = (props as unknown as Record<string, string>)[key] ?? ''
    return (
      <div className="space-y-1">
        <label className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">{label}</label>
        {type === 'select' && opts ? (
          <select
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-200 outline-none focus:border-violet-500"
            value={value}
            onChange={e => onChange(key, e.target.value)}
          >
            {opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        ) : type === 'textarea' ? (
          <textarea
            className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-200 outline-none focus:border-violet-500"
            rows={2}
            value={value}
            onChange={e => onChange(key, e.target.value)}
          />
        ) : (
          <input
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-200 outline-none focus:border-violet-500"
            type={key.includes('Date') || key.includes('Time') ? key.includes('Date') ? 'date' : 'time' : 'text'}
            value={value}
            onChange={e => onChange(key, e.target.value)}
          />
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
        Estratégia de filmagem
      </h3>

      {field('Tipo de vídeo', 'videoType', 'select', VIDEO_TYPE_OPTIONS)}
      {field('Status', 'status', 'select', STRATEGY_STATUS_OPTIONS)}
      {field('Objetivo da gravação', 'objective', 'textarea')}
      {field('Mensagem central', 'centralMessage', 'textarea')}
      {field('Gancho visual', 'visualHook')}
      {field('Primeira frase', 'firstLine')}
      <div className="border-t border-zinc-800 pt-4">
        <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Local & Data</h4>
        {field('Local da gravação', 'recordingLocation')}
        {field('Endereço', 'recordingAddress')}
        {field('Data da gravação', 'recordingDate')}
        {field('Horário', 'recordingTime')}
        {field('Data de postagem', 'postingDate')}
        {field('Horário de postagem', 'postingTime')}
      </div>
      <div className="border-t border-zinc-800 pt-4">
        <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Território</h4>
        <div className="space-y-1">
          <label className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">Região Administrativa</label>
          <select className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-200 outline-none focus:border-violet-500"
            value={props.administrativeRegionId || ''} onChange={e => onChange('administrativeRegionId', e.target.value)}>
            <option value="">Nenhuma</option>
            {props.regions.map(r => (
              <option key={r.id} value={r.id}>RA {r.romanNumber} — {r.officialName}</option>
            ))}
          </select>
        </div>
        {field('Local alternativo', 'alternativeLocation')}
        {field('Ponto de referência', 'recordingReferencePoint')}
      </div>
      {field('Observações estratégicas', 'notes', 'textarea')}
    </div>
  )
}

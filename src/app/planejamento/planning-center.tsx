'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import {
  saveCalendarItems, deleteCalendarItem, updateCalendarItem,
  getCalendarItems, getScriptsByProfileForCalendar,
} from '@/lib/planning/planning-actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { ChevronLeft, ChevronRight, Plus, Search, Download, MapPin, Clock, GripVertical } from 'lucide-react'

const DAY_NAMES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const DAY_NAMES_FULL = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']
const MONTH_NAMES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

const STATUS_COLORS: Record<string, string> = {
  ideia: 'bg-zinc-500',
  roteiro: 'bg-sky-500',
  planejamento: 'bg-violet-500',
  gravacao: 'bg-amber-500',
  edicao: 'bg-orange-500',
  revisao: 'bg-rose-500',
  agendado: 'bg-blue-500',
  publicado: 'bg-emerald-500',
  arquivado: 'bg-zinc-600',
}

const CONTENT_TYPE_COLORS: Record<string, string> = {
  reels: '#8b5cf6',
  stories: '#06b6d4',
  carrossel: '#f59e0b',
  discurso: '#ef4444',
  institucional: '#3b82f6',
  rua: '#10b981',
  entrevista: '#ec4899',
  prestacao_contas: '#6366f1',
}

const WORKFLOW_STEPS = ['ideia', 'roteiro', 'planejamento', 'gravacao', 'edicao', 'revisao', 'agendado', 'publicado', 'arquivado']
const WORKFLOW_LABELS: Record<string, string> = {
  ideia: 'Ideia', roteiro: 'Roteiro', planejamento: 'Planejamento',
  gravacao: 'Gravação', edicao: 'Edição', revisao: 'Revisão',
  agendado: 'Agendado', publicado: 'Publicado', arquivado: 'Arquivado',
}

interface CalendarItem {
  id: string
  profileId: string | null
  scriptId: string | null
  assemblyStrategyId: string | null
  scheduledDate: string | null
  scheduledTime: string | null
  month: number | null
  day: number | null
  dayOfWeek: number
  label: string
  description: string
  contentType: string
  territoryName: string | null
  status: string
  color: string
  priority: string
  notes: string | null
  checklist: string | null
  responsible: string | null
}

type ViewMode = 'month' | 'week' | 'agenda'

export function PlanningCenter({ profiles }: { profiles: Array<{ id: string; name: string }> }) {
  const today = new Date()
  const [profileId, setProfileId] = useState(profiles.length > 0 ? profiles[0].id : '')
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [viewMode, setViewMode] = useState<ViewMode>('month')
  const [items, setItems] = useState<CalendarItem[]>([])
  const [scripts, setScripts] = useState<Array<{ id: string; title: string; type: string; theme: string; duration: string; territoryName?: string; status: string; createdAt: string }>>([])
  const [selectedDay, setSelectedDay] = useState<{ date: string; items: CalendarItem[] } | null>(null)
  const [search, setSearch] = useState('')
  const dragRef = useRef<string | null>(null)
  const [loading, setLoading] = useState(false)

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startPad = firstDay.getDay()
  const daysInMonth = lastDay.getDate()
  const totalCells = Math.ceil((startPad + daysInMonth) / 7) * 7

  const calendarDays = useMemo(() => {
    const cells: Array<{ day: number; date: string; isCurrent: boolean; items: CalendarItem[] }> = []
    for (let i = 0; i < totalCells; i++) {
      const dayNum = i - startPad + 1
      const isCurrent = dayNum >= 1 && dayNum <= daysInMonth
      const dateStr = isCurrent ? `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}` : ''
      cells.push({
        day: dayNum,
        date: dateStr,
        isCurrent,
        items: isCurrent ? items.filter(item => item.scheduledDate === dateStr) : [],
      })
    }
    return cells
  }, [items, year, month, startPad, daysInMonth, totalCells])

  const weekDays = useMemo(() => {
    const startOfWeek = new Date(viewDate)
    const day = startOfWeek.getDay()
    startOfWeek.setDate(startOfWeek.getDate() - day)
    const days = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek)
      d.setDate(d.getDate() + i)
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      days.push({ date: dateStr, day: d.getDate(), name: DAY_NAMES[i], items: items.filter(item => item.scheduledDate === dateStr) })
    }
    return days
  }, [items, viewDate])

  const agendaItems = useMemo(() => {
    return [...items]
      .filter(item => item.scheduledDate)
      .sort((a, b) => (a.scheduledDate || '').localeCompare(b.scheduledDate || ''))
  }, [items])

  const loadItems = useCallback(async (): Promise<CalendarItem[]> => {
    if (!profileId) { setItems([]); return [] }
    setLoading(true)
    const data = await getCalendarItems(profileId)
    setItems(data as CalendarItem[])
    setLoading(false)
    return data as CalendarItem[]
  }, [profileId])

  const loadScripts = useCallback(async () => {
    if (!profileId) { setScripts([]); return }
    const data = await getScriptsByProfileForCalendar(profileId)
    setScripts(data.map(s => ({
      id: s.id, title: s.title, type: s.type, theme: s.theme,
      duration: s.duration, territoryName: s.territoryName || undefined,
      status: 'ideia', createdAt: s.createdAt.toISOString(),
    })))
  }, [profileId])

  useEffect(() => { loadItems(); loadScripts() }, [loadItems, loadScripts])

  const filteredScripts = useMemo(() => {
    if (!search) return scripts
    const q = search.toLowerCase()
    return scripts.filter(s =>
      s.title?.toLowerCase().includes(q) ||
      s.theme?.toLowerCase().includes(q) ||
      s.type?.toLowerCase().includes(q)
    )
  }, [scripts, search])

  const handlePrev = () => {
    const d = new Date(viewDate)
    if (viewMode === 'month') d.setMonth(d.getMonth() - 1)
    else d.setDate(d.getDate() - 7)
    setViewDate(d)
  }

  const handleNext = () => {
    const d = new Date(viewDate)
    if (viewMode === 'month') d.setMonth(d.getMonth() + 1)
    else d.setDate(d.getDate() + 7)
    setViewDate(d)
  }

  const handleDragStart = (e: React.DragEvent, scriptId: string) => {
    e.dataTransfer.setData('text/plain', scriptId)
    e.dataTransfer.effectAllowed = 'copy'
    dragRef.current = scriptId
  }

  const clearDragHighlight = () => {
    document.querySelectorAll('.calendar-cell-dragover').forEach(el => el.classList.remove('calendar-cell-dragover'))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  const handleCellDragEnter = (e: React.DragEvent, dateStr: string) => {
    e.preventDefault()
    clearDragHighlight()
    const cell = e.currentTarget as HTMLElement
    cell.classList.add('calendar-cell-dragover')
  }

  const handleCellDragLeave = (e: React.DragEvent) => {
    const cell = e.currentTarget as HTMLElement
    cell.classList.remove('calendar-cell-dragover')
  }

  const handleDrop = async (e: React.DragEvent, dateStr: string) => {
    e.preventDefault()
    clearDragHighlight()
    const scriptId = e.dataTransfer.getData('text/plain') || dragRef.current
    if (!scriptId || !profileId) return
    const script = scripts.find(s => s.id === scriptId)
    if (!script) return

    const d = new Date(dateStr + 'T12:00:00')
    await saveCalendarItems([{
      profileId,
      scriptId,
      scheduledDate: dateStr,
      dayOfWeek: d.getDay(),
      month: d.getMonth() + 1,
      day: d.getDate(),
      label: script.title,
      contentType: script.type,
      color: CONTENT_TYPE_COLORS[script.type] || '#6366f1',
      status: 'ideia',
    }])

    dragRef.current = null
    toast.success(`Roteiro adicionado em ${dateStr}`)

    const freshItems = await loadItems()
    if (selectedDay && selectedDay.date === dateStr) {
      setSelectedDay({ date: dateStr, items: freshItems.filter(i => i.scheduledDate === dateStr) })
    }
  }

  const handleDayClick = (date: string) => {
    setSelectedDay({ date, items: items.filter(i => i.scheduledDate === date) })
  }

  const handleStatusChange = async (itemId: string, status: string) => {
    await updateCalendarItem(itemId, { status })
    const freshItems = await loadItems()
    if (selectedDay) {
      setSelectedDay({ date: selectedDay.date, items: freshItems.filter(i => i.scheduledDate === selectedDay.date) })
    }
    toast.success(`Status alterado para ${WORKFLOW_LABELS[status]}`)
  }

  const handleDelete = async (id: string) => {
    await deleteCalendarItem(id)
    const freshItems = await loadItems()
    if (selectedDay) {
      setSelectedDay({ date: selectedDay.date, items: freshItems.filter(i => i.scheduledDate === selectedDay.date) })
    }
    toast.success('Item removido do calendário')
  }

  const contentTypeLabel = (t: string) => {
    const labels: Record<string, string> = {
      reels: 'Reels', stories: 'Stories', carrossel: 'Carrossel',
      discurso: 'Discurso', institucional: 'Institucional', rua: 'Rua',
      entrevista: 'Entrevista', prestacao_contas: 'Prestação de Contas',
    }
    return labels[t] || t
  }

  const statusColor = (s: string) => STATUS_COLORS[s] || 'bg-zinc-500'
  const statusLabel = (s: string) => WORKFLOW_LABELS[s] || s

  const indicators = useMemo(() => {
    const total = items.length
    const byStatus: Record<string, number> = {}
    const byType: Record<string, number> = {}
    items.forEach(i => {
      byStatus[i.status] = (byStatus[i.status] || 0) + 1
      byType[i.contentType] = (byType[i.contentType] || 0) + 1
    })
    return { total, byStatus, byType }
  }, [items])

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex items-center gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Centro de Planejamento</h1>
          <p className="text-muted-foreground mt-1 text-sm">Organize toda a produção de conteúdo por perfil</p>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <select
            className="h-9 px-3 rounded-lg border border-border bg-card text-sm max-w-[200px]"
            value={profileId}
            onChange={e => setProfileId(e.target.value)}
          >
            <option value="">Selecionar perfil</option>
            {profiles.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <div className="flex items-center border border-border rounded-lg">
            {(['month', 'week', 'agenda'] as ViewMode[]).map(m => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  viewMode === m ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'
                } ${m === 'month' ? 'rounded-l-lg' : ''} ${m === 'agenda' ? 'rounded-r-lg' : ''}`}
              >
                {m === 'month' ? 'Mês' : m === 'week' ? 'Semana' : 'Agenda'}
              </button>
            ))}
          </div>

          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground">
            <Download size={14} /> Exportar
          </button>
        </div>
      </div>

      {/* Indicators */}
      {profileId && (
        <div className="flex flex-wrap gap-3 text-xs">
          <span className="text-muted-foreground">{indicators.total} itens</span>
          {Object.entries(indicators.byStatus).map(([s, c]) => (
            <span key={s} className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${statusColor(s)}`} />
              {statusLabel(s)}: {c}
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-4">
        {/* Left: Available Scripts */}
        {profileId && (
          <div className="w-64 shrink-0 space-y-3">
            <Card className="glass">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Roteiros Disponíveis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    className="w-full pl-7 pr-3 py-1.5 rounded-lg border border-border bg-card text-xs outline-none focus:border-violet-500"
                    placeholder="Buscar roteiro..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>

                <div className="max-h-[calc(100vh-320px)] overflow-y-auto space-y-1.5">
                  {filteredScripts.map(s => (
                    <div
                      key={s.id}
                      draggable
                      onDragStart={e => handleDragStart(e, s.id)}
                      className="group cursor-grab active:cursor-grabbing rounded-lg border border-border bg-card px-3 py-2 text-xs hover:border-violet-500/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-medium text-foreground truncate">{s.title}</span>
                        <GripVertical className="h-3.5 w-3.5 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100" />
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-400">{contentTypeLabel(s.type)}</span>
                        <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-400">{s.theme}</span>
                        <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-400">{s.duration}</span>
                      </div>
                      {s.territoryName && (
                        <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground">
                          <MapPin size={10} /> {s.territoryName}
                        </div>
                      )}
                      <div className="text-[10px] text-muted-foreground mt-1">
                        {s.createdAt ? new Date(s.createdAt).toLocaleDateString('pt-BR') : ''}
                      </div>
                    </div>
                  ))}
                  {filteredScripts.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-4">
                      {search ? 'Nenhum roteiro encontrado' : 'Nenhum roteiro salvo'}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main area */}
        <div className="flex-1 min-w-0">
          {!profileId ? (
            <Card className="glass">
              <CardContent className="py-16 text-center">
                <p className="text-muted-foreground">Selecione um perfil para começar o planejamento.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Month/Week navigation */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button onClick={handlePrev} className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground">
                    <ChevronLeft size={18} />
                  </button>
                  <h2 className="text-lg font-semibold">
                    {viewMode === 'month'
                      ? `${MONTH_NAMES[month]} ${year}`
                      : `${MONTH_NAMES[viewDate.getMonth()]} ${viewDate.getFullYear()}`
                    }
                  </h2>
                  <button onClick={handleNext} className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground">
                    <ChevronRight size={18} />
                  </button>
                  <button
                    onClick={() => setViewDate(new Date())}
                    className="px-3 py-1 text-xs rounded-lg border border-border text-muted-foreground hover:text-foreground"
                  >
                    Hoje
                  </button>
                </div>
              </div>

              {/* Month view */}
              {viewMode === 'month' && (
                <div className="rounded-xl border border-border overflow-hidden">
                  <div className="grid grid-cols-7 bg-card border-b border-border">
                    {DAY_NAMES.map(d => (
                      <div key={d} className="px-2 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-center">
                        {d}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7">
                    {calendarDays.map((cell, idx) => (
                      <div
                        key={idx}
                        onDragOver={handleDragOver}
                        onDragEnter={e => { cell.date && handleCellDragEnter(e, cell.date) }}
                        onDragLeave={handleCellDragLeave}
                        onDrop={e => { cell.date && handleDrop(e, cell.date) }}
                        onClick={() => cell.date && handleDayClick(cell.date)}
                        className={`min-h-[100px] border-b border-r border-border p-1.5 cursor-pointer transition-colors hover:bg-accent/30 ${
                          !cell.isCurrent ? 'bg-muted/20' : ''
                        } ${cell.date === today.toISOString().slice(0, 10) ? 'bg-violet-500/5' : ''}`}
                      >
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                          cell.date === today.toISOString().slice(0, 10) ? 'bg-violet-600 text-white font-bold' : 'text-muted-foreground'
                        }`}>
                          {cell.isCurrent ? cell.day : ''}
                        </span>
                        <div className="space-y-0.5 mt-0.5">
                          {cell.items.slice(0, 3).map(item => (
                            <div
                              key={item.id}
                              className="flex items-center gap-1 px-1 py-0.5 rounded text-[10px] truncate"
                              style={{ backgroundColor: item.color + '20', color: item.color }}
                              title={item.label}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusColor(item.status)}`} />
                              <span className="truncate">{item.label}</span>
                            </div>
                          ))}
                          {cell.items.length > 3 && (
                            <span className="text-[10px] text-muted-foreground pl-1">+{cell.items.length - 3} mais</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Week view */}
              {viewMode === 'week' && (
                <div className="rounded-xl border border-border overflow-hidden">
                  <div className="grid grid-cols-7 bg-card border-b border-border">
                    {weekDays.map(w => (
                      <div key={w.date} className="px-2 py-2 text-center">
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{w.name}</div>
                        <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm mt-1 ${
                          w.date === today.toISOString().slice(0, 10) ? 'bg-violet-600 text-white font-bold' : ''
                        }`}>
                          {w.day}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7">
                    {weekDays.map((w, idx) => (
                      <div
                        key={idx}
                        onDragOver={handleDragOver}
                        onDragEnter={e => { handleCellDragEnter(e, w.date) }}
                        onDragLeave={handleCellDragLeave}
                        onDrop={e => { handleDrop(e, w.date) }}
                        onClick={() => handleDayClick(w.date)}
                        className="min-h-[300px] border-r border-border p-1.5 cursor-pointer hover:bg-accent/30 transition-colors"
                      >
                        <div className="space-y-1">
                          {w.items.map(item => (
                            <div
                              key={item.id}
                              className="px-1.5 py-1 rounded text-xs"
                              style={{ backgroundColor: item.color + '20', color: item.color }}
                            >
                              {item.scheduledTime && <span className="font-mono">{item.scheduledTime} </span>}
                              <span className="font-medium">{item.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Agenda view */}
              {viewMode === 'agenda' && (
                <div className="space-y-2">
                  {agendaItems.length === 0 ? (
                    <Card className="glass"><CardContent className="py-8 text-center text-muted-foreground text-sm">Nenhum item agendado</CardContent></Card>
                  ) : (
                    agendaItems.map(item => (
                      <div key={item.id} className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
                        <span className="text-xs text-muted-foreground font-mono w-24">{item.scheduledDate}</span>
                        <span className={`w-2 h-2 rounded-full ${statusColor(item.status)}`} />
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium">{item.label}</span>
                          <div className="flex gap-2 text-xs text-muted-foreground mt-0.5">
                            <span>{contentTypeLabel(item.contentType)}</span>
                            {item.territoryName && <span>· {item.territoryName}</span>}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Day detail panel */}
        {selectedDay && (
          <div className="w-80 shrink-0 space-y-3">
            <Card className="glass">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-semibold">
                  {new Date(selectedDay.date + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </CardTitle>
                <button onClick={() => setSelectedDay(null)} className="text-muted-foreground hover:text-foreground text-xs">×</button>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
                {selectedDay.items.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">Nenhum conteúdo neste dia</p>
                ) : (
                  selectedDay.items.map(item => (
                    <div key={item.id} className="rounded-lg border border-border bg-card p-3 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-sm font-medium">{item.label}</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="px-1.5 py-0.5 rounded text-[10px]" style={{ backgroundColor: item.color + '20', color: item.color }}>
                              {contentTypeLabel(item.contentType)}
                            </span>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] ${statusColor(item.status)} text-white`}>
                              {statusLabel(item.status)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {item.territoryName && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin size={12} /> {item.territoryName}
                        </div>
                      )}
                      {item.scheduledTime && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock size={12} /> {item.scheduledTime}
                        </div>
                      )}

                      {item.description && (
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      )}

                      {/* Workflow */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Status</label>
                        <select
                          value={item.status}
                          onChange={e => handleStatusChange(item.id, e.target.value)}
                          className="w-full rounded-lg border border-border bg-card px-2 py-1 text-xs outline-none focus:border-violet-500"
                        >
                          {WORKFLOW_STEPS.map(s => (
                            <option key={s} value={s}>{WORKFLOW_LABELS[s]}</option>
                          ))}
                        </select>
                      </div>

                      {/* Workflow progress */}
                      <div className="flex gap-0.5">
                        {WORKFLOW_STEPS.map(s => (
                          <div
                            key={s}
                            className={`h-1 flex-1 rounded-full transition-colors ${
                              WORKFLOW_STEPS.indexOf(item.status) >= WORKFLOW_STEPS.indexOf(s) ? statusColor(s) : 'bg-zinc-800'
                            }`}
                            title={WORKFLOW_LABELS[s]}
                          />
                        ))}
                      </div>

                      {/* Notes */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Notas
                        </label>
                        <textarea
                          className="w-full resize-none rounded-lg border border-border bg-card px-2 py-1 text-xs outline-none focus:border-violet-500"
                          rows={2}
                          placeholder="Anotações para este conteúdo..."
                          value={item.notes || ''}
                          onChange={async e => {
                            await updateCalendarItem(item.id, { notes: e.target.value })
                            loadItems()
                          }}
                        />
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-[10px] text-red-400 hover:text-red-300"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Stats bar */}
      {profileId && viewMode === 'month' && Object.keys(indicators.byType).length > 0 && (
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground border-t border-border pt-3">
          <span className="font-medium text-foreground">Resumo:</span>
          {Object.entries(indicators.byType).map(([t, c]) => (
            <span key={t} className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CONTENT_TYPE_COLORS[t] || '#666' }} />
              {contentTypeLabel(t)}: {c}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

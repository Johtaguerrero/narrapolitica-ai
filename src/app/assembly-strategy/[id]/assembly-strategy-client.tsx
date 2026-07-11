'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AssemblyMergedProfileSelector } from '@/components/assembly/assembly-merged-profile-selector'
import { AssemblyScriptSelector } from '@/components/assembly/assembly-script-selector'
import { AssemblyShortlist } from '@/components/assembly/assembly-shortlist'
import { AssemblyInfiniteCanvas } from '@/components/assembly/assembly-infinite-canvas'
import { AssemblyDetailsPanel } from '@/components/assembly/assembly-details-panel'
import { AssemblyParticipants } from '@/components/assembly/assembly-participants'
import { AssemblyInterviewees } from '@/components/assembly/assembly-interviewees'
import { AssemblyExportButton } from '@/components/assembly/assembly-export-button'
import {
  updateStrategy, deleteStrategy, saveCanvasItems,
  addParticipant, updateParticipant, deleteParticipant,
  addInterviewee, updateInterviewee, deleteInterviewee,
  getScriptsByProfile, sendToCalendar,
} from '@/lib/assembly/assembly-actions'
import { hasSoloVideo, statusLabel } from '@/lib/assembly/assembly-rules'
import type {
  AssemblyCanvasCard, AssemblyParticipantData, AssemblyIntervieweeData, AssemblyStrategyData,
} from '@/types/assembly'
import { Trash2, ArrowLeft, Send, Save } from 'lucide-react'
import { toast } from 'sonner'

interface MergedProfile {
  id: string
  name: string
  instagram: string
  source: 'profile' | 'analysis'
}

interface RegionBase {
  id: string
  officialNumber: number
  romanNumber: string
  officialName: string
  slug: string
}

interface SerializedStrategy {
  id: string
  profileId: string | null
  scriptId: string | null
  title: string
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
  canvasItems: Array<{
    id: string
    type: string
    title: string
    content: string
    x: number
    y: number
    width: number
    height: number
    position: number
    color: string
    metadata: string
  }>
  participants: Array<{
    id: string
    name: string
    role: string
    phone: string
    instagram: string
    responsibility: string
    status: string
  }>
  interviewees: Array<{
    id: string
    name: string
    profile: string
    speechTheme: string
    mainQuestion: string
    supportQuestions: string
    imageAuthorizationStatus: string
    status: string
  }>
  profile: { id: string; name: string; instagram: string } | null
  script: { id: string; title: string; captionText?: string; hashtags?: string; theme?: string } | null
}

interface Props {
  strategy: SerializedStrategy
  profiles: MergedProfile[]
  regions: RegionBase[]
}

export function AssemblyStrategyClient({ strategy: initial, profiles, regions }: Props) {
  const router = useRouter()
  const [strategy, setStrategy] = useState(initial)
  const [canvasItems, setCanvasItems] = useState<AssemblyCanvasCard[]>(
    initial.canvasItems.map(i => ({ ...i, position: i.position ?? 0 }))
  )
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [participants, setParticipants] = useState<AssemblyParticipantData[]>(
    initial.participants.map(p => ({ ...p, status: p.status as AssemblyParticipantData['status'] }))
  )
  const [interviewees, setInterviewees] = useState<AssemblyIntervieweeData[]>(
    initial.interviewees.map(i => ({
      ...i,
      imageAuthorizationStatus: i.imageAuthorizationStatus as AssemblyIntervieweeData['imageAuthorizationStatus'],
      status: i.status as AssemblyIntervieweeData['status'],
    }))
  )
  const [availableScripts, setAvailableScripts] = useState<Array<{ id: string; title: string; type: string }>>([])
  const [editingCardId, setEditingCardId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)

  const isSolo = hasSoloVideo({ videoType: strategy.videoType })

  useEffect(() => {
    if (strategy.profileId) {
      getScriptsByProfile(strategy.profileId).then(s => setAvailableScripts(s as Array<{ id: string; title: string; type: string }>))
    }
  }, [strategy.profileId])

  const handleProfileChange = useCallback((id: string) => {
    setStrategy(prev => ({ ...prev, profileId: id }))
    setDirty(true)
    getScriptsByProfile(id).then(s => setAvailableScripts(s as Array<{ id: string; title: string; type: string }>))
  }, [])

  const handleScriptChange = useCallback((id: string) => {
    setStrategy(prev => ({ ...prev, scriptId: id }))
    setDirty(true)
  }, [])

  const handleDetailsChange = useCallback((field: string, value: string) => {
    setStrategy(prev => ({ ...prev, [field]: value }))
    setDirty(true)
  }, [])

  const handleCanvasItemsChange = useCallback((items: AssemblyCanvasCard[]) => {
    setCanvasItems(items)
    setDirty(true)
  }, [])

  const handleEditCard = useCallback((id: string) => {
    const card = canvasItems.find(c => c.id === id)
    if (card) {
      setEditingCardId(id)
      setEditContent(card.content)
    }
  }, [canvasItems])

  const handleSaveCardContent = useCallback(() => {
    if (!editingCardId) return
    setCanvasItems(prev => prev.map(c => c.id === editingCardId ? { ...c, content: editContent } : c))
    setEditingCardId(null)
    setEditContent('')
    setDirty(true)
  }, [editingCardId, editContent])

  const handleSave = useCallback(async () => {
    setSaving(true)
    try {
      const { canvasItems: _, participants: __, interviewees: ___, profile: ____, script: _____, ...data } = strategy
      await updateStrategy(strategy.id, data as Record<string, unknown>)
      await saveCanvasItems(strategy.id, canvasItems)
      setDirty(false)
      toast.success('Estratégia salva')
    } catch {
      toast.error('Erro ao salvar')
    }
    setSaving(false)
  }, [strategy, canvasItems])

  const handleDelete = useCallback(async () => {
    if (!confirm('Excluir esta estratégia? O roteiro original não será afetado.')) return
    await deleteStrategy(strategy.id)
    router.push('/assembly-strategy')
    toast.success('Estratégia excluída')
  }, [strategy.id, router])

  const handleSendToCalendar = useCallback(async () => {
    await sendToCalendar(strategy.id)
    toast.success('Estratégia enviada para o Calendário Editorial')
  }, [strategy.id])

  const handleAddParticipant = useCallback(async (data: Parameters<typeof addParticipant>[1]) => {
    const profileId = strategy.profileId || undefined
    await addParticipant(strategy.id, data as Parameters<typeof addParticipant>[1])
    router.refresh()
  }, [strategy.id, strategy.profileId, router])

  const handleUpdateParticipant = useCallback(async (id: string, data: Record<string, unknown>) => {
    await updateParticipant(id, data)
    router.refresh()
  }, [router])

  const handleDeleteParticipant = useCallback(async (id: string) => {
    await deleteParticipant(id)
    router.refresh()
  }, [router])

  const handleAddInterviewee = useCallback(async (data: Parameters<typeof addInterviewee>[1]) => {
    await addInterviewee(strategy.id, data as Parameters<typeof addInterviewee>[1])
    router.refresh()
  }, [strategy.id, router])

  const handleUpdateInterviewee = useCallback(async (id: string, data: Record<string, unknown>) => {
    await updateInterviewee(id, data)
    router.refresh()
  }, [router])

  const handleDeleteInterviewee = useCallback(async (id: string) => {
    await deleteInterviewee(id)
    router.refresh()
  }, [router])

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col space-y-2">
      {/* Topbar */}
      <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-2.5 backdrop-blur-sm">
        <Link href="/assembly-strategy" className="text-zinc-500 hover:text-zinc-300">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-48">
            <AssemblyMergedProfileSelector
              profiles={profiles}
              selectedId={strategy.profileId}
              onSelect={handleProfileChange}
            />
          </div>
          <div className="w-48">
            <AssemblyScriptSelector
              scripts={availableScripts}
              selectedId={strategy.scriptId}
              onSelect={handleScriptChange}
              disabled={!strategy.profileId}
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${
              strategy.status === 'pronto' ? 'bg-green-900/40 text-green-400' :
              strategy.status === 'rascunho' ? 'bg-zinc-800 text-zinc-400' :
              strategy.status === 'publicado' ? 'bg-violet-900/40 text-violet-400' :
              'bg-zinc-800 text-zinc-400'
            }`}>
              {statusLabel(strategy.status)}
            </span>
            <AssemblyExportButton
              strategy={{
                ...strategy,
                canvasItems,
                participants,
                interviewees,
              }}
              script={strategy.script}
            />
            <button
              onClick={handleSendToCalendar}
              className="flex items-center gap-2 rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800"
            >
              <Send className="h-3.5 w-3.5" />
              Calendário
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !dirty}
              className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-xs font-medium text-white hover:bg-violet-500 disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" />
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
            <button onClick={handleDelete} className="rounded-lg p-2 text-zinc-500 hover:text-red-400">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex flex-1 gap-2 overflow-hidden">
        {/* Left: Shortlist */}
        <div className="w-48 shrink-0 overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
          <AssemblyShortlist onDragStart={() => {}} />
        </div>

        {/* Center: Canvas */}
        <div className="flex-1 overflow-hidden">
          <AssemblyInfiniteCanvas
            items={canvasItems}
            selectedId={selectedCardId}
            onItemsChange={handleCanvasItemsChange}
            onSelect={setSelectedCardId}
            onEditCard={handleEditCard}
          />
        </div>

        {/* Right: Details Panel */}
        <div className="w-72 shrink-0 overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
          <AssemblyDetailsPanel
            videoType={strategy.videoType}
            objective={strategy.objective}
            centralMessage={strategy.centralMessage}
            visualHook={strategy.visualHook}
            firstLine={strategy.firstLine}
            recordingLocation={strategy.recordingLocation}
            recordingAddress={strategy.recordingAddress}
            recordingDate={strategy.recordingDate}
            recordingTime={strategy.recordingTime}
            postingDate={strategy.postingDate}
            postingTime={strategy.postingTime}
            status={strategy.status}
            notes={strategy.notes}
            administrativeRegionId={strategy.administrativeRegionId}
            alternativeLocation={strategy.alternativeLocation}
            recordingReferencePoint={strategy.recordingReferencePoint}
            regions={regions}
            onChange={handleDetailsChange}
          />

          <div className="mt-6 space-y-6">
            <AssemblyParticipants
              participants={participants}
              onAdd={handleAddParticipant}
              onUpdate={handleUpdateParticipant}
              onDelete={handleDeleteParticipant}
            />

            <AssemblyInterviewees
              interviewees={interviewees}
              disabled={isSolo}
              onAdd={handleAddInterviewee}
              onUpdate={handleUpdateInterviewee}
              onDelete={handleDeleteInterviewee}
            />
          </div>
        </div>
      </div>

      {/* Edit card modal */}
      {editingCardId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-96 rounded-xl border border-zinc-700 bg-zinc-900 p-6 shadow-xl">
            <h3 className="mb-4 text-sm font-semibold text-zinc-200">Editar card</h3>
            <textarea
              className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-violet-500"
              rows={6}
              value={editContent}
              onChange={e => setEditContent(e.target.value)}
              autoFocus
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setEditingCardId(null)}
                className="rounded-lg border border-zinc-700 px-4 py-2 text-xs text-zinc-400 hover:text-zinc-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveCardContent}
                className="rounded-lg bg-violet-600 px-4 py-2 text-xs font-medium text-white hover:bg-violet-500"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import { exportStrategyTxt } from '@/lib/assembly/assembly-export'
import { Download } from 'lucide-react'
import type { AssemblyStrategyData } from '@/types/assembly'

interface Props {
  strategy: AssemblyStrategyData
  script?: { title?: string; theme?: string; captionText?: string; hashtags?: string } | null
}

export function AssemblyExportButton({ strategy, script }: Props) {
  const handleExport = () => {
    const txt = exportStrategyTxt({
      profileName: strategy.title,
      scriptTitle: script?.title || strategy.title,
      theme: script?.theme || '',
      videoType: strategy.videoType,
      recordingDate: strategy.recordingDate,
      recordingLocation: strategy.recordingLocation,
      participants: strategy.participants.map(p => ({ name: p.name, role: p.role })),
      interviewees: strategy.interviewees.map(i => ({ name: i.name, profile: i.profile, mainQuestion: i.mainQuestion })),
      centralMessage: strategy.centralMessage,
      visualHook: strategy.visualHook,
      firstLine: strategy.firstLine,
      objective: strategy.objective,
      notes: strategy.notes,
      caption: script?.captionText || '',
      hashtags: script?.hashtags || '',
    })
    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `estrategia-${strategy.title.replace(/\s+/g, '-').toLowerCase()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800"
    >
      <Download className="h-3.5 w-3.5" />
      Exportar TXT
    </button>
  )
}

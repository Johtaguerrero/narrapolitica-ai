import { getMergedProfiles } from '@/lib/assembly/assembly-actions'
import { NewStrategyForm } from './new-strategy-form'

export const dynamic = 'force-dynamic'

export default async function NewStrategyPage(props: { searchParams?: Promise<{ profileId?: string; scriptId?: string; title?: string }> }) {
  const searchParams = await props.searchParams
  const profiles = await getMergedProfiles()
  return (
    <NewStrategyForm
      profiles={profiles}
      initialProfileId={searchParams?.profileId}
      initialScriptId={searchParams?.scriptId}
      initialTitle={searchParams?.title}
    />
  )
}

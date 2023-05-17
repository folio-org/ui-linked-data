import { memo, useEffect } from "react"
import useConfig from "../../common/hooks/useConfig.hook"
import { EditSection } from "../../components/EditSection/EditSection"
import { Preview } from "../../components/Preview/Preview"
import { Properties } from "../../components/Properties/Properties"
import './Edit.scss'

export const Edit = memo(() => {
  const { getProfiles, getStartingPoints } = useConfig()

  useEffect(() => {
    getProfiles()
  }, [])

  return (
    <div className="edit-page">
      <Properties />
      <EditSection />
      <Preview />
    </div>
  )
})
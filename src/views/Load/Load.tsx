import { useEffect, useState } from "react"
import { useSetRecoilState } from "recoil"
import { getAllRecords, getRecord } from "../../common/api/records.api"
import state from "../../state/state"

import './Load.scss'

export const Load = () => {
  const [availableRecords, setAvailableRecords] = useState<Record<string, any> | null>(null)
  const setUserValues = useSetRecoilState(state.inputs.userValues)

  useEffect(() => {
    getAllRecords({
      pageNumber: 0,
    })
      .then((res) => {
        setAvailableRecords(res.content)
      })
  }, [])

  const fetchRecord = async (recordId: string) => {
    const record: RecordEntry = await getRecord({ recordId })

    // TODO: work on an appropriate schema for the record 
    const values = [
      ...record.configuration.instanceValues.filter((i) => i.type === 'literal').map((i) => {
        return {
          field: i.propertyLabel,
          value: i.userValue?.["@value"] || ''
        }
      }),
      ...record.configuration.workValues.filter((i) => i.type === 'literal').map((i) => {
        return {
          field: i.propertyLabel,
          value: i.userValue?.["@value"] || ''
        }
      }),
    ]

    setUserValues(values)
  }

  return (
    <div className="load">
      <strong>
        BIBFRAME Profiles:
      </strong>
      <div>
        <button>Monograph</button>
      </div>
      <strong>
        Available records:
      </strong>
      <div className="button-group">
        {
          availableRecords?.map((i: RecordEntry) => 
            <button key={i.id || i.graphName} onClick={() => fetchRecord(i.graphName)}>{i.graphName}</button>
          )
        }
      </div>
    </div>
  )
}
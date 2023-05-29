import { MAX_LIMIT } from "../constants/api.constants"
import baseApi from "./base.api"

type GetRecord = {
  recordId: string,
}

type GetAllRecords = {
  pageSize?: number,
  pageNumber?: number,
}

// this OR use recoil: arg -> state -> apply state -> call fetch -> set state
const tenant = localStorage.getItem('ok_tenant') || ''
const token = localStorage.getItem('ok_token') || ''

const headers = tenant ? {
  'x-okapi-tenant': tenant,
  'x-okapi-token': token,
} : undefined

const getRecordUrl = '/bibframes/:recordId'
export const getRecord = async ({
  recordId
}: GetRecord) => {
  const url = getRecordUrl.replace(':recordId', recordId)

  return baseApi.getJson({
    url,
    requestParams: {
      headers,
    }
  })
}


const getAllRecordsUrl = '/bibframes'
export const getAllRecords = async ({
  pageSize = MAX_LIMIT,
  pageNumber = MAX_LIMIT,
}: GetAllRecords) => {
  const stringParams = new URLSearchParams({
    pageSize: String(pageSize),
    pageNumber: String(pageNumber)
  }).toString()

  return baseApi.getJson({
    url: `${getAllRecordsUrl}?${stringParams}`,
    requestParams: {
      headers,
    }
  })
}

const postRecordUrl = '/bibframes'
export const postRecord = async (recordEntry: RecordEntry) => {
  return baseApi.request({
    url: postRecordUrl,
    requestParams: {
      method: 'POST',
      body: JSON.stringify(recordEntry),
      headers: {
        ...headers,
        'content-type': 'application/json'
      },
    }
  })
}

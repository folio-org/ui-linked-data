// TODO: caching, abort controllers

const BASE_PATH = localStorage.getItem('ok_url') 
  // || .env declared  
  || 'http://localhost:8080'

async function doRequest(url: string, requestParams: RequestInit) {
  try {
    const response = await fetch(`${BASE_PATH}${url}`, requestParams)

    if (!response.ok) {
      const errorBody = await response.text()
      throw errorBody
    }

    return response
  } catch (error) {
    console.error(error)
  }
}

type ReqParams = {
  url: string,
  urlParams?: Record<string, unknown>,
  requestParams?: RequestInit,
}

const request = async ({
  url,
  requestParams = {},
}: ReqParams) => {
  const response = await doRequest(url, { ...requestParams })

  return response
}

const getJson = async ({
  url,
  urlParams = {},
  requestParams = {
    method: 'GET',
  },
}: ReqParams) => {
  const response = await request({ url, urlParams, requestParams })

  if (response?.ok) {
    const formatted = await response.json()
    return formatted
  }

  return response
}

export default {
  request,
  getJson,
}

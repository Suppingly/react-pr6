import type { Media, MediaExtend, Authors } from '../types/Media'

const API_URL = 'http://localhost:4200/api/media/'
const API_AUTH_URL = 'http://localhost:4200/api/auth/'

export async function fetchMedia(params?: {
  category?: string
  type?: string
  search?: string
}): Promise<Media[]> {
  const query = new URLSearchParams()
  if (params?.category) query.append('category', params.category)
  if (params?.type) query.append('type', params.type)
  if (params?.search) query.append('search', params.search)

  const res = await fetch(`${API_URL}?${query.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
  const body = await res.json()
  return body.data
}

export async function fetchAllMedia(params?: {
  category?: string
  type?: string
  search?: string
}): Promise<Media[]> {
  const query = new URLSearchParams()
  if (params?.category) query.append('category', params.category)
  if (params?.type) query.append('type', params.type)
  if (params?.search) query.append('search', params.search)

  const res = await fetch(`${API_URL}all?${query.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
  const body = await res.json()
  return body.data
}

export async function createMedia(formData: FormData): Promise<Media> {
  const res = await fetch(API_URL, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  })
  const body = await res.json()
  return body.data
}

export async function updateMedia(id: Number, formData: FormData): Promise<Media> {
  const res = await fetch(`${API_URL}${id}`, {
    method: 'PUT',
    credentials: 'include',
    body: formData,
  })
  const body = await res.json()
  return body.data
}

export async function fetchPublicMedia(params?: {
  category?: string
  type?: string
  search?: string
}): Promise<MediaExtend[]> {
  const query = new URLSearchParams()
  if (params?.category) query.append('category', params.category)
  if (params?.type) query.append('type', params.type)
  if (params?.search) query.append('search', params.search)

  const res = await fetch(`${API_URL}public?${query.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const body = await res.json()
  return body.data
}

export async function deleteMedia(id: Number): Promise<Media> {
  const res = await fetch(`${API_URL}${id}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  const body = await res.json()
  return body.data
}

export async function getUsers(): Promise<Authors[]> {
  const res = await fetch(`${API_AUTH_URL}profiles`, {
    method: 'GET',
  })
  const body = await res.json()
  return body.data
}

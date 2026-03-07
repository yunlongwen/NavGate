import { Group, Site, Config, LoginCredentials, LoginResponse } from '@navgate/types'

const API_BASE = '/api'

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('navgate_auth_token')
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    throw new Error('Login failed')
  }

  return response.json()
}

export async function getGroups(includePrivate = false): Promise<Group[]> {
  const url = includePrivate ? `${API_BASE}/groups?includePrivate=true` : `${API_BASE}/groups`
  const response = await fetch(url, {
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error('Failed to fetch groups')
  }

  return response.json()
}

export async function createGroup(name: string, isPublic = true): Promise<Group> {
  const response = await fetch(`${API_BASE}/groups`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ name, is_public: isPublic ? 1 : 0 }),
  })

  if (!response.ok) {
    throw new Error('Failed to create group')
  }

  return response.json()
}

export async function updateGroup(
  id: number,
  updates: Partial<Pick<Group, 'name' | 'is_public'>>
): Promise<void> {
  const response = await fetch(`${API_BASE}/groups/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updates),
  })

  if (!response.ok) {
    throw new Error('Failed to update group')
  }
}

export async function deleteGroup(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/groups/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error('Failed to delete group')
  }
}

export async function reorderGroups(
  orders: Array<{ id: number; order_num: number }>
): Promise<void> {
  const response = await fetch(`${API_BASE}/groups/reorder`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ orders }),
  })

  if (!response.ok) {
    throw new Error('Failed to reorder groups')
  }
}

export async function getSites(groupId?: number, includePrivate = false): Promise<Site[]> {
  const params = new URLSearchParams()
  if (groupId) params.append('groupId', groupId.toString())
  if (includePrivate) params.append('includePrivate', 'true')

  const url = params.toString() ? `${API_BASE}/sites?${params}` : `${API_BASE}/sites`
  const response = await fetch(url, {
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error('Failed to fetch sites')
  }

  return response.json()
}

export async function createSite(
  site: Omit<Site, 'id' | 'created_at' | 'updated_at'>
): Promise<Site> {
  const response = await fetch(`${API_BASE}/sites`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(site),
  })

  if (!response.ok) {
    throw new Error('Failed to create site')
  }

  return response.json()
}

export async function updateSite(
  id: number,
  updates: Partial<Omit<Site, 'id' | 'group_id' | 'created_at' | 'updated_at'>>
): Promise<void> {
  const response = await fetch(`${API_BASE}/sites/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updates),
  })

  if (!response.ok) {
    throw new Error('Failed to update site')
  }
}

export async function deleteSite(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/sites/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error('Failed to delete site')
  }
}

export async function reorderSites(
  orders: Array<{ id: number; order_num: number; group_id?: number }>
): Promise<void> {
  const response = await fetch(`${API_BASE}/sites/reorder`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ orders }),
  })

  if (!response.ok) {
    throw new Error('Failed to reorder sites')
  }
}

export async function getConfig(): Promise<Config> {
  const response = await fetch(`${API_BASE}/config`, {
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error('Failed to fetch config')
  }

  return response.json()
}

export async function updateConfig(config: Config): Promise<void> {
  const response = await fetch(`${API_BASE}/config`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(config),
  })

  if (!response.ok) {
    throw new Error('Failed to update config')
  }
}

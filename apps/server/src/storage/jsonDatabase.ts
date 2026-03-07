import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

// Get __dirname in ES module
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Simple JSON-file based storage used when STORAGE_DRIVER=json
// The shape is intentionally close to the Prisma models so that
// existing controllers can reuse most validation / response logic.

export interface GroupRecord {
  id: number
  name: string
  is_public: number
  order_num: number
}

export interface SiteRecord {
  id: number
  group_id: number
  name: string
  url: string
  icon?: string | null
  description?: string | null
  notes?: string | null
  is_public: number
  order_num: number
}

export interface NavConfig {
  // free-form key/value pairs
  [key: string]: string
}

export interface NavData {
  groups: GroupRecord[]
  sites: SiteRecord[]
  config: NavConfig
  nextGroupId: number
  nextSiteId: number
}

const dataFilePath =
  process.env.JSON_DB_PATH || path.join(__dirname, '..', '..', 'data', 'nav-data.json')

async function ensureDataFile(): Promise<void> {
  try {
    await fs.access(dataFilePath)
  } catch {
    const initialData: NavData = {
      groups: [],
      sites: [],
      config: {},
      nextGroupId: 1,
      nextSiteId: 1,
    }
    await fs.mkdir(path.dirname(dataFilePath), { recursive: true })
    await fs.writeFile(dataFilePath, JSON.stringify(initialData, null, 2), 'utf8')
  }
}

async function loadData(): Promise<NavData> {
  await ensureDataFile()
  const raw = await fs.readFile(dataFilePath, 'utf8')
  try {
    const parsed = JSON.parse(raw) as NavData
    // Backwards compatibility if ids are missing
    if (!parsed.nextGroupId) {
      parsed.nextGroupId = (parsed.groups?.reduce((m, g) => Math.max(m, g.id), 0) ?? 0) + 1
    }
    if (!parsed.nextSiteId) {
      parsed.nextSiteId = (parsed.sites?.reduce((m, s) => Math.max(m, s.id), 0) ?? 0) + 1
    }
    return parsed
  } catch (error) {
    console.error('Failed to parse JSON DB file, resetting.', error)
    const initialData: NavData = {
      groups: [],
      sites: [],
      config: {},
      nextGroupId: 1,
      nextSiteId: 1,
    }
    await fs.writeFile(dataFilePath, JSON.stringify(initialData, null, 2), 'utf8')
    return initialData
  }
}

async function saveData(data: NavData): Promise<void> {
  await fs.mkdir(path.dirname(dataFilePath), { recursive: true })
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8')
}

// ===== Group operations =====

export async function jsonGetGroups(includePrivate: boolean): Promise<GroupRecord[]> {
  const data = await loadData()
  const groups = includePrivate ? data.groups : data.groups.filter(g => g.is_public === 1)
  return groups.sort((a, b) => a.order_num - b.order_num)
}

export async function jsonCreateGroup(input: {
  name: string
  is_public?: boolean
}): Promise<GroupRecord> {
  const data = await loadData()
  const group: GroupRecord = {
    id: data.nextGroupId++,
    name: input.name,
    is_public: (input.is_public ?? true) ? 1 : 0,
    order_num:
      data.groups.length === 0 ? 0 : Math.max(...data.groups.map(g => g.order_num ?? 0)) + 1,
  }
  data.groups.push(group)
  await saveData(data)
  return group
}

export async function jsonUpdateGroup(
  id: number,
  updates: { name?: string; is_public?: boolean }
): Promise<GroupRecord | null> {
  const data = await loadData()
  const idx = data.groups.findIndex(g => g.id === id)
  if (idx === -1) return null

  const existing = data.groups[idx]
  const updated: GroupRecord = {
    ...existing,
    ...(updates.name !== undefined && { name: updates.name }),
    ...(updates.is_public !== undefined && { is_public: updates.is_public ? 1 : 0 }),
  }
  data.groups[idx] = updated
  await saveData(data)
  return updated
}

export async function jsonDeleteGroup(id: number): Promise<boolean> {
  const data = await loadData()
  const before = data.groups.length
  data.groups = data.groups.filter(g => g.id !== id)
  // 同时删除该分组下的站点
  data.sites = data.sites.filter(s => s.group_id !== id)
  const changed = data.groups.length !== before
  if (changed) {
    await saveData(data)
  }
  return changed
}

export async function jsonReorderGroups(
  orders: { id: number; order_num: number }[]
): Promise<void> {
  const data = await loadData()
  const map = new Map(orders.map(o => [o.id, o.order_num]))
  data.groups = data.groups.map(g =>
    map.has(g.id) ? { ...g, order_num: map.get(g.id) as number } : g
  )
  await saveData(data)
}

// ===== Site operations =====

export async function jsonGetSites(params: {
  groupId?: number
  includePrivate: boolean
}): Promise<SiteRecord[]> {
  const data = await loadData()
  let sites = data.sites
  if (params.groupId) {
    sites = sites.filter(s => s.group_id === params.groupId)
  }
  if (!params.includePrivate) {
    sites = sites.filter(s => s.is_public === 1)
  }
  return sites.sort((a, b) => a.order_num - b.order_num)
}

export async function jsonCreateSite(input: {
  group_id: number
  name: string
  url: string
  icon?: string
  description?: string
  notes?: string
  is_public?: boolean
}): Promise<SiteRecord | null> {
  const data = await loadData()
  const groupExists = data.groups.some(g => g.id === input.group_id)
  if (!groupExists) {
    return null
  }

  const maxOrderInGroup = data.sites
    .filter(s => s.group_id === input.group_id)
    .reduce((m, s) => Math.max(m, s.order_num ?? 0), -1)

  const site: SiteRecord = {
    id: data.nextSiteId++,
    group_id: input.group_id,
    name: input.name,
    url: input.url,
    icon: input.icon,
    description: input.description,
    notes: input.notes,
    is_public: (input.is_public ?? true) ? 1 : 0,
    order_num: maxOrderInGroup + 1,
  }

  data.sites.push(site)
  await saveData(data)
  return site
}

export async function jsonUpdateSite(
  id: number,
  updates: {
    name?: string
    url?: string
    icon?: string | null
    description?: string | null
    notes?: string | null
    is_public?: boolean
  }
): Promise<SiteRecord | null> {
  const data = await loadData()
  const idx = data.sites.findIndex(s => s.id === id)
  if (idx === -1) return null

  const existing = data.sites[idx]
  const updated: SiteRecord = {
    ...existing,
    ...(updates.name !== undefined && { name: updates.name }),
    ...(updates.url !== undefined && { url: updates.url }),
    ...(updates.icon !== undefined && { icon: updates.icon }),
    ...(updates.description !== undefined && { description: updates.description }),
    ...(updates.notes !== undefined && { notes: updates.notes }),
    ...(updates.is_public !== undefined && { is_public: updates.is_public ? 1 : 0 }),
  }
  data.sites[idx] = updated
  await saveData(data)
  return updated
}

export async function jsonDeleteSite(id: number): Promise<boolean> {
  const data = await loadData()
  const before = data.sites.length
  data.sites = data.sites.filter(s => s.id !== id)
  const changed = data.sites.length !== before
  if (changed) {
    await saveData(data)
  }
  return changed
}

export async function jsonReorderSites(
  orders: { id: number; order_num: number; group_id?: number }[]
): Promise<void> {
  const data = await loadData()
  const map = new Map(orders.map(o => [o.id, o]))
  data.sites = data.sites.map(s => {
    const order = map.get(s.id)
    if (!order) return s
    return {
      ...s,
      order_num: order.order_num,
      ...(order.group_id !== undefined && { group_id: order.group_id }),
    }
  })
  await saveData(data)
}

// ===== Config operations =====

export async function jsonGetConfig(): Promise<NavConfig> {
  const data = await loadData()
  return data.config || {}
}

export async function jsonUpdateConfig(configData: NavConfig): Promise<void> {
  const data = await loadData()
  data.config = {
    ...(data.config || {}),
    ...configData,
  }
  await saveData(data)
}

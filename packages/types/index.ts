export interface Group {
  id: number
  name: string
  order_num: number
  is_public: number
  created_at: string
  updated_at: string
}

export interface Site {
  id: number
  group_id: number
  name: string
  url: string
  icon?: string
  description?: string
  notes?: string
  order_num: number
  is_public: number
  created_at: string
  updated_at: string
}

export interface Config {
  [key: string]: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  username: string
}

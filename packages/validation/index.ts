import type { Group, Site, Config } from '@navgate/types'
import { validateGroup, validateSite } from '@navgate/utils'

/**
 * 验证分组数据
 */
export function validateGroupData(data: Partial<Group>): {
  valid: boolean
  error: string | null
} {
  const error = validateGroup(data)
  return {
    valid: error === null,
    error,
  }
}

/**
 * 验证站点数据
 */
export function validateSiteData(data: Partial<Site>): {
  valid: boolean
  error: string | null
} {
  const error = validateSite(data)
  return {
    valid: error === null,
    error,
  }
}

/**
 * 验证配置数据
 */
export function validateConfigData(data: Partial<Config>): {
  valid: boolean
  error: string | null
} {
  if (!data) {
    return {
      valid: false,
      error: '配置数据不能为空',
    }
  }

  for (const key in data) {
    if (typeof data[key] !== 'string') {
      return {
        valid: false,
        error: `配置项 ${key} 的值必须是字符串`,
      }
    }
    if (key.length > 100) {
      return {
        valid: false,
        error: `配置项名称不能超过 100 个字符`,
      }
    }
    if (data[key].length > 1000) {
      return {
        valid: false,
        error: `配置项 ${key} 的值不能超过 1000 个字符`,
      }
    }
  }

  return {
    valid: true,
    error: null,
  }
}

/**
 * 批量验证数据
 */
export function validateBatch<T>(
  items: T[],
  validator: (item: T) => { valid: boolean; error: string | null }
): {
  valid: boolean
  errors: Array<{ index: number; error: string }>
} {
  const errors: Array<{ index: number; error: string }> = []

  items.forEach((item, index) => {
    const result = validator(item)
    if (!result.valid) {
      errors.push({ index, error: result.error || '验证失败' })
    }
  })

  return {
    valid: errors.length === 0,
    errors,
  }
}

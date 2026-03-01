import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { storage } from '../utils/storage'

describe('Storage Utility', () => {
  beforeEach(() => {
    // 每个测试前清理 localStorage
    localStorage.clear()
  })

  afterEach(() => {
    // 每个测试后清理 localStorage
    localStorage.clear()
  })

  describe('get', () => {
    it('should return null for non-existent key', () => {
      const result = storage.get('non-existent')
      expect(result).toBeNull()
    })

    it('should return value for existing key', () => {
      storage.set('test-key', { name: 'test' })
      const result = storage.get('test-key')
      expect(result).toEqual({ name: 'test' })
    })

    it('should parse JSON correctly', () => {
      storage.set('json-key', { nested: { value: 42 } })
      const result = storage.get('json-key')
      expect(result).toEqual({ nested: { value: 42 } })
    })

    it('should handle invalid JSON gracefully', () => {
      localStorage.setItem('invalid-json', 'not a json')
      const result = storage.get('invalid-json')
      expect(result).toBeNull()
    })
  })

  describe('set', () => {
    it('should store value correctly', () => {
      storage.set('test-key', 'test-value')
      expect(localStorage.getItem('test-key')).toBe('"test-value"')
    })

    it('should store object correctly', () => {
      const obj = { name: 'test', value: 42 }
      storage.set('test-obj', obj)
      expect(localStorage.getItem('test-obj')).toBe(JSON.stringify(obj))
    })

    it('should overwrite existing value', () => {
      storage.set('test-key', 'value1')
      storage.set('test-key', 'value2')
      expect(storage.getItem('test-key')).toBe('"value2"')
    })

    it('should handle localStorage quota exceeded', () => {
      // 模拟 localStorage 已满的情况
      const originalSetItem = localStorage.setItem
      localStorage.setItem = () => {
        throw new Error('QuotaExceededError')
      }

      expect(() => {
        storage.set('test-key', 'x'.repeat(10000000))
      }).not.toThrow()

      localStorage.setItem = originalSetItem
    })
  })

  describe('remove', () => {
    it('should remove key correctly', () => {
      storage.set('test-key', 'test-value')
      storage.remove('test-key')
      expect(localStorage.getItem('test-key')).toBeNull()
    })

    it('should handle non-existent key', () => {
      expect(() => {
        storage.remove('non-existent')
      }).not.toThrow()
    })
  })

  describe('clear', () => {
    it('should clear all storage', () => {
      storage.set('key1', 'value1')
      storage.set('key2', 'value2')
      storage.clear()
      expect(localStorage.length).toBe(0)
    })
  })

  describe('has', () => {
    it('should return true for existing key', () => {
      storage.set('test-key', 'test-value')
      expect(storage.has('test-key')).toBe(true)
    })

    it('should return false for non-existent key', () => {
      expect(storage.has('non-existent')).toBe(false)
    })
  })

  describe('getSize', () => {
    it('should return correct size in bytes', () => {
      storage.set('key1', 'value1')
      const size = storage.getSize()
      expect(size).toBeGreaterThan(0)
      expect(typeof size).toBe('number')
    })

    it('should return 0 for empty storage', () => {
      const size = storage.getSize()
      expect(size).toBe(0)
    })
  })

  describe('getSizeInMB', () => {
    it('should return size in MB', () => {
      // 设置约 1MB 的数据
      const bigData = 'x'.repeat(1024 * 1024)
      storage.set('big-key', bigData)
      const sizeInMB = storage.getSizeInMB()
      expect(sizeInMB).toBeCloseTo(1, 0.1)
    })

    it('should return 0 for empty storage', () => {
      const sizeInMB = storage.getSizeInMB()
      expect(sizeInMB).toBe(0)
    })
  })
})

export function sanitizeInput(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = { ...obj } as T
  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeInput(sanitized[key]) as any
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeObject(sanitized[key])
    }
  }
  return sanitized
}

export function generateCSRFToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('')
}

export function getCSRFToken(): string | null {
  return localStorage.getItem('csrf_token')
}

export function setCSRFToken(): void {
  const token = generateCSRFToken()
  localStorage.setItem('csrf_token', token)
}

export function encryptSensitiveData(data: Record<string, any>): Record<string, any> {
  const encrypted = { ...data }
  const sensitiveFields = ['password', 'idCard', 'phone']
  for (const field of sensitiveFields) {
    if (encrypted[field]) {
      encrypted[field] = btoa(encodeURIComponent(encrypted[field]))
    }
  }
  return encrypted
}

import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { ElMessage } from 'element-plus'
import type { RequestConfig, ApiResponse, SecurityConfig } from './types'
import { DEFAULT_RETRY_COUNT, DEFAULT_RETRY_DELAY, DEFAULT_TIMEOUT, MAX_RETRY_COUNT, MAX_RETRY_DELAY, RequestErrorCode, RequestErrorMessage } from './types'
import { sanitizeObject, getCSRFToken, setCSRFToken, encryptSensitiveData } from './security'
import { showLoading, hideLoading } from './loading'

class RequestCanceler {
  private pending: Map<string, AbortController> = new Map()

  generateRequestKey(config: InternalAxiosRequestConfig): string {
    const { method, url, params, data } = config
    return `${method}:${url}:${JSON.stringify(params)}:${JSON.stringify(data)}`
  }

  addPending(config: InternalAxiosRequestConfig): void {
    const requestKey = this.generateRequestKey(config)
    if (this.pending.has(requestKey)) {
      const controller = this.pending.get(requestKey)
      controller?.abort()
      this.pending.delete(requestKey)
    }
    const controller = new AbortController()
    config.signal = controller.signal
    this.pending.set(requestKey, controller)
  }

  removePending(config: InternalAxiosRequestConfig): void {
    const requestKey = this.generateRequestKey(config)
    this.pending.delete(requestKey)
  }

  cancelRequest(url: string): void {
    for (const [key, controller] of this.pending) {
      if (key.includes(url)) {
        controller.abort()
        this.pending.delete(key)
      }
    }
  }

  cancelAll(): void {
    for (const controller of this.pending.values()) {
      controller.abort()
    }
    this.pending.clear()
  }
}

class HttpRequest {
  private instance: AxiosInstance
  private canceler: RequestCanceler
  private securityConfig: SecurityConfig

  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
      timeout: DEFAULT_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.canceler = new RequestCanceler()
    this.securityConfig = {
      enableXSSProtection: true,
      enableCSRFProtection: true,
      csrfTokenKey: 'csrf_token',
      csrfHeaderName: 'X-CSRF-Token',
    }

    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const requestConfig = config as InternalAxiosRequestConfig & RequestConfig

        if (requestConfig.showLoading !== false) {
          showLoading()
        }

        const token = localStorage.getItem('token')
        if (token) {
          requestConfig.headers.Authorization = `Bearer ${token}`
        }

        const userStr = localStorage.getItem('user')
        if (userStr) {
          try {
            const user = JSON.parse(userStr)
            if (user?.role) {
              requestConfig.headers['X-User-Role'] = user.role
            }
            if (user?.id) {
              requestConfig.headers['X-User-Id'] = String(user.id)
            }
          } catch (e) {
            console.error('Failed to parse user info')
          }
        }

        requestConfig.headers['X-Requested-With'] = 'XMLHttpRequest'
        requestConfig.headers['X-Request-Timestamp'] = Date.now().toString()

        if (this.securityConfig.enableCSRFProtection) {
          let csrfToken = getCSRFToken()
          if (!csrfToken) {
            setCSRFToken()
            csrfToken = getCSRFToken()
          }
          if (csrfToken && this.securityConfig.csrfHeaderName) {
            requestConfig.headers[this.securityConfig.csrfHeaderName] = csrfToken
          }
        }

        const skipSecurityUrls = ['/auth/login', '/auth/register']
        const shouldSkipSecurity = skipSecurityUrls.some(url => requestConfig.url?.includes(url))

        if (this.securityConfig.enableXSSProtection && requestConfig.data && !shouldSkipSecurity) {
          if (typeof requestConfig.data === 'object') {
            requestConfig.data = sanitizeObject(requestConfig.data)
          }
        }

        this.canceler.addPending(requestConfig)

        return requestConfig
      },
      (error: AxiosError) => {
        return Promise.reject(error)
      },
    )

    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        this.canceler.removePending(response.config as InternalAxiosRequestConfig & RequestConfig)
        hideLoading()

        const res = response.data
        const requestConfig = response.config as InternalAxiosRequestConfig & RequestConfig

        if (res.code >= 200 && res.code < 300) {
          return response
        }

        if (requestConfig.silent !== true) {
          this.handleBusinessError(res.code, res.message)
        }

        if (res.code === RequestErrorCode.UNAUTHORIZED) {
          this.handleUnauthorized()
        }

        return Promise.reject(new Error(res.message || '请求失败'))
      },
      (error: AxiosError) => {
        this.canceler.removePending(error.config as InternalAxiosRequestConfig & RequestConfig)
        hideLoading()

        if (axios.isCancel(error)) {
          return Promise.reject({ code: RequestErrorCode.REQUEST_CANCELLED, message: RequestErrorMessage[RequestErrorCode.REQUEST_CANCELLED] })
        }

        return Promise.reject(this.handleNetworkError(error))
      },
    )
  }

  private async executeWithRetry<T>(
    config: RequestConfig,
    retryCount: number,
    retryDelay: number,
    attempt: number = 0
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.request<ApiResponse<T>>(config)
      return response.data
    } catch (error: any) {
      if (axios.isCancel(error)) {
        throw { code: RequestErrorCode.REQUEST_CANCELLED, message: RequestErrorMessage[RequestErrorCode.REQUEST_CANCELLED] }
      }

      const isNetworkError = !error.response || error.code === 'ECONNABORTED'
      const shouldRetry = isNetworkError && attempt < retryCount

      if (shouldRetry) {
        const delay = Math.min(retryDelay * Math.pow(2, attempt), MAX_RETRY_DELAY)
        await new Promise((resolve) => setTimeout(resolve, delay))
        return this.executeWithRetry<T>(config, retryCount, retryDelay, attempt + 1)
      }

      if (error.response) {
        throw {
          code: error.response.status,
          message: (error.response.data as any)?.message || RequestErrorMessage[error.response.status] || '请求失败',
        }
      }

      throw { code: RequestErrorCode.RETRY_FAILED, message: RequestErrorMessage[RequestErrorCode.RETRY_FAILED] }
    }
  }

  private handleBusinessError(code: number, message: string): void {
    const errorMessage = RequestErrorMessage[code] || message || '请求失败'
    ElMessage.error(errorMessage)
  }

  private handleNetworkError(error: AxiosError): { code: number; message: string } {
    if (error.code === 'ECONNABORTED' || error.message === 'timeout of 30000ms exceeded') {
      return { code: RequestErrorCode.TIMEOUT, message: RequestErrorMessage[RequestErrorCode.TIMEOUT] || '请求超时' }
    }

    if (error.response) {
      const status = error.response.status
      const responseData = error.response.data as any
      const message = RequestErrorMessage[status] || responseData?.message || '请求失败'
      return { code: status, message: message || '请求失败' }
    }

    return { code: RequestErrorCode.NETWORK_ERROR, message: RequestErrorMessage[RequestErrorCode.NETWORK_ERROR] || '网络错误' }
  }

  private handleUnauthorized(): void {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    this.canceler.cancelAll()
    window.location.href = '/login'
  }

  public async get<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    const finalConfig: RequestConfig = {
      url,
      method: 'GET',
      ...config,
      retryCount: config?.retryCount ?? DEFAULT_RETRY_COUNT,
      retryDelay: config?.retryDelay ?? DEFAULT_RETRY_DELAY,
    }
    return this.executeWithRetry<T>(finalConfig, finalConfig.retryCount!, finalConfig.retryDelay!)
  }

  public async post<T>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    const finalConfig: RequestConfig = {
      url,
      method: 'POST',
      data,
      ...config,
      retryCount: config?.retryCount ?? 0,
      retryDelay: config?.retryDelay ?? DEFAULT_RETRY_DELAY,
    }
    return this.executeWithRetry<T>(finalConfig, finalConfig.retryCount!, finalConfig.retryDelay!)
  }

  public async put<T>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    const finalConfig: RequestConfig = {
      url,
      method: 'PUT',
      data,
      ...config,
      retryCount: config?.retryCount ?? 0,
      retryDelay: config?.retryDelay ?? DEFAULT_RETRY_DELAY,
    }
    return this.executeWithRetry<T>(finalConfig, finalConfig.retryCount!, finalConfig.retryDelay!)
  }

  public async delete<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    const finalConfig: RequestConfig = {
      url,
      method: 'DELETE',
      ...config,
      retryCount: config?.retryCount ?? 0,
      retryDelay: config?.retryDelay ?? DEFAULT_RETRY_DELAY,
    }
    return this.executeWithRetry<T>(finalConfig, finalConfig.retryCount!, finalConfig.retryDelay!)
  }

  public async request<T>(config: RequestConfig): Promise<ApiResponse<T>> {
    const finalConfig: RequestConfig = {
      ...config,
      retryCount: config.retryCount ?? DEFAULT_RETRY_COUNT,
      retryDelay: config.retryDelay ?? DEFAULT_RETRY_DELAY,
    }
    return this.executeWithRetry<T>(finalConfig, finalConfig.retryCount!, finalConfig.retryDelay!)
  }

  public cancelRequest(url: string): void {
    this.canceler.cancelRequest(url)
  }

  public cancelAllRequests(): void {
    this.canceler.cancelAll()
  }

  public setSecurityConfig(config: Partial<SecurityConfig>): void {
    this.securityConfig = { ...this.securityConfig, ...config }
  }

  public getSecurityConfig(): SecurityConfig {
    return { ...this.securityConfig }
  }
}

export const httpRequest = new HttpRequest()
export default httpRequest

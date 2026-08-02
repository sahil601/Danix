/**
 * Danix — Centralized Axios HTTP Client
 * Connects Next.js Frontend to FastAPI Backend at http://127.0.0.1:8000/api/v1
 * Features: Request/Response Interceptors, Bearer Auth Preparation, Error Handling, and Case Transformation.
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

// 1. Target FastAPI backend API base URL from environment or local fallback
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'

// 2. Create Centralized Axios Instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Helper: Convert snake_case backend JSON objects into camelCase for frontend UI
export function camelize<T = any>(obj: any): T {
  if (Array.isArray(obj)) {
    return obj.map(v => camelize(v)) as any
  } else if (obj !== null && obj !== undefined && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = key.replace(/([-_][a-z])/g, group =>
        group.toUpperCase().replace('-', '').replace('_', '')
      )
      result[camelKey] = camelize(obj[key])
      return result
    }, {} as any)
  }
  return obj
}

// 3. Request Interceptor: Auth Token Injection Preparation
apiClient.interceptors.request.use(
  (config: AxiosRequestConfig | any) => {
    if (typeof window !== 'undefined') {
      // Future authentication token preparation
      const token = localStorage.getItem('danix_auth_token') || sessionStorage.getItem('danix_auth_token')
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// 4. Response Interceptor: Error Handling and Data Transformation
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.data) {
      response.data = camelize(response.data)
    }
    return response
  },
  (error: AxiosError) => {
    let errorMessage = 'An unexpected API communication error occurred.'

    if (error.response) {
      const status = error.response.status
      const data = error.response.data as any

      if (data?.detail) {
        errorMessage = typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail)
      } else if (data?.message) {
        errorMessage = data.message
      } else {
        errorMessage = `Server error ${status}: ${error.response.statusText}`
      }

      if (status === 401) {
        // Handle unauthorized token expiration in future auth workflows
        if (typeof window !== 'undefined') {
          console.warn('[Danix Auth]: Session expired or unauthorized request.')
        }
      }
    } else if (error.request) {
      errorMessage = 'Unable to reach Danix backend server at http://127.0.0.1:8000. Is FastAPI server running?'
    } else {
      errorMessage = error.message
    }

    console.error('[Danix Axios Client Error]:', errorMessage)
    return Promise.reject(new Error(errorMessage))
  }
)

// 5. Generic HTTP Helper Methods
export const http = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const res = await apiClient.get<T>(url, config)
    return res.data
  },
  post: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const res = await apiClient.post<T>(url, data, config)
    return res.data
  },
  put: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const res = await apiClient.put<T>(url, data, config)
    return res.data
  },
  patch: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const res = await apiClient.patch<T>(url, data, config)
    return res.data
  },
  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const res = await apiClient.delete<T>(url, config)
    return res.data
  },
}

export default apiClient

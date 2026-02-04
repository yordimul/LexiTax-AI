/**
 * API Client for LexiTax Backend
 * This is structured for easy integration with Django backend
 * Replace mock functions with actual API calls when backend is ready
 */

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface AuthPayload {
  email: string
  password: string
  full_name?: string
}

export interface AuthResponse {
  id: string
  email: string
  full_name: string
  access_token?: string
  refresh_token?: string
}

export interface ChatMessage {
  id: string
  conversation_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export interface Conversation {
  id: string
  user_id: string
  title: string
  created_at: string
  updated_at: string
  messages: ChatMessage[]
}

export interface ChatQuery {
  conversation_id: string
  message: string
}

export interface ChatResponse {
  message_id: string
  conversation_id: string
  response: string
  confidence: number
  sources: string[]
  created_at: string
}

class APIClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api') {
    this.baseURL = baseURL
    // Get token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('access_token')
    }
  }

  setToken(token: string) {
    this.token = token
    localStorage.setItem('access_token', token)
  }

  clearToken() {
    this.token = null
    localStorage.removeItem('access_token')
  }

  private getHeaders(contentType = 'application/json') {
    const headers: Record<string, string> = {
      'Content-Type': contentType,
    }
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }
    return headers
  }

  // AUTH ENDPOINTS
  async signup(email: string, password: string, fullName: string): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await fetch(`${this.baseURL}/auth/signup/`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          email,
          password,
          full_name: fullName,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Signup failed',
        }
      }

      if (data.access_token) {
        this.setToken(data.access_token)
      }

      return {
        success: true,
        data,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      }
    }
  }

  async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await fetch(`${this.baseURL}/auth/login/`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Login failed',
        }
      }

      if (data.access_token) {
        this.setToken(data.access_token)
      }

      return {
        success: true,
        data,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      }
    }
  }

  async logout(): Promise<ApiResponse<null>> {
    try {
      await fetch(`${this.baseURL}/auth/logout/`, {
        method: 'POST',
        headers: this.getHeaders(),
      })

      this.clearToken()
      return {
        success: true,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Logout failed',
      }
    }
  }

  // CONVERSATION ENDPOINTS
  async getConversations(): Promise<ApiResponse<Conversation[]>> {
    try {
      const response = await fetch(`${this.baseURL}/conversations/`, {
        method: 'GET',
        headers: this.getHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to fetch conversations',
        }
      }

      return {
        success: true,
        data,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      }
    }
  }

  async createConversation(title: string): Promise<ApiResponse<Conversation>> {
    try {
      const response = await fetch(`${this.baseURL}/conversations/`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          title,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to create conversation',
        }
      }

      return {
        success: true,
        data,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      }
    }
  }

  async getConversation(conversationId: string): Promise<ApiResponse<Conversation>> {
    try {
      const response = await fetch(`${this.baseURL}/conversations/${conversationId}/`, {
        method: 'GET',
        headers: this.getHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to fetch conversation',
        }
      }

      return {
        success: true,
        data,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      }
    }
  }

  // CHAT ENDPOINTS
  async sendMessage(conversationId: string, message: string): Promise<ApiResponse<ChatResponse>> {
    try {
      const response = await fetch(`${this.baseURL}/chat/query/`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          conversation_id: conversationId,
          message,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to send message',
        }
      }

      return {
        success: true,
        data,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      }
    }
  }

  // GUEST ENDPOINTS
  async getGuestQueryCount(): Promise<ApiResponse<{ queries_used: number; queries_remaining: number }>> {
    try {
      const response = await fetch(`${this.baseURL}/guest/query-count/`, {
        method: 'GET',
        headers: this.getHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to fetch query count',
        }
      }

      return {
        success: true,
        data,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      }
    }
  }

  async sendGuestQuery(message: string): Promise<ApiResponse<ChatResponse>> {
    try {
      const response = await fetch(`${this.baseURL}/guest/query/`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          message,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to send message',
        }
      }

      return {
        success: true,
        data,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      }
    }
  }
}

export const apiClient = new APIClient()

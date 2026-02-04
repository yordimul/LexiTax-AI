/**
 * LexiTax Type Definitions
 * Shared types for frontend-backend communication
 */

export type UserRole = 'admin' | 'user' | 'guest'

export interface User {
  id: string
  email: string
  full_name: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  conversation_id: string
  role: 'user' | 'assistant'
  content: string
  confidence_score?: number
  sources?: string[]
  created_at: string
}

export interface Conversation {
  id: string
  user_id?: string
  title: string
  messages: Message[]
  is_guest: boolean
  created_at: string
  updated_at: string
}

export interface TaxQueryRequest {
  conversation_id: string
  message: string
  language?: 'en' | 'am'
}

export interface TaxQueryResponse {
  message_id: string
  conversation_id: string
  response: string
  confidence_score: number
  sources: Array<{
    title: string
    section: string
    reference: string
  }>
  created_at: string
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface ErrorResponse {
  error: string
  detail?: string
  status_code: number
}

export interface AuthToken {
  access_token: string
  refresh_token?: string
  token_type: string
  expires_in?: number
}

export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  email: string
  password: string
  full_name: string
}

export interface PasswordChangeRequest {
  old_password: string
  new_password: string
}

export interface FeedbackSubmission {
  conversation_id: string
  message_id: string
  rating: 1 | 2 | 3 | 4 | 5
  feedback_text?: string
}

export interface GuestSession {
  session_id: string
  queries_used: number
  queries_limit: number
  created_at: string
  expires_at: string
}

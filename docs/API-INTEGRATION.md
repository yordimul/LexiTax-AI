# LexiTax Frontend-Backend Integration Guide

This document outlines the API endpoints expected by the frontend and how to integrate with the Django backend.

## Base Configuration

- **Base URL**: `http://localhost:8000/api` (development) or configured via `NEXT_PUBLIC_API_URL`
- **Authentication**: Bearer token in Authorization header
- **Content-Type**: `application/json`

## Authentication Endpoints

### 1. User Signup
**Endpoint**: `POST /auth/signup/`

**Request**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "full_name": "John Doe"
}
```

**Response (200)**:
```json
{
  "id": "user_123",
  "email": "user@example.com",
  "full_name": "John Doe",
  "access_token": "jwt_token_here",
  "refresh_token": "refresh_token_here"
}
```

**Error Response (400/401)**:
```json
{
  "error": "Email already exists",
  "status_code": 400
}
```

---

### 2. User Login
**Endpoint**: `POST /auth/login/`

**Request**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Response (200)**:
```json
{
  "id": "user_123",
  "email": "user@example.com",
  "full_name": "John Doe",
  "access_token": "jwt_token_here",
  "refresh_token": "refresh_token_here"
}
```

---

### 3. User Logout
**Endpoint**: `POST /auth/logout/`

**Headers**:
```
Authorization: Bearer {access_token}
```

**Response (200)**:
```json
{
  "message": "Successfully logged out"
}
```

---

## Conversation Endpoints

### 1. Get All Conversations
**Endpoint**: `GET /conversations/`

**Headers**:
```
Authorization: Bearer {access_token}
```

**Response (200)**:
```json
[
  {
    "id": "conv_123",
    "user_id": "user_123",
    "title": "Corporate Tax Rates Query",
    "messages": [],
    "is_guest": false,
    "created_at": "2025-02-04T10:30:00Z",
    "updated_at": "2025-02-04T10:30:00Z"
  }
]
```

---

### 2. Create New Conversation
**Endpoint**: `POST /conversations/`

**Headers**:
```
Authorization: Bearer {access_token}
```

**Request**:
```json
{
  "title": "New Tax Question"
}
```

**Response (201)**:
```json
{
  "id": "conv_123",
  "user_id": "user_123",
  "title": "New Tax Question",
  "messages": [],
  "is_guest": false,
  "created_at": "2025-02-04T10:30:00Z",
  "updated_at": "2025-02-04T10:30:00Z"
}
```

---

### 3. Get Specific Conversation
**Endpoint**: `GET /conversations/{conversation_id}/`

**Headers**:
```
Authorization: Bearer {access_token}
```

**Response (200)**:
```json
{
  "id": "conv_123",
  "user_id": "user_123",
  "title": "Corporate Tax Rates Query",
  "messages": [
    {
      "id": "msg_1",
      "conversation_id": "conv_123",
      "role": "user",
      "content": "What are the corporate tax rates in Ethiopia?",
      "confidence_score": null,
      "sources": [],
      "created_at": "2025-02-04T10:30:00Z"
    },
    {
      "id": "msg_2",
      "conversation_id": "conv_123",
      "role": "assistant",
      "content": "The standard corporate income tax rate in Ethiopia is 30%...",
      "confidence_score": 0.95,
      "sources": [
        {
          "title": "Income Tax Proclamation",
          "section": "Article 28-35",
          "reference": "No. 979/2016"
        }
      ],
      "created_at": "2025-02-04T10:31:00Z"
    }
  ],
  "is_guest": false,
  "created_at": "2025-02-04T10:30:00Z",
  "updated_at": "2025-02-04T10:31:00Z"
}
```

---

## Chat Endpoints

### 1. Send Message (Authenticated)
**Endpoint**: `POST /chat/query/`

**Headers**:
```
Authorization: Bearer {access_token}
```

**Request**:
```json
{
  "conversation_id": "conv_123",
  "message": "What are the corporate tax rates in Ethiopia?",
  "language": "en"
}
```

**Response (200)**:
```json
{
  "message_id": "msg_2",
  "conversation_id": "conv_123",
  "response": "The standard corporate income tax rate in Ethiopia is 30% on taxable income. However, there are several important considerations...",
  "confidence_score": 0.95,
  "sources": [
    {
      "title": "Income Tax Proclamation",
      "section": "Articles 28-35",
      "reference": "No. 979/2016"
    },
    {
      "title": "Council of Ministers Regulations",
      "section": "Investment Incentives",
      "reference": "No. 421/2018"
    }
  ],
  "created_at": "2025-02-04T10:31:00Z"
}
```

---

### 2. Send Guest Query
**Endpoint**: `POST /guest/query/`

**Request** (no authentication needed):
```json
{
  "message": "How do I calculate withholding tax?"
}
```

**Response (200)**:
```json
{
  "message_id": "guest_msg_1",
  "conversation_id": "guest_conv_temp",
  "response": "Withholding tax in Ethiopia is calculated on various types of payments...",
  "confidence_score": 0.92,
  "sources": [
    {
      "title": "Income Tax Proclamation",
      "section": "Articles 69-93",
      "reference": "No. 979/2016"
    }
  ],
  "created_at": "2025-02-04T10:35:00Z"
}
```

---

### 3. Get Guest Query Count
**Endpoint**: `GET /guest/query-count/`

**Response (200)**:
```json
{
  "queries_used": 1,
  "queries_remaining": 2,
  "queries_limit": 3
}
```

---

## Error Handling

All endpoints return consistent error responses:

**400 - Bad Request**:
```json
{
  "error": "Invalid request format",
  "detail": "Missing required field: message",
  "status_code": 400
}
```

**401 - Unauthorized**:
```json
{
  "error": "Authentication required",
  "detail": "Invalid or missing token",
  "status_code": 401
}
```

**404 - Not Found**:
```json
{
  "error": "Conversation not found",
  "status_code": 404
}
```

**429 - Rate Limited**:
```json
{
  "error": "Too many requests",
  "detail": "Please try again after 60 seconds",
  "status_code": 429
}
```

**500 - Server Error**:
```json
{
  "error": "Internal server error",
  "detail": "An unexpected error occurred",
  "status_code": 500
}
```

---

## Frontend API Client Usage

The frontend uses `/lib/api-client.ts` for all API calls. Example usage:

```typescript
import { apiClient } from '@/lib/api-client'

// Signup
const signupResult = await apiClient.signup('user@example.com', 'password', 'John Doe')
if (signupResult.success) {
  console.log('User created:', signupResult.data)
}

// Login
const loginResult = await apiClient.login('user@example.com', 'password')
if (loginResult.success) {
  console.log('Logged in:', loginResult.data)
}

// Send message
const messageResult = await apiClient.sendMessage('conv_123', 'What are tax deductions?')
if (messageResult.success) {
  console.log('Response:', messageResult.data)
}

// Guest query
const guestResult = await apiClient.sendGuestQuery('How do I calculate VAT?')
if (guestResult.success) {
  console.log('Guest response:', guestResult.data)
}
```

---

## Database Requirements

### Users Table
- `id` (UUID/Primary Key)
- `email` (String, Unique)
- `full_name` (String)
- `password_hash` (String)
- `role` (Enum: admin, user, guest)
- `created_at` (DateTime)
- `updated_at` (DateTime)

### Conversations Table
- `id` (UUID/Primary Key)
- `user_id` (FK to Users, nullable for guest)
- `title` (String)
- `is_guest` (Boolean)
- `created_at` (DateTime)
- `updated_at` (DateTime)

### Messages Table
- `id` (UUID/Primary Key)
- `conversation_id` (FK to Conversations)
- `role` (Enum: user, assistant)
- `content` (Text)
- `confidence_score` (Float, nullable)
- `sources` (JSON Array)
- `created_at` (DateTime)

---

## Environment Variables

Frontend expects:
- `NEXT_PUBLIC_API_URL`: Backend API base URL (default: `http://localhost:8000/api`)

Backend should support:
- `JWT_SECRET_KEY`: Secret for token generation
- `JWT_EXPIRATION_HOURS`: Token expiration time
- `GUEST_QUERY_LIMIT`: Number of queries allowed for guests (default: 3)
- `TAX_LAW_API_KEY`: API key for tax law database/LLM

---

## Integration Checklist

- [ ] Implement all auth endpoints with JWT authentication
- [ ] Create conversation management endpoints
- [ ] Implement chat query processing with tax law AI
- [ ] Set up guest session tracking with query limits
- [ ] Configure CORS for frontend domain
- [ ] Implement rate limiting for guest queries
- [ ] Add proper error handling and validation
- [ ] Set up database models
- [ ] Configure environment variables
- [ ] Add API documentation/Swagger
- [ ] Test all endpoints with frontend client
- [ ] Deploy to production

---

## Notes for Backend Developer

1. **Token Management**: Use JWT tokens with refresh token rotation
2. **Guest Sessions**: Track via session ID or IP + timestamp
3. **AI Integration**: Implement tax law AI response generation (connect to LLM or tax law database)
4. **Sources**: Return actual law references with responses
5. **Validation**: Validate all inputs before processing
6. **Logging**: Log all queries for monitoring and improvements
7. **Performance**: Optimize conversation retrieval with pagination
8. **Security**: Use parameterized queries, validate tokens, implement CORS properly

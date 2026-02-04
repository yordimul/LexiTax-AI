'use client'

import React from "react"

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Plus, LogOut } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
}

interface ChatInterfaceProps {
  isLoggedIn: boolean
  userName: string
  onLogout: () => void
  onLogoClick: () => void
}

const GUEST_QUERY_LIMIT = 3

const mockResponses = [
  {
    question: 'What are the corporate tax rates in Ethiopia?',
    answer:
      'In Ethiopia, corporate income tax rates vary based on the nature of the business activity. For most enterprises, the standard corporate income tax rate is 30% on taxable income. However, there are some important considerations:\n\n1. **Manufacturing Enterprises**: May enjoy tax holidays or reduced rates under investment incentive programs.\n\n2. **Small Business Enterprises**: Defined as businesses with annual turnover below 3 million Birr, and are taxed at 10% on net profit.\n\n3. **Banks and Insurance Companies**: Subject to higher rates, typically around 35% for commercial banks.\n\n4. **Petroleum Companies**: Subject to special tax regimes.\n\nReferences:\n- Income Tax Proclamation No. 979/2016, Articles 28-35\n- Council of Ministers Regulations No. 421/2018',
  },
  {
    question: 'How do I calculate withholding tax?',
    answer:
      'Withholding tax in Ethiopia is calculated on various types of payments. Here are the main categories:\n\n1. **Dividends**: 10% withheld by the payer\n2. **Interest**: 10% withheld\n3. **Royalties**: 10% withheld\n4. **Rental Income**: 10% withheld\n5. **Service Fees**: 5-10% depending on the service type\n6. **Contractor Payments**: 2-3% on gross payment for certain services\n\n**Calculation Formula**:\nWithholding Tax = Payment Amount × Applicable Rate\n\n**Example**: If a company pays 100,000 Birr as dividend:\nWithholding Tax = 100,000 × 10% = 10,000 Birr\nNet Payment = 100,000 - 10,000 = 90,000 Birr\n\nReferences:\n- Income Tax Proclamation No. 979/2016, Articles 69-93\n- Tax Administration Proclamation No. 983/2016',
  },
  {
    question: 'What expenses are deductible for businesses?',
    answer:
      'Under Ethiopian tax law, the following business expenses are generally deductible in computing taxable income:\n\n**Ordinary and Necessary Expenses**:\n- Salaries and wages paid to employees\n- Cost of goods sold (COGS)\n- Rent for business premises\n- Utilities (electricity, water, telephone)\n- Office supplies and materials\n- Professional fees (accounting, legal, consulting)\n- Insurance premiums for business\n- Depreciation on business assets\n- Interest on business loans\n- Transportation and travel expenses\n- Advertising and marketing costs\n- Training and development expenses\n\n**Expenses NOT Deductible**:\n- Personal living expenses\n- Fines and penalties\n- Taxes on income itself\n- Expenditures for acquiring capital assets (depreciated instead)\n- Political contributions\n- Donations (with limited exceptions)\n\n**Important**: All deductions must be supported by documentation and substantiate business purpose.\n\nReferences:\n- Income Tax Proclamation No. 979/2016, Articles 14-20\n- Tax Administration Proclamation No. 983/2016',
  },
]

export default function ChatInterface({ isLoggedIn, userName, onLogout, onLogoClick }: ChatInterfaceProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [guestQueriesUsed, setGuestQueriesUsed] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'New Conversation',
      messages: [],
      createdAt: new Date(),
    }
    setConversations([newConversation, ...conversations])
    setCurrentConversationId(newConversation.id)
    setMessages([])
  }

  const selectConversation = (id: string) => {
    const conversation = conversations.find((c) => c.id === id)
    if (conversation) {
      setCurrentConversationId(id)
      setMessages(conversation.messages)
    }
  }

  const getMockResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    for (const mock of mockResponses) {
      if (
        lowerMessage.includes('corporate tax') ||
        lowerMessage.includes('tax rate') ||
        lowerMessage.includes('corporate income')
      ) {
        return mockResponses[0].answer
      }
      if (lowerMessage.includes('withholding') || lowerMessage.includes('withheld')) {
        return mockResponses[1].answer
      }
      if (
        lowerMessage.includes('deductible') ||
        lowerMessage.includes('deduction') ||
        lowerMessage.includes('expenses')
      ) {
        return mockResponses[2].answer
      }
    }

    // Default response
    return `Thank you for your question about Ethiopian tax law: "${userMessage}"\n\nBased on Ethiopian tax regulations, I can provide guidance on various tax matters. However, for the specific scenario you mentioned, I recommend consulting with:\n\n1. **Ethiopian Tax Authority** - For official tax guidance\n2. **Licensed Tax Professionals** - For personalized advice\n3. **Official Tax Proclamations** - Income Tax Proclamation No. 979/2016 and Tax Administration Proclamation No. 983/2016\n\nPlease note that while I strive for accuracy, this information should not be considered as professional tax advice. Always verify with authoritative sources.`
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    // Check guest query limit
    if (!isLoggedIn && guestQueriesUsed >= GUEST_QUERY_LIMIT) {
      alert(`Guest mode is limited to ${GUEST_QUERY_LIMIT} queries. Please sign in to continue.`)
      return
    }

    // Create new conversation if none exists
    if (!currentConversationId) {
      createNewConversation()
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages([...messages, userMessage])
    setInput('')
    setIsLoading(true)

    if (!isLoggedIn) {
      setGuestQueriesUsed(guestQueriesUsed + 1)
    }

    // Simulate API delay
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getMockResponse(input),
        timestamp: new Date(),
      }

      const updatedMessages = [...messages, userMessage, assistantMessage]
      setMessages(updatedMessages)

      // Update conversation
      setConversations((prevConversations) =>
        prevConversations.map((conv) => {
          if (conv.id === currentConversationId) {
            return {
              ...conv,
              messages: updatedMessages,
              title: input.substring(0, 50) + (input.length > 50 ? '...' : ''),
            }
          }
          return conv
        })
      )

      setIsLoading(false)
    }, 1000)
  }

  const currentConversation = conversations.find((c) => c.id === currentConversationId)

  return (
    <div className="min-h-screen flex bg-white">
      {/* Sidebar */}
      <div className="w-64 bg-primary text-white flex flex-col border-r border-gray-200">
        <div className="p-4">
          <button onClick={onLogoClick} className="flex items-center gap-2 hover:opacity-80 transition mb-6">
            <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-lg">
              <span className="text-xl font-bold">⚖️</span>
            </div>
            <div>
              <div className="font-bold text-lg">Lexi<span className="text-accent">Tax</span></div>
              <div className="text-xs text-white/70">AI ASSISTANT</div>
            </div>
          </button>

          <Button
            onClick={createNewConversation}
            className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 font-semibold py-2 flex items-center justify-center gap-2"
          >
            <Plus size={20} /> New Conversation
          </Button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto px-4 space-y-2">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => selectConversation(conv.id)}
              className={`w-full text-left px-3 py-2 rounded-lg transition text-sm ${
                currentConversationId === conv.id ? 'bg-white/20 font-semibold' : 'hover:bg-white/10 text-white/80'
              }`}
            >
              <div className="truncate">{conv.title || 'New Conversation'}</div>
              <div className="text-xs text-white/60">{conv.createdAt.toLocaleDateString()}</div>
            </button>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-white/20 space-y-3">
          {!isLoggedIn && (
            <div className="bg-accent/20 border border-accent rounded-lg p-3 text-sm text-white">
              <div className="font-semibold text-accent">Guest Mode</div>
              <div className="text-xs mt-1 text-white/80">
                {GUEST_QUERY_LIMIT - guestQueriesUsed} queries remaining
              </div>
            </div>
          )}

          <div className="text-sm text-white/80">
            <div className="font-semibold">{userName}</div>
          </div>

          {isLoggedIn && (
            <Button
              onClick={onLogout}
              className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 font-semibold py-2 flex items-center justify-center gap-2"
            >
              <LogOut size={18} /> Logout
            </Button>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 p-4 flex items-center">
          <div>
            <h1 className="text-lg font-semibold text-primary">How can I help you today?</h1>
            <p className="text-sm text-gray-500">
              Ask any question about Ethiopian tax law. I'll provide answers with citations from authoritative sources.
            </p>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="text-5xl mb-4">⚖️</div>
              <h2 className="text-2xl font-bold text-primary mb-2">How can I help you today?</h2>
              <p className="text-gray-600 max-w-md">
                Ask any question about Ethiopian tax law. I'll provide answers with citations from authoritative sources.
              </p>

              {/* Suggested Questions */}
              <div className="mt-8 grid grid-cols-1 gap-3 w-full max-w-md">
                {[
                  'What are the corporate tax rates in Ethiopia?',
                  'How do I calculate withholding tax?',
                  'What expenses are deductible for businesses?',
                ].map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(question)}
                    className="text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition text-gray-700 font-medium"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-xl px-4 py-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-primary text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-900 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 px-4 py-3 rounded-lg rounded-bl-none">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-100"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-200"></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-6 bg-white">
          {!isLoggedIn && guestQueriesUsed >= GUEST_QUERY_LIMIT && (
            <div className="mb-4 p-4 bg-accent/10 border border-accent/30 rounded-lg text-center text-accent font-semibold text-sm">
              Guest queries limit reached. Please sign in to continue.
            </div>
          )}

          <form onSubmit={handleSendMessage} className="flex gap-3">
            <Input
              type="text"
              placeholder="Ask a tax law question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={!isLoggedIn && guestQueriesUsed >= GUEST_QUERY_LIMIT}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button
              type="submit"
              disabled={isLoading || (!isLoggedIn && guestQueriesUsed >= GUEST_QUERY_LIMIT)}
              className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3 flex items-center gap-2"
            >
              <Send size={20} />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { MessageCircle, FileText, Clock, Zap, BookOpen, Shield, ChevronRight } from 'lucide-react'
import Header from '@/components/header'
import AuthModal from '@/components/auth-modal'
import ChatInterface from '@/components/chat-interface'

export default function Home() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'chat'>('landing')
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)

  const handleGetStarted = () => {
    setIsSignUp(true)
    setIsAuthModalOpen(true)
  }

  const handleTryAsGuest = () => {
    setCurrentPage('chat')
  }

  const handleAuthSuccess = (name: string) => {
    setUserName(name)
    setIsLoggedIn(true)
    setIsAuthModalOpen(false)
    setCurrentPage('chat')
  }

  const handleSignIn = () => {
    setIsSignUp(false)
    setIsAuthModalOpen(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUserName(null)
    setCurrentPage('landing')
  }

  const handleLogoClick = () => {
    setCurrentPage('landing')
  }

  if (currentPage === 'chat') {
    return (
      <ChatInterface
        isLoggedIn={isLoggedIn}
        userName={userName || 'Guest'}
        onLogout={handleLogout}
        onLogoClick={handleLogoClick}
      />
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header onLogoClick={handleLogoClick} isLoggedIn={isLoggedIn} onLoginClick={handleSignIn} />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary to-primary/80 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-6 bg-white/20 px-4 py-2 rounded-full backdrop-blur">
            <span className="text-accent text-lg">⚖️</span>
            <span className="text-sm font-medium">AI-Powered Legal Research</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Tax Law Research,
            <br />
            <span className="text-accent">Simplified</span>
          </h1>

          <p className="text-lg text-white/90 mb-12 max-w-2xl mx-auto">
            Get instant, citation-backed answers to your Ethiopian tax law questions.
            Powered by AI, grounded in authoritative legal documents.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={handleGetStarted}
              className="bg-accent hover:bg-accent/90 text-primary font-semibold px-8 py-6 text-lg flex items-center gap-2"
            >
              Get Started Free <ChevronRight size={20} />
            </Button>
            <Button
              onClick={handleTryAsGuest}
              variant="outline"
              className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold bg-transparent"
            >
              Try as Guest
            </Button>
          </div>
        </div>
      </section>

      {/* Three Pillars Section */}
      <section className="bg-gradient-to-b from-primary/10 via-white to-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="p-8 bg-primary/5 border-0 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-accent/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl text-accent">⚖️</span>
                </div>
              </div>
              <h3 className="font-bold text-xl mb-3 text-primary">Legal Accuracy</h3>
              <p className="text-gray-600">Responses backed by official tax law documents and regulations</p>
            </Card>

            <Card className="p-8 bg-primary/5 border-0 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-accent/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl text-accent">🧠</span>
                </div>
              </div>
              <h3 className="font-bold text-xl mb-3 text-primary">AI-Powered</h3>
              <p className="text-gray-600">Natural language understanding for complex legal queries</p>
            </Card>

            <Card className="p-8 bg-primary/5 border-0 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-accent/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl text-accent">📋</span>
                </div>
              </div>
              <h3 className="font-bold text-xl mb-3 text-primary">Trusted Sources</h3>
              <p className="text-gray-600">Citations from verified legal documents and guidelines</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-primary">
            Why Choose <span className="text-accent">LexiTax</span>?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="p-8 border border-gray-200 hover:shadow-lg transition">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageCircle size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2 text-primary">Natural Language Queries</h3>
                  <p className="text-gray-600">Ask questions in plain English. Our AI understands context and legal terminology.</p>
                </div>
              </div>
            </Card>

            <Card className="p-8 border border-gray-200 hover:shadow-lg transition">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2 text-primary">Citation-Backed Answers</h3>
                  <p className="text-gray-600">Every response includes references to specific sections of tax law documents.</p>
                </div>
              </div>
            </Card>

            <Card className="p-8 border border-gray-200 hover:shadow-lg transition">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2 text-primary">Conversation History</h3>
                  <p className="text-gray-600">Save and continue your research sessions. Never lose track of important discussions.</p>
                </div>
              </div>
            </Card>

            <Card className="p-8 border border-gray-200 hover:shadow-lg transition">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2 text-primary">Confidence Indicators</h3>
                  <p className="text-gray-600">Transparency about the AI's certainty level for each response.</p>
                </div>
              </div>
            </Card>

            <Card className="p-8 border border-gray-200 hover:shadow-lg transition">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2 text-primary">Comprehensive Coverage</h3>
                  <p className="text-gray-600">Access to a vast library of Ethiopian tax laws, regulations, and guidelines.</p>
                </div>
              </div>
            </Card>

            <Card className="p-8 border border-gray-200 hover:shadow-lg transition">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2 text-primary">Secure & Private</h3>
                  <p className="text-gray-600">Your queries and research are kept confidential and secure.</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Who Is LexiTax For Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-primary">
            Who is <span className="text-accent">LexiTax AI</span> for?
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Our platform is designed to serve a diverse range of users who need reliable tax law information.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-8 border border-gray-200 text-center hover:shadow-lg transition">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
              </div>
              <h3 className="font-bold text-xl mb-3 text-primary">Legal Consumers</h3>
              <p className="text-gray-600">Individuals and businesses seeking clear answers to tax-related questions without complex legal jargon.</p>
            </Card>

            <Card className="p-8 border border-gray-200 text-center hover:shadow-lg transition">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
                  <span className="text-2xl">💼</span>
                </div>
              </div>
              <h3 className="font-bold text-xl mb-3 text-primary">Lawyers</h3>
              <p className="text-gray-600">Legal professionals who need quick access to tax law references and citations for their cases.</p>
            </Card>

            <Card className="p-8 border border-gray-200 text-center hover:shadow-lg transition">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
                  <span className="text-2xl">🎓</span>
                </div>
              </div>
              <h3 className="font-bold text-xl mb-3 text-primary">Law Students</h3>
              <p className="text-gray-600">Students researching tax law topics for academic work, exams, and professional preparation.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <span className="text-2xl font-bold">LexiTax</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-accent transition">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-accent transition">
              Terms of Service
            </a>
          </div>
          <div className="text-sm text-white/70 mt-4 md:mt-0">
            © 2025 LexiTax AI
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        isSignUp={isSignUp}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  )
}

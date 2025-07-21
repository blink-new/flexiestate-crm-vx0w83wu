import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { blink } from './blink/client'
import { Sidebar } from './components/layout/Sidebar'
import { Header } from './components/layout/Header'
import { Dashboard } from './pages/Dashboard'
import { Pipeline } from './pages/Pipeline'
import { Leads } from './pages/Leads'
import { Properties } from './pages/Properties'
import { Tasks } from './pages/Tasks'
import { Analytics } from './pages/Analytics'
import { Relationships } from './pages/Relationships'
import { Toaster } from 'react-hot-toast'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Loading FlexiEstate CRM</h2>
          <p className="text-gray-600 mt-1">Please wait while we set up your workspace...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">FlexiEstate CRM</h1>
          <p className="text-gray-600 mb-8">
            Your flexible real estate CRM with drag-and-drop pipeline management, 
            comprehensive lead tracking, and advanced relationship mapping.
          </p>
          <button
            onClick={() => blink.auth.login()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Sign In to Get Started
          </button>
          <div className="mt-6 grid grid-cols-3 gap-4 text-center text-sm text-gray-500">
            <div>
              <div className="font-semibold text-gray-900">Pipeline</div>
              <div>Drag & Drop</div>
            </div>
            <div>
              <div className="font-semibold text-gray-900">Relationships</div>
              <div>Many-to-Many</div>
            </div>
            <div>
              <div className="font-semibold text-gray-900">Tasks</div>
              <div>Smart Tracking</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          <Header />
          <main className="min-h-[calc(100vh-4rem)]">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/pipeline" element={<Pipeline />} />
              <Route path="/leads" element={<Leads />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/relationships" element={<Relationships />} />
              <Route path="/analytics" element={<Analytics />} />
            </Routes>
          </main>
        </div>
        <Toaster />
      </div>
    </Router>
  )
}

export default App
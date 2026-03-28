import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import Home from './pages/Home'

// We will implement these empty pages later
const ProjectDetail = () => <div className="p-20">Project Detail</div>
const BlogPost = () => <div className="p-20">Blog Post</div>

import { CursorTrail } from './components/ui/CursorTrail'
import { GlobalGamification } from './components/ui/GlobalGamification'

function App() {
  return (
    <BrowserRouter>
      {/* Global Overlays */}
      <CursorTrail />
      <GlobalGamification />
      <Toaster position="bottom-right" theme="dark" />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

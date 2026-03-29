import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import Home from './pages/Home'
import { ProjectDetail } from './pages/ProjectDetail'
import { BlogPost } from './pages/BlogPost'


import { CursorTrail } from './components/ui/CursorTrail'
import { GlobalGamification } from './components/ui/GlobalGamification'
import { AestheticSwitcher } from './components/ui/AestheticSwitcher'

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

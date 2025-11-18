import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import BookCover from './components/BookCover'
import Book3D from './components/Book3D'

const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

export default function App(){
  const [opened, setOpened] = useState(false)
  const [dark, setDark] = useState(true)
  const [entries, setEntries] = useState([])

  useEffect(()=>{
    loadEntries()
  }, [])

  async function loadEntries(){
    try{
      const res = await fetch(`${API_BASE}/api/entries`)
      const data = await res.json()
      setEntries(data)
    }catch(e){
      console.warn('Backend not available yet, using local storage fallback.')
      const ls = localStorage.getItem('journalEntries')
      if(ls){ setEntries(JSON.parse(ls)) }
    }
  }

  async function saveEntry(entry){
    // Try backend first
    try{
      const res = await fetch(`${API_BASE}/api/entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      })
      const saved = await res.json()
      setEntries(prev => [saved, ...prev])
    }catch(e){
      // Fallback to local storage
      const next = [{...entry, id: crypto.randomUUID(), created_at: new Date().toISOString()}, ...entries]
      setEntries(next)
      localStorage.setItem('journalEntries', JSON.stringify(next))
    }
  }

  function exportPDF(){
    window.print()
  }

  return (
    <div className={`min-h-screen ${dark? 'bg-neutral-950':'bg-neutral-900'} relative overflow-hidden`}>
      {/* Desk background */}
      <div className="absolute inset-0 bg-[radial-gradient(800px_400px_at_50%_20%,rgba(255,215,128,0.1),transparent),radial-gradient(1000px_600px_at_50%_120%,rgba(0,0,0,0.7),transparent)]" />

      <div className="relative min-h-screen flex items-center justify-center p-8">
        <AnimatePresence mode="wait">
          {!opened ? (
            <motion.div
              key="cover"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <BookCover onOpen={()=>setOpened(true)} dark={dark} />
            </motion.div>
          ) : (
            <motion.div
              key="book"
              initial={{ opacity: 0, rotateX: -15 }}
              animate={{ opacity: 1, rotateX: 0 }}
              exit={{ opacity: 0, rotateX: 15 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <Book3D entries={entries} onSave={saveEntry} onExportPDF={exportPDF} dark={dark} setDark={setDark} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

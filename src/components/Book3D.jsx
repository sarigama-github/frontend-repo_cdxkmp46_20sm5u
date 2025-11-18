import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Calendar, Search, Plus, Upload, Tag, FileDown, Sun, Moon } from 'lucide-react'

function Field({ label, children }){
  return (
    <div className="mb-3">
      <div className="text-xs uppercase tracking-wider text-neutral-500 mb-1">{label}</div>
      {children}
    </div>
  )
}

function TagInput({ tags, setTags }){
  const [value, setValue] = useState('')
  function addTag(v){
    const t = v.trim()
    if(!t) return
    if(!tags.includes(t)) setTags([...tags, t])
    setValue('')
  }
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map(t => (
          <span key={t} className="px-2 py-1 rounded-full bg-amber-200/60 text-amber-900 text-xs border border-amber-400/60">{t}</span>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input value={value} onChange={e=>setValue(e.target.value)} onKeyDown={(e)=>{ if(e.key==='Enter') addTag(value)}} placeholder="Add tag" className="flex-1 bg-transparent border-b border-neutral-300 focus:outline-none py-1 text-sm"/>
        <button onClick={()=>addTag(value)} className="px-2 py-1 text-xs rounded bg-amber-500 text-white">Add</button>
      </div>
    </div>
  )
}

function ScreenshotUpload({ images, setImages }){
  const inputRef = useRef()
  const onFiles = async (files) => {
    const arr = Array.from(files)
    const datas = await Promise.all(arr.map(f => new Promise((res, rej)=>{
      const reader = new FileReader()
      reader.onload = ()=>res(reader.result)
      reader.onerror = rej
      reader.readAsDataURL(f)
    })))
    setImages([...(images||[]), ...datas])
  }
  return (
    <div>
      <div className="grid grid-cols-3 gap-2 mb-2">
        {(images||[]).map((src,i)=>(
          <img key={i} src={src} className="w-full h-24 object-cover rounded border border-amber-200/60 shadow-sm"/>
        ))}
      </div>
      <button onClick={()=>inputRef.current?.click()} className="inline-flex items-center gap-2 px-3 py-2 rounded bg-amber-600 text-white text-sm">
        <Upload size={16}/> Upload screenshots
      </button>
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e)=>onFiles(e.target.files)} />
    </div>
  )
}

export default function Book3D({ entries, onSave, onExportPDF, dark, setDark }){
  const [index, setIndex] = useState(0)
  const [page, setPage] = useState(entries[0] || {})
  const [query, setQuery] = useState('')

  useEffect(()=>{
    setPage(entries[index] || {})
  }, [index, entries])

  function go(dir){
    setIndex(i=> Math.max(0, Math.min(entries.length-1, i+dir)))
  }

  function handleChange(key, value){
    setPage(p=> ({...p, [key]: value}))
  }

  function createNew(){
    const blank = { date: new Date().toISOString().slice(0,10), instrument:'', session:'NY', rr:'', lot_size:'', outcome:'Win', notes:'', tags:[], screenshots:[] }
    setIndex(entries.length)
    setPage(blank)
  }

  async function save(){
    await onSave(page)
  }

  const sheet = dark ? 'from-[#0e0b09] to-[#1a1410]' : 'from-amber-50 to-amber-100'
  const ink = dark ? 'text-amber-100' : 'text-zinc-800'

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button onClick={()=>go(-1)} className="p-2 rounded bg-black/20 text-white hover:bg-black/30"><ChevronLeft/></button>
          <button onClick={()=>go(1)} className="p-2 rounded bg-black/20 text-white hover:bg-black/30"><ChevronRight/></button>
          <button onClick={createNew} className="ml-2 inline-flex items-center gap-2 px-3 py-2 rounded bg-amber-600 text-white text-sm"><Plus size={16}/> New Page</button>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-black/20 text-white px-3 py-2 rounded">
            <Search size={16}/>
            <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search by tag or text" className="bg-transparent outline-none text-sm placeholder-white/60" />
          </div>
          <button onClick={onExportPDF} className="inline-flex items-center gap-2 px-3 py-2 rounded bg-emerald-600 text-white text-sm"><FileDown size={16}/> Export PDF</button>
          <button onClick={()=>setDark(d=>!d)} className="p-2 rounded bg-black/20 text-white hover:bg-black/30">{dark ? <Sun size={16}/> : <Moon size={16}/>}</button>
        </div>
      </div>

      {/* Book */}
      <div className="relative mx-auto w-[1000px] max-w-full aspect-[16/10] perspective-[2000px]">
        <div className="absolute inset-0 rounded-2xl shadow-2xl bg-[url('https://images.unsplash.com/photo-1760764541302-e3955fbc6b2b?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxjZXJhbWljJTIwcG90dGVyeSUyMGhhbmRtYWRlfGVufDB8MHx8fDE3NjM0MTE5NzJ8MA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80')] bg-cover bg-center" />
        {/* open book */}
        <div className="absolute inset-6 rounded-xl grid grid-cols-2 gap-4">
          {[0,1].map(side => (
            <div key={side} className={`relative rounded-lg p-6 bg-gradient-to-br ${sheet} shadow-inner border ${dark? 'border-amber-900/40':'border-amber-200'}`}>
              <div className="absolute inset-0 pointer-events-none rounded-lg" style={{boxShadow: side===0? 'inset -30px 0 60px rgba(0,0,0,0.08)': 'inset 30px 0 60px rgba(0,0,0,0.08)'}}></div>
              {side===0 ? (
                <div className={`space-y-3 ${ink}`}>
                  <Field label="Date">
                    <div className="flex items-center gap-2">
                      <Calendar size={16}/>
                      <input type="date" value={page.date||''} onChange={(e)=>handleChange('date', e.target.value)} className="bg-transparent border-b border-neutral-300 focus:outline-none py-1"/>
                    </div>
                  </Field>
                  <Field label="Instrument">
                    <input value={page.instrument||''} onChange={(e)=>handleChange('instrument', e.target.value)} placeholder="ES, NQ, XAUUSD" className="bg-transparent border-b border-neutral-300 focus:outline-none py-1 w-full"/>
                  </Field>
                  <div className="grid grid-cols-3 gap-3">
                    <Field label="Session">
                      <select value={page.session||'NY'} onChange={(e)=>handleChange('session', e.target.value)} className="bg-transparent border-b border-neutral-300 focus:outline-none py-1 w-full">
                        {['NY','London','Asia','Other'].map(s=> <option key={s} value={s}>{s}</option>)}
                      </select>
                    </Field>
                    <Field label="R/R">
                      <input value={page.rr||''} onChange={(e)=>handleChange('rr', e.target.value)} placeholder="2.5" className="bg-transparent border-b border-neutral-300 focus:outline-none py-1 w-full"/>
                    </Field>
                    <Field label="Lot Size">
                      <input value={page.lot_size||''} onChange={(e)=>handleChange('lot_size', e.target.value)} placeholder="1.0" className="bg-transparent border-b border-neutral-300 focus:outline-none py-1 w-full"/>
                    </Field>
                  </div>
                  <Field label="Outcome">
                    <div className="flex gap-3">
                      {['Win','Loss','Break-even'].map(o=> (
                        <label key={o} className="inline-flex items-center gap-2">
                          <input type="radio" name="outcome" checked={page.outcome===o} onChange={()=>handleChange('outcome', o)} />
                          <span>{o}</span>
                        </label>
                      ))}
                    </div>
                  </Field>

                  <Field label="Tags">
                    <TagInput tags={page.tags||[]} setTags={(t)=>handleChange('tags', t)} />
                  </Field>

                  <button onClick={save} className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded bg-amber-700 text-white"><Plus size={16}/> Save Entry</button>
                </div>
              ) : (
                <div className={`space-y-3 ${ink}`}>
                  <Field label="Screenshots">
                    <ScreenshotUpload images={page.screenshots||[]} setImages={(imgs)=>handleChange('screenshots', imgs)} />
                  </Field>
                  <Field label="Notes">
                    <textarea value={page.notes||''} onChange={(e)=>handleChange('notes', e.target.value)} rows={10} placeholder="Write your journal notes here..." className="w-full bg-transparent border border-dashed border-amber-300 rounded p-3 leading-relaxed" />
                  </Field>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Results filtered display (simple search on client) */}
      {query && (
        <div className="mt-6 text-white/80 text-sm">
          Showing results matching: "{query}"
        </div>
      )}
    </div>
  )
}

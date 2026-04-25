'use client'

import { useEffect, useState } from 'react'
import { supabase, HappyHour } from '@/lib/supabase'

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
const DAY_SHORT = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

function formatTime(time: string) {
  const [h, m] = time.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}${m > 0 ? `:${String(m).padStart(2,'0')}` : ''} ${ampm}`
}

function getTodayName() {
  const d = new Date().getDay()
  return DAYS[d === 0 ? 6 : d - 1]
}

export default function Home() {
  const [happyHours, setHappyHours] = useState<HappyHour[]>([])
  const [selectedDay, setSelectedDay] = useState<string>(getTodayName())
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const { data, error } = await supabase
        .from('happy_hours')
        .select('*')
        .order('start_time')
      if (!error && data) setHappyHours(data)
      setLoading(false)
    }
    fetchData()
  }, [])

  const filtered = happyHours.filter(hh => {
    const matchDay = hh.days.includes(selectedDay)
    const q = search.toLowerCase()
    const matchSearch = q === '' ||
      hh.name.toLowerCase().includes(q) ||
      (hh.neighbourhood?.toLowerCase().includes(q) ?? false) ||
      hh.deals.toLowerCase().includes(q)
    return matchDay && matchSearch
  })

  const today = getTodayName()

  return (
    <main style={{ minHeight: '100vh', background: '#0d0d0d', fontFamily: 'Georgia, serif', color: '#fff' }}>

      {/* ── HEADER ── */}
      <header style={{
        background: 'linear-gradient(160deg, #1c0800 0%, #2e1200 60%, #1c0800 100%)',
        borderBottom: '2px solid #ff6b00',
        padding: '2.5rem 1.5rem 2rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'repeating-linear-gradient(45deg,#ff6b00 0,#ff6b00 1px,transparent 1px,transparent 18px)',
        }}/>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: '0.7rem', letterSpacing: '0.35em', color: '#ff6b00', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
            🍺 Downtown Toronto
          </p>
          <h1 style={{ margin: 0, fontSize: 'clamp(2.2rem,7vw,3.8rem)', fontWeight: 900, lineHeight: 1, textShadow: '0 0 50px rgba(255,107,0,0.35)' }}>
            Happy Hour<br/><span style={{ color: '#ff6b00' }}>Finder</span>
          </h1>
          <p style={{ color: '#777', marginTop: '0.8rem', fontSize: '0.9rem' }}>
            The best drink deals in the city — filtered by day
          </p>
        </div>
      </header>

      {/* ── DAY SELECTOR ── */}
      <nav style={{ background: '#111', borderBottom: '1px solid #1e1e1e', padding: '1rem 1rem', overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: '0.45rem', justifyContent: 'center', minWidth: 'max-content', margin: '0 auto' }}>
          {DAYS.map((day, i) => {
            const isToday = day === today
            const isSelected = day === selectedDay
            return (
              <button key={day} onClick={() => setSelectedDay(day)} style={{
                padding: '0.55rem 1.05rem',
                borderRadius: '9px',
                border: isSelected ? '2px solid #ff6b00' : '2px solid #2c2c2c',
                background: isSelected ? '#ff6b00' : isToday ? '#1e1200' : 'transparent',
                color: isSelected ? '#000' : isToday ? '#ff9944' : '#555',
                fontWeight: isSelected || isToday ? 700 : 400,
                cursor: 'pointer',
                fontSize: '0.82rem',
                fontFamily: 'Georgia, serif',
                transition: 'all 0.12s',
                lineHeight: 1.2,
              }}>
                {DAY_SHORT[i]}
                {isToday && <span style={{ display: 'block', fontSize: '0.58rem', opacity: 0.85 }}>Today</span>}
              </button>
            )
          })}
        </div>
      </nav>

      {/* ── SEARCH ── */}
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '1.1rem 1.25rem 0.25rem' }}>
        <input
          type="text"
          placeholder="Search bar name, neighbourhood, deal type…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '0.8rem 1.1rem',
            background: '#161616', border: '1px solid #2c2c2c',
            borderRadius: '11px', color: '#fff', fontSize: '0.88rem',
            outline: 'none', fontFamily: 'Georgia, serif', boxSizing: 'border-box',
          }}
        />
      </div>

      {/* ── RESULTS ── */}
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '0.75rem 1.25rem 4rem' }}>

        <p style={{ color: '#444', fontSize: '0.75rem', marginBottom: '1rem', letterSpacing: '0.04em' }}>
          {loading ? 'Pouring your results…' : `${filtered.length} spot${filtered.length !== 1 ? 's' : ''} on ${selectedDay}`}
        </p>

        {loading && (
          <div style={{ textAlign: 'center', color: '#444', padding: '4rem 0' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🍺</div>
            Loading happy hours…
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', color: '#444', padding: '4rem 0' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>😢</div>
            No happy hours found for {selectedDay}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map(hh => (
            <article key={hh.id} style={{
              background: '#141414', border: '1px solid #252525',
              borderRadius: '14px', padding: '1.3rem',
              transition: 'border-color 0.15s, box-shadow 0.15s',
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = '#ff6b00'
                ;(e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(255,107,0,0.07)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = '#252525'
                ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
              }}
            >
              {/* Name + time badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.08rem', fontWeight: 700, color: '#fff' }}>{hh.name}</h2>
                  <p style={{ margin: '0.2rem 0 0', color: '#555', fontSize: '0.78rem' }}>
                    📍 {hh.address}{hh.neighbourhood ? ` · ${hh.neighbourhood}` : ''}
                  </p>
                </div>
                <span style={{
                  background: '#ff6b00', color: '#000', fontWeight: 800,
                  fontSize: '0.82rem', padding: '0.32rem 0.8rem',
                  borderRadius: '20px', whiteSpace: 'nowrap', flexShrink: 0,
                }}>
                  {formatTime(hh.start_time)} – {formatTime(hh.end_time)}
                </span>
              </div>

              {/* Deal highlight */}
              <div style={{
                marginTop: '0.9rem', padding: '0.6rem 0.9rem',
                background: '#1c1000', borderLeft: '3px solid #ff6b00',
                borderRadius: '0 8px 8px 0', color: '#ffb055', fontSize: '0.88rem',
              }}>
                🎉 {hh.deals}
              </div>

              {/* Drink / food */}
              {(hh.drink_specials || hh.food_specials) && (
                <div style={{ display: 'flex', gap: '1.2rem', marginTop: '0.65rem', flexWrap: 'wrap' }}>
                  {hh.drink_specials && <span style={{ color: '#666', fontSize: '0.78rem' }}>🍹 {hh.drink_specials}</span>}
                  {hh.food_specials  && <span style={{ color: '#666', fontSize: '0.78rem' }}>🍔 {hh.food_specials}</span>}
                </div>
              )}

              {/* Day pills */}
              <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.9rem', flexWrap: 'wrap' }}>
                {DAYS.map(d => (
                  <span key={d} style={{
                    fontSize: '0.68rem', padding: '0.18rem 0.5rem', borderRadius: '4px',
                    background: hh.days.includes(d) ? (d === selectedDay ? '#ff6b00' : '#261200') : '#181818',
                    color:      hh.days.includes(d) ? (d === selectedDay ? '#000'    : '#ff8833') : '#2e2e2e',
                    fontWeight: hh.days.includes(d) ? 600 : 400,
                  }}>
                    {d.slice(0,3)}
                  </span>
                ))}
              </div>

              {/* Links */}
              {(hh.google_maps_url || hh.website) && (
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.9rem' }}>
                  {hh.google_maps_url && (
                    <a href={hh.google_maps_url} target="_blank" rel="noopener noreferrer"
                      style={{ color: '#ff6b00', fontSize: '0.78rem', textDecoration: 'none' }}>
                      📍 Directions
                    </a>
                  )}
                  {hh.website && (
                    <a href={hh.website} target="_blank" rel="noopener noreferrer"
                      style={{ color: '#ff6b00', fontSize: '0.78rem', textDecoration: 'none' }}>
                      🌐 Website
                    </a>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>

      <footer style={{ textAlign: 'center', color: '#2a2a2a', fontSize: '0.72rem', padding: '1.25rem', borderTop: '1px solid #181818' }}>
        Toronto Happy Hours · Always verify times directly with the venue
      </footer>
    </main>
  )
}

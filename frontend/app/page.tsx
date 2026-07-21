'use client'

import { useEffect, useState } from 'react'

interface Role {
  position: string
  service: string
  status: string
}

interface Person {
  id: string
  name: string
  avatar: string
  status: string
  email: string | null
  phone: string | null
  servingThisSunday: boolean
  roles: Role[]
}

interface ServiceTime {
  id: string
  title: string
  serviceType: string
  peopleCount: number
}

interface UpcomingEvent {
  date: string
  services: ServiceTime[]
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
    </svg>
  )
}

function CheckBadgeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="m9 12.75 2.25 2.25 4.5-4.5m4.5 2.25a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
    </svg>
  )
}

function GroupIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
    </svg>
  )
}

function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    </svg>
  )
}

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

const ACCENTS = [
  { grad: 'from-fuchsia-500 to-pink-500', text: 'text-fuchsia-400', ring: 'ring-fuchsia-400/50', dot: 'bg-fuchsia-400', bar: 'bg-fuchsia-500' },
  { grad: 'from-sky-500 to-cyan-400', text: 'text-cyan-400', ring: 'ring-cyan-400/50', dot: 'bg-cyan-400', bar: 'bg-sky-500' },
  { grad: 'from-amber-400 to-orange-500', text: 'text-amber-400', ring: 'ring-amber-400/50', dot: 'bg-amber-400', bar: 'bg-amber-500' },
  { grad: 'from-emerald-400 to-teal-500', text: 'text-emerald-400', ring: 'ring-emerald-400/50', dot: 'bg-emerald-400', bar: 'bg-emerald-500' },
  { grad: 'from-violet-500 to-purple-500', text: 'text-violet-400', ring: 'ring-violet-400/50', dot: 'bg-violet-400', bar: 'bg-violet-500' },
]

function accentFor(key: string) {
  let hash = 0
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0
  return ACCENTS[hash % ACCENTS.length]
}

function Avatar({ name, src, seed, size = 9 }: { name: string; src: string | null; seed: string; size?: number }) {
  const [failed, setFailed] = useState(false)
  const sizeClass = size === 9 ? 'w-9 h-9' : 'w-8 h-8'
  const accent = accentFor(seed)

  if (!src || failed) {
    return (
      <div className={`${sizeClass} rounded-full bg-linear-to-br ${accent.grad} flex items-center justify-center text-xs font-semibold text-white shrink-0 ring-2 ring-offset-2 ring-offset-gray-950 ${accent.ring}`}>
        {initials(name) || '?'}
      </div>
    )
  }

  return (
    <img
      src={src}
      className={`${sizeClass} rounded-full object-cover shrink-0 ring-2 ring-offset-2 ring-offset-gray-950 ${accent.ring}`}
      alt={name}
      onError={() => setFailed(true)}
    />
  )
}

function SkeletonRow() {
  return <div className="skeleton h-14 rounded-xl" />
}

const STAT_META = [
  { label: 'Total members', icon: <UsersIcon />, grad: 'from-sky-500 to-cyan-400', glow: 'shadow-cyan-500/20' },
  { label: 'Serving this Sunday', icon: <CheckBadgeIcon />, grad: 'from-emerald-400 to-teal-500', glow: 'shadow-emerald-500/20' },
  { label: 'Upcoming events', icon: <CalendarIcon />, grad: 'from-amber-400 to-orange-500', glow: 'shadow-amber-500/20' },
]

export default function Home() {
  const [people, setPeople] = useState<Person[]>([])
  const [peopleLoaded, setPeopleLoaded] = useState(false)
  const [events, setEvents] = useState<UpcomingEvent[]>([])
  const [eventsLoaded, setEventsLoaded] = useState(false)

  useEffect(() => {
    fetch('http://localhost:3001/planning-center/members-with-service')
      .then((res) => res.json())
      .then((data) => setPeople(data))
      .finally(() => setPeopleLoaded(true))

    fetch('http://localhost:3001/planning-center/upcoming-events')
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .finally(() => setEventsLoaded(true))
  }, [])

  const statValues = [
    people.length.toString(),
    people.filter((p) => p.servingThisSunday).length.toString(),
    events.length.toString(),
    '12',
  ]

  return (
    <main className="relative min-h-screen bg-gray-950 text-white overflow-hidden">
      {/* Ambient background accents */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-32 -left-24 w-104 h-104 bg-fuchsia-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/4 -right-32 w-120 h-120 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-10 md:px-10">

        {/* Header */}
        <div className="flex justify-between items-center pb-6 mb-8 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-fuchsia-500 via-violet-500 to-blue-500 flex items-center justify-center text-sm font-bold shadow-lg shadow-violet-500/30">
              Y
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight bg-linear-to-r from-fuchsia-400 via-violet-300 to-blue-400 bg-clip-text text-transparent">
                YA34
              </h1>
              <p className="text-xs text-gray-400">Leader dashboard</p>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {STAT_META.map((stat, i) => (
            <div
              key={stat.label}
              className={`relative overflow-hidden rounded-2xl bg-gray-900/60 backdrop-blur border border-white/5 p-5 hover:border-white/10 hover:-translate-y-0.5 transition-all duration-200 shadow-lg ${stat.glow}`}
            >
              <div className={`absolute inset-x-0 top-0 h-1 bg-linear-to-r ${stat.grad}`} />
              <div className={`w-10 h-10 rounded-xl bg-linear-to-br ${stat.grad} flex items-center justify-center mb-3 text-white shadow-md`}>
                {stat.icon}
              </div>
              <p className="text-3xl font-semibold tracking-tight font-mono">{statValues[i]}</p>
              <p className="text-sm text-gray-400 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* Members */}
          <div className="rounded-2xl bg-gray-900/40 backdrop-blur border border-white/5 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold">Members</h2>
              <span className="text-xs text-gray-300 bg-linear-to-r from-fuchsia-500/20 to-violet-500/20 ring-1 ring-white/10 rounded-full px-2 py-0.5">YA3 + YA4</span>
            </div>
            <div className="flex flex-col gap-1.5">
              {!peopleLoaded ? (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              ) : people.length === 0 ? (
                <p className="text-sm text-gray-500 py-6 text-center">No members found.</p>
              ) : (
                people.map((person) => (
                  <div
                    key={person.id}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    <Avatar name={person.name} src={person.avatar} seed={person.id} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{person.name}</p>
                      <p className="text-xs text-gray-500 truncate">{person.email || person.phone || 'No contact info'}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      {person.servingThisSunday ? (
                        <>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-linear-to-r from-emerald-500 to-teal-500 text-white font-medium shadow-sm shadow-emerald-500/30">
                            Serving Sunday
                          </span>
                          {person.roles.map((role, i) => (
                            <span key={i} className="text-xs text-gray-500">
                              {role.service} · {role.position} · {role.status}
                            </span>
                          ))}
                        </>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-500 ring-1 ring-white/10 font-medium">
                          Not serving
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="rounded-2xl bg-gray-900/40 backdrop-blur border border-white/5 p-5">
            <h2 className="text-sm font-semibold mb-4">Upcoming events</h2>
            <div className="flex flex-col gap-3">
              {!eventsLoaded ? (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              ) : events.length === 0 ? (
                <p className="text-sm text-gray-500 py-6 text-center">No upcoming events.</p>
              ) : (
                events.map((event) => {
                  const accent = accentFor(event.date)
                  const eventMax = Math.max(...event.services.map((s) => s.peopleCount), 1)
                  return (
                    <div key={event.date} className="relative overflow-hidden pl-3.5 py-3 pr-3.5 bg-white/2 border border-white/5 rounded-xl">
                      <span className={`absolute left-0 top-0 bottom-0 w-1 ${accent.bar}`} />
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2.5">{event.date}</p>
                      <div className="flex flex-col gap-2.5">
                        {event.services.map((service) => (
                          <div key={service.id} className="flex items-center gap-3">
                            <span className={`w-1.5 h-1.5 rounded-full ${accent.dot} shrink-0`} />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="text-sm font-medium truncate">{service.serviceType}</span>
                                  <span className="text-xs text-gray-500 truncate">{service.title}</span>
                                </div>
                                <span className="text-xs font-mono text-gray-300 shrink-0">{service.peopleCount}</span>
                              </div>
                              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${accent.bar}`}
                                  style={{ width: `${Math.max((service.peopleCount / eventMax) * 100, 6)}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}

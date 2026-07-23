'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface PlanEvent {
  id: string
  date: string
  title: string
  serviceType: string
}

function ChevronLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
  )
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

export default function CalendarPage() {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [events, setEvents] = useState<PlanEvent[]>([])

  useEffect(() => {
    fetch('http://localhost:3001/planning-center/all-plans')
      .then(res => res.json())
      .then(data => setEvents(data))
  }, [])

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth)

  // Build event map keyed by day number
  const eventMap = new Map<number, PlanEvent[]>()
  events.forEach(event => {
    const [year, month, day] = event.date.split('T')[0].split('-').map(Number)
    if (month - 1 === currentMonth && year === currentYear) {
      if (!eventMap.has(day)) eventMap.set(day, [])
      eventMap.get(day)!.push(event)
    }
  })

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="px-6 md:px-10 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-md bg-gray-900 flex items-center justify-center text-white text-sm font-bold">Y</div>
            <span className="text-sm font-bold tracking-tight text-gray-900">YA34</span>
          </div>
          <nav className="hidden md:flex items-center gap-1 ml-8">
            {['Dashboard', 'Members', 'Calendar', 'CG Plan'].map(item => (
              <Link
                key={item}
                href={item === 'Dashboard' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  item === 'Calendar' ? 'bg-gray-100 text-gray-900 font-semibold' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {item}
              </Link>
            ))}
          </nav>
          <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-xs font-bold">JC</div>
        </div>
      </header>

      <main className="px-6 py-8 md:px-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Calendar</h1>
            <p className="text-sm text-gray-500 mt-1">Planning Center services</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={prevMonth} className="p-1.5 rounded-md hover:bg-gray-100 transition-colors">
              <ChevronLeftIcon />
            </button>
            <span className="text-sm font-semibold text-gray-900 w-36 text-center">
              {MONTHS[currentMonth]} {currentYear}
            </span>
            <button onClick={nextMonth} className="p-1.5 rounded-md hover:bg-gray-100 transition-colors">
              <ChevronRightIcon />
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="grid grid-cols-7 border-b border-gray-200">
            {DAYS.map(day => (
              <div key={day} className="py-3 text-center text-xs font-bold uppercase tracking-wider text-gray-400">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {cells.map((day, i) => {
              const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()
              const dayEvents = day ? eventMap.get(day) : undefined

              return (
                <div
                  key={i}
                  className={`min-h-[100px] p-2 border-b border-r border-gray-100 ${!day ? 'bg-gray-50' : 'hover:bg-gray-50 transition-colors'}`}
                >
                  {day && (
                    <>
                      <span className={`text-sm font-medium inline-flex items-center justify-center w-7 h-7 rounded-full ${
                        isToday ? 'bg-gray-900 text-white' : 'text-gray-700'
                      }`}>
                        {day}
                      </span>
                      <div className="mt-1 flex flex-col gap-1">
                        {dayEvents?.map(event => (
                          <div
                            key={event.id}
                            className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 truncate"
                          >
                            {event.title} · {event.serviceType}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
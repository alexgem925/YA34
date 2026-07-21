'use client'

import { useEffect, useState } from 'react'

interface Role {
  position: string
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

export default function Home() {
  const [people, setPeople] = useState<Person[]>([])

  useEffect(() => {
    fetch('http://localhost:3001/planning-center/members-with-service')
      .then(res => res.json())
      .then(data => setPeople(data))
  }, [])

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-xl font-semibold">YA34</h1>
          <p className="text-sm text-gray-400">Leader dashboard</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-semibold">SL</div>
          <span className="text-sm">Sam Lee</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total members", value: people.length.toString() },
          { label: "Serving this Sunday", value: people.filter(p => p.servingThisSunday).length.toString() },
          { label: "Upcoming events", value: "2" },
          { label: "Active groups", value: "12" },
        ].map((stat) => (
          <div key={stat.label} className="bg-gray-900 rounded-xl p-4">
            <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
            <p className="text-2xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-2 gap-6">

        {/* Members */}
        <div>
          <h2 className="text-base font-semibold mb-3">
            Members <span className="text-xs text-gray-400 font-normal">YA3 + YA4</span>
          </h2>
          <div className="flex flex-col gap-3">
            {people.length === 0 ? (
              <p className="text-sm text-gray-400">Loading...</p>
            ) : (
              people.map((person) => (
                <div key={person.id} className="flex items-center gap-3 p-3 bg-gray-900 rounded-xl">
                  <img
                    src={person.avatar}
                    className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                    alt={person.name}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{person.name}</p>
                    <p className="text-xs text-gray-400 truncate">{person.email || person.phone || 'No contact info'}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    {person.servingThisSunday ? (
                      <>
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-900 text-blue-400">
                          Serving Sunday
                        </span>
                        {person.roles.map((role, i) => (
                          <span key={i} className="text-xs text-gray-400">{role.position} · {role.status}</span>
                        ))}
                      </>
                    ) : (
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-400">
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
        <div>
          <h2 className="text-base font-semibold mb-3">Upcoming events</h2>
          <div className="flex flex-col gap-3">
            {[
              { month: "Jul", day: "26", title: "Sunday Service", group: "9:30am · 43 serving" },
              { month: "Aug", day: "2", title: "Sunday Service", group: "9:30am · 8 serving" },
              { month: "Aug", day: "9", title: "Sunday Service", group: "9:30am · 8 serving" },
            ].map((event) => (
              <div key={event.title + event.day} className="flex items-center gap-3 p-3 bg-gray-900 rounded-xl">
                <div className="w-10 text-center flex-shrink-0">
                  <p className="text-xs text-gray-400">{event.month}</p>
                  <p className="text-lg font-semibold">{event.day}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">{event.title}</p>
                  <p className="text-xs text-gray-400">{event.group}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  )
}
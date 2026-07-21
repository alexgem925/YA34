export default function Home() {
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
          { label: "New this week", value: "8" },
          { label: "Needs follow-up", value: "3" },
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
        
        {/* Newcomers */}
        <div>
          <h2 className="text-base font-semibold mb-3">Recent newcomers</h2>
          <div className="flex flex-col gap-3">
            {[
              { name: "Jordan Mills", visited: "Jun 15", status: "Needs review" },
              { name: "Asha Patel", visited: "Jun 8", status: "Linked" },
              { name: "Tyler Brooks", visited: "Jun 1", status: "Needs review" },
              { name: "Maria Gomez", visited: "May 25", status: "Linked" },
            ].map((person) => (
              <div key={person.name} className="flex items-center gap-3 p-3 bg-gray-900 rounded-xl">
                <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                  {person.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{person.name}</p>
                  <p className="text-xs text-gray-400">Visited {person.visited}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  person.status === "Linked"
                    ? "bg-green-900 text-green-400"
                    : "bg-yellow-900 text-yellow-400"
                }`}>
                  {person.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div>
          <h2 className="text-base font-semibold mb-3">Upcoming events</h2>
          <div className="flex flex-col gap-3">
            {[
              { month: "Jun", day: "24", title: "Group leaders meetup", group: "All groups" },
              { month: "Jun", day: "28", title: "Newcomer welcome dinner", group: "All groups" },
              { month: "Jul", day: "3", title: "Connect group social", group: "All groups" },
            ].map((event) => (
              <div key={event.title} className="flex items-center gap-3 p-3 bg-gray-900 rounded-xl">
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
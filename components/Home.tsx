import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { useState, useMemo } from "react";
import { TrendingUp, Calendar as CalendarIcon, Building2, FileCheck, MapPin, Zap, Key, ChevronDown, AlertCircle, Star, ChevronLeft, ChevronRight } from "lucide-react";

const analyticsData = [
  { id: "jan-data", month: "Jan", available: 45, rented: 38, revenue: 42000 },
  { id: "feb-data", month: "Feb", available: 52, rented: 41, revenue: 45500 },
  { id: "mar-data", month: "Mar", available: 48, rented: 45, revenue: 52000 },
  { id: "apr-data", month: "Apr", available: 50, rented: 43, revenue: 48000 },
  { id: "may-data", month: "May", available: 55, rented: 49, revenue: 58000 },
  { id: "jun-data", month: "Jun", available: 51, rented: 47, revenue: 55000 },
];

const occupancyData = [
  { id: "rented-data", name: "Rented", value: 68 },
  { id: "available-data", name: "Available", value: 32 },
];

const COLORS = ["var(--spacespot-cyan-primary)", "var(--spacespot-gray-500)"];

interface CalendarEvent {
  year: number;
  month: number;
  day: number;
  type: "deadline" | "important";
  title: string;
}

const calendarEvents: CalendarEvent[] = [
  { year: 2026, month: 4, day: 5, type: "deadline", title: "Lease Renewal Deadline - Space 12" },
  { year: 2026, month: 4, day: 9, type: "important", title: "Property Inspection - Mall Level 2" },
  { year: 2026, month: 4, day: 12, type: "deadline", title: "Payment Due - Tenant ABC Corp" },
  { year: 2026, month: 4, day: 18, type: "important", title: "Board Meeting - Q1 Review" },
  { year: 2026, month: 4, day: 22, type: "deadline", title: "Document Submission - Unit 204" },
  { year: 2026, month: 4, day: 27, type: "important", title: "New Tenant Onboarding - Retail Space" },
  { year: 2026, month: 5, day: 3, type: "deadline", title: "Maintenance Contract Expiry - Tower A" },
  { year: 2026, month: 5, day: 11, type: "important", title: "Tenant Review Meeting - Unit 204" },
];

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [availabilityView, setAvailabilityView] = useState<"monthly" | "quarterly" | "ytd">("monthly");
  const [availabilitySeries, setAvailabilitySeries] = useState({ available: true, rented: true });
  const today = useMemo(() => new Date(), []);
  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState<number | null>(today.getDate());

  const selectedMonthName = useMemo(
    () => currentDate.toLocaleString("default", { month: "long", year: "numeric" }),
    [currentDate],
  );

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dayArray: (number | null)[] = [];
    for (let i = 0; i < firstDayIndex; i++) dayArray.push(null);
    for (let d = 1; d <= daysInMonth; d++) dayArray.push(d);
    return dayArray;
  }, [currentDate]);

  const eventsByDay = useMemo(() => {
    const map = new Map<number, CalendarEvent[]>();

    for (const event of calendarEvents) {
      if (
        event.year === currentDate.getFullYear() &&
        event.month - 1 === currentDate.getMonth()
      ) {
        const list = map.get(event.day) ?? [];
        list.push(event);
        map.set(event.day, list);
      }
    }

    return map;
  }, [currentDate]);

  const selectedDateEvents = selectedDate ? eventsByDay.get(selectedDate) ?? [] : [];

  const handleMonthChange = (delta: number) => {
    const nextDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1);
    const daysInNextMonth = new Date(nextDate.getFullYear(), nextDate.getMonth() + 1, 0).getDate();

    setCurrentDate(nextDate);
    setSelectedDate((prev) => (prev === null ? null : Math.min(prev, daysInNextMonth)));
  };

  const availabilityData = useMemo(() => {
    if (availabilityView === "monthly") {
      return analyticsData.map((point) => ({
        id: point.id,
        label: point.month,
        available: point.available,
        rented: point.rented,
      }));
    }

    if (availabilityView === "quarterly") {
      const quarters: Record<string, { available: number; rented: number }> = {
        Q1: { available: 0, rented: 0 },
        Q2: { available: 0, rented: 0 },
      };

      analyticsData.forEach((point, index) => {
        const quarterKey = index < 3 ? "Q1" : "Q2";
        quarters[quarterKey].available += point.available;
        quarters[quarterKey].rented += point.rented;
      });

      return Object.entries(quarters).map(([label, values]) => ({
        id: `availability-${label.toLowerCase()}`,
        label,
        available: values.available,
        rented: values.rented,
      }));
    }

    let availableRunning = 0;
    let rentedRunning = 0;
    return analyticsData.map((point, index) => {
      availableRunning += point.available;
      rentedRunning += point.rented;
      return {
        id: `availability-ytd-${index}`,
        label: point.month,
        available: availableRunning,
        rented: rentedRunning,
      };
    });
  }, [availabilityView]);

  const availabilityMax = useMemo(
    () => Math.max(...availabilityData.map((point) => Math.max(point.available, point.rented))),
    [availabilityData],
  );

  const getLollipopHeight = (value: number) => Math.max(22, Math.round((value / availabilityMax) * 180));

  const toggleAvailabilitySeries = (series: "available" | "rented") => {
    setAvailabilitySeries((prev) => {
      const next = { ...prev, [series]: !prev[series] };
      if (!next.available && !next.rented) {
        return prev;
      }
      return next;
    });
  };

  return (
    <div className="max-w-[1342px] mx-auto">
      {/* Welcome Section */}
      <h2 className="text-[45px] font-normal opacity-81 mb-6 animate-fade-in text-[var(--spacespot-text-primary)]">Welcome</h2>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-8 mb-6">
        {/* Visual Analytics Dashboard */}
        <div className="p-4 sm:p-6 rounded-[14px] shadow-[var(--spacespot-shadow-lg)] border-2 border-[var(--spacespot-cyan-primary)] bg-[linear-gradient(135deg,var(--spacespot-dashboard-panel-start)_0%,var(--spacespot-dashboard-panel-mid)_55%,var(--spacespot-dashboard-panel-end)_100%)]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[28px] font-semibold text-[var(--spacespot-text-primary)] flex items-center gap-3">
              <TrendingUp className="text-[var(--spacespot-cyan-primary)]" size={24} aria-hidden="true" />
              Visual Analytics
            </h3>
            <div className="flex gap-3">
              <div className="px-5 py-2.5 bg-[var(--spacespot-cyan-primary)] text-[var(--spacespot-gray-900)] rounded-lg text-[14px] font-semibold">
                This Month
              </div>
            </div>
          </div>

          {/* Mini Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {/* Available Spaces */}
            <div className="bg-[var(--spacespot-card-surface)] p-4 sm:p-5 rounded-[14px] border border-[var(--spacespot-card-border)] shadow-sm min-w-0 hover:shadow-lg hover:scale-105 hover:border-[var(--spacespot-cyan-primary)] transition-all duration-300 cursor-pointer">
              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 bg-[#10B981] rounded-full flex items-center justify-center shadow-sm">
                  <Building2 size={20} className="text-[var(--spacespot-gray-900)]" />
                </div>
                <div>
                  <p className="text-[var(--spacespot-text-secondary)] uppercase tracking-wide leading-tight" style={{ fontSize: 'clamp(11px, 1vw, 12px)' }}>Available Spaces</p>
                  <p className="text-[28px] font-bold text-[var(--spacespot-text-primary)]">32</p>
                </div>
              </div>
            </div>

            {/* Rented Spaces */}
            <div className="bg-[var(--spacespot-card-surface)] p-4 sm:p-5 rounded-[14px] border border-[var(--spacespot-card-border)] shadow-sm min-w-0 hover:shadow-lg hover:scale-105 hover:border-[var(--spacespot-cyan-primary)] transition-all duration-300 cursor-pointer">
              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 bg-[#14D8CC] rounded-full flex items-center justify-center shadow-sm">
                  <Key size={20} className="text-[var(--spacespot-gray-900)]" />
                </div>
                <div>
                  <p className="text-[var(--spacespot-text-secondary)] uppercase tracking-wide leading-tight" style={{ fontSize: 'clamp(11px, 1vw, 12px)' }}>Rented Spaces</p>
                  <p className="text-[28px] font-bold text-[var(--spacespot-text-primary)]">66</p>
                </div>
              </div>
            </div>

            {/* Leases Closed Last Month */}
            <div className="bg-[var(--spacespot-card-surface)] p-4 sm:p-5 rounded-[14px] border border-[var(--spacespot-card-border)] shadow-sm min-w-0 hover:shadow-lg hover:scale-105 hover:border-[var(--spacespot-cyan-primary)] transition-all duration-300 cursor-pointer">
              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 bg-[#3B82F6] rounded-lg flex items-center justify-center shadow-sm">
                  <FileCheck size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-[var(--spacespot-text-secondary)] uppercase tracking-wide leading-tight" style={{ fontSize: 'clamp(11px, 1vw, 12px)' }}>Leases Closed Last Month</p>
                  <p className="text-[28px] font-bold text-[var(--spacespot-text-primary)]">14</p>
                </div>
              </div>
            </div>

            {/* Precinct */}
            <div className="bg-[var(--spacespot-card-surface)] p-4 sm:p-5 rounded-[14px] border border-[var(--spacespot-card-border)] shadow-sm min-w-0 hover:shadow-lg hover:scale-105 hover:border-[var(--spacespot-cyan-primary)] transition-all duration-300 cursor-pointer">
              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 bg-[#8B5CF6] rounded-lg flex items-center justify-center shadow-sm">
                  <MapPin size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-[var(--spacespot-text-secondary)] uppercase tracking-wide leading-tight" style={{ fontSize: 'clamp(11px, 1vw, 12px)' }}>Precinct</p>
                  <p className="text-[16px] font-bold text-[var(--spacespot-text-primary)]">Downtown</p>
                </div>
              </div>
            </div>

            {/* Fast Leasing */}
            <div className="bg-[var(--spacespot-card-surface)] p-4 sm:p-5 rounded-[14px] border border-[var(--spacespot-card-border)] shadow-sm min-w-0 hover:shadow-lg hover:scale-105 hover:border-[var(--spacespot-cyan-primary)] transition-all duration-300 cursor-pointer">
              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 bg-[#EF4444] rounded-lg flex items-center justify-center shadow-sm">
                  <Zap size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-[var(--spacespot-text-secondary)] uppercase tracking-wide leading-tight" style={{ fontSize: 'clamp(11px, 1vw, 12px)' }}>Fast Leasing</p>
                  <p className="text-[16px] font-bold text-[var(--spacespot-text-primary)]">Level 3A</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-[1.5fr_1fr] gap-4">
            {/* Revenue Trend Line Chart */}
            <div className="bg-[var(--spacespot-card-surface)] p-4 rounded-lg border border-[var(--spacespot-card-border)] shadow-md hover:shadow-lg transition-all duration-300" role="img" aria-label="Revenue Trend chart">
              <h4 className="text-[16px] font-semibold text-[var(--spacespot-text-primary)] mb-3">Revenue Trend</h4>
              <ResponsiveContainer width="100%" height={200} key="home-revenue-container">
                <LineChart data={analyticsData} id="home-revenue-trend-chart" key="home-revenue-chart">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--spacespot-chart-grid)" />
                  <XAxis dataKey="month" stroke="var(--spacespot-text-secondary)" style={{ fontSize: '12px' }} />
                  <YAxis stroke="var(--spacespot-text-secondary)" style={{ fontSize: '12px' }} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--spacespot-tooltip-surface)', border: '2px solid var(--spacespot-cyan-primary)', borderRadius: '8px', fontSize: '12px', color: 'var(--spacespot-text-primary)' }} />
                  <Line type="monotone" dataKey="revenue" stroke="var(--spacespot-cyan-primary)" strokeWidth={3} dot={{ fill: 'var(--spacespot-cyan-primary)', r: 5 }} activeDot={{ r: 7 }} id="home-revenue-line" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Occupancy Pie Chart */}
            <div className="bg-[var(--spacespot-card-surface)] p-4 rounded-lg border border-[var(--spacespot-card-border)] shadow-md hover:shadow-lg transition-all duration-300" role="img" aria-label="Occupancy Rate chart">
              <h4 className="text-[16px] font-semibold text-[var(--spacespot-text-primary)] mb-3">Occupancy Rate</h4>
              <ResponsiveContainer width="100%" height={200} key="home-occupancy-container">
                <PieChart id="home-occupancy-pie-chart" key="home-pie-chart">
                  <Pie data={occupancyData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value" id="home-occupancy-pie">
                    {occupancyData.map((entry, index) => (
                      <Cell key={`home-pie-cell-${entry.id}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--spacespot-tooltip-surface)', border: '2px solid var(--spacespot-cyan-primary)', borderRadius: '8px', fontSize: '12px', color: 'var(--spacespot-text-primary)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Calendar */}
        <div className="w-full max-w-[400px]">
          <div className="bg-[var(--spacespot-calendar-surface)] rounded-[14px] border-2 border-[var(--spacespot-cyan-primary)] shadow-[var(--spacespot-shadow-lg)] p-5">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => handleMonthChange(-1)}
                aria-label="Previous month"
                className="w-9 h-9 rounded-lg bg-[var(--spacespot-cyan-primary)] flex items-center justify-center text-[var(--spacespot-gray-900)]"
              >
                <ChevronLeft size={12} aria-hidden="true" />
              </button>
              <div className="flex items-center gap-2 text-white text-[28px] font-semibold">
                <CalendarIcon size={26} className="text-[var(--spacespot-cyan-primary)]" aria-hidden="true" />
                {selectedMonthName}
              </div>
              <button
                onClick={() => handleMonthChange(1)}
                aria-label="Next month"
                className="w-9 h-9 rounded-lg bg-[var(--spacespot-cyan-primary)] flex items-center justify-center text-[var(--spacespot-gray-900)]"
              >
                <ChevronRight size={12} aria-hidden="true" />
              </button>
            </div>
            <div className="h-px bg-[var(--spacespot-calendar-divider)] mb-4" />

            <div className="grid grid-cols-7 gap-1 text-[var(--spacespot-cyan-primary)] uppercase text-[14px] font-semibold tracking-wider mb-2">
              {['SUN','MON','TUE','WED','THU','FRI','SAT'].map((day) => (
                <div key={day} className="text-center">{day}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2 mb-3">
              {calendarDays.map((day, idx) => {
                const isSelected = day !== null && day === selectedDate;
                const isToday =
                  day !== null &&
                  currentDate.getFullYear() === today.getFullYear() &&
                  currentDate.getMonth() === today.getMonth() &&
                  day === today.getDate();
                const dayEvents = day !== null ? eventsByDay.get(day) ?? [] : [];
                const hasDeadline = dayEvents.some((event) => event.type === 'deadline');
                const hasImportant = dayEvents.some((event) => event.type === 'important');
                return (
                  <button
                    key={`${idx}-${day}`}
                    disabled={day === null}
                    aria-label={day !== null ? `${selectedMonthName.split(' ')[0]} ${day}` : undefined}
                    onClick={() => day && setSelectedDate(day)}
                    className={`h-11 rounded-lg flex items-center justify-center font-semibold relative ${
                      day === null
                        ? 'text-transparent bg-transparent pointer-events-none'
                        : isSelected
                        ? 'bg-[var(--spacespot-cyan-primary)] text-[var(--spacespot-gray-900)] border border-[var(--spacespot-cyan-primary)]'
                        : isToday
                        ? 'bg-[var(--spacespot-calendar-cell)] text-white hover:bg-[var(--spacespot-calendar-cell-hover)] border border-[var(--spacespot-cyan-primary)]'
                        : 'bg-[var(--spacespot-calendar-cell)] text-white hover:bg-[var(--spacespot-calendar-cell-hover)] border border-[var(--spacespot-calendar-divider)]'
                    }`}
                  >
                    {day ?? ''}
                    {day !== null && dayEvents.length > 0 && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1">
                        {hasDeadline && (
                          <span
                            className={`w-2 h-2 rounded-full bg-[#EF4444] ${
                              isSelected ? 'ring-1 ring-[var(--spacespot-gray-900)]' : ''
                            }`}
                          />
                        )}
                        {hasImportant && (
                          <span
                            className={`w-2 h-2 rounded-full bg-[#F9A826] ${
                              isSelected ? 'ring-1 ring-[var(--spacespot-gray-900)]' : ''
                            }`}
                          />
                        )}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="h-px bg-[var(--spacespot-calendar-divider)] mb-3" />
            <div className="flex items-center gap-4 text-sm font-medium text-white mb-4">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[var(--spacespot-cyan-primary)]"></span> Selected</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-white border border-[var(--spacespot-cyan-primary)]"></span> Today</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#EF4444]"></span> Deadline</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#F9A826]"></span> Important</span>
            </div>

            {selectedDate && (
              <div className="bg-[var(--spacespot-calendar-detail-surface)] p-3 rounded-lg border border-[var(--spacespot-cyan-primary)]">
                <p className="text-[var(--spacespot-cyan-primary)] text-sm font-semibold mb-2">
                  Events on {selectedMonthName.split(' ')[0]} {selectedDate}
                </p>

                {selectedDateEvents.length === 0 ? (
                  <p className="text-[var(--spacespot-text-inverse-muted)] text-sm">No events scheduled.</p>
                ) : (
                  <div className="space-y-2">
                    {selectedDateEvents.map((event, index) => (
                      <div
                        key={`${event.title}-${index}`}
                        className={`rounded-lg p-3 border ${
                          event.type === 'deadline'
                            ? 'bg-[#2B0C12] border-[#EF4444]'
                            : 'bg-[var(--spacespot-calendar-detail-accent)] border-[var(--spacespot-cyan-primary)]'
                        }`}
                      >
                        <p className="text-white font-semibold flex items-center gap-2">
                          {event.type === 'deadline' ? (
                            <AlertCircle size={14} className="text-[#EF4444]" />
                          ) : (
                            <Star size={14} className="text-[#F9A826]" />
                          )}
                          {event.title}
                        </p>
                        <p className="text-[var(--spacespot-text-inverse-muted)] text-sm ml-6">
                          {event.type === 'deadline' ? 'Closing Deadline' : 'Important Event'}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Space Availability Overview */}
      <div>
        <h3 className="text-[27px] font-normal mb-4 text-[var(--spacespot-text-primary)]">Space Availability Overview</h3>
        <div className="relative overflow-hidden rounded-[18px] border border-[rgba(20,216,204,0.35)] bg-[color:color-mix(in_srgb,var(--spacespot-card-surface)_82%,transparent)] p-6 shadow-[0_24px_38px_rgba(0,0,0,0.18)] backdrop-blur-[6px] transition-all duration-300">
          <div className="pointer-events-none absolute -top-16 -right-12 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(20,216,204,0.34)_0%,rgba(20,216,204,0)_72%)]" />
          <div className="pointer-events-none absolute -bottom-20 -left-14 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(31,41,55,0.24)_0%,rgba(31,41,55,0)_72%)]" />

          <div className="relative z-10 mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 text-[12px] font-semibold">
              <button
                type="button"
                aria-pressed={availabilityView === "monthly"}
                onClick={() => setAvailabilityView("monthly")}
                className={`inline-flex items-center rounded-full border px-3 py-1.5 transition-colors ${
                  availabilityView === "monthly"
                    ? "border-[var(--spacespot-cyan-primary)] bg-[var(--spacespot-cyan-primary)] text-[var(--spacespot-gray-900)]"
                    : "border-[var(--spacespot-card-border)] bg-[var(--spacespot-surface-secondary)] text-[var(--spacespot-text-secondary)]"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                aria-pressed={availabilityView === "quarterly"}
                onClick={() => setAvailabilityView("quarterly")}
                className={`inline-flex items-center rounded-full border px-3 py-1.5 transition-colors ${
                  availabilityView === "quarterly"
                    ? "border-[var(--spacespot-cyan-primary)] bg-[var(--spacespot-cyan-primary)] text-[var(--spacespot-gray-900)]"
                    : "border-[var(--spacespot-card-border)] bg-[var(--spacespot-surface-secondary)] text-[var(--spacespot-text-secondary)]"
                }`}
              >
                Quarterly
              </button>
              <button
                type="button"
                aria-pressed={availabilityView === "ytd"}
                onClick={() => setAvailabilityView("ytd")}
                className={`inline-flex items-center rounded-full border px-3 py-1.5 transition-colors ${
                  availabilityView === "ytd"
                    ? "border-[var(--spacespot-cyan-primary)] bg-[var(--spacespot-cyan-primary)] text-[var(--spacespot-gray-900)]"
                    : "border-[var(--spacespot-card-border)] bg-[var(--spacespot-surface-secondary)] text-[var(--spacespot-text-secondary)]"
                }`}
              >
                YTD
              </button>
            </div>
          </div>

          <div className="relative z-10">
            <div className={`grid gap-6 sm:gap-8 items-end justify-items-center h-[300px] rounded-[14px] border border-[var(--spacespot-card-border)] bg-[color:color-mix(in_srgb,var(--spacespot-surface-secondary)_78%,transparent)] p-4 ${
              availabilityData.length === 2 ? "grid-cols-2" : "grid-cols-6"
            }`}>
              {availabilityData.map((point) => {
                const availableHeight = getLollipopHeight(point.available);
                const rentedHeight = getLollipopHeight(point.rented);

                return (
                  <div key={point.id} className="group/point w-[130px] flex flex-col items-center gap-2">
                    <div className="h-[230px] w-full flex items-end justify-center gap-2">
                      {availabilitySeries.available && (
                        <div className="relative flex flex-col items-center justify-end h-[200px] w-11">
                          <div
                            className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[4px] rounded-full transition-[height] duration-500"
                            style={{
                              height: `${availableHeight}px`,
                              background: 'linear-gradient(180deg, color-mix(in srgb, var(--spacespot-chart-available) 95%, white 5%) 0%, color-mix(in srgb, var(--spacespot-chart-available) 65%, transparent) 100%)',
                              boxShadow: '1px 0 4px rgba(15, 23, 42, 0.14)',
                            }}
                          />
                          <span
                            className="pointer-events-none absolute left-1/2 -translate-x-1/2 w-[3px] rounded-full opacity-0 transition-opacity duration-200 group-hover/point:opacity-100"
                            style={{
                              bottom: `${Math.max(0, availableHeight - 22)}px`,
                              height: '22px',
                              background: 'linear-gradient(180deg, rgba(71, 85, 105, 0.7) 0%, rgba(71, 85, 105, 0) 100%)',
                            }}
                          />
                          <span className="absolute -top-3 text-[10px] font-semibold text-[var(--spacespot-text-secondary)]">
                            {point.available}
                          </span>
                        </div>
                      )}

                      {availabilitySeries.rented && (
                        <div className="relative flex flex-col items-center justify-end h-[200px] w-11">
                          <div
                            className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[4px] rounded-full transition-[height] duration-500"
                            style={{
                              height: `${rentedHeight}px`,
                              background: 'var(--spacespot-chart-rented)',
                              boxShadow: '0 0 8px rgba(20, 216, 204, 0.22), 1px 0 4px rgba(15, 23, 42, 0.16)',
                            }}
                          />
                          <span
                            className="pointer-events-none absolute left-1/2 -translate-x-1/2 w-[3px] rounded-full opacity-0 transition-opacity duration-200 group-hover/point:opacity-100"
                            style={{
                              bottom: `${Math.max(0, rentedHeight - 22)}px`,
                              height: '22px',
                              background: 'linear-gradient(180deg, rgba(20, 216, 204, 0.74) 0%, rgba(20, 216, 204, 0) 100%)',
                            }}
                          />
                          <span className="absolute -top-3 text-[10px] font-semibold text-[var(--spacespot-text-secondary)]">
                            {point.rented}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="w-14 h-[2px] rounded-full bg-[var(--spacespot-card-border)]" />
                    <div className="text-[12px] font-semibold text-[var(--spacespot-text-primary)]">{point.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative z-10 mt-4 flex flex-wrap items-center justify-center gap-2 text-[12px] font-semibold">
            <button
              type="button"
              aria-pressed={availabilitySeries.available}
              onClick={() => toggleAvailabilitySeries("available")}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgba(17,24,39,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--spacespot-cyan-primary)] focus-visible:ring-offset-2 active:translate-y-0 ${
                availabilitySeries.available
                  ? "border-[var(--spacespot-gray-900)] bg-[var(--spacespot-gray-500)] text-white shadow-[0_6px_16px_rgba(17,24,39,0.28)]"
                  : "border-[var(--spacespot-card-border)] bg-[var(--spacespot-surface-secondary)] text-[var(--spacespot-text-secondary)]"
              }`}
              title="Toggle available series"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--spacespot-chart-available)] border border-[var(--spacespot-gray-900)]" />
              Available
            </button>
            <button
              type="button"
              aria-pressed={availabilitySeries.rented}
              onClick={() => toggleAvailabilitySeries("rented")}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgba(17,24,39,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--spacespot-cyan-primary)] focus-visible:ring-offset-2 active:translate-y-0 ${
                availabilitySeries.rented
                  ? "border-[var(--spacespot-gray-900)] bg-[var(--spacespot-cyan-primary)] text-[var(--spacespot-gray-900)] shadow-[0_0_16px_rgba(20,216,204,0.35)]"
                  : "border-[var(--spacespot-card-border)] bg-[var(--spacespot-surface-secondary)] text-[var(--spacespot-text-secondary)]"
              }`}
              title="Toggle rented series"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--spacespot-chart-rented)] border border-[var(--spacespot-gray-900)]" />
              Rented
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}


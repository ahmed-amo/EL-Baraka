"use client";

import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { AnalyticsSnapshot } from "@/lib/analytics";

const colors = ["#02469b", "#4aa3e8", "#000f36", "#7eb6ff"];
const axis = { fontSize: 11, fill: "#1d2f4f" };

export function AnalyticsCharts({ data }: { data: AnalyticsSnapshot }) {
  return (
    <div className="dash-charts">
      <div className="dash-panel dash-chart is-wide">
        <header>
          <h2>Visites par jour</h2>
        </header>
        <div className="dash-chart-body">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="rgba(0,15,54,0.08)" vertical={false} />
              <XAxis dataKey="day" tick={axis} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={axis} axisLine={false} tickLine={false} width={32} />
              <Tooltip />
              <Line type="monotone" dataKey="count" name="Visites" stroke="#02469b" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="dash-panel dash-chart">
        <header>
          <h2>Pages</h2>
        </header>
        <div className="dash-chart-body">
          {data.pages.length === 0 ? (
            <p className="dash-empty">Aucune donnée sur cette période.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.pages} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="rgba(0,15,54,0.08)" vertical={false} />
                <XAxis dataKey="name" tick={axis} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={axis} axisLine={false} tickLine={false} width={32} />
                <Tooltip />
                <Bar dataKey="count" name="Pages" fill="#02469b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
      <div className="dash-panel dash-chart">
        <header>
          <h2>Appareils</h2>
        </header>
        <div className="dash-chart-body">
          {data.devices.length === 0 ? (
            <p className="dash-empty">Aucune donnée sur cette période.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.devices} dataKey="count" nameKey="name" innerRadius={58} outerRadius={86} paddingAngle={3}>
                  {data.devices.map((entry, index) => (
                    <Cell key={entry.name} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

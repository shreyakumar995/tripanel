"use client";

import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const PERSONAS = [
  {
    key: "System Design Skeptic",
    color: "#8B5CF6",
    strokeDasharray: undefined as string | undefined,
  },
  {
    key: "Friendly HR Interviewer",
    color: "#4C8DFF",
    strokeDasharray: undefined as string | undefined,
  },
  // Drawn last so overlapping scores still show (was hidden under blue)
  {
    key: "Strict Technical Reviewer",
    color: "#E8590C",
    strokeDasharray: "6 4",
  },
] as const;

type ProgressPoint = {
  date: string;
  track?: string;
  "Strict Technical Reviewer"?: number;
  "Friendly HR Interviewer"?: number;
  "System Design Skeptic"?: number;
};

function formatShortDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function ProgressPage() {
  const [data, setData] = useState<ProgressPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProgress() {
      try {
        const response = await fetch("http://localhost:5000/progress");
        if (!response.ok) {
          throw new Error("Failed to load progress.");
        }
        const payload = (await response.json()) as ProgressPoint[];
        setData(Array.isArray(payload) ? payload : []);
      } catch {
        setError("Could not load progress. Check that the backend is running.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadProgress();
  }, []);

  const chartData = data.map((point) => ({
    ...point,
    label: formatShortDate(point.date),
  }));

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: "#12141C" }}>
      <div className="mx-auto w-full max-w-5xl px-6 py-10 sm:px-8 lg:px-10">
        <h1
          className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl"
          style={{ color: "#EDEDF2" }}
        >
          Your progress over time
        </h1>
        <p className="mt-2 text-base" style={{ color: "#8B8FA3" }}>
          Track how each AI interviewer scores you across practice sessions.
        </p>

        <div
          className="mt-8 rounded-xl border p-4 sm:p-6"
          style={{
            background: "#1B1E29",
            borderColor: "#2A2E3D",
          }}
        >
          {isLoading && (
            <p className="py-16 text-center text-sm" style={{ color: "#8B8FA3" }}>
              Loading progress...
            </p>
          )}

          {error && !isLoading && (
            <p className="py-16 text-center text-sm text-red-400">{error}</p>
          )}

          {!isLoading && !error && chartData.length === 0 && (
            <p
              className="py-16 text-center text-base leading-relaxed"
              style={{ color: "#8B8FA3" }}
            >
              Complete a few practice sessions to see your progress here.
            </p>
          )}

          {!isLoading && !error && chartData.length > 0 && (
            <div className="h-[360px] w-full sm:h-[420px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 12, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid stroke="#2A2E3D" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="label"
                    stroke="#8B8FA3"
                    tick={{ fill: "#8B8FA3", fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: "#2A2E3D" }}
                    interval="preserveStartEnd"
                    minTickGap={28}
                  />
                  <YAxis
                    domain={[0, 10]}
                    stroke="#8B8FA3"
                    tick={{ fill: "#8B8FA3", fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: "#2A2E3D" }}
                    width={36}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#1B1E29",
                      border: "1px solid #2A2E3D",
                      borderRadius: 8,
                      color: "#EDEDF2",
                    }}
                    labelStyle={{ color: "#8B8FA3" }}
                  />
                  <Legend
                    wrapperStyle={{ color: "#EDEDF2", paddingTop: 12 }}
                  />
                  {PERSONAS.map((persona) => (
                    <Line
                      key={persona.key}
                      type="monotone"
                      dataKey={persona.key}
                      name={persona.key}
                      stroke={persona.color}
                      strokeWidth={persona.key === "Strict Technical Reviewer" ? 3 : 2.5}
                      strokeDasharray={persona.strokeDasharray}
                      dot={{
                        r: persona.key === "Strict Technical Reviewer" ? 5 : 4,
                        fill: persona.color,
                        stroke: "#1B1E29",
                        strokeWidth: 2,
                      }}
                      activeDot={{ r: 6 }}
                      connectNulls
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

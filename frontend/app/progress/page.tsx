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
    color: "#667066",
    strokeDasharray: undefined as string | undefined,
  },
  {
    key: "Friendly HR Interviewer",
    color: "#172018",
    strokeDasharray: undefined as string | undefined,
  },
  {
    key: "Strict Technical Reviewer",
    color: "#48B536",
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/progress`);
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
    <div className="app-shell flex-1 overflow-y-auto bg-[#F8FAF5]">
      <div className="mx-auto w-full max-w-5xl px-6 py-10 sm:px-8 lg:px-10">
        <p className="landing-eyebrow">Progress</p>
        <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight text-[#172018] sm:text-4xl">
          Your progress over time
        </h1>
        <p className="mt-2 text-base text-[#667066]">
          Track how each AI interviewer scores you across practice sessions.
        </p>

        <div className="landing-card mt-8 p-4 sm:p-6">
          {isLoading && (
            <p className="flex items-center justify-center gap-2 py-16 text-sm text-[#667066]">
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#DCE4D8] border-t-[#72D13D]" />
              Loading progress...
            </p>
          )}

          {error && !isLoading && (
            <p className="studio-error mx-auto my-8 max-w-md rounded-xl px-4 py-3 text-center text-sm">
              {error}
            </p>
          )}

          {!isLoading && !error && chartData.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-base leading-relaxed text-[#667066]">
                Complete a few practice sessions to see your progress here.
              </p>
              <a href="/practice" className="landing-btn-primary mt-6 inline-flex text-sm">
                Start practicing
              </a>
            </div>
          )}

          {!isLoading && !error && chartData.length > 0 && (
            <div className="h-[360px] w-full sm:h-[420px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 12, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid stroke="#DCE4D8" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="label"
                    stroke="#667066"
                    tick={{ fill: "#667066", fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: "#DCE4D8" }}
                    interval="preserveStartEnd"
                    minTickGap={28}
                  />
                  <YAxis
                    domain={[0, 10]}
                    stroke="#667066"
                    tick={{ fill: "#667066", fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: "#DCE4D8" }}
                    width={36}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#FFFFFF",
                      border: "1px solid #DCE4D8",
                      borderRadius: 10,
                      color: "#172018",
                      boxShadow: "0 8px 32px rgba(23, 32, 24, 0.08)",
                    }}
                    labelStyle={{ color: "#667066" }}
                  />
                  <Legend wrapperStyle={{ color: "#172018", paddingTop: 12 }} />
                  {PERSONAS.map((persona) => (
                    <Line
                      key={persona.key}
                      type="monotone"
                      dataKey={persona.key}
                      name={persona.key}
                      stroke={persona.color}
                      strokeWidth={
                        persona.key === "Strict Technical Reviewer" ? 3 : 2.5
                      }
                      strokeDasharray={persona.strokeDasharray}
                      dot={{
                        r: persona.key === "Strict Technical Reviewer" ? 5 : 4,
                        fill: persona.color,
                        stroke: "#FFFFFF",
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

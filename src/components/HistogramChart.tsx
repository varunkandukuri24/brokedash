"use client"

import React, { useMemo } from 'react'

interface HistogramChartProps {
  userPercentile: number
}

const categories = [
  { name: "Broke Beginner", range: "0-9th", emoji: "😓" },
  { name: "Frugal Freshman", range: "10-19th", emoji: "🐣" },
  { name: "Savvy Sophomore", range: "20-29th", emoji: "📚" },
  { name: "Judicious Junior", range: "30-39th", emoji: "🤔" },
  { name: "Senior Saver", range: "40-49th", emoji: "💼" },
  { name: "Balanced Bachelor", range: "50-59th", emoji: "⚖️" },
  { name: "Master of Moderation", range: "60-69th", emoji: "🧘" },
  { name: "Doctorate in Dollars", range: "70-79th", emoji: "🎓" },
  { name: "Professor of Prosperity", range: "80-89th", emoji: "🏆" },
  { name: "Wealth Wizard", range: "90-99th", emoji: "🧙" }
]

export default function HistogramChart({ userPercentile }: HistogramChartProps) {
  const realData = useMemo(() => {
    return [150, 280, 420, 580, 700, 800, 880, 940, 980, 1000]
  }, [])

  const maxValue = Math.max(...realData)

  const getRandomOffset = (range: number) => Math.random() * range - range / 2

  const drawBar = (x: number, y: number, width: number, height: number) => {
    const points = [
      [x, y + height],
      [x, y],
      [x + width, y],
      [x + width, y + height],
    ]

    return points
      .map((point, i) => {
        const offset = i === 0 || i === 3 ? 0 : getRandomOffset(3)
        return `${point[0] + offset},${point[1] + getRandomOffset(3)}`
      })
      .join(" ")
  }

  const percentileX = 50 + (userPercentile / 100) * 400
  const userCategory = categories[Math.floor(userPercentile / 10)]

  return (
    <div className="w-full h-full flex flex-col">
      <div className="bg-orange-200 p-2 rounded-lg shadow-lg flex-grow border-4 border-black">
        <div className="h-full w-full bg-white p-4 rounded-lg border-4 border-black flex flex-col">
          <h2 className="text-xl font-bold mb-2 text-center text-black">
            You spend more than {userPercentile}% of people
          </h2>
          <div className="flex-grow relative" style={{ minHeight: '280px' }}>
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 500 280"
              preserveAspectRatio="xMidYMid meet"
              className="absolute inset-0"
            >
              <defs>
                <pattern id="diagonalLines" patternUnits="userSpaceOnUse" width="4" height="4">
                  <path d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2" stroke="black" strokeWidth="0.8" />
                </pattern>
              </defs>

              {/* Y-axis with arrow */}
              <path
                d="M 50,230 L 50,30 M 50,30 L 45,40 M 50,30 L 55,40"
                fill="none"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* X-axis with arrow */}
              <path
                d="M 50,230 L 450,230 M 450,230 L 440,225 M 450,230 L 440,235"
                fill="none"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Real Data Bars */}
              {realData.map((value, index) => (
                <polygon
                  key={index}
                  points={drawBar(
                    60 + index * 38,
                    230 - (value / maxValue) * 180,
                    28,
                    (value / maxValue) * 180
                  )}
                  fill="url(#diagonalLines)"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              ))}

              {/* X-axis dollar amount labels */}
              <text x="50" y="250" textAnchor="start" className="fill-black text-[10px] sm:text-xs font-medium">
                $150
              </text>
              <text x="250" y="250" textAnchor="middle" className="fill-black text-[10px] sm:text-xs font-medium">
                $500
              </text>
              <text x="450" y="250" textAnchor="end" className="fill-black text-[10px] sm:text-xs font-medium">
                $1000+
              </text>

              {/* User's percentile dotted line */}
              <path
                d={`M ${percentileX},230 L ${percentileX},30`}
                fill="none"
                stroke="#FF7F59"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="5 5"
              />

              {/* User's category name and emoji */}
              <text
                x={percentileX}
                y="20"
                textAnchor="middle"
                fill="black"
                className="text-[10px] sm:text-xs font-semibold"
              >
                <tspan x={percentileX - 40} textAnchor="end" dy="0.3em">{userCategory.emoji}</tspan>
                <tspan x={percentileX - 35} textAnchor="start" dy="0">{userCategory.name}</tspan>
              </text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
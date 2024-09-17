"use client"

import React, { useMemo, useEffect, useState } from 'react'
import { useUser } from '@/contexts/UserContext'
import { supabase } from '@/lib/supabase'

interface HistogramChartProps {
  userId: string
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

export default function HistogramChart() {
  const { user } = useUser();
  const [userPercentile, setUserPercentile] = useState<number | null>(null)
  const [percentileData, setPercentileData] = useState<number[]>(new Array(10).fill(0))
  const [userCategory, setUserCategory] = useState<{ name: string, emoji: string } | null>(null)
  const [totalUsers, setTotalUsers] = useState<number>(0)

  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      // Fetch total number of users
      const { count, error: countError } = await supabase
        .from('brokerank')
        .select('*', { count: 'exact', head: true })

      if (countError) {
        console.error('Error fetching total users:', countError)
        return
      }

      setTotalUsers(count || 0)

      // Fetch all monthly_spend data
      const { data: allData, error: allDataError } = await supabase
        .from('brokerank')
        .select('monthly_spend')
        .order('monthly_spend', { ascending: true })

      if (allDataError) {
        console.error('Error fetching all data:', allDataError)
        return
      }

      const allSpends = allData.map(d => d.monthly_spend)
      const totalCount = allSpends.length

      // Calculate percentile buckets
      const newPercentileData = new Array(10).fill(0)
      allSpends.forEach((spend, index) => {
        const percentile = Math.floor((index / totalCount) * 10)
        newPercentileData[percentile]++
      })
      setPercentileData(newPercentileData)

      // Fetch user's data
      const { data: userData, error: userDataError } = await supabase
        .from('brokerank')
        .select('monthly_spend, category, emoji')
        .eq('id', user.id)
        .single()

      if (userDataError) {
        console.error('Error fetching user data:', userDataError)
        return
      }

      // Calculate user's percentile
      const userSpend = userData.monthly_spend
      const lowerSpends = allSpends.filter(spend => spend < userSpend).length
      const equalSpends = allSpends.filter(spend => spend === userSpend).length
      const calculatedPercentile = Math.min(
        Math.floor(((lowerSpends + equalSpends / 2) / totalCount) * 100),
        99
      )
      setUserPercentile(calculatedPercentile)

      // Set user's category and emoji
      setUserCategory({ name: userData.category, emoji: userData.emoji })
    }

    fetchData()
  }, [user])

  const realData = percentileData

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

  const percentileX = 50 + ((userPercentile ?? 0) / 100) * 400
  

  return (
    <div className="w-full h-full flex flex-col">
      {userPercentile !== null && userCategory !== null ? (
        <div className="bg-orange-200 p-2 rounded-lg shadow-lg flex-grow border-4 border-black">
          <div className="h-full w-full bg-white p-4 rounded-lg border-4 border-black flex flex-col">
            <h2 className="text-xl font-bold mb-2 text-center text-black">
              You spend more than {userPercentile}% of {totalUsers} users
            </h2>
            <div className="flex-grow relative" style={{ minHeight: '220px' }}>
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

                {/* Updated X-axis dollar amount labels */}
                <text x="50" y="250" textAnchor="start" className="fill-black text-[10px] sm:text-xs font-medium">
                  $50
                </text>
                <text x="250" y="250" textAnchor="middle" className="fill-black text-[10px] sm:text-xs font-medium">
                  $750
                </text>
                <text x="450" y="250" textAnchor="end" className="fill-black text-[10px] sm:text-xs font-medium">
                  $1500+
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
      ) : (
        <div>Loading...</div>
      )}
    </div>
  )
}
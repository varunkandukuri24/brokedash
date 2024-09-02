import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ArrowUpDown, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

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

const incomeLevels = ["<100k", "100k-150k", "150k-250k", "250k+"]

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const calculateDaysTillBroke = (incomeLevel: string, monthlySpend: number) => {
  const annualIncome = {
    '<100k': 75000,
    '100k-150k': 125000,
    '150k-250k': 200000,
    '250k+': 300000
  }[incomeLevel] || 75000

  const monthlySavings = (annualIncome / 12) - monthlySpend
  return Math.max(0, Math.floor((annualIncome / 365) / (monthlySpend / 30)))
}

type WalletWarrior = {
  id: string
  income_level: string
  monthly_spend: number
  rank: number
  daysTillBroke: number
  category: string
  emoji: string
}

export default function Component() {
  const [walletWarriorData, setWalletWarriorData] = useState<WalletWarrior[]>([])
  const [sortBy, setSortBy] = useState<keyof WalletWarrior>('rank')
  const [sortOrder, setSortOrder] = useState('asc')
  const [currentPage, setCurrentPage] = useState(0)

  const highlightedUserRank = 2 // This should be dynamically set based on the current user's rank

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('id, income_level, monthly_spend')
      .order('monthly_spend', { ascending: false })

    if (error) {
      console.error('Error fetching data:', error)
      return
    }

    const processedData: WalletWarrior[] = data.map((user, index) => {
      const rank = index + 1
      const categoryIndex = Math.min(Math.floor((rank - 1) / 5), categories.length - 1)
      const category = categories[categoryIndex]
      return {
        ...user,
        rank,
        daysTillBroke: calculateDaysTillBroke(user.income_level, user.monthly_spend),
        category: category.name,
        emoji: category.emoji
      }
    })

    setWalletWarriorData(processedData)
  }

  const sortedData = [...walletWarriorData].sort((a, b) => {
    if (sortBy === 'income_level') {
      const order = ['<100k', '100k-150k', '150k-250k', '250k+']
      return (order.indexOf(a[sortBy]) - order.indexOf(b[sortBy])) * (sortOrder === 'asc' ? 1 : -1)
    }
    if (a[sortBy] < b[sortBy]) return sortOrder === 'asc' ? -1 : 1
    if (a[sortBy] > b[sortBy]) return sortOrder === 'asc' ? 1 : -1
    return 0
  })

  const handleSort = (column: keyof WalletWarrior) => {
    if (column === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('asc')
    }
  }

  const pageSize = 6
  const pageCount = Math.ceil(sortedData.length / pageSize)
  const currentPageData = sortedData.slice(currentPage * pageSize, (currentPage + 1) * pageSize)

  const highlightedUser = walletWarriorData.find(user => user.rank === highlightedUserRank)
  const userCategory = categories[Math.floor((highlightedUserRank - 1) / 5)]

  return (
    <div className="bg-lightAccent border-black border-4 rounded-lg shadow-2xl w-full mx-auto flex flex-col h-[calc(100vh-6rem)] overflow-hidden">
      <h2 className="text-lg font-bold text-center text-white bg-black">brokerank</h2>
      {highlightedUser && (
        <div className="text-center p-2 border-b-4 border-black bg-orange-200">
          <p className="text-xl sm:text-2xl font-bold mb-1">
            <span className="mr-2">{userCategory.emoji}</span>
            You are a {userCategory.name}
          </p>
          <p className="text-xs sm:text-sm text-gray-600">Percentile Range: {userCategory.range}</p>
        </div>
      )}
      <div className="flex-grow overflow-auto flex flex-col">
        <table className="w-full text-xs table-fixed flex-grow">
          <colgroup>
            <col className="w-[10%]" />
            <col className="w-[30%]" />
            <col className="w-[20%]" />
            <col className="w-[20%]" />
            <col className="w-[20%]" />
          </colgroup>
          <thead className="bg-white text-black border-b-4 border-black">
            <tr>
              <th className="px-1 py-2 text-center">
                <Button variant="ghost" size="sm" onClick={() => handleSort('rank')} className="font-bold hover:text-orange-900 p-0 text-[10px] sm:text-xs">
                  <ArrowUpDown className="mr-1 h-2 w-2 sm:h-3 sm:w-3" />
                  Rank
                </Button>
              </th>
              <th className="px-1 py-2 text-center text-[10px] sm:text-xs">
                Warrior
              </th>
              <th className="px-1 py-2 text-center">
                <Button variant="ghost" size="sm" onClick={() => handleSort('daysTillBroke')} className="font-bold  hover:text-orange-900 p-0 text-[10px] sm:text-xs">
                  <ArrowUpDown className="mr-1 h-2 w-2 sm:h-3 sm:w-3" />
                  <span className="hidden sm:inline">Days Till Broke</span>
                  <span className="sm:hidden">Days To Broke</span>
                </Button>
              </th>
              <th className="px-1 py-2 text-center">
                <Button variant="ghost" size="sm" onClick={() => handleSort('income_level')} className="font-bold  hover:text-orange-900 p-0 text-[10px] sm:text-xs">
                  <ArrowUpDown className="mr-1 h-2 w-2 sm:h-3 sm:w-3" />
                  Income
                </Button>
              </th>
              <th className="px-1 py-2 text-center">
                <Button variant="ghost" size="sm" onClick={() => handleSort('monthly_spend')} className="font-bold  hover:text-orange-900 p-0 text-[10px] sm:text-xs">
                  <ArrowUpDown className="mr-1 h-2 w-2 sm:h-3 sm:w-3" />
                  Spend
                </Button>
              </th>
            </tr>
          </thead>
          <tbody className="flex-grow">
            {currentPageData.map((warrior) => (
              <tr 
                key={warrior.id} 
                className={`
                  ${warrior.rank === highlightedUserRank 
                    ? 'bg-black text-white' 
                    : 'hover:bg-orange-50 border-b-2 bg-blue-200 border-black'
                  } 
                  transition-all duration-200
                `}
              >
                <td className="px-1 py-2 text-center font-medium truncate">{warrior.rank}</td>
                <td className="px-1 py-2 text-center">
                  <div className="flex items-center gap-1 justify-center">
                    <span className="text-base">{warrior.emoji}</span>
                    <span className="truncate text-[10px] sm:text-xs">{warrior.category}</span>
                  </div>
                </td>
                <td className="px-1 py-2 text-center truncate text-[10px] sm:text-xs">{warrior.daysTillBroke}</td>
                <td className="px-1 py-2 text-center truncate text-[10px] sm:text-xs">{warrior.income_level}</td>
                <td className="px-1 py-2 text-center truncate text-[10px] sm:text-xs">${warrior.monthly_spend.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-2 flex justify-between items-center text-xs bg-orange-200 ">
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentPage(0)}
            disabled={currentPage === 0}
            className="bg-orange-200 hover:bg-orange-300 text-orange-800 font-bold py-1 px-2 rounded-full transition-all duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronsLeft className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
            className="bg-orange-200 hover:bg-orange-300 text-orange-800 font-bold py-1 px-2 rounded-full transition-all duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-3 w-3" />
          </Button>
        </div>
        <span className="text-orange-800 font-semibold">
          Page {currentPage + 1} of {pageCount}
        </span>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(pageCount - 1, prev + 1))}
            disabled={currentPage === pageCount - 1}
            className="bg-orange-200 hover:bg-orange-300 text-orange-800 font-bold py-1 px-2 rounded-full transition-all duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentPage(pageCount - 1)}
            disabled={currentPage === pageCount - 1}
            className="bg-orange-200 hover:bg-orange-300 text-orange-800 font-bold py-1 px-2 rounded-full transition-all duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronsRight className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}
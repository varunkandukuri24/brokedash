import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ArrowUpDown, ChevronsLeft, ChevronsRight, Share2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useUser } from '@/contexts/UserContext'

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

type Brokedasher = {
  id: string
  income_level: string
  monthly_spend: number
  rank: number
  days_till_broke: number
  category: string
  emoji: string
}

export default function Component() {
  const { user } = useUser()
  const [brokedasherData, setBrokedasherData] = useState<Brokedasher[]>([])
  const [sortBy, setSortBy] = useState<keyof Brokedasher>('rank')
  const [sortOrder, setSortOrder] = useState('asc')
  const [currentPage, setCurrentPage] = useState(0)
  const [leaderboardType, setLeaderboardType] = useState('global')
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null)
  const [referralCode, setReferralCode] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchData()
      fetchReferralCode()
    }
  }, [leaderboardType, user])

  const fetchData = async () => {
    if (!user) return

    let query = supabase.from('brokerank').select('*')

    if (leaderboardType === 'friends') {
      const { data: friendships, error: friendshipsError } = await supabase
        .from('friendships')
        .select('friend_id')
        .eq('user_id', user.id)

      if (friendshipsError) {
        console.error('Error fetching friendships:', friendshipsError)
        return
      }

      const friendIds = friendships.map(f => f.friend_id)
      if (friendIds.length === 0) {
        setBrokedasherData([])
        return
      }

      query = query.in('id', friendIds)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching data:', error)
      return
    }

    setBrokedasherData(data)
    const currentUser = data.find(dasher => dasher.id === user.id)
    if (currentUser) {
      setCurrentUserRank(currentUser.rank)
    }
  }

  const fetchReferralCode = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('users')
      .select('referral_code')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Error fetching referral code:', error)
      return
    }

    setReferralCode(data.referral_code)
  }

  const handleShare = async () => {
    if (!referralCode) return

    const shareData = {
      title: 'Join me on brokedash!',
      text: 'Check out this awesome app to track your finances!',
      url: `https://yourdomain.com/signup?ref=${referralCode}`
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      alert(`Use this link to sign up: ${shareData.url}`)
    }
  }

  const sortedData = [...brokedasherData].sort((a, b) => {
    if (sortBy === 'income_level') {
      const order = ['<100k', '100k-150k', '150k-250k', '250k+']
      return (order.indexOf(a[sortBy]) - order.indexOf(b[sortBy])) * (sortOrder === 'asc' ? 1 : -1)
    }
    if (a[sortBy] < b[sortBy]) return sortOrder === 'asc' ? -1 : 1
    if (a[sortBy] > b[sortBy]) return sortOrder === 'asc' ? 1 : -1
    return 0
  })

  const handleSort = (column: keyof Brokedasher) => {
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

  const currentUserData = brokedasherData.find(dasher => dasher.id === user?.id)
  const userCategory = currentUserRank ? categories[Math.min(Math.floor((currentUserRank - 1) / 5), categories.length - 1)] : null

  return (
    <div className="bg-lightAccent border-black border-4 rounded-lg shadow-2xl w-full mx-auto flex flex-col h-[calc(100vh-6rem)] overflow-hidden">
      <h2 className="text-lg font-bold text-center text-white bg-black">brokerank</h2>
      {currentUserData && userCategory && (
        <div className="text-center p-2 border-b-4 border-black bg-orange-200">
          <p className="text-xl sm:text-2xl font-bold mb-1">
            <span className="mr-2">{userCategory.emoji}</span>
            You are a {userCategory.name}
          </p>
          <p className="text-xs sm:text-sm text-gray-600">Percentile Range: {userCategory.range}</p>
        </div>
      )}
      <div className="bg-orange-200 p-2 border-b-4 border-black">
        <div className="bg-white rounded-full p-1 flex border-2 border-black">
          <button
            className={`flex-1 py-2 px-2 rounded-full text-xs sm:text-sm transition-colors duration-300 ${
              leaderboardType === 'global' 
                ? 'bg-black text-orange-200' 
                : 'text-black hover:bg-orange-200'
            }`}
            onClick={() => setLeaderboardType('global')}
          >
            Global
          </button>
          <button
            className={`flex-1 py-2 px-2 rounded-full text-xs sm:text-sm transition-colors duration-300 ${
              leaderboardType === 'friends' 
                ? 'bg-black text-orange-200' 
                : 'text-black hover:bg-orange-200'
            }`}
            onClick={() => setLeaderboardType('friends')}
          >
            Friends
          </button>
        </div>
      </div>
      <div className="flex-grow overflow-auto flex flex-col">
        <table className="w-full text-xs table-fixed flex-grow">
          <colgroup>
            <col className="w-[10%]" />
            <col className="w-[30%]" />
            {leaderboardType === 'global' && (
              <>
                <col className="w-[20%]" />
                <col className="w-[20%]" />
                <col className="w-[20%]" />
              </>
            )}
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
              {leaderboardType === 'global' && (
                <>
                  <th className="px-1 py-2 text-center">
                    <Button variant="ghost" size="sm" onClick={() => handleSort('days_till_broke')} className="font-bold  hover:text-orange-900 p-0 text-[10px] sm:text-xs">
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
                </>
              )}
            </tr>
          </thead>
          <tbody className="flex-grow">
            {brokedasherData.length > 0 ? (
              currentPageData.map((dasher) => (
                <tr 
                  key={dasher.id} 
                  className={`
                    ${dasher.id === user?.id 
                      ? 'bg-black text-white' 
                      : 'hover:bg-orange-50 border-b-2 bg-blue-200 border-black'
                    } 
                    transition-all duration-200
                  `}
                >
                  <td className="px-1 py-2 text-center font-medium truncate">{dasher.rank}</td>
                  <td className="px-1 py-2 text-center">
                    <div className="flex items-center gap-1 justify-center">
                      <span className="text-base">{dasher.emoji}</span>
                      <span className="truncate text-[10px] sm:text-xs">{dasher.category}</span>
                    </div>
                  </td>
                  {leaderboardType === 'global' && (
                    <>
                      <td className="px-1 py-2 text-center truncate text-[10px] sm:text-xs">{dasher.days_till_broke}</td>
                      <td className="px-1 py-2 text-center truncate text-[10px] sm:text-xs">{dasher.income_level}</td>
                      <td className="px-1 py-2 text-center truncate text-[10px] sm:text-xs">${dasher.monthly_spend.toLocaleString()}</td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={leaderboardType === 'global' ? 5 : 2} className="text-center py-4 text-lg font-bold text-gray-500">
                  {leaderboardType === 'friends' ? (
                    <div className="flex flex-col items-center">
                      <p>Invite friends to view</p>
                      <Button
                        onClick={handleShare}
                        className="mt-2 bg-orange-500 hover:bg-orange-600 text-white"
                      >
                        <Share2 className="mr-2 h-4 w-4" />
                        Invite Friends
                      </Button>
                    </div>
                  ) : (
                    "No data available"
                  )}
                </td>
              </tr>
            )}
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
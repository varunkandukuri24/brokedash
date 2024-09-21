import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ArrowUpDown, ChevronsLeft, ChevronsRight, Share2, PencilIcon } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useUser } from '@/contexts/UserContext'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { posthog } from '@/lib/posthog';

const categories = {
  "Splurge Specialist": { range: "90-99th", emoji: "💸" },
  "Impulse Investor": { range: "80-89th", emoji: "🛍️" },
  "Carefree Cashburner": { range: "70-79th", emoji: "🔥" },
  "Whimsical Wallet-Drainer": { range: "60-69th", emoji: "🎭" },
  "Middling Money Manager": { range: "50-59th", emoji: "➗" },
  "Prudent Penny-Pincher": { range: "40-49th", emoji: "🐷" },
  "Savvy Saver": { range: "30-39th", emoji: "🧠" },
  "Frugal Financier": { range: "20-29th", emoji: "📊" },
  "Thrift Theorist": { range: "10-19th", emoji: "🧮" },
  "Miserly Maestro": { range: "0-9th", emoji: "🧙" }
};

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
  const [userCountry, setUserCountry] = useState<string>('US')
  const [brokedasherData, setBrokedasherData] = useState<Brokedasher[]>([])
  const [sortBy, setSortBy] = useState<keyof Brokedasher>('rank')
  const [sortOrder, setSortOrder] = useState('asc')
  const [currentPage, setCurrentPage] = useState(0)
  const [leaderboardType, setLeaderboardType] = useState('global')
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null)
  const [referralCode, setReferralCode] = useState<string | null>(null)
  const [initialLoadComplete, setInitialLoadComplete] = useState(false)
  const [userCategory, setUserCategory] = useState<{ name: string, emoji: string, range: string } | null>(null)
  const router = useRouter()
  const [friendCount, setFriendCount] = useState(0);

  useEffect(() => {
    const country = Cookies.get('user_country')
    if (country === 'IN' || country === 'US') {
      setUserCountry(country)
    }
  }, [])

  useEffect(() => {
    if (user) {
      fetchData()
      fetchReferralCode()
      fetchUserCategory()
      if (leaderboardType === 'global') {
        setCurrentPage(0) // Temporarily set to 0, will be updated after data fetch
      } else {
        setCurrentPage(0) // Reset to first page for friends leaderboard
      }
    }
  }, [leaderboardType, user])

  useEffect(() => {
    if (user && leaderboardType === 'friends') {
      fetchFriendCount();
    }
  }, [leaderboardType, user]);

  const fetchFriendCount = async () => {
    if (!user) return;

    const { count, error } = await supabase
      .from('friendships')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching friend count:', error);
      return;
    }

    setFriendCount(count || 0);
  };

  useEffect(() => {
    if (leaderboardType === 'global' && brokedasherData.length > 0 && currentUserRank) {
      const userPage = Math.floor((currentUserRank - 1) / pageSize)
      setCurrentPage(userPage)
    }
  }, [brokedasherData, currentUserRank, leaderboardType])

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

    const sortedData = data.sort((a, b) => a.rank - b.rank)
    setBrokedasherData(sortedData)
    const currentUser = sortedData.find(dasher => dasher.id === user.id)
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

  const fetchUserCategory = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('brokerank')
      .select('category, emoji')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Error fetching user category:', error)
      return
    }

    if (data && data.category in categories) {
      setUserCategory({
        name: data.category,
        emoji: data.emoji,
        range: categories[data.category as keyof typeof categories].range
      })
    }
  }

  const handleShare = async () => {
    if (!referralCode) return

    const shareData = {
      title: 'Join me on brokedash',
      text: 'Check out this app to compare your food spending anonymously!',
      url: `https://brokedash.vercel.app/?ref=${referralCode}`
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
  const pageCount = Math.max(1, Math.ceil(sortedData.length / pageSize))
  const currentPageData = sortedData.slice(currentPage * pageSize, (currentPage + 1) * pageSize)

  const currentUserData = brokedasherData.find(dasher => dasher.id === user?.id)

  const handleEdit = () => {
    router.push('/userinput')
  }

  const getCountryName = (countryCode: string) => {
    switch (countryCode) {
      case 'US':
        return 'United States';
      case 'IN':
        return 'India';
      default:
        return 'Global';
    }
  }

  const getCountryFlag = (countryCode: string) => {
    switch (countryCode) {
      case 'US':
        return '🇺🇸';
      case 'IN':
        return '🇮🇳';
      default:
        return '🌎';
    }
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    posthog.capture('leaderboard_page_changed', { 
      new_page: newPage + 1, 
      total_pages: pageCount 
    });
  };

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
            {getCountryFlag(userCountry)} {getCountryName(userCountry)}
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
                brokelevel
              </th>
              {leaderboardType === 'global' && (
                <>
                  <th className="px-1 py-2 text-center">
                    <Button variant="ghost" size="sm" onClick={() => handleSort('days_till_broke')} className="font-bold  hover:text-orange-900 p-0 text-[10px] sm:text-xs">
                      <ArrowUpDown className="mr-1 h-2 w-2 sm:h-3 sm:w-3" />
                      <span className="hidden sm:inline">Days Till broke</span>
                      <span className="sm:hidden">DaysTobroke</span>
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
            {leaderboardType === 'friends' && friendCount < 2 ? (
              <tr>
                <td colSpan={2} className="text-center py-4 text-lg font-bold text-gray-500">
                  <div className="flex flex-col items-center">
                    {friendCount === 0 ? (
                      <p className='text-base text-black'>Invite at least 2 friends to view</p>
                    ) : (
                      <p className='text-base text-black'>Invite 1 more friend to view</p>
                    )}
                    <Button onClick={handleShare} className="mt-2 mb-4 bg-black hover:bg-white text-white hover:text-black font-bold py-2 px-4 rounded-full transition-all duration-200 ease-in-out transform hover:scale-[1.02] border-2 border-black flex items-center justify-center">
                      <Share2 className="mr-2 h-4 w-4" />
                      Invite Friends
                    </Button>
                    <p className='text-xs text-black'>No names or numbers, we respect the broke-ode</p>
                  </div>
                </td>
              </tr>
            ) : (
              brokedasherData.length > 0 ? (
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
                        <td className="px-1 py-2 text-center truncate text-[10px] sm:text-xs">
                          <div className="flex items-center justify-center">
                            ${dasher.monthly_spend.toLocaleString()}
                            {dasher.id === user?.id && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleEdit}
                                className="ml-1 p-0 h-4 w-4"
                              >
                                <PencilIcon className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={leaderboardType === 'global' ? 5 : 2} className="text-center py-4 text-lg font-bold text-gray-500">
                    No data available
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
      <div className="p-2 flex justify-between items-center text-xs bg-orange-200 ">
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handlePageChange(0)}
            disabled={currentPage === 0 || sortedData.length === 0}
            className="bg-orange-200 hover:bg-orange-300 text-orange-800 font-bold py-1 px-2 rounded-full transition-all duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronsLeft className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0 || sortedData.length === 0}
            className="bg-orange-200 hover:bg-orange-300 text-orange-800 font-bold py-1 px-2 rounded-full transition-all duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-3 w-3" />
          </Button>
        </div>
        <span className="text-orange-800 font-semibold">
          Page {sortedData.length > 0 ? currentPage + 1 : 0} of {pageCount}
        </span>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handlePageChange(Math.min(pageCount - 1, currentPage + 1))}
            disabled={currentPage === pageCount - 1 || sortedData.length === 0}
            className="bg-orange-200 hover:bg-orange-300 text-orange-800 font-bold py-1 px-2 rounded-full transition-all duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handlePageChange(pageCount - 1)}
            disabled={currentPage === pageCount - 1 || sortedData.length === 0}
            className="bg-orange-200 hover:bg-orange-300 text-orange-800 font-bold py-1 px-2 rounded-full transition-all duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronsRight className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}
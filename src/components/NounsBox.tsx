import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AirPods, ConcertTickets, HairDryer, Thermos, VisionPro, Book, GymMembership, Premium, YeezyBoosts, Purse } from '@/assets/nounssvgs'
import { useUser } from '@/contexts/UserContext'
import { supabase } from '@/lib/supabase'

interface NounsBoxProps {
  onSelect: (noun: string | null) => void;
}

export default function NounsBox({ onSelect }: NounsBoxProps) {
  const [selectedSVG, setSelectedSVG] = useState<'thermos' | 'concertTickets' | 'visionPro' | 'airPods' | 'hairDryer' | 'book' | 'gymMembership' | 'premium' | 'yeezyBoosts' | 'purse'>('thermos')
  const [userMonthlySpend, setUserMonthlySpend] = useState<number | null>(null)
  const { user } = useUser()

  useEffect(() => {
    onSelect('thermos')
    fetchUserMonthlySpend()
  }, [onSelect, user])

  const fetchUserMonthlySpend = async () => {
    if (user) {
      const { data, error } = await supabase
        .from('users')
        .select('monthly_spend')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error fetching user monthly spend:', error)
      } else if (data) {
        setUserMonthlySpend(data.monthly_spend)
      }
    }
  }

  const handleClick = (svg: 'thermos' | 'concertTickets' | 'visionPro' | 'airPods' | 'hairDryer' | 'book' | 'gymMembership' | 'premium' | 'yeezyBoosts' | 'purse') => {
    setSelectedSVG(svg)
    onSelect(svg)
  }

  const getSVGComponent = () => {
    switch (selectedSVG) {
      case 'thermos':
        return <Thermos className="w-16 h-16 animate-bounce" />
      case 'concertTickets':
        return <ConcertTickets className="w-16 h-16 animate-bounce" />
      case 'visionPro':
        return <VisionPro className="w-16 h-16 animate-bounce" />
      case 'airPods':
        return <AirPods className="w-16 h-16 animate-bounce" />
      case 'hairDryer':
        return <HairDryer className="w-16 h-16 animate-bounce" />
      case 'book':
        return <Book className="w-16 h-16 animate-bounce" />
      case 'gymMembership':
        return <GymMembership className="w-16 h-16 animate-bounce" />
      case 'premium':
        return <Premium className="w-16 h-16 animate-bounce" />
      case 'yeezyBoosts':
        return <YeezyBoosts className="w-16 h-16 animate-bounce" />
      case 'purse':
        return <Purse className="w-16 h-16 animate-bounce" />
    }
  }
      
  const getDescriptionText = () => {
    switch (selectedSVG) {
      case 'thermos':
        return 'Stanley Cup'
      case 'concertTickets':
        return 'Taylor Swift concert tickets (nosebleed section)'
      case 'visionPro':
        return 'Vision Pro'
      case 'airPods':
        return 'Airpods'
      case 'hairDryer':
        return 'Dyson hair dryer'
      case 'book':
        return 'For once, a book'
      case 'gymMembership':
        return 'A gym membership to burn those calories'
      case 'premium':
        return 'LinkedIn Premium'
      case 'yeezyBoosts':
        return 'Yeezys'
      case 'purse':
        return 'Birkin baby'
    }
  }

  const getAffordableCount = (cost: number) => {
    if (userMonthlySpend === null) return 0
    return Math.floor(userMonthlySpend / cost)
  }

  const buttonComponents = [
    { key: 'thermos', component: Thermos },
    { key: 'concertTickets', component: ConcertTickets },
    { key: 'book', component: Book },
    { key: 'gymMembership', component: GymMembership },
    { key: 'premium', component: Premium },
    { key: 'yeezyBoosts', component: YeezyBoosts },
    { key: 'airPods', component: AirPods },
    { key: 'hairDryer', component: HairDryer },
    { key: 'visionPro', component: VisionPro },
    { key: 'purse', component: Purse },
  ];

  const svgcosts = [
    { key: 'thermos', cost: 45, currency: 'USD' },
    { key: 'concertTickets', cost: 690, currency: 'USD' },
    { key: 'book', cost: 20, currency: 'USD' },
    { key: 'gymMembership', cost: 80, currency: 'USD' },
    { key: 'premium', cost: 45, currency: 'USD' },
    { key: 'yeezyBoosts', cost: 230, currency: 'USD' },
    { key: 'airPods', cost: 130, currency: 'USD' },
    { key: 'hairDryer', cost: 300, currency: 'USD' },
    { key: 'visionPro', cost: 3499, currency: 'USD' },
    { key: 'purse', cost: 10000, currency: 'USD' },
  ];

  return (
    <div className="w-full h-full">
      <div className="bg-orange-200 p-2 rounded-lg shadow-lg border-4 border-black h-full">
        <div className="w-full h-full bg-white p-4 rounded-lg border-4 border-black flex flex-col">
          <h2 className="text-xl font-bold mb-4 text-center text-black">
            Things you could have bought instead
          </h2>
          <div className="flex-1 flex flex-col justify-between">
            <div className="flex flex-col items-center justify-center mb-2 flex-grow">
              <div className="flex items-center mb-2">
                {getSVGComponent()}
                <span className="text-3xl font-bold ml-2">
                  x {getAffordableCount(svgcosts.find(item => item.key === selectedSVG)?.cost || 0)}
                </span>
              </div>
              <p className="text-sm text-center text-gray-600 max-w-full">
                {getDescriptionText()}
              </p>
            </div>
            <div className="w-full h-px bg-black mb-2"></div>
            <div className="grid grid-cols-5 gap-2 justify-items-center mb-2">
              {buttonComponents.slice(0, 5).map(({ key, component: SVGComponent }) => (
                <Button
                  key={key}
                  onClick={() => handleClick(key as any)}
                  variant={selectedSVG === key ? 'default' : 'outline'}
                  className="p-1 h-10 w-10 hover:bg-gray-100 rounded-full border-2 border-black"
                >
                  <SVGComponent className="w-6 h-6" />
                </Button>
              ))}
            </div>
            <div className="grid grid-cols-5 gap-2 justify-items-center">
              {buttonComponents.slice(5).map(({ key, component: SVGComponent }) => (
                <Button
                  key={key}
                  onClick={() => handleClick(key as any)}
                  variant={selectedSVG === key ? 'default' : 'outline'}
                  className="p-1 h-10 w-10 hover:bg-gray-100 rounded-full border-2 border-black"
                >
                  <SVGComponent className="w-6 h-6" />
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes textAnimation {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        .animated-text {
          display: inline-block;
          animation: textAnimation 2s infinite;
          background: linear-gradient(45deg, #ff4e50, #f9d423);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </div>
  )
}
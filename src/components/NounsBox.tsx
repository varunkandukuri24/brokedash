import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AirPods, ConcertTickets, HairDryer, Thermos, VisionPro, Book, GymMembership, Premium, YeezyBoosts, Purse } from '@/assets/nounssvgs'

interface NounsBoxProps {
  onSelect: (noun: string | null) => void;
}

export default function NounsBox({ onSelect }: NounsBoxProps) {
  const [selectedSVG, setSelectedSVG] = useState<'thermos' | 'concertTickets' | 'visionPro' | 'airPods' | 'hairDryer' | 'book' | 'gymMembership' | 'premium' | 'yeezyBoosts' | 'purse'>('thermos')

  useEffect(() => {
    onSelect('thermos')
  }, [onSelect])

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

  const getDisplayText = () => {
    switch (selectedSVG) {
      case 'thermos':
        return '10 Stanley Cups'
      case 'concertTickets':
        return '10 Concert Tickets'
      case 'visionPro':
        return '10 Vision Pros'
      case 'airPods':
        return '10 AirPods'
      case 'hairDryer':
        return '10 Hair Dryers'
      case 'book':
        return '10 Books'
      case 'gymMembership':
        return '10 Gym Memberships'
      case 'premium':
        return '10 Premium Subscriptions'
      case 'yeezyBoosts':
        return '10 Yeezy Boosts'
      case 'purse':
        return '10 Purses'
    }
  }

  const getDescriptionText = () => {
    switch (selectedSVG) {
      case 'thermos':
        return 'Keep your drinks hot or cold all day long. Perfect for outdoor adventures!'
      case 'concertTickets':
        return 'Experience live music and unforgettable moments with your favorite artists.'
      case 'visionPro':
        return 'Immerse yourself in mixed reality with Apple\'s cutting-edge headset.'
      case 'airPods':
        return 'Enjoy wireless audio with noise cancellation and seamless device switching.'
      case 'hairDryer':
        return 'Achieve salon-quality hair at home with this powerful and efficient hair dryer.'
      case 'book':
        return 'Expand your knowledge and imagination with a collection of captivating reads.'
      case 'gymMembership':
        return 'Stay fit and healthy with access to state-of-the-art fitness equipment and classes.'
      case 'premium':
        return 'Unlock exclusive content and features across your favorite streaming platforms.'
      case 'yeezyBoosts':
        return 'Step out in style with these trendy and comfortable sneakers.'
      case 'purse':
        return 'Carry your essentials in style with these fashionable and functional purses.'
    }
  }

  const buttonComponents = [
    { key: 'thermos', component: Thermos },
    { key: 'concertTickets', component: ConcertTickets },
    { key: 'visionPro', component: VisionPro },
    { key: 'airPods', component: AirPods },
    { key: 'hairDryer', component: HairDryer },
    { key: 'book', component: Book },
    { key: 'gymMembership', component: GymMembership },
    { key: 'premium', component: Premium },
    { key: 'yeezyBoosts', component: YeezyBoosts },
    { key: 'purse', component: Purse },
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
                <span className="text-3xl font-bold ml-2">x 10</span>
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
                  className="p-1 h-10 w-10 bg-white hover:bg-gray-100 rounded-full border-2 border-black"
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
                  className="p-1 h-10 w-10 bg-white hover:bg-gray-100 rounded-full border-2 border-black"
                >
                  <SVGComponent className="w-6 h-6" />
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
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
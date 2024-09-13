import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AirPods, ConcertTickets, HairDryer, Thermos, VisionPro } from '@/assets/nounssvgs'


export default function NounsBox() {
  const [selectedSVG, setSelectedSVG] = useState<'thermos' | 'concertTickets' | 'visionPro' |'airPods' | 'hairDryer' | null>(null)

  const handleClick = (svg: 'thermos' | 'concertTickets' | 'visionPro' |'airPods' | 'hairDryer') => {
    setSelectedSVG(svg)
  }

  const getSVGComponent = () => {
    switch (selectedSVG) {
      case 'thermos':
        return <Thermos className="w-16 h-16" />
      case 'concertTickets':
        return <ConcertTickets className="w-16 h-16" />
      case 'visionPro':
        return <VisionPro className="w-16 h-16" />
      case 'airPods':
        return <AirPods className="w-16 h-16" />
      case 'hairDryer':
        return <HairDryer className="w-16 h-16" />
      default:
        return null
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
      default:
        return 'Select an item'
    }
  }

  const buttonComponents = [
    { key: 'thermos', component: Thermos },
    { key: 'concertTickets', component: ConcertTickets },
    { key: 'visionPro', component: VisionPro },
    { key: 'airPods', component: AirPods },
    { key: 'hairDryer', component: HairDryer },
  ];

  return (
    <div className="w-full">
      <div className="bg-orange-200 p-2 rounded-lg shadow-lg border-4 border-black">
        <div className="w-full bg-white p-4 rounded-lg border-4 border-black flex flex-col">
          <h2 className="text-xl font-bold mb-2 text-center text-black">
            What would you rather have?
          </h2>
          <div className="flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-center mb-2 flex-grow">
              {selectedSVG ? (
                <div className="flex items-center">
                  {getSVGComponent()}
                  <span className="text-3xl font-bold mt-2">x 10</span>
                </div>
              ) : (
                <div className="text-2xl font-bold text-gray-400">Select an item</div>
              )}
            </div>
            <div className="w-full h-px bg-black mb-2"></div>
            <div className="grid grid-cols-5 gap-2 justify-items-center">
              {buttonComponents.map(({ key, component: SVGComponent }) => (
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
'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import ProtectedRoute from '@/components/ProtectedRoute'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useUser } from '@/contexts/UserContext'
import { v4 as uuidv4 } from 'uuid'
import crypto from 'crypto'

export default function Component() {
  const router = useRouter()
  const { user } = useUser()
  const [monthlySpend, setMonthlySpend] = useState('')
  const [income, setIncome] = useState('50k-150k')
  const [isLoading, setIsLoading] = useState(false)
  const [isEditable, setIsEditable] = useState(true)
  const [userExists, setUserExists] = useState(false)

  const incomeOptions = [
    { value: "<50k", label: "<$50k" },
    { value: "50k-150k", label: "$50k-$150k" },
    { value: "150k-250k", label: "$150k-$250k" },
    { value: "250k+", label: "$250k+" },
  ]

  useEffect(() => {
    if (user) {
      checkUserExists()
    }
  }, [user])

  const checkUserExists = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('users')
      .select('monthly_spend, income_level')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Error checking user:', error)
      return
    }

    if (data) {
      setMonthlySpend(data.monthly_spend.toString())
      setIncome(data.income_level)
      setIsEditable(false)
      setUserExists(true)
    }
  }

  const generateReferralCode = (uuid: string, email: string) => {
    const hash = crypto.createHash('sha256')
    hash.update(uuid + email)
    return hash.digest('hex').substring(0, 10)
  }

  const handleSubmit = async () => {
    if (!user || !monthlySpend || !income) return

    setIsLoading(true)

    if (userExists) {
      // Update existing user data
      const { error } = await supabase
        .from('users')
        .update({
          income_level: income,
          monthly_spend: parseFloat(monthlySpend),
        })
        .eq('id', user.id)

      setIsLoading(false)

      if (error) {
        console.error('Error updating user data:', error)
        return
      }
    } else {
      // Insert new user data
      const referralCode = generateReferralCode(uuidv4(), user.email!)

      const { error } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email,
          income_level: income,
          monthly_spend: parseFloat(monthlySpend),
          referral_code: referralCode,
          is_seed_user: false
        })

      setIsLoading(false)

      if (error) {
        console.error('Error inserting user data:', error)
        return
      }
    }

    router.push('/brokestats')
  }

  return (
    <ProtectedRoute>
      <div className="bg-lightAccent min-h-screen flex items-center justify-center">
        <div className="bg-orange-200 border-black border-4 rounded-lg shadow-2xl w-4/5 sm:w-4/5 md:w-3/5 lg:w-2/5 xl:w-2/3 mx-auto flex flex-col">
          <h2 className="text-lg font-bold text-center text-white bg-black p-2">Enter your monthly spend</h2>
          <div className="flex-grow overflow-auto flex flex-col p-4">
            <div className="flex items-center justify-between mb-2 pb-4 border-b-2 border-black">
              <span className="text-black font-semibold text-sm sm:text-base md:text-lg lg:text-xl">1 x food you bought instead of groceries</span>
              <div className="flex items-center">
                <span className="mr-2 text-black font-semibold">$</span>
                <Input
                  type="number"
                  value={monthlySpend}
                  onChange={(e) => setMonthlySpend(e.target.value)}
                  className="w-24 sm:w-28 md:w-32 lg:w-36 text-right bg-white border-black [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="0.00"
                  disabled={!isEditable}
                />
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-2 text-center text-black">Select Income Level</h3>
              <div className="bg-white rounded-full p-1 flex border-2 border-black">
                {incomeOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`flex-1 py-2 px-2 rounded-full text-xs sm:text-sm transition-colors duration-300 ${
                      income === option.value 
                        ? 'bg-black text-orange-200' 
                        : 'text-black hover:bg-orange-200'
                    }`}
                    onClick={() => setIncome(option.value)}
                    disabled={!isEditable}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            {!isEditable && (
              <Button 
                className="w-full mb-4 bg-white hover:bg-orange-300 text-black font-bold py-2 px-4 rounded-full transition-all duration-200 ease-in-out transform hover:scale-[1.02] border-2 border-black"
                onClick={() => setIsEditable(true)}
              >
                Edit Spend
              </Button>
            )}
            <Button 
              className="w-full bg-black hover:bg-white hover:text-black text-white font-bold py-2 px-4 rounded-full transition-all duration-200 ease-in-out transform hover:scale-[1.02] border-2 border-black"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Go'}
            </Button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
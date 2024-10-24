'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'
import { Card } from '@/components/ui/card'

// Mock exchange rate: 1 USD = 100,000 SAT
const MOCK_EXCHANGE_RATE = 100000

export const SendKeywordInput = () => {
  const [usdAmount, setUsdAmount] = useState('0')
  const [satAmount, setSatAmount] = useState('0')
  const [activeInput, setActiveInput] = useState<'USD' | 'SAT'>('USD')

  useEffect(() => {
    if (activeInput === 'USD') {
      setSatAmount((Number.parseFloat(usdAmount) * MOCK_EXCHANGE_RATE).toFixed(0))
    } else {
      setUsdAmount((Number.parseFloat(satAmount) / MOCK_EXCHANGE_RATE).toFixed(2))
    }
  }, [usdAmount, satAmount, activeInput])

  const handleNumberClick = (num: string) => {
    if (activeInput === 'USD') {
      setUsdAmount((prev) => (prev === '0' ? num : prev + num))
    } else {
      setSatAmount((prev) => (prev === '0' ? num : prev + num))
    }
  }

  const handleDecimalClick = () => {
    if (activeInput === 'USD' && !usdAmount.includes('.')) {
      setUsdAmount((prev) => `${prev}.`)
    }
  }

  const handleDeleteClick = () => {
    if (activeInput === 'USD') {
      setUsdAmount((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'))
    } else {
      setSatAmount((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'))
    }
  }

  const toggleActiveInput = () => {
    setActiveInput((prev) => (prev === 'USD' ? 'SAT' : 'USD'))
  }

  return (
    <Card className="bg-background text-white p-6 max-w-sm mx-auto font-sans">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-normal">Set amount</h2>
      </div>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <Input
            type="text"
            value={`$${usdAmount}`}
            readOnly
            className={`text-4xl font-light bg-transparent border-none text-white p-0 h-auto ${
              activeInput === 'USD' ? 'text-white' : 'text-gray-500'
            }`}
            onClick={() => setActiveInput('USD')}
          />
          <div className={`text-right text-2xl font-light ${activeInput === 'USD' ? 'text-white' : 'text-gray-500'}`}>
            USD
          </div>
        </div>
        <div className="flex justify-between items-center">
          <Input
            type="text"
            value={satAmount}
            readOnly
            className={`text-4xl font-light bg-transparent border-none text-white p-0 h-auto ${
              activeInput === 'SAT' ? 'text-white' : 'text-gray-500'
            }`}
            onClick={() => setActiveInput('SAT')}
          />
          <div className={`text-right text-2xl font-light ${activeInput === 'SAT' ? 'text-white' : 'text-gray-500'}`}>
            SAT
          </div>
        </div>
        <div className="h-px bg-gray-800 w-full mt-2" />
      </div>
      <div className="flex justify-center mb-8">
        <Button
          variant="ghost"
          className="rounded-full bg-gray-800 p-0 h-12 w-12 flex items-center justify-center"
          onClick={toggleActiveInput}
        >
          <span className="text-primary text-xl font-bold">⇅</span>
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-y-6 mb-8">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0].map((num) => (
          <Button
            key={num}
            variant="ghost"
            className="text-3xl py-2 h-auto"
            onClick={() => (num === '.' ? handleDecimalClick() : handleNumberClick(num.toString()))}
          >
            {num}
          </Button>
        ))}
        <Button variant="ghost" className="text-2xl py-2 h-auto" onClick={handleDeleteClick}>
          <X size={24} />
        </Button>
      </div>
      <Button className="w-full bg-primary hover:bg-primary/80 text-white py-4 rounded-full text-xl font-normal">
        Confirm
      </Button>
    </Card>
  )
}

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'
import { Card } from '@/components/ui/card'

export const SendKeywordInput = () => {
  const [tokenAmount, setTokenAmount] = useState('0')

  const handleNumberClick = (num: string) => {
    setTokenAmount((prev) => (prev === '0' ? num : prev + num))
  }

  const handleDecimalClick = () => {
    if (!tokenAmount.includes('.')) {
      setTokenAmount((prev) => `${prev}.`)
    }
  }

  const handleDeleteClick = () => {
    setTokenAmount((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'))
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
            value={tokenAmount}
            readOnly
            className="text-4xl font-light bg-transparent border-none text-white p-0 h-auto"
          />
          <div className="text-right text-2xl font-light text-white">Tokens</div>
        </div>
        <div className="h-px bg-gray-800 w-full mt-2" />
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

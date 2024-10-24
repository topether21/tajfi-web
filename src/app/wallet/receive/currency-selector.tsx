'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import { useBalances } from '@/hooks/use-balances'
import { Currency } from '@/components/containers/wallet/currency_selector/currency-selector'

export const VerticalCurrencySelector = ({ selectedOption, setSelectedOption, currencies }: { selectedOption: string, setSelectedOption: (option: string) => void, currencies: string[] }) => {
    const [isOpen, setIsOpen] = React.useState(false)


    const handleSelect = (option: string) => {
        setSelectedOption(option)
        setIsOpen(false)
    }

    return (
        <div className="relative w-16">
            <button
                type="button"
                className="w-16 h-16 p-2 rounded-none flex flex-col items-center justify-center"
                onClick={() => setIsOpen(!isOpen)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-label={`Selected: ${selectedOption}`}
            >
                <Currency name={selectedOption} assetId={selectedOption} />
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                <span className="sr-only">Toggle icon selector</span>
            </button>
            {isOpen && (
                <div className="absolute top-full left-0 w-16 mt-1 bg-background border-2 rounded-none shadow-md">
                    {currencies.map((currency) => (
                        <Button
                            key={currency}
                            variant="ghost"
                            className={`w-full h-12 p-2 rounded-none flex items-center justify-center ${selectedOption === currency
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-secondary'
                                }`}
                            onClick={() => handleSelect(currency)}
                            aria-selected={selectedOption === currency}
                        >
                            <Currency name={currency} assetId={currency} />
                            <span className="sr-only">{currency}</span>
                        </Button>
                    ))}
                </div>
            )}
        </div>
    )
}

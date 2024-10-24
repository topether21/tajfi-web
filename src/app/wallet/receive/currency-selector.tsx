'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { ChevronDown, Home, Settings, User, Bell, Calendar, Search } from 'lucide-react'
import { TetherUSDT } from '@/components/icons/tether'

const options = [
    { icon: TetherUSDT, label: 'Tether' },
    { icon: Home, label: 'Home' },
    { icon: Settings, label: 'Settings' },
    { icon: User, label: 'User' },
    { icon: Bell, label: 'Notifications' },
    { icon: Calendar, label: 'Calendar' },
    { icon: Search, label: 'Search' },
]

export const VerticalCurrencySelector = () => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [selectedOption, setSelectedOption] = React.useState(options[0]) // Default to TetherUSDT

    const handleSelect = (option) => {
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
                aria-label={`Selected: ${selectedOption.label}`}
            >
                <selectedOption.icon className="h-8 w-8 mb-1" />
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                <span className="sr-only">Toggle icon selector</span>
            </button>
            {isOpen && (
                <div className="absolute top-full left-0 w-16 mt-1 bg-background border-2 rounded-none shadow-md">
                    {options.map((option) => (
                        <Button
                            key={option.label}
                            variant="ghost"
                            className={`w-full h-12 p-2 rounded-none flex items-center justify-center ${selectedOption.label === option.label
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-secondary'
                                }`}
                            onClick={() => handleSelect(option)}
                            aria-selected={selectedOption.label === option.label}
                            role="option"
                        >
                            <option.icon className="h-6 w-6" />
                            <span className="sr-only">{option.label}</span>
                        </Button>
                    ))}
                </div>
            )}
        </div>
    )
}

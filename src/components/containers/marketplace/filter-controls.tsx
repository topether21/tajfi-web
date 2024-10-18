import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Toggle } from "@/components/ui/toggle";
import { Grid as GridIcon, List as ListIcon } from 'lucide-react';

interface FilterControlsProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    sortBy: string;
    setSortBy: (value: string) => void;
    isGridView: boolean;
    setIsGridView: (value: boolean) => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({ searchTerm, setSearchTerm, sortBy, setSortBy, isGridView, setIsGridView }) => (
    <div className="container mx-auto flex-col md:flex-row gap-4 p-4 bg-background border-b border-border hidden md:flex">
        <div className="relative flex-grow">
            <Input
                type="text"
                placeholder="Search assets..."
                className="pl-8 bg-input text-foreground border-border"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-[180px] bg-input text-foreground border-border">
                <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-input text-foreground border-border">
                <SelectItem value="price">Price: Low to High</SelectItem>
                <SelectItem value="rarity">Rarity: High to Low</SelectItem>
            </SelectContent>
        </Select>
        <Toggle
            pressed={isGridView}
            onPressedChange={setIsGridView}
            aria-label="Toggle view"
        >
            {isGridView ? <GridIcon className="h-4 w-4 text-foreground" /> : <ListIcon className="h-4 w-4 text-foreground" />}
        </Toggle>
    </div>
);
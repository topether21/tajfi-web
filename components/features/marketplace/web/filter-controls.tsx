import type { FC } from 'react'
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input'
import { Center } from '@/components/ui/center'
import { Grid as GridIcon, List as ListIcon, Search as SearchIcon } from 'lucide-react-native'
import { Box } from '@/components/ui/box'
import { HStack } from '@/components/ui/hstack'
import { Pressable } from 'react-native'

interface FilterControlsProps {
  searchTerm: string
  setSearchTerm: (value: string) => void
  sortBy: string
  setSortBy: (value: string) => void
  isGridView: boolean
  setIsGridView: (value: boolean) => void
}

export const FilterControls: FC<FilterControlsProps> = ({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  isGridView,
  setIsGridView,
}) => (
  <HStack className="container mx-auto flex-row gap-4 bg-background">
    <Box className="relative flex-grow">
      <Input>
        <InputSlot className="pl-3">
          <InputIcon as={SearchIcon} />
        </InputSlot>
        <InputField placeholder="Search..." />
      </Input>
    </Box>
    <Center>
      <Pressable onPress={() => setIsGridView(!isGridView)} aria-label="Toggle view">
        {isGridView ? <GridIcon className='stroke-background-tajfi-deep-blue' /> : <ListIcon className='stroke-background-tajfi-deep-blue' />}
      </Pressable>
    </Center>
  </HStack>
)

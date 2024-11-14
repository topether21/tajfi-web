import { Send, Download, History } from 'lucide-react-native'
import { useState } from 'react'
import { Link } from 'expo-router'
import { MotionDiv } from '../../home/motion'
import { Box } from '@/components/ui/box'
import { useSizes } from '@/hooks/useSizes'
import { HStack } from '@/components/ui/hstack'
import { TAB_BAR_ACTIVE_BACKGROUND_COLOR } from '@/components/containers/tab-bar/colors'
import { useWalletAuth } from '../connect-wallet/use-connect-wallet'
import { Center } from '@/components/ui/center'

const ActionButton = ({
  Icon,
  label,
  href,
  setActiveAction,
  isActive,
}: {
  Icon: React.ElementType
  label: string
  href: string
  setActiveAction: React.Dispatch<React.SetStateAction<string | null>>
  isActive: boolean
}) => {
  return (
    <Link href={href} onPress={() => setActiveAction(label)}>
      <MotionDiv
        className="flex flex-col items-center focus:outline-none relative z-10"
        style={{ willChange: 'transform', transform: 'translateZ(0)' }}
      >
        <Box className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
          <Icon size={24} color="white" />
        </Box>
        <p className="text-sm mt-2" style={{ color: isActive ? TAB_BAR_ACTIVE_BACKGROUND_COLOR : 'white' }}>{label}</p>
      </MotionDiv>
    </Link>
  )
}

export const DesktopWalletHeader = () => {
  const [activeAction, setActiveAction] = useState<string | null>(null)
  const { profile } = useWalletAuth({})
  const { isMobile } = useSizes();
  if (isMobile || !profile) return null;
  return (
    <Center>
      <HStack className="hidden md:flex justify-around mt-8 relative gap-40">
        <ActionButton
          Icon={Send}
          label="Send"
          href="/(tabs)/send"
          isActive={activeAction === 'Send'}
          setActiveAction={setActiveAction}
        />
        <ActionButton
          Icon={Download}
          label="Receive"
          href="/(tabs)/receive"
          isActive={activeAction === 'Receive'}
          setActiveAction={setActiveAction}
        />
        <ActionButton
          Icon={History}
          label="History"
          href="/(tabs)/history"
          isActive={activeAction === 'History'}
          setActiveAction={setActiveAction}
        />
      </HStack>
    </Center>

  )
}
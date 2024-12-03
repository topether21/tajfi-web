import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import clsx from "clsx";
import { FadeIn, FadeOut } from "react-native-reanimated";
import { ScrollView } from "react-native";
import Animated from "react-native-reanimated";
import { HEX_COLORS } from "@/components/ui/gluestack-ui-provider/config";
import useTimeout from "react-use/lib/useTimeout";
import { Spinner } from "@/components/ui/spinner";

export default function AssetPage() {
    const [isLoading, cancel] = useTimeout(1000);
    return (
        <>
            <Box className="flex-1 items-start justify-start px-4 bg-background-0">
                <Heading size="lg" className="mb-4 text-background-tajfi-deep-blue">
                    History
                </Heading>
                <ScrollView
                    className={clsx(
                        "w-full h-full",
                        isLoading() && "flex-1 items-center justify-center",
                    )}
                >
                    {isLoading() ? (
                        <Spinner size="small" color={HEX_COLORS.tajfiDeepBlue} />
                    ) : (
                        <Animated.View entering={FadeIn} exiting={FadeOut}>
                            <Text>Asset</Text>
                        </Animated.View>

                    )}
                </ScrollView>
            </Box>
        </>
    );
}

import { Text } from "@/components/ui/text";
import type { NumberFlowProps } from "@number-flow/react";

export const NumberContainer = (props: NumberFlowProps) => {
    const { className, ...rest } = props;
    return <Text className={className}>{props.value}</Text>;
};


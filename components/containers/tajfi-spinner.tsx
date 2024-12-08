import { Box } from "../ui/box";
import { HEX_COLORS } from "../ui/gluestack-ui-provider/config";
import { Spinner } from "../ui/spinner";

export const TajfiSpinner = () => {
	return <Spinner size="small" color={HEX_COLORS.tajfiDeepBlue} />;
};

export const TajfiSpinnerFullScreen = () => {
	return (
		<Box className="flex-1 justify-center items-center bg-background-tajfi-white">
			<TajfiSpinner />
		</Box>
	);
};

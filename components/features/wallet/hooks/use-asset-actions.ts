import { useState } from "react";
import { useAsyncFn } from "react-use";
import { sellAssetStart } from "@/libs/wallet/api";

export const useAssetActions = () => {
    const [error, setError] = useState<string | null>(null);

    const [
        { loading: loadingSellStart, value: sellStartData },
        sellStart,
    ] = useAsyncFn(async (assetId: string, amountToSell: number) => {
        setError(null);
        try {
            const res = await sellAssetStart({ assetId, amountToSell });
            return {
                fundedPsbt: res.fundedPsbt,
                sighashHexToSign: res.sighashHexToSign,
            };
        } catch (e) {
            const message = (e as Error).message || "Unknown error";
            setError(message);
            return null;
        }
    }, []);

    return { sellStart, sellStartData, loadingSellStart, error }

}
import { mockListBalances } from "@/lib/wallet/api";
import { useEffect, useState } from "react";
import { useAsync } from "react-use";

export const useBalance = () => {
    const [balance, setBalance] = useState(0);
    const { value, loading, error } = useAsync(mockListBalances);

    useEffect(() => {
        setBalance(1000);
    }, []);

    return balance;
};
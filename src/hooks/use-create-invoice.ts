import { receive } from '@/lib/wallet/api';
import { useState } from 'react';
import { useAsyncFn, useDebounce } from 'react-use';

export const useCreateInvoice = (amount: number, assetId: string) => {
    const [errorMessage, setErrorMessage] = useState('');
    const [{ loading, error, value }, createNewInvoice] = useAsyncFn(async ({ amount, assetId }: { amount: number, assetId: string }) => {
        console.log('creating invoice');
        setErrorMessage('');
        if (!amount || !assetId) return null;
        try {
            const res = await receive({ amount, assetId });
            return {
                invoiceId: res.invoice_id,
                status: res.status,
            };
        } catch (e) {
            setErrorMessage('Failed to create invoice');
            return null;
        }
    });
    useDebounce(() => {
        createNewInvoice({ amount, assetId });
    }, 1000, [amount, assetId]);
    return { loading, error: errorMessage || error?.message, value };
}
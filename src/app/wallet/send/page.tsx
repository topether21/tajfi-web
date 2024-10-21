'use client';

import { useState } from 'react';
import { useCycle, useRootClick } from './wip';
import NumberFlow, { type Value } from "@number-flow/react";
import { motion } from 'framer-motion'; // Import motion from framer-motion

const values: Value[] = [398.43, -3243.5, 1435237];

const SendPage: React.FC = () => {
    const [address, setAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [token, setToken] = useState('sats');

    const [value, cycleValue] = useCycle(values);

    useRootClick(cycleValue);

    return (
        <motion.div className="flex flex-col items-center justify-start h-full p-4 text-white" layout layoutRoot>
            <div className="w-full max-w-md mt-4">
                <NumberFlow
                    value={value}
                    trend={false}
                    className="text-3xl font-bold text-green-500 mb-2"
                    format={{ style: 'currency', currency: 'USD' }}
                />
                <p className="text-sm text-gray-400">Click anywhere to change values</p>
            </div>
        </motion.div>
    );
};

export default SendPage;

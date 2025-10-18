import React, { useState, useEffect } from 'react';
import { FINAL_DATE } from '../constants';

const Countdown: React.FC = () => {
    const [daysLeft, setDaysLeft] = useState(0);

    useEffect(() => {
        const calculateDaysLeft = () => {
            const now = new Date();
            const difference = FINAL_DATE.getTime() - now.getTime();

            let newDaysLeft = 0;

            if (difference > 0) {
                newDaysLeft = Math.floor(difference / (1000 * 60 * 60 * 24));
            }
            
            setDaysLeft(newDaysLeft);
        };

        calculateDaysLeft();
        // Update once a minute, no need for every second if only showing days
        const interval = setInterval(calculateDaysLeft, 60000); 

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="text-center my-12 py-8 bg-white/50 rounded-2xl shadow-lg shadow-pink-100/50 max-w-2xl mx-auto">
            <div className="px-4">
                <h3 className="text-xl sm:text-2xl text-gray-600 font-bold mb-4">
                    TEAM SHACHI ラストライブ
                </h3>
                <img
                    src="/image/logo.png"
                    alt="TEAM SHACHI 最終SHOW ～晴れ晴れ～"
                    className="mx-auto w-full max-w-md mb-2"
                />
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-light text-gray-500">
                まで
            </h2>
            <div className="flex justify-center items-baseline mt-4 font-yusei text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-amber-400">
                <div className="flex items-baseline">
                    <span className="text-5xl sm:text-6xl md:text-8xl font-bold">{daysLeft}</span>
                    <span className="text-xl sm:text-2xl md:text-4xl font-bold ml-1 sm:ml-2 text-gray-500">日</span>
                </div>
            </div>
        </section>
    );
};

export default Countdown;
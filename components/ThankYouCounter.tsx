import React from 'react';
import { motion, useSpring, useTransform, useInView } from 'framer-motion';
import { useRef, useEffect } from 'react';

interface ThankYouCounterProps {
    count: number;
}

const ThankYouCounter: React.FC<ThankYouCounterProps> = ({ count }) => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    
    const spring = useSpring(0, { stiffness: 100, damping: 30 });
    const display = useTransform(spring, (current) => Math.round(current).toLocaleString());

    useEffect(() => {
        if (isInView) {
            spring.set(count);
        }
    }, [spring, count, isInView]);

    return (
        <section ref={ref} className="text-center my-12 py-8 bg-white/50 rounded-2xl shadow-lg shadow-pink-100/50">
            <h3 className="text-lg md:text-2xl font-light text-gray-500">
                いままで届いたメッセージ
            </h3>
            <motion.p className="text-5xl md:text-7xl font-bold font-yusei mt-2 text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">
                {display}
            </motion.p>
            <p className="text-gray-500 mt-1">件</p>
        </section>
    );
};

export default ThankYouCounter;
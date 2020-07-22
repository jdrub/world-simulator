import { useRef, useEffect } from 'react';

const INTERVAL = 1000;
const updateFns = new Set();

const runUpdateFns = () => { updateFns.forEach(fn => fn()) };
const registerLoopSubscriber = ({ updateFn, rafRef, prevTimeRef }) => {
    updateFns.add(updateFn);
    if (updateFns.size === 1) {
        runGameLoop({ rafRef, prevTimeRef });
    }
}

const unregisterLoopSubscriber = ({ updateFn, rafRef }) => {
    updateFns.delete(updateFn);

    if (updateFns.size === 0) {
        cancelAnimationFrame(rafRef.current);
    }
}

const runGameLoop = ({ rafRef, prevTimeRef }) => {
    const animate = time => {
        if (time - prevTimeRef.current > INTERVAL) {
            prevTimeRef.current = time;
            runUpdateFns();
        }

        rafRef.current = requestAnimationFrame(animate);
    }

    rafRef.current = requestAnimationFrame(animate);
}

export const useGameLoop = (updateFn) => {
    const rafRef = useRef();
    const prevTimeRef = useRef(0);

    useEffect(() => {
        registerLoopSubscriber({ updateFn, rafRef, prevTimeRef });
        return () => unregisterLoopSubscriber({ updateFn, rafRef });
    }, []);
}

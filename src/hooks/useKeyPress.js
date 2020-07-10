import { useEffect, useState } from 'react';

export default () => {
    const [keysPressed, setKeysPressed] = useState(new Set());

    const downHandler = ({ key, repeat }) => {
        if (repeat) { return; }

        console.log('should render');

        keysPressed.add(key);
        setKeysPressed(keysPressed);
    };

    const upHandler = ({ key, repeat }) => {
        if (repeat) { return; }

        keysPressed.delete(key);
        setKeysPressed(keysPressed);
    };

    useEffect(() => {
        window.addEventListener('keydown', downHandler);
        window.addEventListener('keyup', upHandler);

        return () => {
            console.log('unmounting');
            window.removeEventListener('keydown', downHandler);
            window.removeEventListener('keyup', upHandler);
        }
    }, []);

    return keysPressed;
}

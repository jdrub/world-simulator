import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { atom, useRecoilState } from 'recoil'

import WorldMapView from './WorldMapView';
import {
    BOARD_HEIGHT_TILES,
    BOARD_WIDTH_TILES,
    TILE_WIDTH_PX,
    TILE_HEIGHT_PX,
    TILE_TOP_SURFACE_HEIGHT_PX,
    TILE_Z_HEIGHT_PX,
    MOVEMENT_SPEED_FACTOR,
} from '../../constants';

const MAX_HISTORY_LENGTH = 3;
const INTERVAL_MS = 100;

const yVelocityHistoryState = atom({
    key: 'yVelocityHistoryState',
    default: new Array(MAX_HISTORY_LENGTH).fill(0),
});

const xVelocityHistoryState = atom({
    key: 'xVelocityHistoryState',
    default: new Array(MAX_HISTORY_LENGTH).fill(0),
});

export const yOffsetState = atom({
    key: 'yOffsetState',
    default: 0,
});

export const xOffsetState = atom({
    key: 'xOffsetState',
    default: 0,
});

const getVelocity = (velocityHistory) => velocityHistory.reduce((acc, curr) => acc + curr) / MAX_HISTORY_LENGTH;

export default function Landscape() {
    const [yVelocityHistory, _setYVelocityHistory] = useRecoilState(yVelocityHistoryState);
    const [xVelocityHistory, _setXVelocityHistory] = useRecoilState(xVelocityHistoryState);
    
    const yVelocityHistoryRef = useRef(yVelocityHistory);
    const setYVelocityHistory = (newYVelocityHistory) => {
        yVelocityHistoryRef.current = newYVelocityHistory;
        _setYVelocityHistory(yVelocityHistory);
    }

    const xVelocityHistoryRef = useRef(xVelocityHistory);
    const setXVelocityHistory = (newXVelocityHistory) => {
        xVelocityHistoryRef.current = newXVelocityHistory;
        _setXVelocityHistory(xVelocityHistory);
    }

    const [yOffset, _setYOffset] = useRecoilState(yOffsetState);
    const yOffsetRef = useRef(yOffset);
    const setYOffset = (newYOffset) => {
        yOffsetRef.current = newYOffset;
        _setYOffset(newYOffset);
    }

    const [xOffset, _setXOffset] = useRecoilState(xOffsetState);
    const xOffsetRef = useRef(xOffset);
    const setXOffset = (newXOffset) => {
        xOffsetRef.current = newXOffset;
        _setXOffset(newXOffset);
    }

    let moveYIntervalId;
    let moveXIntervalId;

    const moveY = (newVelocity) => {
        clearInterval(moveYIntervalId);
        moveYIntervalId = setInterval(() => {
            moveHelper({
                newVelocity,
                velocityHistoryRef: yVelocityHistoryRef,
                setVelocityHistory: setYVelocityHistory,
                offsetRef: yOffsetRef,
                setOffset: setYOffset,
            });
        }, INTERVAL_MS)
    };

    const moveX = (newVelocity) => {
        clearInterval(moveXIntervalId);
        moveXIntervalId = setInterval(() => {
            moveHelper({
                newVelocity,
                velocityHistoryRef: xVelocityHistoryRef,
                setVelocityHistory: setXVelocityHistory,
                offsetRef: xOffsetRef,
                setOffset: setXOffset,
            });
        }, INTERVAL_MS)
    };

    const stopMoveX = () => {
        stopMove({
            intervalId: moveXIntervalId,
            velocityHistoryRef: xVelocityHistoryRef,
            setVelocityHistory: setXVelocityHistory,
            offsetRef: xOffsetRef,
            setOffset: setXOffset,
        });
    }

    const stopMoveY = () => {
        stopMove({
            intervalId: moveYIntervalId,
            velocityHistoryRef: yVelocityHistoryRef,
            setVelocityHistory: setYVelocityHistory,
            offsetRef: yOffsetRef,
            setOffset: setYOffset,
        });
    }

    const stopMove = ({ intervalId, velocityHistoryRef, setVelocityHistory, offsetRef, setOffset }) => {
        clearInterval(intervalId);

        setVelocityHistory(new Array(MAX_HISTORY_LENGTH).fill(0));
        // comment the above and uncomment the following to have a momentum-stop effect

        // const stopMoveIntervalId = setInterval(() => {
        //     moveHelper({ newVelocity: 0, velocityHistoryRef, setVelocityHistory, offsetRef, setOffset });
        //     if (getVelocity(velocityHistoryRef.current) === 0) {
        //         clearInterval(stopMoveIntervalId);
        //     }
        // }, INTERVAL_MS)
    }

    const moveHelper = ({ newVelocity, velocityHistoryRef, setVelocityHistory, offsetRef, setOffset }) => {
        setVelocityHistory([...velocityHistoryRef.current, newVelocity].slice(1, MAX_HISTORY_LENGTH+1));
        setOffset(offsetRef.current + MOVEMENT_SPEED_FACTOR*getVelocity(velocityHistoryRef.current));
    };
    
    const handleKeyDown = ({ key, repeat }) => {
        if (repeat) {
            return;
        }

        let newYVelocity;
        let newXVelocity;

        switch(key) {
            case 'ArrowUp':
            case 'w':
                newYVelocity = 1;
                break;
            case 'ArrowDown':
            case 's':
                newYVelocity = -1;
                break;
            case 'ArrowLeft':
            case 'a':
                newXVelocity = 1;
                break;
            case 'ArrowRight':
            case 'd':
                newXVelocity = -1;
                break;
            default:
                break;
        }

        newXVelocity && moveX(newXVelocity);
        newYVelocity && moveY(newYVelocity);
    }

    const handleKeyUp = ({ key }) => {
        switch(key) {
            case 'ArrowUp':
            case 'ArrowDown':
            case 'w':
            case 's':
                stopMoveY();
                break;
            case 'ArrowLeft':
            case 'ArrowRight':
            case 'a':
            case 'd':
                stopMoveX();
                break;
            default: break;
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    return(
        <Background>
            <Wrapper offsetY={yOffset} offsetX={xOffset}>
                <WorldMapView />
            </Wrapper>
        </Background>
    );
}


const Background = styled.div`
    background-color: #151515;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
`;

const Wrapper = styled.div.attrs(p => ({
    style: {
        transform: `
            translateX(-50%)
            translateY(-50%)
            translateX(${p.offsetX + TILE_WIDTH_PX/TILE_HEIGHT_PX * p.offsetY * -1}px)
            translateY(${TILE_HEIGHT_PX/TILE_WIDTH_PX * p.offsetX + p.offsetY}px)
            `
    },
  }))`
    position: relative;

    left: 50%;
    top: 50%;

    width: ${TILE_WIDTH_PX * BOARD_WIDTH_TILES}px;
    height: ${TILE_HEIGHT_PX * BOARD_HEIGHT_TILES + TILE_Z_HEIGHT_PX}px;

    transition: transform 0.1s linear;
    backface-visibility: hidden; /* this prevents jumpy css transitions in firefox */
  `;

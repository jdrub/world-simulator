import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { atom, useRecoilState } from 'recoil'

import WorldMapView from './WorldMapView';
import {
    BOARD_HEIGHT_TILES,
    BOARD_WIDTH_TILES,
    MOVEMENT_SPEED_FACTOR,
    TILE_HEIGHT_PX,
    TILE_SIDE_LENGTH_PX,
    TILE_WIDTH_PX,
    TILE_Z_HEIGHT_PX,
    VISIBLE_HEIGHT_TILES,
    VISIBLE_WIDTH_TILES,
} from '../../constants';

const INTERVAL_MS = 5;

export const yOffsetState = atom({
    key: 'yOffsetState',
    default: 0,
});

export const xOffsetState = atom({
    key: 'xOffsetState',
    default: 0,
});

const positionState = atom({
    key: 'positionState',
    default: { row: 10, col: 15 },
});

export default function Landscape() {
    const [position, _setPosition] = useRecoilState(positionState);

    const positionRef = useRef(position);
    const setPosition = (newPosition) => {
        positionRef.current = newPosition;
        _setPosition(newPosition);
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
                offsetRef: yOffsetRef,
                setOffset: setYOffset,
                isXOffset: false,
            });
        }, INTERVAL_MS)
    };

    const moveX = (newVelocity) => {
        clearInterval(moveXIntervalId);
        moveXIntervalId = setInterval(() => {
            moveHelper({
                newVelocity,
                offsetRef: xOffsetRef,
                setOffset: setXOffset,
                isXOffset: true,
            });
        }, INTERVAL_MS)
    };

    const stopMoveX = () => {
        clearInterval(moveXIntervalId);
    }

    const stopMoveY = () => {
        clearInterval(moveYIntervalId);
    }

    const moveHelper = ({ newVelocity, offsetRef, setOffset, isXOffset }) => {
        let newOffset = offsetRef.current + MOVEMENT_SPEED_FACTOR*newVelocity;

        const tileSideLengthXOffset = pxToOffset({ xPx: TILE_SIDE_LENGTH_PX, yPx: 0 }).xOffset;
        const tileSideLengthYOffset = pxToOffset({ xPx: 0, yPx: TILE_SIDE_LENGTH_PX }).yOffset;

        if (isXOffset && newOffset > tileSideLengthXOffset) {
            const newPosition = { col: Math.max(positionRef.current.col - 1, 0), row: positionRef.current.row };
            setPosition(newPosition);
            newOffset -= tileSideLengthXOffset + 20;
        } else if (isXOffset && newOffset < -1 * tileSideLengthXOffset ) {
            const newPosition = { col: Math.min(positionRef.current.col + 1, BOARD_WIDTH_TILES - 1), row: positionRef.current.row };
            setPosition(newPosition);
            newOffset += tileSideLengthXOffset + 20;
        } else if (!isXOffset && newOffset > tileSideLengthYOffset) {
            const newPosition = { row: Math.max(positionRef.current.row - 1, 0), col: positionRef.current.col };
            setPosition(newPosition);
            newOffset -= tileSideLengthYOffset + 2.5;
        } else if (!isXOffset && newOffset < -1 * tileSideLengthYOffset) {
            const newPosition = { row: Math.min(positionRef.current.row + 1, BOARD_HEIGHT_TILES), col: positionRef.current.col };
            setPosition(newPosition);
            newOffset += tileSideLengthYOffset + 2.5;
        }

        setOffset(newOffset);
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

        
        newYVelocity && moveY(newYVelocity);
        newXVelocity && moveX(newXVelocity);
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
            <Wrapper yOffset={yOffset} xOffset={xOffset}>
                <WorldMapView position={positionRef.current} />
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

export const offsetToPx = ({ xOffset, yOffset }) => {
    return ({
        xPx: xOffset + TILE_WIDTH_PX/TILE_HEIGHT_PX * yOffset * -1,
        yPx:  yOffset + TILE_HEIGHT_PX/TILE_WIDTH_PX * xOffset,
    })
}

export const pxToOffset = ({ xPx, yPx }) => {
    return ({
        xOffset: (xPx + yPx * TILE_WIDTH_PX/TILE_HEIGHT_PX)/ 2,
        yOffset: yPx/2 - (xPx * TILE_HEIGHT_PX/TILE_WIDTH_PX)/2
    });
}

const Wrapper = styled.div.attrs(({ xOffset, yOffset })=> {
    const { xPx, yPx } = offsetToPx({ xOffset, yOffset });
    return {
    style: {
        transform: `
            translateY(-50%)
            translateX(-50%)
            translateY(${yPx}px)
            translateX(${xPx}px)
            `
    },
  }})`
    position: relative;

    left: 50%;
    top: 50%;

    width: ${TILE_WIDTH_PX * VISIBLE_WIDTH_TILES}px;
    height: ${TILE_HEIGHT_PX * VISIBLE_HEIGHT_TILES + TILE_Z_HEIGHT_PX}px;

    /* transition: transform ${INTERVAL_MS / 1000}s linear; */
    backface-visibility: hidden; /* this prevents jumpy css transitions in firefox */ 
  `;

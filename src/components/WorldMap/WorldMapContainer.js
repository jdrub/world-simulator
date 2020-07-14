import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { atom, useRecoilState } from 'recoil'

import WorldMapView from './WorldMapView';
import {
    INTERVAL_MS,
    START_COL,
    START_ROW,
    TILE_HEIGHT_PX,
    TILE_MOVEMENT_STEP,
    TILE_WIDTH_PX,
    TILE_Z_HEIGHT_PX,
    VISIBLE_HEIGHT_TILES,
    VISIBLE_WIDTH_TILES,
} from '../../constants';

const positionState = atom({
    key: 'positionState',
    default: { row: START_ROW, col: START_COL },
});

export default function Landscape() {
    const [position, _setPosition] = useRecoilState(positionState);

    const positionRef = useRef(position);
    const setPosition = (newPosition) => {
        positionRef.current = newPosition;
        _setPosition(newPosition);
    }

    let moveYIntervalId;
    let moveXIntervalId;

    const moveY = (newVelocity) => {
        clearInterval(moveYIntervalId);
        moveYIntervalId = setInterval(() => {
            moveHelper({
                newVelocity,
                isXOffset: false,
            });
        }, INTERVAL_MS)
    };

    const moveX = (newVelocity) => {
        clearInterval(moveXIntervalId);
        moveXIntervalId = setInterval(() => {
            moveHelper({
                newVelocity,
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

    const moveHelper = ({ newVelocity, isXOffset }) => {
        if (isXOffset) {
            setPosition({
                row: positionRef.current.row,
                col: positionRef.current.col + newVelocity*TILE_MOVEMENT_STEP,
            });
        } else {
            setPosition({
                row: positionRef.current.row + newVelocity*TILE_MOVEMENT_STEP,
                col: positionRef.current.col,
            });
        }
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
                newYVelocity = -1;
                break;
            case 'ArrowDown':
            case 's':
                newYVelocity = 1;
                break;
            case 'ArrowLeft':
            case 'a':
                newXVelocity = -1;
                break;
            case 'ArrowRight':
            case 'd':
                newXVelocity = 1;
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
            <Wrapper>
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

const Wrapper = styled.div`
    position: relative;

    left: 50%;
    top: 50%;
    transform: translateY(-50%) translateX(-50%);

    width: ${TILE_WIDTH_PX * VISIBLE_WIDTH_TILES}px;
    height: ${TILE_HEIGHT_PX * VISIBLE_HEIGHT_TILES + TILE_Z_HEIGHT_PX}px;

    backface-visibility: hidden; /* this prevents jumpy css transitions in firefox */ 
  `;

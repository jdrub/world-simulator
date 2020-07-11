import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { atom, useRecoilState, useRecoilValue, selector } from 'recoil'

// import { currentXDirectionState, currentYDirectionState, xDirectionState, yDirectionState } from './InputHandler';

import Tile, { TILE_TYPES } from './Tile';
import {
    BOARD_HEIGHT_TILES,
    BOARD_WIDTH_TILES,
    TILE_WIDTH_PX,
    TILE_TOP_SURFACE_HEIGHT_PX,
    TILE_Z_HEIGHT_PX,
} from '../constants';

const MAX_HISTORY_LENGTH = 5;
const INTERVAL_MS = 100;

const yVelocityHistoryState = atom({
    key: 'yVelocityHistoryState',
    default: new Array(MAX_HISTORY_LENGTH).fill(0),
});

const xVelocityHistoryState = atom({
    key: 'xVelocityHistoryState',
    default: new Array(MAX_HISTORY_LENGTH).fill(0),
});

const yPositionState = atom({
    key: 'yPositionState',
    default: 0,
});

const xPositionState = atom({
    key: 'xPositionState',
    default: 0,
});

const getVelocity = (velocityHistory) => velocityHistory.reduce((acc, curr) => acc + curr) / MAX_HISTORY_LENGTH;

export default function Landscape() {

    const tileArr = [[]];

    const waterLocations = [[1,1],[1,2],[5,3],[6,4],[0,6],[3,7],[5,8],[2,1],[2,2],[6,3],[7,4],[1,6],[4,7],[6,8],[8,4],[2,6],[5,7],[4,6],[7,7],[3,8],[6,7],[8,7]];
    
    for(let i = 0; i < 9; i++) {
        tileArr[i] = [];
        for(let j = 0; j < 9; j++) {
            waterLocations.find(([row, col]) => row === i && col === j) ? tileArr[i][j] = TILE_TYPES.WATER : tileArr[i][j] = TILE_TYPES.GRASS;
        }
    }

    const tileArrWithOffsets = tileArr.map((row, rowIdx) => {
        return row.map((tileType, colIdx) => {
            return <Tile
                tileType={tileType}
                xOffsetPx={colIdx*TILE_WIDTH_PX/2 - (rowIdx*TILE_WIDTH_PX/2)}
                yOffsetPx={(colIdx*20) + rowIdx*18}
                key={rowIdx*BOARD_HEIGHT_TILES + colIdx} />
        })
    });

    // const xDirection = useRecoilValue(currentXDirectionState);
    // const yDirection = useRecoilValue(currentYDirectionState);

    // const [xdir, setX] = useRecoilState(xDirectionState);
    // console.log('xdir: ', xdir);

    // console.log('xDirection: ', xDirection);
    // console.log('yDirection: ', yDirection);

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

    const [yPosition, _setYPosition] = useRecoilState(yPositionState);
    const yPositionRef = useRef(yPosition);
    const setYPosition = (newYPosition) => {
        yPositionRef.current = newYPosition;
        _setYPosition(newYPosition);
    }

    const [xPosition, _setXPosition] = useRecoilState(xPositionState);
    const xPositionRef = useRef(xPosition);
    const setXPosition = (newXPosition) => {
        xPositionRef.current = newXPosition;
        _setXPosition(newXPosition);
    }

    let moveYIntervalId;
    let moveXIntervalId;
    
    const moveYHelper = (newYVelocity = 0) => {
        setYVelocityHistory([...yVelocityHistoryRef.current, newYVelocity].slice(1, MAX_HISTORY_LENGTH+1));
        setYPosition(yPositionRef.current + 5*getVelocity(yVelocityHistoryRef.current));
    };

    const moveXHelper = (newXVelocity = 0) => {
        setXVelocityHistory([...xVelocityHistoryRef.current, newXVelocity].slice(1, MAX_HISTORY_LENGTH+1));
        setXPosition(xPositionRef.current + 5*getVelocity(xVelocityHistoryRef.current));
    };

    const moveY = (newYVelocity = 0) => {
        clearInterval(moveYIntervalId);
        moveYIntervalId = setInterval(() => {
            moveYHelper(newYVelocity)
        }, INTERVAL_MS)
    };

    const moveX = (newXVelocity = 0) => {
        clearInterval(moveXIntervalId);
        moveXIntervalId = setInterval(() => {
            moveXHelper(newXVelocity)
        }, INTERVAL_MS)
    };

    const stopMoveY = () => {
        clearInterval(moveYIntervalId);
        const stopMoveIntervalId = setInterval(() => {
            moveYHelper(0);
            if (getVelocity(yVelocityHistoryRef.current) === 0) {
                clearInterval(stopMoveIntervalId);
            }
        }, INTERVAL_MS)
    }

    const stopMoveX = () => {
        clearInterval(moveXIntervalId);
        const stopMoveIntervalId = setInterval(() => {
            moveXHelper(0);
            if (getVelocity(xVelocityHistoryRef.current) === 0) {
                clearInterval(stopMoveIntervalId);
            }
        }, INTERVAL_MS)
    }
    
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
                newXVelocity = -1;
                break;
            case 'ArrowRight':
            case 'd':
                newXVelocity = 1;
                break;
            default:
                break;
        }

        moveX(newXVelocity);
        moveY(newYVelocity);
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

    // console.log('yVelocityHistory: ', yVelocityHistoryRef.current);
    // console.log('xVelocityHistory: ', xVelocityHistoryRef.current);
    
    return(
        <Background>
            <LandscapeWrapper offsetY={yPositionRef.current} offsetX={xPositionRef.current}>

                {tileArrWithOffsets}
            </LandscapeWrapper>
        </Background>
    );
}


const Background = styled.div`
    background-color: #454545;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
`;

const LandscapeWrapper = styled.div.attrs(p => ({
    style: {
        transform: `translateX(-50%) translateX(calc(${-1 * p.offsetY*5}px + ${p.offsetX*5}px)) translateY(-50%) translateY(calc(${.35*p.offsetY*5}px + ${.35*p.offsetX*5}px))`
    },
  }))`
    position: relative;

    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);

    width: ${TILE_WIDTH_PX * BOARD_WIDTH_TILES}px;
    height: ${TILE_TOP_SURFACE_HEIGHT_PX * BOARD_HEIGHT_TILES + TILE_Z_HEIGHT_PX}px;

    transition: transform 0.1s linear;
  `;

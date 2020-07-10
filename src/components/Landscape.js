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

const yVelocityHistoryState = atom({
    key: 'yVelocityHistoryState',
    default: new Array(MAX_HISTORY_LENGTH).fill(0),
});

const yPositionState = atom({
    key: 'yPositionState',
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
    
    const yVelocityHistoryRef = useRef(yVelocityHistory);
    const setYVelocityHistory = (newYVelocityHistory) => {
        yVelocityHistoryRef.current = newYVelocityHistory;
        _setYVelocityHistory(yVelocityHistory);
    }

    const [yPosition, _setYPosition] = useRecoilState(yPositionState);
    const yPositionRef = useRef(yPosition);
    const setYPosition = (newYPosition) => {
        yPositionRef.current = newYPosition;
        _setYPosition(newYPosition);
    }

    const handleKeyDown = ({ key, repeat }) => {
        if (repeat) {
            return;
        }

        switch(key) {
            case 'ArrowUp':
            case 'w':
                setYVelocityHistory([...yVelocityHistoryRef.current, 1].slice(1, MAX_HISTORY_LENGTH+1));
                setYPosition(yPositionRef.current + 5*getVelocity(yVelocityHistoryRef.current));
                break;
            default: break;
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        // window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            // window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    return(
        <Background>
            <LandscapeWrapper offsetY={yPositionRef.current}>

                {tileArrWithOffsets}
            </LandscapeWrapper>
        </Background>
    );
}


const Background = styled.div`
    background-color: #454545;
    width: 100vw;
    height: 100vh;
`;

const LandscapeWrapper = styled.div`
    position: relative;

    left: calc(50% + ${p => -1 * p.offsetY*5}px);
    top: calc(50% + ${p => .35*p.offsetY*5}px);
    transform: translateX(-50%) translateY(-50%);

    width: ${TILE_WIDTH_PX * BOARD_WIDTH_TILES}px;
    height: ${TILE_TOP_SURFACE_HEIGHT_PX * BOARD_HEIGHT_TILES + TILE_Z_HEIGHT_PX}px;

    transition: left 0.2s linear, top 0.2s linear;
`;

import React, { useEffect, useRef } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { atom, useRecoilState } from 'recoil'

import waterLocations from './waterLocations';
import CssReset from '../CssReset';
import WorldMapView from './WorldMapView';
import Button from '../Button';
import { TILE_TYPES } from '../Tile';

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
    BOARD_WIDTH_TILES,
    BOARD_HEIGHT_TILES,
} from '../../constants';

const positionState = atom({
    key: 'positionState',
    default: { row: START_ROW, col: START_COL },
});

const tileMapState = atom({
    key: 'tileMapState',
    default: buildFullTileMap(),
});

function buildFullTileMap() {
    const tileArr = [[]];

    for(let i = 0; i < BOARD_HEIGHT_TILES; i++) {
        tileArr[i] = [];
        for(let j = 0; j < BOARD_WIDTH_TILES; j++) {
            waterLocations.find(([row, col]) => row === i && col === j) ? tileArr[i][j] = TILE_TYPES.WATER : tileArr[i][j] = TILE_TYPES.GRASS;
        }
    }

    return tileArr;
}

export default function Landscape() {
    const [fullTileMap, setFullTileMap] = useRecoilState(tileMapState);
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

    const handleUpdateTile = ({ row, col, tileType }) => {
        const newFullTileMap = [];
        for(let i = 0; i < fullTileMap.length; i++) {
            newFullTileMap[i] = [...fullTileMap[i]];
        }

        newFullTileMap[row][col] = tileType;
        setFullTileMap(newFullTileMap);
    }

    const handleExportClick = () => {
        // console.log(JSON.stringify(fullTileMap));
        // get water locations
        const waterLocations = [];
        for(let row = 0; row < fullTileMap.length; row++) {
            for(let col = 0; col < fullTileMap[0].length; col++) {
                if (fullTileMap[row][col] === TILE_TYPES.WATER) {
                    waterLocations.push([row, col]);
                }
            }
        }

        console.log(JSON.stringify(waterLocations));
    }

    return(
        <>
            <CssReset />
            <Background>
                <Button onClick={() => handleExportClick()}>Export</Button>
                <Wrapper>
                    <WorldMapView
                        position={positionRef.current}
                        fullTileMap={fullTileMap}
                        updateTile={(params) => handleUpdateTile(params)} />
                </Wrapper>
                <HideBodyOverflow />
            </Background>
        </>
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
    height: ${TILE_HEIGHT_PX * (VISIBLE_HEIGHT_TILES + 1) + TILE_Z_HEIGHT_PX}px;

    /* this clip-path only works when the visible area is square */
    clip-path: polygon(50% 56px, 100% 53.25%, 100% 55.79%, 50.10% 99.54%, 0px 55.79%, 0px 53.25%);

    backface-visibility: hidden; /* this prevents jumpy css transitions in firefox */ 
  `;

const HideBodyOverflow = createGlobalStyle`
    body {
        overflow: hidden;
    }
`

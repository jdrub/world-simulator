import React, { useEffect, useRef, useState, useReducer } from 'react';
import { atom, useRecoilState } from 'recoil'
import styled, { createGlobalStyle } from 'styled-components';

import Button from '../Button';
import CssReset from '../CssReset';
import waterLocations from './waterLocations';
import WorldMapView from './WorldMapView';

import { useGameLoop } from '../../hooks';

import {
    BOARD_HEIGHT_TILES,
    BOARD_WIDTH_TILES,
    COS_45_DEGS,
    START_COL,
    START_ROW,
    TILE_HEIGHT_PX,
    TILE_MOVEMENT_STEP,
    TILE_WIDTH_PX,
    TILE_Z_HEIGHT_PX,
    VISIBLE_HEIGHT_TILES,
    VISIBLE_WIDTH_TILES,
} from '../../constants';
import { Canvas } from 'react-three-fiber';

const KEY_PRESSED = 'key_pressed';
const KEY_RELEASED = 'key_released';

const TILE_TYPES = { WATER: 0 };

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

const getVelocityGivenKeysPressed = ({ xKeyDir, yKeyDir }) => {
    if (xKeyDir !== 0 && yKeyDir !== 0) {
        return { xVelocity: xKeyDir * COS_45_DEGS, yVelocity: yKeyDir * COS_45_DEGS };
    } else {
        return { xVelocity: xKeyDir, yVelocity: yKeyDir }
    }
}

const keysPressedReducer = (state, {type, payload, currentState}) => {
    // this is unbelievably janky to pass currentState to this reducer, i'm not
    // sure how to avoid this and get the proper state quite yet given my
    // current knowledge of how hooks work

    if (type === KEY_PRESSED) {
        switch(payload) {
            case 'ArrowUp':
            case 'w':
                return { ...currentState, yKeyDir: -1 };
            case 'ArrowDown':
            case 's':
                return { ...currentState, yKeyDir: 1 };
            case 'ArrowLeft':
            case 'a':
                return { ...currentState, xKeyDir: -1 };
            case 'ArrowRight':
            case 'd':
                return { ...currentState, xKeyDir: 1 };
            default:
                return { ...currentState };
        }
    } else if (type === KEY_RELEASED) {
        switch(payload) {
            case 'ArrowUp':
            case 'ArrowDown':
            case 'w':
            case 's':
                return { ...currentState, yKeyDir: 0 };
            case 'ArrowLeft':
            case 'ArrowRight':
            case 'a':
            case 'd':
                return { ...currentState, xKeyDir: 0 };
            default:
                return { ...currentState };
        }
    }
}

export default function Landscape() {
    const [fullTileMap, setFullTileMap] = useRecoilState(tileMapState);
    const [position, _setPosition] = useState({ row: START_ROW, col: START_COL });

    const positionRef = useRef(position);
    const setPosition = (newPosition) => {
        positionRef.current = newPosition;
        _setPosition(newPosition);
    }

    const [keysPressedState, _dispatchKeyEvent] = useReducer(keysPressedReducer, { xKeyDir: 0, yKeyDir: 0 });
    const keysPressedStateRef = useRef(keysPressedState);
    const dispatchKeyEvent = (action) => {
        keysPressedStateRef.current = keysPressedReducer(keysPressedState, action);
        _dispatchKeyEvent(action);
    }

    useGameLoop(() => {
        const { xVelocity, yVelocity } = getVelocityGivenKeysPressed(keysPressedStateRef.current);

        const newRow = positionRef.current.row + yVelocity * TILE_MOVEMENT_STEP;
        const newCol = positionRef.current.col + xVelocity * TILE_MOVEMENT_STEP;

        setPosition({
            row: newRow,
            col: newCol,
            // row: Number.parseFloat(newRow).toFixed(2),
            // col: Number.parseFloat(newCol).toFixed(2),
        });
    })
    
    const handleKeyDown = ({ key, repeat }) => {
        if (repeat) {
            return;
        }

        dispatchKeyEvent({ type: KEY_PRESSED, payload: key, currentState: keysPressedStateRef.current });
    };

    const handleKeyUp = ({ key }) => {
        dispatchKeyEvent({ type: KEY_RELEASED, payload: key, currentState: keysPressedStateRef.current });
    };

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

    const worldWidth = 20;
    const worldHeight = 20;


    return(
        <>
            <CssReset />
            <Background>
                <Button onClick={() => handleExportClick()}>Export</Button>
                <Wrapper>
                    <Canvas camera={{ zoom: 10, position: [-45, 35.26, -30 ]}}>
                        <WorldMapView
                            position={positionRef.current}
                            fullTileMap={fullTileMap}
                            updateTile={(params) => handleUpdateTile(params)} />
                        </Canvas>
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
    overflow: hidden;

    left: 50%;
    top: 50%;
    transform: translateY(-50%) translateX(-50%);

    width: ${TILE_WIDTH_PX * VISIBLE_WIDTH_TILES}px;
    height: ${TILE_HEIGHT_PX * (VISIBLE_HEIGHT_TILES + 1) + TILE_Z_HEIGHT_PX}px;

    backface-visibility: hidden; /* this prevents jumpy css transitions in firefox */ 
  `;

const HideBodyOverflow = createGlobalStyle`
    body {
        overflow: hidden;
    }
`

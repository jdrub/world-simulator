import React, { useEffect, useRef, useState, useReducer } from 'react';
import { atom, useRecoilState } from 'recoil'
import styled, { createGlobalStyle } from 'styled-components';

import { TILE_TYPES } from '../Tile';
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

const KEY_PRESSED = 'key_pressed';
const KEY_RELEASED = 'key_released';

const KEY_TO_DIRECTION = {
    'ArrowUp': 'N',
    'ArrowRight': 'E',
    'ArrowDown': 'S',
    'ArrowLeft': 'W',
    'w': 'N',
    'd': 'E',
    's': 'S',
    'a': 'W'
};

const DIRECTION_TO_VELOCITY = {
    '': {xVelocity: 0, yVelocity: 0},
    'E': {xVelocity: 1, yVelocity: 0},
    'EN': {xVelocity: COS_45_DEGS, yVelocity: -COS_45_DEGS},
    'ES': {xVelocity: COS_45_DEGS, yVelocity: COS_45_DEGS},
    'N': {xVelocity: 0, yVelocity: -1},
    'NW': {xVelocity: -COS_45_DEGS, yVelocity: -COS_45_DEGS},
    'S': {xVelocity: 0, yVelocity: 1},
    'SW': {xVelocity: -COS_45_DEGS, yVelocity: COS_45_DEGS},
    'W': {xVelocity: -1, yVelocity: 0}
};

const INCONSISTENT_KEY_MAP = {
    'E': 'W',
    'N': 'S',
    'S': 'N',
    'W': 'E'
};

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

const getVelocityGivenKeysPressed = ({ keysPressed }) => {
    let filteredKeys = [];
    keysPressed.forEach(keyPressed => {
        filteredKeys.push(keyPressed);
        filteredKeys = filteredKeys.filter(key => key !== INCONSISTENT_KEY_MAP[keyPressed]);
    });
    filteredKeys.sort();

    const direction = filteredKeys.join('');
    return DIRECTION_TO_VELOCITY[direction];
}

const keysPressedReducer = (state, {type, payload, currentState}) => {
    // this is unbelievably janky to pass currentState to this reducer, i'm not
    // sure how to avoid this and get the proper state quite yet given my
    // current knowledge of how hooks work

    let keysPressed = [...currentState.keysPressed];
    const keyChanged = KEY_TO_DIRECTION[payload];
    if (type === KEY_PRESSED) {
        keysPressed.push(keyChanged);
        return { ...currentState, keysPressed: keysPressed };
    } else if (type === KEY_RELEASED) {
        keysPressed = keysPressed.filter(dir => dir !== keyChanged);
        return { ...currentState, keysPressed: keysPressed };
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

    const [keysPressedState, _dispatchKeyEvent] = useReducer(keysPressedReducer, { keysPressed: [] });
    const keysPressedStateRef = useRef(keysPressedState);
    const dispatchKeyEvent = (action) => {
        keysPressedStateRef.current = keysPressedReducer(keysPressedState, action);
        _dispatchKeyEvent(action);
    }

    useGameLoop(() => {
        const { xVelocity, yVelocity } = getVelocityGivenKeysPressed(keysPressedStateRef.current);

        setPosition({
            row: positionRef.current.row + yVelocity * TILE_MOVEMENT_STEP,
            col: positionRef.current.col + xVelocity * TILE_MOVEMENT_STEP,
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
    overflow: hidden;

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

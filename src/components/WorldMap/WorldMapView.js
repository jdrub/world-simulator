import React, { useMemo } from 'react';
import { atom, useRecoilState } from 'recoil';

import { xOffsetState, yOffsetState } from './WorldMapContainer';

import Tile, { TILE_TYPES } from '../Tile';
import {
    TILE_WIDTH_PX,
    TILE_HEIGHT_PX,
    BOARD_HEIGHT_TILES,
    BOARD_WIDTH_TILES,
    VISIBLE_HEIGHT_TILES,
    VISIBLE_WIDTH_TILES,
    TILE_ISO_WIDTH_PX,
} from '../../constants';

const positionState = atom({
    key: 'positionState',
    default: { row: 4, col: 4 },
});

const buildFullTileMap = () => {
    const tileArr = [[]];

    const waterLocations = [[1,1],[1,2],[5,3],[6,4],[0,6],[3,7],[5,8],[2,1],[2,2],[6,3],[7,4],[1,6],[4,7],[6,8],[8,4],[2,6],[5,7],[4,6],[7,7],[3,6],[6,7],[8,7]];

    for(let i = 0; i < BOARD_HEIGHT_TILES; i++) {
        tileArr[i] = [];
        for(let j = 0; j < BOARD_WIDTH_TILES; j++) {
            waterLocations.find(([row, col]) => row === i && col === j) ? tileArr[i][j] = TILE_TYPES.WATER : tileArr[i][j] = TILE_TYPES.GRASS;
        }
    }

    return tileArr;
}


const xOffsetToPx = (xOffset) => {
    return (9.627 * xOffset)
}

const pxToXOffset = (px) => {
    return px / 9.627;
}

const buildVisibleTileMap = ({ fullTileMap, position, setPosition, xOffset, yOffset, setXOffset, setYOffset }) => {
    const visibleTileArr = [[]];

    // if x offset is > the width of a block (could be 3 blocks in the future if there are performance issues) then update position.col accordingly, and also update the x offset by the width of a few tiles.

    // let currPosition = position;

    // if (xOffset > pxToXOffset(TILE_ISO_WIDTH_PX)) {
    //     const newPosition = { col: Math.max(position.col-1, BOARD_WIDTH_TILES-1), row: position.row };
    //     setPosition(newPosition);
    //     setXOffset(xOffset - pxToXOffset(TILE_ISO_WIDTH_PX));

    //     currPosition = newPosition;
    // } else if (Math.abs(xOffset) > pxToXOffset(TILE_ISO_WIDTH_PX)) {
    //     const newPosition = { col: Math.min(position.col+1, 0), row: position.row };
    //     setPosition(newPosition);
    //     setXOffset(xOffset + pxToXOffset(TILE_ISO_WIDTH_PX));

    //     currPosition = newPosition;
    // }

    

    const currPosition = {
        row: 4,
        col: Math.floor(xOffsetToPx(xOffset)/TILE_ISO_WIDTH_PX) + 4,
    };

    console.log('currPosition:', currPosition);

    let leftBound = Math.max(Math.floor(currPosition.col - VISIBLE_WIDTH_TILES/2), 0);
    let rightBound = Math.min(Math.ceil(currPosition.col + VISIBLE_WIDTH_TILES/2), BOARD_WIDTH_TILES - 1);
    let topBound = Math.max(Math.floor(currPosition.row - VISIBLE_HEIGHT_TILES/2), 0);
    let bottomBound = Math.min(Math.ceil(currPosition.row + VISIBLE_HEIGHT_TILES/2), BOARD_WIDTH_TILES - 1);

    for(let row = topBound, i = 0; row <= bottomBound; row++, i++) {
        visibleTileArr[i] = [];
        for(let col = leftBound, j = 0; col <= rightBound; col++, j++) {
            visibleTileArr[i][j] = fullTileMap[row][col];
        }
    }

    // return visibleTileArr;
    return fullTileMap;
}

const WorldMapView = () => {
    const fullTileMap = useMemo(buildFullTileMap, []);

    const [position, setPosition] = useRecoilState(positionState);
    const [xOffset, setXOffset] = useRecoilState(xOffsetState);
    const [yOffset, setYOffset] = useRecoilState(yOffsetState);

    console.log('xOffset: ', xOffset);
    const visibleTileArr = buildVisibleTileMap({ fullTileMap, position, setPosition, xOffset, yOffset, setXOffset, setYOffset });

    const tileArrWithOffsets = visibleTileArr.map((row, rowIdx) => {
        return row.map((tileType, colIdx) => {
            return <Tile
                tileType={tileType}
                xOffsetPx={colIdx*TILE_WIDTH_PX/2 - (rowIdx*TILE_WIDTH_PX/2)}
                yOffsetPx={(colIdx*TILE_HEIGHT_PX/2) + (rowIdx*TILE_HEIGHT_PX/2)}
                key={rowIdx*BOARD_HEIGHT_TILES + colIdx} />
        })
    });

    return tileArrWithOffsets;
}

export {
    WorldMapView as default
};

import React, { useMemo } from 'react';
import { DRBN } from './specialWaterLocations';

import Tile, { TILE_TYPES } from '../Tile';
import {
    TILE_WIDTH_PX,
    TILE_HEIGHT_PX,
    BOARD_HEIGHT_TILES,
    BOARD_WIDTH_TILES,
    VISIBLE_HEIGHT_TILES,
    VISIBLE_WIDTH_TILES,
} from '../../constants';


const buildFullTileMap = () => {
    const tileArr = [[]];

    const waterLocations = [
        // [1,1 + 10],[1,2 + 10],[5,3 + 10],[6,4 + 10],[0,6],[3,7 + 10],[5,8 + 10],[2,1 + 10],[2,2 + 10],[6,3 + 10],[7,4 + 10],[1,6 + 10],[4,7 + 10],[6,8 + 10],[8,4 + 10],[2,6 + 10],[5,7 + 10],[4,6 + 10],[7,7 + 10],[3,6 + 10],[6,7 + 10],[8,7 + 10]
    ].concat(DRBN).map(([row, col]) => [row + 10, col]);

    for(let i = 0; i < BOARD_HEIGHT_TILES; i++) {
        tileArr[i] = [];
        for(let j = 0; j < BOARD_WIDTH_TILES; j++) {
            waterLocations.find(([row, col]) => row === i && col === j) ? tileArr[i][j] = TILE_TYPES.WATER : tileArr[i][j] = TILE_TYPES.GRASS;
        }
    }

    return tileArr;
}


const buildVisibleTileMap = ({ fullTileMap, position }) => {
    const visibleTileArr = [[]];

    let leftBound = Math.max(Math.floor(position.col - VISIBLE_WIDTH_TILES/2), 0);
    let rightBound = Math.min(Math.ceil(position.col + VISIBLE_WIDTH_TILES/2), BOARD_WIDTH_TILES - 1);
    let topBound = Math.max(Math.floor(position.row - VISIBLE_HEIGHT_TILES/2), 0);
    let bottomBound = Math.min(Math.ceil(position.row + VISIBLE_HEIGHT_TILES/2), BOARD_HEIGHT_TILES - 1);

    for(let row = topBound, i = 0; row <= bottomBound; row++, i++) {
        visibleTileArr[i] = [];
        for(let col = leftBound, j = 0; col <= rightBound; col++, j++) {
            visibleTileArr[i][j] = fullTileMap[row][col];
        }
    }

    return visibleTileArr;
}

const WorldMapView = ({ position }) => {
    const fullTileMap = useMemo(buildFullTileMap, []);

    const visibleTileArr = buildVisibleTileMap({ fullTileMap, position });

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

import React from 'react';

import Tile, { TILE_TYPES } from '../Tile';
import {
    TILE_WIDTH_PX,
    BOARD_HEIGHT_TILES,
} from '../../constants';

const buildMap = () => {
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

    return tileArrWithOffsets;
}

export {
    buildMap as default
};
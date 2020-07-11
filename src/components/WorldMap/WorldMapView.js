import React, { useMemo } from 'react';
import { atom, useRecoilState } from 'recoil';

import { xOffsetState, yOffsetState } from './WorldMapContainer';

import Tile, { TILE_TYPES } from '../Tile';
import {
    TILE_WIDTH_PX,
    BOARD_HEIGHT_TILES,
    BOARD_WIDTH_TILES,
    VISIBLE_HEIGHT_TILES,
    VISIBLE_WIDTH_TILES,
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

const buildVisibleTileMap = ({ fullTileMap, position, xOffset, yOffset, setXOffset, setYOffset }) => {
    const visibleTileArr = [[]];

    let leftBound = Math.floor(position.col - VISIBLE_WIDTH_TILES/2);
    let rightBound = Math.ceil(position.col + VISIBLE_WIDTH_TILES/2);
    let topBound = Math.floor(position.row - VISIBLE_HEIGHT_TILES/2);
    let bottomBound = Math.ceil(position.row + VISIBLE_HEIGHT_TILES/2);

    leftBound = leftBound < 0 ? 0 : leftBound;
    rightBound = rightBound > BOARD_WIDTH_TILES - 1 ? BOARD_WIDTH_TILES - 1 : rightBound;
    topBound = topBound < 0 ? 0 : topBound;
    bottomBound = bottomBound > BOARD_HEIGHT_TILES - 1 ? BOARD_HEIGHT_TILES - 1 : bottomBound;

    console.log('leftBBound: ', leftBound);
    console.log('rightBound: ', rightBound);
    console.log('topBound: ', topBound);
    console.log('bottomBound: ', bottomBound);

    for(let row = topBound, i = 0; row <= bottomBound; row++, i++) {
        visibleTileArr[i] = [];
        for(let col = leftBound, j = 0; col <= rightBound; col++, j++) {
            visibleTileArr[i][j] = fullTileMap[row][col];
        }
    }

    console.log('visibleTileArr: ', visibleTileArr);

    return visibleTileArr;
}

const WorldMapView = () => {
    const fullTileMap = useMemo(buildFullTileMap, []);

    const [position, setPosition] = useRecoilState(positionState);
    const [xOffset, setXOffset] = useRecoilState(xOffsetState);
    const [yOffset, setYOffset] = useRecoilState(yOffsetState);

    const visibleTileArr = buildVisibleTileMap({ fullTileMap, position, xOffset, yOffset, setXOffset, setYOffset });

    const tileArrWithOffsets = visibleTileArr.map((row, rowIdx) => {
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
    WorldMapView as default
};

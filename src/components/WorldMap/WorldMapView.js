import React, { useMemo } from 'react';
import { atom, useRecoilState } from 'recoil';
import styled from 'styled-components';

import Tile, { TILE_TYPES } from '../Tile';
import {
    BOARD_HEIGHT_TILES,
    BOARD_WIDTH_TILES,
    TILE_HEIGHT_PX,
    TILE_WIDTH_PX,
    VISIBLE_HEIGHT_TILES,
    VISIBLE_WIDTH_TILES,
} from '../../constants';



const getEdgeTileType = ({ tileType, isRightEdge, isCornerEdge }) => {
    return tileType === TILE_TYPES.WATER
        ? isRightEdge ? TILE_TYPES.WATER_RIGHT_EDGE : isCornerEdge ? TILE_TYPES.WATER_CORNER_EDGE : TILE_TYPES.WATER_LEFT_EDGE
        : isRightEdge ? TILE_TYPES.GRASS_RIGHT_EDGE : isCornerEdge ? TILE_TYPES.GRASS_CORNER_EDGE : TILE_TYPES.GRASS_LEFT_EDGE;
}

const buildEdgeTileMask = (visibleTileArr) => {
    const leftEdgeTileMask = [];
    const rightEdgeTileMask = [];

    for (let i = 0; i < visibleTileArr.length; i++) {
        const {
            xOffsetPx: leftEdgeXOffsetPx,
            yOffsetPx: leftEdgeYOffsetPx
        } = getOffsetPx({ row: visibleTileArr.length - 1, col: i+1 });

        const {
            xOffsetPx: rightEdgeXOffsetPx,
            yOffsetPx: rightEdgeYOffsetPx
        } = getOffsetPx({ row: i+1, col: visibleTileArr.length - 1 });

        leftEdgeTileMask[i] = (
            <Tile
                tileType={getEdgeTileType({ tileType: visibleTileArr[visibleTileArr.length-1][i], isRightEdge: false })}
                xOffsetPx={leftEdgeXOffsetPx}
                yOffsetPx={leftEdgeYOffsetPx}
                key={(visibleTileArr.length-1)*BOARD_HEIGHT_TILES + i + 1} />
        );

        rightEdgeTileMask[i] = (
            <Tile
                tileType={getEdgeTileType({ tileType: visibleTileArr[i][visibleTileArr.length - 1], isRightEdge: true })}
                xOffsetPx={rightEdgeXOffsetPx}
                yOffsetPx={rightEdgeYOffsetPx}
                key={(visibleTileArr.length-1)*BOARD_HEIGHT_TILES + i + 1} />
        );
    }

    const {
        xOffsetPx: cornerEdgeXOffsetPx,
        yOffsetPx: cornerEdgeYOffsetPx
    } = getOffsetPx({ row: visibleTileArr.length - 1, col: visibleTileArr.length - 1 });

    const cornerEdgeTileMask = (
        <Tile
            tileType={getEdgeTileType({ tileType: visibleTileArr[visibleTileArr.length - 1][visibleTileArr.length - 1], isCornerEdge: true })}
            xOffsetPx={cornerEdgeXOffsetPx}
            yOffsetPx={cornerEdgeYOffsetPx}
            key={(visibleTileArr.length-1)*BOARD_HEIGHT_TILES + visibleTileArr.length-1 + 2} />
    );

    return ({ leftEdgeTileMask, rightEdgeTileMask, cornerEdgeTileMask });
}

const getVisibleTileMapBounds = ({ position }) => {
    const rowInt = Math.floor(position.row);
    const colInt = Math.floor(position.col);

    const leftBound = Math.max(Math.floor(colInt - VISIBLE_WIDTH_TILES/2), 0);
    const rightBound = Math.min(Math.ceil(colInt + VISIBLE_WIDTH_TILES/2), BOARD_WIDTH_TILES - 1);
    const topBound = Math.max(Math.floor(rowInt - VISIBLE_HEIGHT_TILES/2), 0);
    const bottomBound = Math.min(Math.ceil(rowInt + VISIBLE_HEIGHT_TILES/2), BOARD_HEIGHT_TILES - 1);

    return ({ leftBound, rightBound, topBound, bottomBound });
}
const buildVisibleTileMap = ({ fullTileMap, position }) => {
    const visibleTileArr = [[]];

    const { leftBound, rightBound, topBound, bottomBound } = getVisibleTileMapBounds({ position });

    for(let row = topBound, i = 0; row <= bottomBound; row++, i++) {
        visibleTileArr[i] = [];
        for(let col = leftBound, j = 0; col <= rightBound; col++, j++) {
            visibleTileArr[i][j] = fullTileMap[row][col];
        }
    }

    return visibleTileArr;
}

const getAbsolutePosition = ({ visibleRow, visibleCol, position }) => {
    const { leftBound, topBound } = getVisibleTileMapBounds({ position });
    return ({ row: topBound + visibleRow, col: leftBound + visibleCol });
}

const handleClick = ({ tileType, visibleRow, visibleCol, updateTile, position, fullTileMap }) => {
    const absolutePosition = getAbsolutePosition({ visibleRow, visibleCol, position });
    updateTile({ row: absolutePosition.row, col: absolutePosition.col, tileType });
}

const WorldMapView = ({ position, fullTileMap, updateTile }) => {
    const visibleTileArr = buildVisibleTileMap({ fullTileMap, position });

    const tileArrWithOffsets = visibleTileArr.map((row, rowIdx) => {
        return row.map((tileType, colIdx) => {
            const { xOffsetPx, yOffsetPx } = getOffsetPx({ row: rowIdx, col: colIdx });

            return <Tile
                tileType={tileType}
                xOffsetPx={xOffsetPx}
                yOffsetPx={yOffsetPx}
                key={rowIdx*BOARD_HEIGHT_TILES + colIdx}
                onClick={(tileType) => handleClick({ tileType, visibleRow: rowIdx, visibleCol: colIdx, updateTile, position, fullTileMap })}
                />
        })
    });

    const { leftEdgeTileMask, rightEdgeTileMask, cornerEdgeTileMask } = buildEdgeTileMask(visibleTileArr);

    return (
        <>
            <OffsetWrapper position={position}>
                {tileArrWithOffsets}
            </OffsetWrapper>
            <LeftEdgeMaskOffsetWrapper position={position}>
                {leftEdgeTileMask}
            </LeftEdgeMaskOffsetWrapper>
            <RightEdgeMaskOffsetWrapper position={position}>
                {rightEdgeTileMask}
            </RightEdgeMaskOffsetWrapper>
            {cornerEdgeTileMask}
        </>
    );
}

const getOffsetPx = ({ row, col }) => {
    return ({
        xOffsetPx: col*TILE_WIDTH_PX/2 - (row*TILE_WIDTH_PX/2),
        yOffsetPx: (col*TILE_HEIGHT_PX/2) + (row*TILE_HEIGHT_PX/2),
    });
};

const OffsetWrapper = styled.div.attrs(({ position }) => {
    const { xOffsetPx, yOffsetPx } = getOffsetPx({ row: position.row % 1, col: position.col % 1 });

    const { xOffsetPx: xConstOffsetPx, yOffsetPx: yConstOffsetPx } = getOffsetPx({ row: 1, col: 1 });
    return {
        style: {
            transform: `translateX(${-1*xOffsetPx + xConstOffsetPx}px) translateY(${-1*yOffsetPx + yConstOffsetPx}px)`
        }
    }
})``;

const RightEdgeMaskOffsetWrapper = styled.div.attrs(({ position }) => {
    const { xOffsetPx, yOffsetPx } = getOffsetPx({ row: position.row % 1, col: 0 });

    return {
        style: {
            transform: `translateX(${-1*xOffsetPx}px) translateY(${-1*yOffsetPx}px)`
        }
    }
})``;

const LeftEdgeMaskOffsetWrapper = styled.div.attrs(({ position }) => {
    const { xOffsetPx, yOffsetPx } = getOffsetPx({ row: 0, col: position.col % 1 });

    return {
        style: {
            transform: `translateX(${-1*xOffsetPx}px) translateY(${-1*yOffsetPx}px)`
        }
    }
})``;

export {
    WorldMapView as default
};

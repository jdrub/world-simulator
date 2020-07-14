import React from 'react';
import styled from 'styled-components';

import { grassTile, waterTile, grassTileRightEdge, grassTileLeftEdge, grassTileCornerEdge, waterTileLeftEdge, waterTileRightEdge, waterTileCornerEdge } from '../images';
import { TILE_WIDTH_PX } from '../constants';

export const TILE_TYPES = {
    GRASS: 0,
    GRASS_RIGHT_EDGE: 1,
    GRASS_LEFT_EDGE: 2,
    GRASS_CORNER_EDGE: 3,
    WATER: 4,
    WATER_RIGHT_EDGE: 5,
    WATER_LEFT_EDGE: 6,
    WATER_CORNER_EDGE: 7,
};

export default ({ tileType, xOffsetPx, yOffsetPx }) => {
    let imgSrc;
    let zIndex = 0;

    switch(tileType) {
        case(TILE_TYPES.WATER): imgSrc = waterTile; break;
        case(TILE_TYPES.GRASS): imgSrc = grassTile; break;
        case(TILE_TYPES.GRASS_RIGHT_EDGE): imgSrc = grassTileRightEdge; zIndex = 2; break;
        case(TILE_TYPES.GRASS_LEFT_EDGE): imgSrc = grassTileLeftEdge; zIndex = 2; break;
        case(TILE_TYPES.GRASS_CORNER_EDGE): imgSrc = grassTileCornerEdge; zIndex = 1; break;
        case(TILE_TYPES.WATER_RIGHT_EDGE): imgSrc = waterTileRightEdge; zIndex = 2; break;
        case(TILE_TYPES.WATER_LEFT_EDGE): imgSrc = waterTileLeftEdge; zIndex = 2; break;
        case(TILE_TYPES.WATER_CORNER_EDGE): imgSrc = waterTileCornerEdge; zIndex = 1; break;
        default: throw new Error('invalid tile type');
    }

    return <Tile src={imgSrc} xOffsetPx={xOffsetPx} yOffsetPx={yOffsetPx} zIndex={zIndex} />
}


const Tile = styled.img`
    width: ${TILE_WIDTH_PX}px;
    z-index: ${p => p.zIndex};
    position: absolute;
    left: 50%;
    top: 0;
    transform: translateX(-50%) translateX(${p => p.xOffsetPx}px) translateY(${p => p.yOffsetPx}px);
`;

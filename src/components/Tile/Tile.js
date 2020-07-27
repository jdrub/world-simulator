import React from 'react';
import styled from 'styled-components';

import { TILE_WIDTH_PX } from '../../constants';
import {
    grassTile,
    grassTileCornerEdge,
    grassTileLeftEdge,
    grassTileRightEdge,
    waterTile,
    waterTileCornerEdge,
    waterTileLeftEdge,
    waterTileRightEdge,
} from '../../images';

import { TILE_TYPES } from './constants';

export default ({ tileType, xOffsetPx, yOffsetPx, onClick, className }) => {
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

    const handleClick = (e) => {
        e.preventDefault();

        if (tileType === TILE_TYPES.WATER) {
            onClick(TILE_TYPES.GRASS);
        } else if (tileType === TILE_TYPES.GRASS) {
            onClick(TILE_TYPES.WATER);
        }
    }

    return <Tile
        src={imgSrc}
        xOffsetPx={xOffsetPx}
        yOffsetPx={yOffsetPx}
        zIndex={zIndex}
        onClick={(e) => handleClick(e)}
        className={className} />
}


const Tile = styled.img.attrs(({ xOffsetPx, yOffsetPx, zIndex }) => ({
    style: {
        transform: `translateX(-50%) translateX(${xOffsetPx}px) translateY(${yOffsetPx}px) translateZ(0)`,
        'z-index': zIndex,
    }
}))`
    width: ${TILE_WIDTH_PX}px;
    position: absolute;
    left: 50%;
    top: 0;
    :hover {
        filter: brightness(50%);
    }
`;

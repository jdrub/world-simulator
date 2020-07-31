import React from 'react';
import styled from 'styled-components';

import { TILE_WIDTH_PX } from '../../constants';
import {
    GrassTileSvg,
    grassTileCornerEdge,
    grassTileLeftEdge,
    grassTileRightEdge,
    WaterTileSvg,
    waterTileCornerEdge,
    waterTileLeftEdge,
    waterTileRightEdge,
} from '../../images';

import { TILE_TYPES } from './constants';

export default ({ tileType, xOffsetPx, yOffsetPx, onClick, className }) => {
    let imgSrc;
    let SvgTile;
    let top = '0';
    let zIndex = 0;

    switch(tileType) {
        case(TILE_TYPES.WATER): imgSrc = undefined; SvgTile = WaterTileSvg; top = '7px'; break;
        case(TILE_TYPES.GRASS): imgSrc = undefined; SvgTile = GrassTileSvg; break;
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

    return imgSrc
        ? (
            <Tile
                src={imgSrc}
                xOffsetPx={xOffsetPx}
                yOffsetPx={yOffsetPx}
                zIndex={zIndex}
                onClick={(e) => handleClick(e)}
                className={className} />
        ) : (
            <SvgTileWrapper
                src={imgSrc}
                top={top}
                xOffsetPx={xOffsetPx}
                yOffsetPx={yOffsetPx}
                zIndex={zIndex}
                onClick={(e) => handleClick(e)}
                className={className}>
                <SvgTile />
            </SvgTileWrapper>
        )
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

const SvgTileWrapper = styled.div.attrs(({ xOffsetPx, yOffsetPx, zIndex }) => ({
    style: {
        transform: `translateX(-50%) translateX(${xOffsetPx}px) translateY(${yOffsetPx}px) translateZ(0)`,
        'z-index': zIndex,
    }
}))`
    width: ${TILE_WIDTH_PX}px;
    z-index: ${p => p.zIndex};
    position: absolute;
    left: 50%;
    top: 0;
    :hover {
        filter: brightness(50%);
    }
`;


// const OffsetWrapper = styled.div.attrs(({ xOffsetPx, yOffsetPx, xConstOffsetPx, yConstOffsetPx }) => {

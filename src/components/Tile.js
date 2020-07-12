import React from 'react';
import styled from 'styled-components';

import { grassTile, waterTile } from '../images';
import { TILE_WIDTH_PX } from '../constants';

export const TILE_TYPES = {
    WATER: 'water',
    GRASS: 'grass',
};

export default ({ tileType, xOffsetPx, yOffsetPx }) => {
    let imgSrc;
    switch(tileType) {
        case(TILE_TYPES.WATER): imgSrc = waterTile; break;
        case(TILE_TYPES.GRASS): imgSrc = grassTile; break;
        default: throw new Error('invalid tile type');
    }

    return <Tile src={imgSrc} xOffsetPx={xOffsetPx} yOffsetPx={yOffsetPx} />
}


const Tile = styled.img`
    width: ${TILE_WIDTH_PX}px;
    position: absolute;
    left: 50%;
    top: 0;
    transform: translateX(-50%) translateX(${p => p.xOffsetPx}px) translateY(${p => p.yOffsetPx}px);
`;

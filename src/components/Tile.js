import React from 'react';
import styled from 'styled-components';

import { grassTile, waterTile } from '../images';
// import getRandomInt from '../utils/getRandomInt';
import { TILE_SIZE_PX } from '../constants';

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
    width: ${TILE_SIZE_PX}px;
    position: absolute;
    left: ${p => p.xOffsetPx}px;
    top: ${p => p.yOffsetPx}px;
`;

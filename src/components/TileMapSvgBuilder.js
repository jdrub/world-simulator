import React from 'react';

import { TILE_TYPES } from './Tile';
import {
    VISIBLE_WIDTH_TILES,
    VISIBLE_HEIGHT_TILES,
} from '../constants';

const TILE_WIDTH = 2041;
const TILE_HEIGHT = 1585;
const VIEWBOX_WIDTH = TILE_WIDTH * VISIBLE_WIDTH_TILES;
const VIEWBOX_HEIGHT = TILE_HEIGHT * VISIBLE_HEIGHT_TILES;

const GrassTilePath = ({ xOffset, yOffset }) => (
    <g className='tile' transform={`translate(${xOffset}, ${yOffset})`}>
        <polygon points="2041 589.08 1530.74 883.7 1020.44 1178.33 -0.12 589.08 510.18 294.45 1020.44 -0.13 2041 589.08" fill="#8bdb78"/>
        <polygon points="1020.44 1295.3 -0.13 706.08 0 589.5 1020 1178.5 1020.44 1295.3" fill="#56894a"/>
        <polygon points="2041 589.1 2041 647.57 2041 706.08 1530.73 1000.68 1020.44 1295.3 1020.44 1236.79 1020.44 1178.32 1530.73 883.7 2041 589.1" fill="#7cc56b"/>
    </g>
);

const WaterTilePath = ({ xOffset, yOffset }) => (
    <g className='tile' transform={`translate(${xOffset}, ${yOffset})`}>
        <polygon points="1020.05 1321.93 -0.46 732.74 1020.04 143.56 2040.54 732.75 1020.05 1321.93" fill="#78bfdb"/>
        <polygon points="1020.05 1439.76 -0.46 850.57 -0.46 732.74 1020.05 1321.93 1020.05 1439.76" fill="#4a7789"/>
        <polygon points="2040.54 732.75 2040.54 850.57 2017.53 863.86 1020.05 1439.76 1020.05 1321.93 2040.54 732.75" fill="#6bacc5"/>
    </g>
);

export const SvgWrapper = ({ children, className }) => (
    <svg
        className={className}
        xmlns='http://www.w3.org/2000/svg'
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}>
            {children}
    </svg>
);

const getRelativeOffset = ({ row, col }) => {
    return ({
        xOffset: col*TILE_WIDTH/2 - (row*TILE_WIDTH/2) + (VIEWBOX_WIDTH/2 - TILE_WIDTH/2),
        yOffset: (col*TILE_HEIGHT/2) + (row*TILE_HEIGHT/2) - col*TILE_HEIGHT/8 - row*TILE_HEIGHT/8,
    });
}

export default class TileMapSvgBuilder {
    constructor() {
        this.childPaths = [];
    }

    addTile({ tileType, tileRowIdx, tileColIdx, key }) {
        const { xOffset, yOffset } = getRelativeOffset({ row: tileRowIdx, col: tileColIdx });

        let TilePath;
        if (tileType === TILE_TYPES.WATER) {
            TilePath = WaterTilePath;
        } else if (tileType === TILE_TYPES.GRASS) {
            TilePath = GrassTilePath;
        } else {
            throw new Error('unsupported tile type');
        }

        this.childPaths = this.childPaths.concat(<TilePath key={key} xOffset={xOffset} yOffset={yOffset} />);
        return this;
    }

    build() {
        return { childPaths: this.childPaths };
    }
}

import React from 'react';

import { TILE_TYPES } from './Tile';
import {
    TILE_WIDTH,
    TILE_HEIGHT,
    VIEWBOX_WIDTH,
    VIEWBOX_HEIGHT,
} from '../constants';

const getGrassTilePaths = ({ xOffset, yOffset }) => [
    { path: new Path2D(`M${xOffset + 212.13},${yOffset + 304.77}L${xOffset + 0} ${yOffset + 182.29} ${xOffset + 212.13} ${yOffset + 59.82} ${xOffset + 424.26} ${yOffset + 182.29} ${xOffset + 212.13} ${yOffset + 304.77}z`), fillStyle: '#5a3238' },
    { path: new Path2D(`M${xOffset + 212.13},${yOffset + 329.44}L${xOffset + 0} ${yOffset + 206.97} ${xOffset + 0} ${yOffset + 182.29} ${xOffset + 212.13} ${yOffset + 304.77} ${xOffset + 212.13} ${yOffset + 329.44}z`), fillStyle: '#381f23' },
    { path: new Path2D(`M${xOffset + 424.26},${yOffset + 182.29}L${xOffset + 424.26} ${yOffset + 206.97} ${xOffset + 212.13} ${yOffset + 329.44} ${xOffset + 212.13} ${yOffset + 304.77} ${xOffset + 424.26} ${yOffset + 182.29}z`), fillStyle: '#512d32' },
    { path: new Path2D(`M${xOffset + 212.13},${yOffset + 299.24}L${xOffset + 0} ${yOffset + 176.77} ${xOffset + 0} ${yOffset + 152.27} ${xOffset + 212.13} ${yOffset + 274.75} ${xOffset + 212.13 }${yOffset + 299.24}z`), fillStyle: '#4f3836' },
    { path: new Path2D(`M${xOffset + 424.26},${yOffset + 152.28}L${xOffset + 424.26} ${yOffset + 176.77} ${xOffset + 212.13} ${yOffset + 299.24} ${xOffset + 212.13} ${yOffset + 274.75} ${xOffset + 424.26} ${yOffset + 152.28}z`), fillStyle: '#72514d' },
    { path: new Path2D(`M${xOffset + 212.13},${yOffset + 274.75}L${xOffset + 0} ${yOffset + 152.27} ${xOffset + 212.13} ${yOffset + 29.8} ${xOffset + 424.26} ${yOffset + 152.28} ${xOffset + 212.13} ${yOffset + 274.75}z`), fillStyle: '#7f5a56' },
    { path: new Path2D(`M${xOffset + 424.26},${yOffset + 122.47}L${xOffset + 318.2} ${yOffset + 183.71} ${xOffset + 212.13} ${yOffset + 244.95} ${xOffset + 0} ${yOffset + 122.47} ${xOffset + 106.07} ${yOffset + 61.23} ${xOffset + 212.13} ${yOffset + 0} ${xOffset + 424.26} ${yOffset + 122.47}z`), fillStyle: '#8bdb78' },
    { path: new Path2D(`M${xOffset + 212.13},${yOffset + 269.26}L${xOffset + 0} ${yOffset + 146.79} ${xOffset + 0} ${yOffset + 134.63} ${xOffset + 212.13} ${yOffset + 257.1} ${xOffset + 212.13} ${yOffset + 269.26}z`), fillStyle: '#56894a' },
    { path: new Path2D(`M${xOffset + 424.26},${yOffset + 122.47}L${xOffset + 424.26} ${yOffset + 134.63} ${xOffset + 424.26} ${yOffset + 146.79} ${xOffset + 318.2} ${yOffset + 208.03} ${xOffset + 212.13} ${yOffset + 269.26} ${xOffset + 212.13} ${yOffset + 257.1} ${xOffset + 212.13} ${yOffset + 244.95} ${xOffset + 318.2} ${yOffset + 183.71} ${xOffset + 424.26} ${yOffset + 122.47}z`), fillStyle: '#7cc56b' },
    { path: new Path2D(`M${xOffset + 212.13},${yOffset + 257.1}L${xOffset + 0} ${yOffset + 134.63} ${xOffset + 0} ${yOffset + 122.47} ${xOffset + 212.13} ${yOffset + 244.95} ${xOffset + 212.13} ${yOffset + 257.1}z`), fillStyle: '#56894a' },
];

const getWaterTilePaths = ({ xOffset, yOffset }) => [
    { path: new Path2D(`M${xOffset + 212.13},${yOffset + 304.76}L${xOffset + 0} ${yOffset + 182.29} ${xOffset + 212.13} ${yOffset + 59.82} ${xOffset + 424.26} ${yOffset + 182.29} ${xOffset + 212.13} ${yOffset + 304.76}z`), fillStyle: '#5a3238' },
    { path: new Path2D(`M${xOffset + 212.13},${yOffset + 329.44}L${xOffset + 0} ${yOffset + 206.97} ${xOffset + 0} ${yOffset + 182.29} ${xOffset + 212.13} ${yOffset + 304.76} ${xOffset + 212.13} ${yOffset + 329.44}z`), fillStyle: '#381f23' },
    { path: new Path2D(`M${xOffset + 424.26},${yOffset + 182.29}L${xOffset + 424.26} ${yOffset + 206.97} ${xOffset + 212.13} ${yOffset + 329.44} ${xOffset + 212.13} ${yOffset + 304.76} ${xOffset + 424.26} ${yOffset + 182.29}z`), fillStyle: '#512d32' },
    { path: new Path2D(`M${xOffset + 212.13},${yOffset + 274.75}L${xOffset + 0} ${yOffset + 152.27} ${xOffset + 212.13} ${yOffset + 29.8} ${xOffset + 424.26} ${yOffset + 152.27} ${xOffset + 212.13} ${yOffset + 274.75}z`), fillStyle: '#78bfdb' },
    { path: new Path2D(`M${xOffset + 212.13},${yOffset + 299.24}L${xOffset + 0} ${yOffset + 176.77} ${xOffset + 0} ${yOffset + 152.27} ${xOffset + 212.13} ${yOffset + 274.75} ${xOffset + 212.13} ${yOffset + 299.24}z`), fillStyle: '#4a7789' },
    { path: new Path2D(`M${xOffset + 424.26},${yOffset + 152.27}L${xOffset + 424.26} ${yOffset + 176.77} ${xOffset + 212.13} ${yOffset + 299.24} ${xOffset + 212.13} ${yOffset + 274.75} ${xOffset + 424.26} ${yOffset + 152.27}z`), fillStyle: '#6bacc5' },
];

const getRelativeOffset = ({ row, col }) => {
    return ({
        xOffset: col*TILE_WIDTH/2 - (row*TILE_WIDTH/2) + (VIEWBOX_WIDTH/2 - TILE_WIDTH/2),
        yOffset: (col*TILE_HEIGHT/2) + (row*TILE_HEIGHT/2) - col*TILE_HEIGHT/8 - row*TILE_HEIGHT/8,
    });
}

export default class TileMapSvgBuilder {
    addTile({ tileType, tileRowIdx, tileColIdx, key, ctx }) {
        const { xOffset, yOffset } = getRelativeOffset({ row: tileRowIdx, col: tileColIdx });

        let paths;
        if (tileType === TILE_TYPES.WATER) {
            paths = getWaterTilePaths({ xOffset, yOffset, key });
        } else if (tileType === TILE_TYPES.GRASS) {
            paths = getGrassTilePaths({ xOffset, yOffset, key });
        } else {
            throw new Error('unsupported tile type');
        }

        ctx.lineWidth = 1;
        paths.forEach(({ path, fillStyle }) => {
            ctx.strokeStyle = fillStyle;
            ctx.fillStyle = fillStyle;
            ctx.stroke(path);
            ctx.fill(path);
        });

        return this;
    }

    static encode(dataUri) {
        return dataUri
            .replace(/>\s{1,}</g, `><`)
            .replace(/\s{2,}/g, ` `)
            .replace(/[\r\n%#()<>?[\\\]^`{|}]/g, encodeURIComponent);
    }

    build() {
        // fill in edges
    }
}

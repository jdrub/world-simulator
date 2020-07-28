import React from 'react';

import { TILE_TYPES } from './Tile';
import {
    VISIBLE_WIDTH_TILES,
    VISIBLE_HEIGHT_TILES,
} from '../constants';

const TILE_WIDTH = 424.26;
const TILE_HEIGHT = 329.44;
const WG_HEIGHT_DIFF = TILE_HEIGHT - 299.64;
const VIEWBOX_WIDTH = TILE_WIDTH * VISIBLE_WIDTH_TILES;
const VIEWBOX_HEIGHT = TILE_HEIGHT * VISIBLE_HEIGHT_TILES;

const Styles = () => (
<defs>
    <style>{`
      .cls-1-grass {
        fill: #5a3238;
      }

      .cls-2-grass {
        fill: #381f23;
      }

      .cls-3-grass {
        fill: #512d32;
      }

      .cls-4-grass {
        fill: #4f3836;
      }

      .cls-5-grass {
        fill: #72514d;
      }

      .cls-6-grass {
        fill: #7f5a56;
      }

      .cls-7-grass {
        fill: #8bdb78;
      }

      .cls-8-grass {
        fill: #56894a;
      }

      .cls-9-grass {
        fill: #7cc56b;
      }

      .cls-1-water {
        fill: #5a3238;
      }

      .cls-2-water {
        fill: #381f23;
      }

      .cls-3-water {
        fill: #512d32;
      }

      .cls-4-water {
        fill: #78bfdb;
      }

      .cls-5-water {
        fill: #4a7789;
      }

      .cls-6-water {
        fill: #6bacc5;
      }

      .tile {
      }

      .tile:hover {
            filter: brightness(50%);
        }
    `}</style>
</defs>
);

const GrassTilePath = () => (
    <>
        <g>
            <path className="cls-1-grass" d="M212.13,304.77L0 182.29 212.13 59.82 424.26 182.29 212.13 304.77z"></path>
            <path className="cls-2-grass" d="M212.13,329.44L0 206.97 0 182.29 212.13 304.77 212.13 329.44z"></path>
            <path className="cls-3-grass" d="M424.26,182.29L424.26 206.97 212.13 329.44 212.13 304.77 424.26 182.29z"></path>
        </g>
        <g>
            <path className="cls-4-grass" d="M212.13,299.24L0 176.77 0 152.27 212.13 274.75 212.13 299.24z"></path>
            <path className="cls-5-grass" d="M424.26,152.28L424.26 176.77 212.13 299.24 212.13 274.75 424.26 152.28z"></path>
            <path className="cls-6-grass" d="M212.13,274.75L0 152.27 212.13 29.8 424.26 152.28 212.13 274.75z"></path>
        </g>
        <g>
            <path className="cls-7-grass" d="M424.26,122.47L318.2 183.71 212.13 244.95 0 122.47 106.07 61.23 212.13 0 424.26 122.47z"></path>
            <path className="cls-8-grass" d="M212.13,269.26L0 146.79 0 134.63 212.13 257.1 212.13 269.26z"></path>
            <path className="cls-9-grass" d="M424.26,122.47L424.26 134.63 424.26 146.79 318.2 208.03 212.13 269.26 212.13 257.1 212.13 244.95 318.2 183.71 424.26 122.47z"></path>
            <path className="cls-8-grass" d="M212.13,257.1L0 134.63 0 122.47 212.13 244.95 212.13 257.1z"></path>
        </g>
    </>
)
export const getGrassTilePathWithTransform = ({ xOffset, yOffset, key }) => () => (
    <g className='tile' key={key} transform={`translate(${xOffset}, ${yOffset})`}>
        <GrassTilePath />
    </g>
);

const WaterTilePath = () => (
    <>
        <g>
            <path className="cls-1-water" d="M212.13,304.76L0 182.29 212.13 59.82 424.26 182.29 212.13 304.76z"></path>
            <path className="cls-2-water" d="M212.13,329.44L0 206.97 0 182.29 212.13 304.76 212.13 329.44z"></path>
            <path className="cls-3-water" d="M424.26,182.29L424.26 206.97 212.13 329.44 212.13 304.76 424.26 182.29z"></path>
        </g>
        <g>
            <path className="cls-4-water" d="M212.13,274.75L0 152.27 212.13 29.8 424.26 152.27 212.13 274.75z"></path>
            <path className="cls-5-water" d="M212.13,299.24L0 176.77 0 152.27 212.13 274.75 212.13 299.24z"></path>
            <path className="cls-6-water" d="M424.26,152.27L424.26 176.77 212.13 299.24 212.13 274.75 424.26 152.27z"></path>
        </g>
    </>
);

export const getWaterTilePathWithTransform = ({ xOffset, yOffset, key }) => () => (
    <g className='tile' key={key} transform={`translate(${xOffset}, ${yOffset})`}>
        <WaterTilePath />
    </g>
);

export const SvgWrapper = ({ children }) => <svg xmlns='http://www.w3.org/2000/svg' viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}><Styles/>{children}</svg>;

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
            TilePath = getWaterTilePathWithTransform({ xOffset, yOffset, key });
        } else if (tileType === TILE_TYPES.GRASS) {
            TilePath = getGrassTilePathWithTransform({ xOffset, yOffset, key });
        } else {
            throw new Error('unsupported tile type');
        }

        this.childPaths = this.childPaths.concat(<TilePath key={key} />);
        return this;
    }

    static encode(dataUri) {
        return dataUri
            .replace(/>\s{1,}</g, `><`)
            .replace(/\s{2,}/g, ` `)
            .replace(/[\r\n%#()<>?[\\\]^`{|}]/g, encodeURIComponent);
    }

    build() {
        return ({ TileMapSvg: SvgWrapper, childPaths: this.childPaths });
    }
}

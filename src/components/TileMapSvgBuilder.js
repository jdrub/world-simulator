import { TILE_TYPES } from './Tile';
import {
    VISIBLE_WIDTH_TILES,
    VISIBLE_HEIGHT_TILES,
} from '../constants';

const TILE_WIDTH = 424.26;
const TILE_HEIGHT = 329.44;
const VIEWBOX_WIDTH = TILE_WIDTH * VISIBLE_WIDTH_TILES;
const VIEWBOX_HEIGHT = TILE_HEIGHT * VISIBLE_HEIGHT_TILES;

export const styles = `
<defs>
    <style>
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
        width: ${900};
      }

      .tile:hover {
            filter: brightness(50%);
        }
    </style>
</defs>
`;

export const getGrassTilePath = ({ xOffset, yOffset }) => `
    <g class='tile' transform='translate(${xOffset}, ${yOffset})'>
        <g>
            <polygon class='cls-1-grass' points='212.13 304.77 0 182.29 212.13 59.82 424.26 182.29 212.13 304.77'/>
            <polygon class='cls-2-grass' points='212.13 329.44 0 206.97 0 182.29 212.13 304.77 212.13 329.44'/>
            <polygon class='cls-3-grass' points='424.26 182.29 424.26 206.97 212.13 329.44 212.13 304.77 424.26 182.29'/>
        </g>
        <g>
            <polygon class='cls-4-grass' points='212.13 299.24 0 176.77 0 152.27 212.13 274.75 212.13 299.24'/>
            <polygon class='cls-5-grass' points='424.26 152.28 424.26 176.77 212.13 299.24 212.13 274.75 424.26 152.28'/>
            <polygon class='cls-6-grass' points='212.13 274.75 0 152.27 212.13 29.8 424.26 152.28 212.13 274.75'/>
        </g>
        <g>
            <polygon class='cls-7-grass' points='424.26 122.47 318.2 183.71 212.13 244.95 0 122.47 106.07 61.23 212.13 0 424.26 122.47'/>
            <polygon class='cls-8-grass' points='212.13 269.26 0 146.79 0 134.63 212.13 257.1 212.13 269.26'/>
            <polygon class='cls-9-grass' points='424.26 122.47 424.26 134.63 424.26 146.79 318.2 208.03 212.13 269.26 212.13 257.1 212.13 244.95 318.2 183.71 424.26 122.47'/>
            <polygon class='cls-8-grass' points='212.13 257.1 0 134.63 0 122.47 212.13 244.95 212.13 257.1'/>
        </g>
    </g>
`;

export const getWaterTilePath = ({ xOffset, yOffset }) => `
    <g class='tile' transform='translate(${xOffset}, ${yOffset})'>
        <g>
            <polygon class='cls-1-water' points='212.13 274.96 0 152.49 212.13 30.02 424.26 152.49 212.13 274.96'/>
            <polygon class='cls-2-water' points='212.13 299.64 0 177.17 0 152.49 212.13 274.96 212.13 299.64'/>
            <polygon class='cls-3-water' points='424.26 152.49 424.26 177.17 212.13 299.64 212.13 274.96 424.26 152.49'/>
        </g>
        <g>
            <polygon class='cls-4-water' points='212.13 244.95 0 122.47 212.13 0 424.26 122.47 212.13 244.95'/>
            <polygon class='cls-5-water' points='212.13 269.44 0 146.97 0 122.47 212.13 244.95 212.13 269.44'/>
            <polygon class='cls-6-water' points='424.26 122.47 424.26 146.97 212.13 269.44 212.13 244.95 424.26 122.47'/>
        </g>
    </g>
`;

export const svgOpenTag = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}'>`
export const svgCloseTag = `</svg>`;

const getRelativeOffset = ({ row, col }) => {
    return ({
        xOffset: col*TILE_WIDTH/2 - (row*TILE_WIDTH/2) + (VIEWBOX_WIDTH/2 - TILE_WIDTH/2),
        yOffset: (col*TILE_HEIGHT/2) + (row*TILE_HEIGHT/2) - col*TILE_HEIGHT/8 - row*TILE_HEIGHT/8,
    });
}

export default class TileMapSvgBuilder {
    constructor() {
        this.svgDataUri = `data:image/svg+xml;utf8,${svgOpenTag}${styles}`;
    }

    addTile({ tileType, tileRowIdx, tileColIdx }) {
        const { xOffset, yOffset } = getRelativeOffset({ row: tileRowIdx, col: tileColIdx });

        let tilePath;
        if (tileType === TILE_TYPES.WATER) {
            tilePath = getWaterTilePath({ xOffset, yOffset });
        } else if (tileType === TILE_TYPES.GRASS) {
            tilePath = getGrassTilePath({ xOffset, yOffset });
        } else {
            throw new Error('unsupported tile type');
        }

        this.svgDataUri = `${this.svgDataUri}${tilePath}`;

        return this;
    }

    static encode(dataUri) {
        return dataUri
            .replace(/>\s{1,}</g, `><`)
            .replace(/\s{2,}/g, ` `)
            .replace(/[\r\n%#()<>?[\\\]^`{|}]/g, encodeURIComponent);
    }

    build() {
        return TileMapSvgBuilder.encode(`${this.svgDataUri}${svgCloseTag}`);
    }
}

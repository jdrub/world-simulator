export const BOARD_WIDTH_TILES = 300;
export const BOARD_HEIGHT_TILES = 300;
export const VISIBLE_WIDTH_TILES = 10;
export const VISIBLE_HEIGHT_TILES = 10;
export const MOVEMENT_SPEED_FACTOR = 1;
export const TILE_MOVEMENT_STEP = 0.1;
export const INTERVAL_MS = 12;
export const START_ROW = 150;
export const START_COL = 150;

const TILE_GROWTH_FACTOR = 1;
export const TILE_WIDTH_PX = 100 * TILE_GROWTH_FACTOR;
export const TILE_HEIGHT_PX = 57.735 * TILE_GROWTH_FACTOR; // this is mathematically derived by hand based on the image asset
export const TILE_SIDE_LENGTH_PX = Math.sqrt(Math.pow(TILE_WIDTH_PX/2, 2) + Math.pow(TILE_HEIGHT_PX/2, 2));
export const TILE_Z_HEIGHT_PX = 20.69 * TILE_GROWTH_FACTOR; // measured

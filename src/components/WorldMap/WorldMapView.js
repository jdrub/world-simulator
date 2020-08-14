import React, { useMemo, Suspense, useRef } from 'react';
import Tile from '../Tile';
import Lights from '../Lights';

const WorldMapView = ({ position, fullTileMap, updateTile }) => {

    const visibleTiles = useMemo(() => {
        let newTilemap = [];
        for(let row = -15; row <= 15; row++) {
            for (let col = -15; col <= 15; col++) {
                newTilemap.push(<Tile key={`${row},${col}`} pos={{row, col}} />);
            }
        }
        return newTilemap;
    }, [position.row, position.col]);

    const tilesRef = useRef();

    return (
        <>
            <group ref={tilesRef}>
                <Suspense fallback={null}>
                    {visibleTiles}
                </Suspense>
            </group>
            <Lights />
        </>
    );
}
export {
    WorldMapView as default
};

import React, { useMemo, Suspense, useRef } from 'react';
import styled, { css } from 'styled-components';
import Tile from '../Tile';
import Lights from '../Lights';

import { Canvas, useFrame } from "react-three-fiber";
import { useEffect } from 'react';
import MapBounds from '../MapBounds';

const WorldMapView = ({ position, fullTileMap, updateTile }) => {

    const visibleTiles = useMemo(() => {
        let newTilemap = [];
        for(let row = -2; row <= 2; row++) {
            for (let col = -2; col <= 2; col++) {
                newTilemap.push(<Tile key={`${row},${col}`} pos={{row, col}} />);
            }
        }
        return newTilemap;
    }, [position.row, position.col]);

    const tilesRef = useRef();

    useFrame(() => {
        // tilesRef.current.rotation.y -= 0.01;
    })

    return (
        <>
            <group ref={tilesRef}>
                <Suspense fallback={null}>
                    {visibleTiles}
                </Suspense>
            </group>
            <Lights />
            {/* <MapBounds /> */}
        </>
    );
}
export {
    WorldMapView as default
};

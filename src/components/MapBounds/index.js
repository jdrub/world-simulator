import React, { useRef, useState } from 'react';
import { Canvas, useLoader, useFrame, useThree } from "react-three-fiber"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';

export default ({ pos }) => {
    return (
        <mesh position={[10, 0, 0]}>
            <planeBufferGeometry attach="geometry" args={[500, 500]} />
            <meshStandardMaterial
                attach="material"
                color="white"
                side={THREE.DoubleSide}
                roughness={0.3}
                metalness={0.3} />
        </mesh>

        // <mesh receiveShadow position={[2, 0, 0]}>
        //     <planeBufferGeometry attach="geometry" args={[500, 500]} />
        //     <meshStandardMaterial attach="material" color="white" />
        // </mesh>
        
        // <mesh
        //   ref={mesh}
        //   position={[pos.row, 0, pos.col]}
        //   visible
        // >
        //     <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
        //     <meshStandardMaterial
        //         attach="material"
        //         color="white"
        //         roughness={0.3}
        //         metalness={0.3} />
        // </mesh>
        
      );
}

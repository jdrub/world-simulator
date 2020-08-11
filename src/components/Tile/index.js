import React, { useRef, useState } from 'react';
import { Canvas, useLoader, useFrame, useThree } from "react-three-fiber"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { useEffect, useMemo } from 'react';

export default ({ pos }) => {
    const mesh = useRef();

    // const position = [0,0,0];

    const gltf = useLoader(GLTFLoader, "/grass_tile.glb")
    

    // raf loop
    useFrame(() => {
        // mesh.current.rotation.x += 0.02;
        // mesh.current.rotation.y -= 0.01;
        // mesh.current.rotation.z += 0.02;
        // mesh.current.position.x += 0.01;
    });

    return (
        <group
            ref={mesh}
            position={[pos.row*2.1, 0, pos.col * 2.1]}
        >
            <mesh {...gltf.nodes.Cube} />
            <mesh {...gltf.nodes.Cube001} />
            <mesh {...gltf.nodes.Cube002} />
        </group>
        
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

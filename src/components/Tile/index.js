import React, { useRef, useState } from 'react';
import { Canvas, useLoader, useFrame, useThree } from "react-three-fiber"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';

export default ({ pos }) => {
    const mesh = useRef();

    const gltf = useLoader(GLTFLoader, "/grass_tile.glb")
    
    // useFrame(() => {
    //     mesh.current.rotation.x += 0.02;
    //     mesh.current.rotation.y -= 0.01;
    //     mesh.current.rotation.z += 0.02;
    //     mesh.current.position.x += 0.05;
    // });

    const { scene, gl } = useThree();

    const clippingPlanes = useMemo(() => [
        new THREE.Plane(new THREE.Vector3(0, 0, 1), 5),
        new THREE.Plane(new THREE.Vector3(0, 0, -1), 5),
        new THREE.Plane(new THREE.Vector3(1, 0, 0), 5),
        new THREE.Plane(new THREE.Vector3(-1, 0, 0), 5),
    ], []);

    useEffect(() => {
        // const helpers = new THREE.Group();
        // helpers.add( new THREE.PlaneHelper( clippingPlanes[ 0 ], 2, 0xff0000 ) );
        // helpers.add( new THREE.PlaneHelper( clippingPlanes[ 1 ], 2, 0xff0000 ) );
        // helpers.add( new THREE.PlaneHelper( clippingPlanes[ 2 ], 2, 0x0000ff ) );
        // helpers.add( new THREE.PlaneHelper( clippingPlanes[ 3 ], 2, 0x0000ff ) );
        // helpers.visible = true;
        // scene.add( helpers );
        gl.localClippingEnabled = true;
    }, []);

    return (
        <group
            ref={mesh}
            position={[pos.row*2.1, 0, pos.col * 2.1]}
        >
            <mesh {...{ ...gltf.nodes.Cube, material: undefined}}>
                <meshPhysicalMaterial
                    attach="material"
                    {...gltf.nodes.Cube.material}
                    clippingPlanes={clippingPlanes} />
            </mesh>
            <mesh {...gltf.nodes.Cube001}>
                <meshPhysicalMaterial
                    attach="material"
                    {...gltf.nodes.Cube001.material}
                    clippingPlanes={clippingPlanes} />
            </mesh>
            <mesh {...gltf.nodes.Cube002}>
                <meshPhysicalMaterial
                    attach="material"
                    {...gltf.nodes.Cube002.material}
                    clippingPlanes={clippingPlanes} />
            </mesh>
        </group>
      );
}

import React from "react";

export default () => {
  return (
    <group>
      <ambientLight intensity={0.4} />
      <pointLight intensity={1.12} position={[-5, 10, -2]} />
      <pointLight intensity={1.12} position={[20, 0, 20]} />
    </group>
  );
};


// position: [-4.5, 3.5, -3 ]

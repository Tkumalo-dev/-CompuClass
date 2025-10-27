// import { useGLTF } from "@react-three/drei";

// export function ComputerModel() {
//   const { scene } = useGLTF(
//     "https://raw.githubusercontent.com/Tkumalo-dev/3Dmodels/main/inside_a_pc/scene.gltf"
//   );

//   return <primitive object={scene} />;
// }


import React, { useRef } from 'react';


export default function ComputerModel(props) {
  const groupRef = useRef();
  const { nodes, materials } = useGLTF("CompuClass/assets/3D_models/inside_a_pc/scene.gltf"); 

  return (
    <group ref={groupRef} {...props} dispose={null}>
      {/* Render  model's meshes based on its structure */}
      {/* Example for a simple model: */}
      {/* <mesh
        castShadow
        receiveShadow
        geometry={nodes.YourModelMeshName.geometry}
        material={materials.YourModelMaterialName}
      /> */}
    </group>
  );
}

useGLTF.preload('CompuClass/assets/3D_models/inside_a_pc/scene.gltf'); // Preload the model for faster loading
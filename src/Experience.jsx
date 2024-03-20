import { OrbitControls } from "@react-three/drei";
import {
  Physics,
  RigidBody,
  CuboidCollider,
  BallCollider,
} from "@react-three/rapier";
import { Perf } from "r3f-perf";
import { useRef } from "react";

export default function Experience() {
  const cube = useRef();

  const cubeJump = () => {
    // impulse sends in direction using vec3
    cube.current.applyImpulse({ x: 0, y: 5, z: 0 });

    // torque is keyword for rotation
    cube.current.applyTorqueImpulse({
      x: Math.random() - 0.5,
      y: Math.random() - 0.5,
      z: Math.random() - 0.5,
    });
  };

  return (
    <>
      <Perf position="top-left" />

      <OrbitControls makeDefault />

      <directionalLight castShadow position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1.5} />

      {/* use debug property to see physics bounding boxes (colliders; "cuboid" for box shape) around meshes (activating this affects performance) */}
      <Physics debug gravity={[0, -1.6, 0]}>
        {/* set collider using the property */}
        <RigidBody colliders="ball">
          <mesh castShadow position={[-1.5, 2, 0]}>
            <sphereGeometry />
            <meshStandardMaterial color="orange" />
          </mesh>
        </RigidBody>

        {/* gravity scale allows individual gravity settings */}
        <RigidBody position={[1.5, 2, 0]} ref={cube} gravityScale={0.2}>
          <mesh castShadow onClick={cubeJump}>
            <boxGeometry />
            <meshStandardMaterial color="mediumpurple" />
          </mesh>
        </RigidBody>

        <RigidBody type="fixed">
          <mesh receiveShadow position-y={-1.25}>
            <boxGeometry args={[10, 0.5, 10]} />
            <meshStandardMaterial color="greenyellow" />
          </mesh>
        </RigidBody>
      </Physics>
    </>
  );
}

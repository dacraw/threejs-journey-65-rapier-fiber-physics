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
    // using mass we can make the cube jump the same irregardless of mass
    const mass = cube.current.mass();

    // impulse sends in direction using vec3
    cube.current.applyImpulse({ x: 0, y: 5 * mass, z: 0 });

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

      <Physics debug>
        <RigidBody colliders="ball">
          <mesh castShadow position={[-1.5, 2, 0]}>
            <sphereGeometry />
            <meshStandardMaterial color="orange" />
          </mesh>
        </RigidBody>

        {/* we have to create our own colliders in order to change indinvidual mass of objects (note that mass doesn't account for air friction inherently) */}
        <RigidBody
          position={[1.5, 2, 0]}
          ref={cube}
          restitution={0}
          friction={0.7}
          colliders={false}
        >
          <mesh castShadow onClick={cubeJump}>
            <boxGeometry />
            <meshStandardMaterial color="mediumpurple" />
          </mesh>
          {/* note that mass doesn't make something fall faster in this world */}
          <CuboidCollider args={[0.5, 0.5, 0.5]} mass={0.5} />
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

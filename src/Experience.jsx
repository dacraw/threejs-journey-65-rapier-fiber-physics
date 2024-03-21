import { OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  Physics,
  RigidBody,
  CuboidCollider,
  BallCollider,
} from "@react-three/rapier";
import { Perf } from "r3f-perf";
import { useRef } from "react";
import * as THREE from "three";

export default function Experience() {
  const cube = useRef();
  const twister = useRef();

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

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    const eulerRotation = new THREE.Euler(0, time * 3, 0);
    const quaternionRotation = new THREE.Quaternion();
    quaternionRotation.setFromEuler(eulerRotation);

    twister.current.setNextKinematicRotation(quaternionRotation);

    const angle = time * 0.5;
    const x = Math.cos(angle) * 2;
    const z = Math.sin(angle) * 2;

    twister.current.setNextKinematicTranslation({ x, y: -0.8, z });
  });

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

        {/* // do not change position/rotation at runtime; if you MUST (i.e. reset car to original position in a game) then:
        // #1 reset velocities
        // #2 if u need to move something like a carousel or moving obstacle, use "kinematic" type */}

        <RigidBody
          ref={twister}
          position={[0, -0.8, 0]}
          friction={0}
          type="kinematicPosition" // kinematic position type won't move if another object collides with it; only way to move it manually applying forces to it
        >
          <mesh castShadow scale={[0.4, 0.4, 3]}>
            <boxGeometry />
            <meshStandardMaterial color="red" />
          </mesh>
        </RigidBody>

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

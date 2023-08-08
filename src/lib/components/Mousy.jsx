/**
 * @license
 * Copyright 2021-2022 The SeedV Lab.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, {useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import {useGLTF} from '@react-three/drei';

import {quaternionFrom, getHeadRotation} from '../utils/keypoints';
import {Vector3} from 'three';

/**
 * Renders a <Mousy/> component.
 *
 * @param {Props} props
 * @return {string} rendered JSX.
 */
export default function Mousy(props) {
  let kp;
  const group = useRef();
  const {nodes, materials} = useGLTF('../../../mousy.glb');

  useFrame((state, delta) => {
    kp = props.keypoints.current;

    if (kp != null) {
      nodes.Ch14.skeleton.bones[5].setRotationFromEuler(
          getHeadRotation(kp));

      const lShoulder = new Vector3(kp[11].z, kp[11].x, kp[11].y);
      const rShoulder = new Vector3(kp[12].z, kp[12].x, kp[12].y);
      const lElbow = new Vector3(kp[13].z, kp[13].x, kp[13].y);
      const rElbow = new Vector3(kp[14].z, kp[14].x, kp[14].y);
      const lWrist = new Vector3(kp[15].z, kp[15].x, kp[15].y);
      const rWrist = new Vector3(kp[16].z, kp[16].x, kp[16].y);
      nodes.Ch14.skeleton.bones[8].setRotationFromQuaternion(
          quaternionFrom(rShoulder, lShoulder, lElbow));
      nodes.Ch14.skeleton.bones[9].setRotationFromQuaternion(
          quaternionFrom(lShoulder, lElbow, lWrist));
      nodes.Ch14.skeleton.bones[28].setRotationFromQuaternion(
          quaternionFrom(rElbow, rShoulder, lShoulder));
      nodes.Ch14.skeleton.bones[29].setRotationFromQuaternion(
          quaternionFrom(rWrist, rElbow, rShoulder));
    }
  });

  return (
    <group ref={group} {...props} dispose={null}>
      <group
        name="Armature"
        rotation={[Math.PI / 2, 0, 0]}
        scale={[0.01, 0.01, 0.01]}>
        <primitive object={nodes.mixamorigHips} />
        <skinnedMesh
          geometry={nodes.Ch14.geometry}
          material={materials.Ch14_Body}
          skeleton={nodes.Ch14.skeleton} />
      </group>
    </group>
  );
}

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

import {Vector3, Quaternion, Euler} from 'three';

const CONFIDENCE = 0.5;

/**
 * Returns head rotation.
 *
 * @param {Array} kp
 * @return {Euler} head rotation.
 */
function getHeadRotation(kp) {
  if (kp[0].score < CONFIDENCE || kp[2].score < CONFIDENCE ||
      kp[5].score < CONFIDENCE) {
    return new Euler(0, 0, 0);
  }
  const y = getYRotation(kp[2], kp[5], kp[0]);
  const z = getZRotation(kp[2], kp[5]);
  return new Euler(0, y, z);
}

/**
 * Returns rotation angle on Y axis.
 *
 * The angle is measured in radians and normalized based on its raw coordinates.
 *
 * @param {Keypoint} p1
 * @param {Keypoint} p2
 * @param {Keypoint} pivot
 * @return {number} rotation on Y axis.
 */
function getYRotation(p1, p2, pivot) {
  const e1 = Math.abs(p1.x - pivot.x);
  const e2 = Math.abs(p2.x - pivot.x);
  return normalize(-100, 100, e2-e1) - Math.PI/2;
}

/**
 * Returns rotation angle on Z axis.
 *
 * The angle is measured in radians and normalized based on its raw coordinates.
 *
 * @param {Keypoint} p1
 * @param {Keypoint} p2
 * @return {number} rotation on Z axis.
 */
function getZRotation(p1, p2) {
  const e1 = Math.abs(p1.y);
  const e2 = Math.abs(p2.y);
  return normalize(-80, 80, e2-e1) - Math.PI/2;
}

/**
 * Returns a normalized value between 0 and 1.
 *
 * @param {number} min
 * @param {number} max
 * @param {number} val
 * @return {number}
 */
function normalize(min, max, val) {
  return ((val - min) / (max - min)) * Math.PI;
}

/**
 * Returns a quaternion to rotate between two 3D vectors. The first one is
 * pointing from first to middle. The second one is pointing from middle to
 * last.
 *
 * @param {Vector3} first
 * @param {Vector3} middle
 * @param {Vector3} last
 * @return {Quaternion} a quaternion to apply rotation.
 */
function quaternionFrom(first, middle, last) {
  const v1 = new Vector3();
  v1.subVectors(first, middle).normalize();
  const v2 = new Vector3();
  v2.subVectors(middle, last).normalize();
  const quaternion = new Quaternion();
  quaternion.setFromUnitVectors(v1, v2);
  return quaternion.normalize();
}

export {getHeadRotation, quaternionFrom};

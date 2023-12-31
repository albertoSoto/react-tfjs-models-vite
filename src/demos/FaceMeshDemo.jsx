/**
 * @license
 * Copyright 2021-2022 The SeedV Lab.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Camera from '../lib/components/Camera';
import FaceMesh from '../lib/components/FaceMesh';
import React from 'react';

const style = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  zIndex: -1,
  width: 640,
  height: 480,
};

const FaceMeshDemo = (props) => {
  /**
   * Handles face estimation.
   * @param {Object} prediction
   */
  function onFaceEstimate(prediction) {
    console.log(prediction);
  }

  return <div>
    <Camera style={style}>
      <FaceMesh
        backend='webgl'
        onFaceEstimate={onFaceEstimate} />
    </Camera>
  </div>;
};

export default FaceMeshDemo;

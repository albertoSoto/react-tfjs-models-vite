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

import * as posedetection from '@tensorflow-models/pose-detection';

const BlazePoseLoader = (props) => {
  const {type, runtime} = props;

  if (runtime === 'mediapipe') {
    return posedetection.createDetector(
        posedetection.SupportedModels.BlazePose, {
          runtime,
          modelType: type != null ? type : 'full',
          solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/pose',
        });
  } else if (runtime === 'tfjs') {
    return posedetection.createDetector(
        posedetection.SupportedModels.BlazePose, {
          runtime,
          modelType: type != null ? type : 'full',
        });
  } else {
    throw new Error('The runtime is not supported');
  }
};

export default BlazePoseLoader;

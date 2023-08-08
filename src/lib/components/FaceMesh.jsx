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

import {useContext, useEffect, useCallback} from 'react';
import {VideoContext} from './global';
import useModel from '../hooks/useModel';
import FaceMeshLoader from '../models/FaceMeshLoader';

const FaceMesh = (props) => {
  const videoState = useContext(VideoContext);
  const detectorRef = useModel(FaceMeshLoader, props);
  const {onFaceEstimate} = props;

  /**
    * Processes the video image with the pose estimator.
    *
    * @param {HTMLMediaElement} video
    */
  const onEstimate = useCallback(async (video) => {
    const detector = detectorRef.current;
    if (detector !== null) {
      const predictions = await detector.estimateFaces({
        input: video,
      });
      predictions.forEach((prediction) => {
        onFaceEstimate(prediction);
      });
    }
  }, [detectorRef, onFaceEstimate]);

  useEffect(() => {
    onEstimate(videoState.video);
  }, [videoState, onEstimate]);

  return null;
};

export default FaceMesh;

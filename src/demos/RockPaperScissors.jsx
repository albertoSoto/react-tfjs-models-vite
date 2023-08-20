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
import fp from 'fingerpose';
import React, {useRef, useState} from 'react';
import {rock, paper, scissor} from '../lib/utils/gesture';
import HandPose from '../lib/components/HandPose';

const style = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  zIndex: -1,
  width: 640,
  height: 480,
};

const emojiMap = {
  'scissor': '✌🏻',
  'rock': '✊',
  'paper': '✋',
};

const RockPaperScissors = (props) => {
  const estimator = useRef(new fp.GestureEstimator([rock, paper, scissor]));
  const [gesture, setGesture] = useState();

  /**
   * Handles hand estimate.
   * @param {Object} predictions
   */
  function onHandEstimate(predictions) {
    const estimated = estimator.current.estimate(predictions.landmarks, 7.5);
    if (estimated.gestures.length > 0) {
      const best = estimated.gestures.reduce((a, b) => {
        return (a.confidence > b.confidence) ? a : b;
      });
      if (gesture !== best.name) {
        setGesture(best.name);
      }
    }
  }

  return (
    <>
      <div style={{position: 'fixed', left: 32}}>
        <h1>{emojiMap[gesture]}</h1>
      </div>
      <Camera style={style}>
        <HandPose backend='webgl' onHandEstimate={onHandEstimate}/>
      </Camera>
    </>
  );
};

export default RockPaperScissors;

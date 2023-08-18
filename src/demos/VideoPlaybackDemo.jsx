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

import './VideoPlaybackDemo.css';
import React, {useRef, useState} from 'react';
import * as posedetection from '@tensorflow-models/pose-detection';
import {drawPose} from '../lib';
import MoveNetLoader from '../lib/models/MoveNetLoader';
import VideoPlayback from '../lib/components/VideoPlayback';
import BlazePose from '../lib/components/BlazePose';

const VideoPlaybackDemo = (props) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const canvasRef = useRef(null);
  const model = posedetection.SupportedModels.MoveNet;
  const keypointIndices = posedetection.util.getKeypointIndexBySide(model);
  const adjacentPairs = posedetection.util.getAdjacentPairs(model);

  const style = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9,
  };

  const [videoSource, setVideoSource] = useState("/climbing.mp4");

  const fileSelectedHandler = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const fileUploadHandler = () => {
    setVideoSource(URL.createObjectURL(selectedFile));
  };

  let isPoseShown = false;
  const onPoseEstimate = (pose) => {
    const ctx = canvasRef.current.getContext('2d');
    const canvas = canvasRef.current;
    if (!isPoseShown){
      console.log(pose);
      isPoseShown = true;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPose(pose, keypointIndices, adjacentPairs, ctx);
  };

  const setCanvas = (canvas) => {
    canvasRef.current = canvas;
    console.log(`Current size of canvas: ${canvas.width}x${canvas.height}`)
  };

  return (
    <div className="App">
      {videoSource == null && <>
        <input type="file" onChange={fileSelectedHandler} accept="video/*"/>
        <button onClick={fileUploadHandler}>Upload</button>
      </>}
      <VideoPlayback style={style} videoSource={videoSource}
        setCanvas={setCanvas} controlsEnabled={false} width={640} height={480}>
        <BlazePose
          backend='webgl'
          runtime='tfjs'
          type={posedetection.movenet.modelType.SINGLEPOSE_THUNDER}
          maxPoses={1}
          flipHorizontal={true}
          loader={MoveNetLoader}
          onPoseEstimate={onPoseEstimate}/>
      </VideoPlayback>
    </div>
  );
};

export default VideoPlaybackDemo;

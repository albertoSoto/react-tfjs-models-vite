# react-tfjs-models

`react-tfjs-models` is a set of components and utilities to create machine learning applications using
React. It's based on Google's [tensorflow tfjs models](https://github.com/tensorflow/tfjs-models), including
image classification, pose detection, face detection, body segmentation and more.

Comparing to integrating the underlying library, this project provides various supports for non-machine learning
experts to use these models in their Rect applications.

The model implements a proper approach for Movenet && Blaze model on pose detection which is accurate
The model variations are adaptative and it renders the canvas with the controls over the video if desired.
Styling is adaptative to needs


## Usage example

Working project located under src/demos/VideoPlaybackDemo.jsx with the following code as example of use

Considerations:

- The video component contains a recalculation for poses according to aspect ratio of the video with it's original size
  To use the recalculation, just add the width parameter in VideoPlayback component
- Provided example contains a climbing video
- Blazepose component needs to be adjusted to your needs, as it works as a loader for movenet or blaze models
    In this case, use the valid import for MovenetLoader or BlazePoseLoader
```jsx
    // loader={BlazePoseLoader}
    // type={"full"}
    loader={MoveNetLoader}
    type={posedetection.movenet.modelType.SINGLEPOSE_THUNDER}
```

```jsx

import './VideoPlaybackDemo.css';
import React, {useRef, useState} from 'react';
import * as posedetection from '@tensorflow-models/pose-detection';
import {drawPose} from '../lib';
import MoveNetLoader from '../lib/models/MoveNetLoader';
// import BlazePoseLoader from '../lib/models/BlazePoseLoader';
import VideoPlayback from '../lib/components/VideoPlayback';
import BlazePose from '../lib/components/BlazePose';
import log from '../lib/utils/logger'
const VideoPlaybackDemo = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [originalSize, setOriginalSize] = useState(null);
    const canvasRef = useRef(null);
    const videoPlaybackRef = useRef(null);
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
        if (!isPoseShown) {
            log(pose);
            log(originalSize);
            isPoseShown = true;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawPose(pose,
            keypointIndices,
            adjacentPairs,
            ctx,
            {width: canvas.width, height: canvas.height},
            originalSize
        );
    };

    const setCanvas = (canvas) => {
        canvasRef.current = canvas;
        log(`Current size of canvas: ${canvas.width}x${canvas.height}`)
    };

    return (
        <div className="App">
            {videoSource == null && <>
                <input type="file" onChange={fileSelectedHandler} accept="video/*"/>
                <button onClick={fileUploadHandler}>Upload</button>
            </>}
            <VideoPlayback style={style} videoSource={videoSource} ref={videoPlaybackRef}
                           setCanvas={setCanvas} controlsEnabled={false} width={900}
                           setOriginalVideoSize={setOriginalSize}>
                <BlazePose
                    backend='webgl'
                    runtime='tfjs'
                    // loader={BlazePoseLoader}
                    // type={"full"}
                    loader={MoveNetLoader}
                    type={posedetection.movenet.modelType.SINGLEPOSE_THUNDER}
                    maxPoses={1}
                    flipHorizontal={true}
                    onPoseEstimate={onPoseEstimate}
                />
            </VideoPlayback>
        </div>
    );
};

export default VideoPlaybackDemo;
```


## Credits

This project has been updated and forked from https://github.com/SeedV/react-tfjs-models
The adaptation has been really though, but now, is reusable for external project so I would like to share with the community
Adapted using vite with specific polyfills and included adaptative behaviour for aspect ratio insted of original video size


## React components hierarchy

`react-tfjs-models` has provided a more intuitive declarative syntax, rather than the traditional imperative
approach. An application to use `BlazePose` model to analyze each frame from a webcam stream would look like:

```jsx
<Camera ...>
  <BlazePose ...>
    <Animation />
  </BlazePose>
</Camera>
```

Generally speaking, a streaming based machine learning hierarchy would consist of an input layer, a model layer
and an output layer, and each layer has swappable components developed in `react-tfjs-models`, and can also be
implemented by application developers.

```jsx
<Input ...>
  <Model ...>
    <Output />
  </Model>
</Input>
```

### Input layer

The components in this layer generate a stream of images from input devices. It can be from a webcam or a video
extractor. This layer wraps the heavy lifting in setting up the HTML structure of using `<video>` and `<canvas>`
elements and convert the extracted frame into a Rect state.

`react-tfjs-models` provides the below components as input layer:

| Component | Description                                                                  |
| --------- |------------------------------------------------------------------------------|
| Camera | A webcam that provides video source to the model.                            |
| VideoPlayback | A video extractor that send video frames. <br/>Width parameter adjusts video size |

### Model layer

The components in this layer are machine learning models provided by
[`tfjs-models`](https://github.com/tensorflow/tfjs-models/).

This layer will also support model acceleration on webgl and wasm backend, if the model supports.

`react-tjfs-models` provides the below components as models:

| Component | Description |
| --------- | ----------- |
| BlazePose | Pose estimator, the implementation can be chosen from `BlazePose` and `MoveNet`. (`PoseNet` isn't provided yet.) |
| HandPose | Mediapipe [handpose](https://github.com/tensorflow/tfjs-models/tree/master/handpose), a 21-point 3D hand keypoints detector. |
| FaceMesh | Mediapipe [facemesh](https://github.com/tensorflow/tfjs-models/tree/master/face-landmarks-detection), a 486-point 3D facial landmark detector. |

Please refer to respective model details in <https://github.com/tensorflow/tfjs-models>.

### Output layer

The components in this layer can be used to render the result. `react-tfjs-models` will provide some predefined
overlay debug UI, e.g. rendering the skeleton on the web frames, to help developers to understand model performance
and tweak the algorithms. It's also highly customizable to adopt to the real application need.

## Demos

This project provides a list of demos to show case how the components work. Please check out the `demos` folder.

| Demo | Description |
| ---- | ----------- |
| RockPaperScissors | a HandPose estimation demo of the classic game. |
| CartoonMirror | a BlazePose demo to recognize the pose from webcam, and control a 3D character to mimic the pose. |
| FaceMeshDemo | a FaceMesh demo to recognize face landmarks (still in development). |
| VideoPlaybackDemo | a demo to use a video to test ML model (MoveNet). |

## Development

```shell
# Install dependencies
yarn install

# Start demo server on http.
yarn start
```


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

import React, {useEffect, useRef, useState} from 'react';
import {VideoContext} from './global';
import './VideoPlayback.css';
//import {calculators} from "@tensorflow-models/pose-detection";

const initVideoState = {
    video: null,
};

const VideoPlayback = (props) => {
    const videoRef = useRef(null);
    const sourceRef = useRef(null);
    const canvasRef = useRef(null);
    const requestRef = useRef(null);
    const [videoState, setVideoState] = useState(initVideoState);
    //TODO ASF 23: pass to tsx or use proptypes
    const {style, videoSource, setCanvas, controlsEnabled, width, height} = props;
    //let's avoid using the control on the canvas
    const styleCanvas = {
        ...style, pointerEvents: "none"
    }
    const run = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const isResized = width && video && video.videoWidth && video.videoWidth !== width;
        //TODO ASF 23: it takes the video original width and height, let´s adapt it f
        canvas.width = width ? width : video.videoWidth;
        canvas.height = height ? height : video.videoHeight;
        console.log(`Video Size is ${video.videoWidth}x${video.videoHeight}`)
        console.log(`Working with a canvas size ${canvas.width}x${canvas.height}`)
        console.log(`Video resized?${isResized}`);
        setCanvas(canvas);
        animate();
    };

    const animate = () => {
        setVideoState((prevState) => {
            return {...prevState, video: videoRef.current};
        });
        requestRef.current = requestAnimationFrame(animate);
    };

    const onEnded = () => {
        // TODO: dispose the detector.
    };

    useEffect(() => {
        sourceRef.current.src = videoSource;
        videoRef.current.load();
    }, [videoSource]);

    return (
        <div className="video-canvas-container">
            <video ref={videoRef} autoPlay onLoadedData={run} onEnded={onEnded}
                   style={style} controls={controlsEnabled ? controlsEnabled : true} width={width} height={height}>
                <source ref={sourceRef} type="video/mp4" width={width} height={height}/>
            </video>
            <canvas ref={canvasRef} className="canvas-overlay" style={styleCanvas}/>
            <VideoContext.Provider value={videoState}>
                {props.children}
            </VideoContext.Provider>
        </div>
    );
};

export default VideoPlayback;

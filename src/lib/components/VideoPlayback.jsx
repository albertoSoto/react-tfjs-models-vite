/**
 * @license
 * Copyright 2021-2022 The SeedV Lab.
 * Copyright 2023 Alberto Soto - LINCE PLUS
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

import React, {useEffect, useRef, useState, useImperativeHandle, forwardRef} from 'react';
import {VideoContext} from './global';
import './VideoPlayback.css';
import {getCustomHeightWithOriginalAspectRatio} from "../utils/handpose";
import log from '../utils/logger';

const initVideoState = {
    video: null,
    height: null
};

const VideoPlayback = (props, ref) => {
    const videoRef = useRef(null);
    const sourceRef = useRef(null);
    const canvasRef = useRef(null);
    const requestRef = useRef(null);
    const [videoState, setVideoState] = useState(initVideoState);
    //TODO ASF 23: pass to tsx or use proptypes
    const {style, videoSource, setCanvas, controlsEnabled, width, setOriginalVideoSize} = props;

    useImperativeHandle(ref, () => ({
        doPlayScene: (time) => {
            console.log("set time to " + time)
            videoRef.current.currentTime = time;
        },
        getCurrentTime: () => {
            return videoRef.current.currentTime;
        },
        onReadyState: (f) => {
            //Every 500ms, check if the video element has loaded
            let b = setInterval(()=>{
                if(videoRef.current.readyState >= 3){
                    if (f && typeof f === 'function' ){
                        f();
                    }
                    clearInterval(b);
                }
            },500);
        }
    }), []);

    //let's avoid using the control on the canvas
    const styleCanvas = {
        ...style, pointerEvents: "none"
    }
    const run = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const isResized = width && video && video.videoWidth && video.videoWidth !== width;
        canvas.width = width ? width : video.videoWidth;
        canvas.height = width ? getCustomHeightWithOriginalAspectRatio(video.videoWidth, video.videoHeight, width) : video.videoHeight;
        videoState.height = canvas.height;
        log(`Video Size is ${video.videoWidth}x${video.videoHeight}`)
        log(`Working with a canvas size ${canvas.width}x${canvas.height}`)
        log(`Video resized?${isResized}`);
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
    const updateOriginalVideoFullSize= ()=> {
        //Every 500ms, check if the video element has loaded
        let b = setInterval(()=>{
            if(videoRef.current.readyState >= 3){
                //This block of code is triggered when the video is loaded
                //your code goes here
                setOriginalVideoSize({
                    width: videoRef.current.videoWidth,
                    height: videoRef.current.videoHeight
                })
                //stop checking every half second
                clearInterval(b);
            }
        },500);
    }
    useEffect(() => {
        sourceRef.current.src = videoSource;
        videoRef.current.load();
        updateOriginalVideoFullSize();
    }, [videoSource, videoRef]);

    return (
        <div className="video-canvas-container">
            <video ref={videoRef} autoPlay onLoadedData={run} onEnded={onEnded}
                   style={style} controls={controlsEnabled ? controlsEnabled : true} width={width}
                   height={videoState.height}>
                <source ref={sourceRef} type="video/mp4" width={width} height={videoState.height}/>
            </video>
            <canvas ref={canvasRef} className="canvas-overlay" style={styleCanvas}/>
            <VideoContext.Provider value={videoState}>
                {props.children}
            </VideoContext.Provider>
        </div>
    );
};

export default forwardRef(VideoPlayback);

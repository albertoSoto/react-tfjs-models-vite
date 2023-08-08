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

import {useEffect, useRef, useState} from 'react';
import {VideoContext} from './global';

const initVideoState = {
  video: null,
};

const VideoPlayback = (props) => {
  const videoRef = useRef(null);
  const sourceRef = useRef(null);
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const [videoState, setVideoState] = useState(initVideoState);
  const {style, videoSource, setCanvas} = props;

  const run = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
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
    <div>
      <video ref={videoRef} autoPlay onLoadedData={run} onEnded={onEnded}
        style={style}>
        <source ref={sourceRef} type="video/mp4"/>
      </video>
      <canvas ref={canvasRef} style={style}/>
      <VideoContext.Provider value={videoState}>
        {props.children}
      </VideoContext.Provider>
    </div>
  );
};

export default VideoPlayback;

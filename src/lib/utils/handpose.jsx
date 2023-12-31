/**
 * @license
 * Copyright 2021-2022 The SeedV Lab.
 * Copyright 2023 Alberto Soto - LINCE PLUS
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
import log from './logger';
const fingerJoints = {
    thumb: [0, 1, 2, 3, 4],
    indexFinger: [0, 5, 6, 7, 8],
    middleFinger: [0, 9, 10, 11, 12],
    ringFinger: [0, 13, 14, 15, 16],
    pinky: [0, 17, 18, 19, 20],
};

const scoreThreshold = 0.65;

/**
 * Draws a hand.
 * @param {Array<number>} landmarks
 * @param {CanvasRenderingContext2D} ctx
 */
function drawHand(landmarks, ctx) {
    for (let j = 0; j < Object.keys(fingerJoints).length; j++) {
        const finger = Object.keys(fingerJoints)[j];
        //  Loop through pairs of joints
        for (let k = 0; k < fingerJoints[finger].length - 1; k++) {
            // Get pairs of joints
            const firstJointIndex = fingerJoints[finger][k];
            const secondJointIndex = fingerJoints[finger][k + 1];
            drawPath(landmarks[firstJointIndex], landmarks[secondJointIndex], ctx);
        }
    }

    landmarks.forEach((landmark) => {
        drawPoint(landmark[0], landmark[1], ctx);
    });
}

/**
 * Draws a point.
 * @param {number} x
 * @param {number} y
 * @param {CanvasRenderingContext2D} ctx
 */
function drawPoint(x, y, ctx) {
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();
}

/**
 * Draws a path.
 * @param {number} from
 * @param {number} to
 * @param {CanvasRenderingContext2D} ctx
 */
function drawPath(from, to, ctx) {
    ctx.beginPath();
    ctx.moveTo(from[0], from[1]);
    ctx.lineTo(to[0], to[1]);
    ctx.strokeStyle = 'lime';
    ctx.lineWidth = 4;
    ctx.stroke();
}

/**
 * Draws a pose.
 * @param {Object} predictions
 * @param {Array<Object>} keypointIndices
 * @param {Array<Object>} adjacentPairs
 * @param {CanvasRenderingContext2D} ctx
 */

let lazy = false;

function drawPose(predictions, keypointIndices, adjacentPairs, ctx, resizeValues, originalValues) {
    //size for a canvas with width and height is under ctx.canvas.width && ctx.canvas.height
    const keypoints = predictions.keypoints;
    const doResizeKeypoints = originalValues && originalValues.width && originalValues.height
        && resizeValues.width && resizeValues.height;
    const normalizedKeypoints =  doResizeKeypoints? resizeKeypoints(keypoints, resizeValues, originalValues) : null;
    if (!lazy) {
        log(`analisis point!${resizeValues.width}x${resizeValues.height}`)
        log(keypoints)
        log(normalizedKeypoints)
        lazy = true;
    }
    drawKeypoints(normalizedKeypoints ? normalizedKeypoints : keypoints, keypointIndices, ctx);
    drawSkeleton(normalizedKeypoints ? normalizedKeypoints : keypoints, adjacentPairs, ctx);
}

function getCustomHeightWithOriginalAspectRatio(originalWidth, originalHeight, customWidth) {
    return customWidth * originalHeight / originalWidth;
}

function resizeKeypoints(keypoints, resizeValues, originalValues) {
    //import {calculators} from "@tensorflow-models/pose-detection";
    //calculators.keypointsToNormalizedKeypoints(keypoints, {height: 640, width: 480})
    return keypoints.map(kp => resizeValueIfCanvasResized(kp, resizeValues, originalValues))
}

/**
 *
 * For the `keypoints`, x and y represent the actual keypoint position in the image.
 * If you need normalized keypoint positions, you can use the method
 * `poseDetection.calculators.keypointsToNormalizedKeypoints(keypoints, imageSize)` to
 *
 * [MoveNet Documentation](https://github.com/tensorflow/tfjs-models/tree/master/pose-detection/src/movenet)
 * [BlazePose TFJS Documentation](https://github.com/tensorflow/tfjs-models/tree/master/pose-detection/src/blazepose_tfjs)
 *
 * Modifies original keypoint value for dynamic canvas
 * @param keypoint pose keypoint
 * @returns {*&{x: number, y: number}}
 */
function resizeValueIfCanvasResized(keypoint, resizeValues, originalValues) {
    return {
        ...keypoint,
        x: resizeCoordinate(keypoint.x, originalValues.width, resizeValues.width),
        y: resizeCoordinate(keypoint.y, originalValues.height, resizeValues.height)
    }
}

/**
 * Adjust full video coordinate to custom coordinate for width or height
 * @param canvasCoordinate dynamic Value for pose
 * @param fullSize fullWidth or fullHeight
 * @param customSize customWidth or customHeight
 * @returns {number}
 */
function resizeCoordinate(canvasCoordinate, fullSize, customSize) {
    return (canvasCoordinate * customSize) / fullSize;
}

/**
 * Draws all keypoints. The keypoints to the left are in lime, the keypoints to
 * the right are in red, the keypoints to the middle are in yellow.
 * @param {Array<Object>} keypoints
 * @param {Array<Object>} keypointIndices
 * @param {CanvasRenderingContext2D} ctx
 */
function drawKeypoints(keypoints, keypointIndices, ctx) {
    for (const i of keypointIndices.middle) {
        drawKeypoint(keypoints[i], 'yellow', ctx);
    }

    for (const i of keypointIndices.left) {
        drawKeypoint(keypoints[i], 'lime', ctx);
    }

    for (const i of keypointIndices.right) {
        drawKeypoint(keypoints[i], 'red', ctx);
    }
}

/**
 * Draws a keypoint.
 * @param {Object} keypoint
 * @param {string} color
 * @param {CanvasRenderingContext2D} ctx
 */
function drawKeypoint(keypoint, color, ctx) {
    const score = keypoint.score != null ? keypoint.score : 1;
    if (score >= scoreThreshold) {
        ctx.beginPath();
        ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
    }
}

/**
 * Draws a skeleton.
 * @param {Array<Object>} keypoints
 * @param {Array<Object>} adjacentPairs
 * @param {CanvasRenderingContext2D} ctx
 */
function drawSkeleton(keypoints, adjacentPairs, ctx) {
    ctx.fillStyle = 'White';
    ctx.strokeStyle = 'White';
    ctx.lineWidth = 3;

    adjacentPairs
        .forEach(([i, j]) => {
            const kp1 = keypoints[i];
            const kp2 = keypoints[j];

            // If score is null, just show the keypoint.
            const score1 = kp1.score != null ? kp1.score : 1;
            const score2 = kp2.score != null ? kp2.score : 1;

            if (score1 >= scoreThreshold && score2 >= scoreThreshold) {
                ctx.beginPath();
                ctx.moveTo(kp1.x, kp1.y);
                ctx.lineTo(kp2.x, kp2.y);
                ctx.stroke();
            }
        });
}

export {
    drawHand,
    drawPose,
    drawSkeleton,
    drawKeypoints,
    drawPath,
    drawKeypoint,
    drawPoint,
    getCustomHeightWithOriginalAspectRatio
};

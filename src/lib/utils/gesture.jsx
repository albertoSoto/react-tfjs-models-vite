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

import fp from 'fingerpose';

const rock = new fp.GestureDescription('rock');

rock.addCurl(fp.Finger.Thumb, fp.FingerCurl.FullCurl, 1.0);
rock.addCurl(fp.Finger.Index, fp.FingerCurl.FullCurl, 1.0);
rock.addCurl(fp.Finger.Middle, fp.FingerCurl.FullCurl, 1.0);
rock.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
rock.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);

const paper = new fp.GestureDescription('paper');

paper.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl, 1.0);

paper.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
paper.addDirection(fp.Finger.Index, fp.FingerDirection.VerticalUp, 1.0);
paper.addDirection(fp.Finger.Index, fp.FingerDirection.DiagonalUpLeft, 0.75);
paper.addDirection(fp.Finger.Index, fp.FingerDirection.DiagonalUpRight, 0.75);

paper.addCurl(fp.Finger.Middle, fp.FingerCurl.NoCurl, 1.0);
paper.addDirection(fp.Finger.Middle, fp.FingerDirection.VerticalUp, 1.0);
paper.addDirection(fp.Finger.Middle, fp.FingerDirection.DiagonalUpLeft, 0.75);
paper.addDirection(fp.Finger.Middle, fp.FingerDirection.DiagonalUpRight, 0.75);

paper.addCurl(fp.Finger.Ring, fp.FingerCurl.NoCurl, 1.0);
paper.addDirection(fp.Finger.Ring, fp.FingerDirection.VerticalUp, 1.0);
paper.addDirection(fp.Finger.Ring, fp.FingerDirection.DiagonalUpLeft, 0.75);
paper.addDirection(fp.Finger.Ring, fp.FingerDirection.DiagonalUpRight, 0.75);

paper.addCurl(fp.Finger.Pinky, fp.FingerCurl.NoCurl, 1.0);
paper.addDirection(fp.Finger.Pinky, fp.FingerDirection.VerticalUp, 1.0);
paper.addDirection(fp.Finger.Pinky, fp.FingerDirection.DiagonalUpLeft, 0.75);
paper.addDirection(fp.Finger.Pinky, fp.FingerDirection.DiagonalUpRight, 0.75);

const scissor = new fp.GestureDescription('scissor');

scissor.addCurl(fp.Finger.Thumb, fp.FingerCurl.HalfCurl, 0.5);
scissor.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl, 0.5);
scissor.addDirection(fp.Finger.Thumb, fp.FingerDirection.VerticalUp, 1.0);
scissor.addDirection(fp.Finger.Thumb, fp.FingerDirection.DiagonalUpLeft, 1.0);

scissor.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
scissor.addDirection(fp.Finger.Index, fp.FingerDirection.VerticalUp, 0.75);
scissor.addDirection(fp.Finger.Index, fp.FingerDirection.DiagonalUpLeft, 1.0);

scissor.addCurl(fp.Finger.Middle, fp.FingerCurl.NoCurl, 1.0);
scissor.addDirection(fp.Finger.Middle, fp.FingerDirection.VerticalUp, 0.75);
scissor.addDirection(fp.Finger.Middle, fp.FingerDirection.DiagonalUpRight, 1.0);

scissor.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
scissor.addCurl(fp.Finger.Ring, fp.FingerCurl.HalfCurl, 0.5);

scissor.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);
scissor.addCurl(fp.Finger.Pinky, fp.FingerCurl.HalfCurl, 0.5);

scissor.setWeight(fp.Finger.Index, 2);
scissor.setWeight(fp.Finger.Middle, 2);

export {rock, paper, scissor};

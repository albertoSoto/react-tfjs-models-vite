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

import {useEffect, useRef, useCallback} from 'react';
import * as tfjsWasm from '@tensorflow/tfjs-backend-wasm';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';

tfjsWasm.setWasmPaths({
  'tfjs-backend-wasm.wasm':
      `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@` +
      `${tfjsWasm.version_wasm}/dist/tfjs-backend-wasm.wasm`,
  'tfjs-backend-wasm-simd.wasm':
      `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@` +
      `${tfjsWasm.version_wasm}/dist/tfjs-backend-wasm-simd.wasm`,
  'tfjs-backend-wasm-threaded-simd.wasm':
      `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@` +
      `${tfjsWasm.version_wasm}/dist/tfjs-backend-wasm-threaded-simd.wasm`,
});

const useModel = (loader, props) => {
  const {backend} = props;
  const modelRef = useRef(null);
  const load = useCallback(async () => {
    modelRef.current = await loader(props);
  }, [loader, props]);

  /**
   * Sets the backend.
   * @param {string} backend
   */
  function setBackend(backend) {
    tf.setBackend(backend).then(
        () => {
          if (!tf.env().getAsync('WASM_HAS_SIMD_SUPPORT') && backend ===
              'wasm') {
            console.warn('The backend is set to WebAssembly and SIMD support' +
                'is turned off.\nThis could bottleneck your performance ' +
                'greatly, thus to prevent this enable SIMD Support in ' +
                'chrome://flags');
          }
        });
  }

  useEffect(() => {
    setBackend(backend);
    load();
  }, [backend, load]);

  return modelRef;
};

export default useModel;

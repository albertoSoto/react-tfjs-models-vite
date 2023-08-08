import React from 'react'
import Root, {
  pathCartoonMirror,
  pathFaceMesh,
  pathVideoPlayback,
  pathRockPaperScissors,
} from './routes/root';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import CartoonMirror from './demos/CartoonMirror';
import FaceMeshDemo from './demos/FaceMeshDemo';
import RockPaperScissors from './demos/RockPaperScissors';
import VideoPlaybackDemo from './demos/VideoPlaybackDemo';

const App = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Root/>,
    }, {
      path: pathRockPaperScissors,
      element: <RockPaperScissors/>,
    }, {
      path: pathCartoonMirror,
      element: <CartoonMirror/>,
    }, {
      path: pathFaceMesh,
      element: <FaceMeshDemo/>,
    }, {
      path: pathVideoPlayback,
      element: <VideoPlaybackDemo/>,
    },
  ]);
  return (
      <React.StrictMode>
        <RouterProvider router={router}/>
      </React.StrictMode>
  );
}

export default App

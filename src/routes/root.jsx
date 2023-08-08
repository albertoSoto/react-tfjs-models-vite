import {Link} from 'react-router-dom';
import React from 'react';
import HelloWorld from '../lib/components/HelloWorld'

export const pathRockPaperScissors = '/rockpaperscissors';
export const pathCartoonMirror = '/cartoonmirror';
export const pathFaceMesh = '/facemesh';
export const pathVideoPlayback = '/videoplayback';
/**
 * Router for application
 * @return {Element}
 * @constructor
 */
export default function Root() {
    return (<>
        <div id="sidebar">
            <HelloWorld greetee={'Universe'}/>
            <nav>
                <ul>
                    <li>
                        <Link to={pathRockPaperScissors}>
                            RockPaperScissors
                        </Link>
                    </li>
                    <li>
                        <Link to={pathCartoonMirror}>CartoonMirror</Link>
                    </li>
                    <li>
                        <Link to={pathFaceMesh}>FaceMesh</Link>
                    </li>
                    <li>
                        <Link to={pathVideoPlayback}>VideoPlayback</Link>
                    </li>
                </ul>
            </nav>
        </div>
    </>);
}

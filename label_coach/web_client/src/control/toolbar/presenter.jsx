import * as React from "react";
import "./toolbar.css";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faUser, faRobot} from '@fortawesome/free-solid-svg-icons'
import {faCircle, faCog, faSearchMinus, faSearchPlus, faPencilAlt, faDrawPolygon, faDrawSquare} from '@fortawesome/free-solid-svg-icons'

export default class ToolBarP extends React.Component {
    constructor(props) {
        super(props);

}

render() {
        return (

  <div className="toolbar btn-group btn-group-custom">
    <button id="full-page" className="btn btn-lg btn-default"><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" data-prefix="fas" data-icon="expand-arrows-alt" className="svg-inline--fa fa-expand-arrows-alt fa-w-14" role="img" viewBox="0 0 448 512"><path fill="currentColor" d="M448.1 344v112c0 13.3-10.7 24-24 24h-112c-21.4 0-32.1-25.9-17-41l36.2-36.2L224 295.6 116.8 402.9 153 439c15.1 15.1 4.4 41-17 41H24c-13.3 0-24-10.7-24-24V344c0-21.4 25.9-32.1 41-17l36.2 36.2L184.5 256 77.2 148.7 41 185c-15.1 15.1-41 4.4-41-17V56c0-13.3 10.7-24 24-24h112c21.4 0 32.1 25.9 17 41l-36.2 36.2L224 216.4l107.3-107.3L295.1 73c-15.1-15.1-4.4-41 17-41h112c13.3 0 24 10.7 24 24v112c0 21.4-25.9 32.1-41 17l-36.2-36.2L263.6 256l107.3 107.3 36.2-36.2c15.1-15.2 41-4.5 41 16.9z"/></svg></button>
    <button id="zoom-in" className="btn btn-lg btn-default"><FontAwesomeIcon icon={faSearchPlus}/></button>
    <button id="zoom-out" className="btn btn-lg btn-default"><FontAwesomeIcon icon={faSearchMinus}/></button>
    <button id="reset" className="btn btn-lg btn-default"><FontAwesomeIcon icon={faCircle}/></button>
    <button id="pencil" className="btn btn-lg btn-default"><FontAwesomeIcon icon={faPencilAlt}/></button>
    <button id="polygon" className="btn btn-lg btn-default"><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" data-prefix="fas" data-icon="draw-polygon" className="svg-inline--fa fa-draw-polygon fa-w-14" role="img" viewBox="0 0 448 512"><path fill="currentColor" d="M384 352c-.35 0-.67.1-1.02.1l-39.2-65.32c5.07-9.17 8.22-19.56 8.22-30.78s-3.14-21.61-8.22-30.78l39.2-65.32c.35.01.67.1 1.02.1 35.35 0 64-28.65 64-64s-28.65-64-64-64c-23.63 0-44.04 12.95-55.12 32H119.12C108.04 44.95 87.63 32 64 32 28.65 32 0 60.65 0 96c0 23.63 12.95 44.04 32 55.12v209.75C12.95 371.96 0 392.37 0 416c0 35.35 28.65 64 64 64 23.63 0 44.04-12.95 55.12-32h209.75c11.09 19.05 31.49 32 55.12 32 35.35 0 64-28.65 64-64 .01-35.35-28.64-64-63.99-64zm-288 8.88V151.12A63.825 63.825 0 0 0 119.12 128h208.36l-38.46 64.1c-.35-.01-.67-.1-1.02-.1-35.35 0-64 28.65-64 64s28.65 64 64 64c.35 0 .67-.1 1.02-.1l38.46 64.1H119.12A63.748 63.748 0 0 0 96 360.88zM272 256c0-8.82 7.18-16 16-16s16 7.18 16 16-7.18 16-16 16-16-7.18-16-16zM400 96c0 8.82-7.18 16-16 16s-16-7.18-16-16 7.18-16 16-16 16 7.18 16 16zM64 80c8.82 0 16 7.18 16 16s-7.18 16-16 16-16-7.18-16-16 7.18-16 16-16zM48 416c0-8.82 7.18-16 16-16s16 7.18 16 16-7.18 16-16 16-16-7.18-16-16zm336 16c-8.82 0-16-7.18-16-16s7.18-16 16-16 16 7.18 16 16-7.18 16-16 16z"/></svg></button>
    <button id="box" className="btn btn-lg btn-default"><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" data-prefix="fas" data-icon="vector-square" className="svg-inline--fa fa-vector-square fa-w-16" role="img" viewBox="0 0 512 512"><path fill="currentColor" d="M512 128V32c0-17.67-14.33-32-32-32h-96c-17.67 0-32 14.33-32 32H160c0-17.67-14.33-32-32-32H32C14.33 0 0 14.33 0 32v96c0 17.67 14.33 32 32 32v192c-17.67 0-32 14.33-32 32v96c0 17.67 14.33 32 32 32h96c17.67 0 32-14.33 32-32h192c0 17.67 14.33 32 32 32h96c17.67 0 32-14.33 32-32v-96c0-17.67-14.33-32-32-32V160c17.67 0 32-14.33 32-32zm-96-64h32v32h-32V64zM64 64h32v32H64V64zm32 384H64v-32h32v32zm352 0h-32v-32h32v32zm-32-96h-32c-17.67 0-32 14.33-32 32v32H160v-32c0-17.67-14.33-32-32-32H96V160h32c17.67 0 32-14.33 32-32V96h192v32c0 17.67 14.33 32 32 32h32v192z"/></svg></button>
  </div>
);
    }
}


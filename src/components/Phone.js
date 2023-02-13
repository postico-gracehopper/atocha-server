import React from "react"

const Phone = ({source, scalePercent, handleClick}) => {
    return (<div className="marvel-device iphone-x" style={{boxShadow: '10px 10px 8px 4px #00000044', rotate: '7deg', aspectRatio: 1, scale: `${Math.floor(scalePercent*100)}%`}}>
        <div className="notch">
            <div className="camera"></div>
            <div className="speaker"></div>
        </div>
        <div className="top-bar"></div>
        <div className="sleep"></div>
        <div className="bottom-bar"></div>
        <div className="volume"></div>
        <div className="overflow">
            <div className="shadow shadow--tr"></div>
            <div className="shadow shadow--tl"></div>
            <div className="shadow shadow--br"></div>
            <div className="shadow shadow--bl"></div>
        </div>
        <div className="inner-shadow"></div>
        <div className="screen">
            <img src={source} onClick={handleClick} style={{width: '100%', height: '100%', zIndex: 50}} />
        </div>
        </div>)}

export default Phone
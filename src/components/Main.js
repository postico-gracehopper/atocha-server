import React from 'react';


const Main = () => {
   
    return (
            <div>
                <img id="screenshot" src="screengrab.png" />
                <div className="ribbon r-odd flx">
                    <h1 className='flxd'>Atocha</h1>
                    <p id="top-text" className='flxd'>Speak someone's language</p>
                </div>
                
                <div className="ribbon r-even flx">
                    <p id="op-button" className='flxd'>
                        . .
                    </p>
                    <div className='flxd btn'>
                        Download on <br></br>the App Store
                    </div>
                </div>
                <div className="ribbon r-odd-2">
                    <p className='flxd'>. .</p>
                    <p className='flxd bottom-text'>
                        Capable of translating over 5 languages and counting. Instant speech translation to text, using state-of-the art deep neural networks and data analysis and all types of other buzzwords.
                        <br></br><br></br>
                        Make new friends, everywhere you go.
                        <br></br><br></br>
                    </p>

                </div>
            </div>
    );
};

export default Main;
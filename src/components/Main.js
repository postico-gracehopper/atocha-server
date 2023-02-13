import React from 'react';
import useWindowDimensions from './useWindowDimensions';
import Phone from './Phone';

const Main = () => {
    const [picNum, setPicNum] = React.useState(0)
    const {width, height} = useWindowDimensions()
    const onPhoneClick = () => setPicNum((picNum + 1) % 3)
    console.log(picNum)

    return (<div style={{backgroundColor: colors.primary, paddingBottom: '30vh'}}>
        <div style={{
                backgroundColor: colors.primary, 
                width: '100%', 
                height: Math.floor(width/6), 
                display: 'flex', 
                alignItems: 'flex-end', 
                paddingLeft: width/20,}}>
            <h1 style={{color: 'white', 
                    fontSize: width/10, 
                    fontFamily: 'Water Brush', 
                    fontWeight: 100,
                    position: 'relative',
                    top: width/10
                
            }}>Atocha</h1>
            <h3 style={{textAlign: 'center', 
              color: 'white', 
              fontSize: width/40,
              flex: 1,
              position: 'relative', 
              top: width/40}}><i>The Translation App built for Adventure</i></h3>

        </div>
        <div style={{backgroundColor: colors.fadedPrimary, width: '100%', height: Math.floor(width/2.5), display: 'flex', justifyContent: 'center', alignItems: 'center', }}> 
            <div style={{flex: 1, textAlign: 'center', color: 'white', marginLeft: (width/75) - 50, position: 'relative', top: width/4}}>
                <Phone source={`./images/screencap${picNum + 1}.png`} scalePercent={width/1500} handleClick={onPhoneClick}/></div>
            <div style={{flex: 1, marginLeft: width/50, width: '30%'
                }}>
                    <button style={{backgroundColor: colors.white, 
                        color: 'white', 
                        width: '90%', 
                        textAlign: 'center', 
                        borderStyle: 'solid',
                        borderColor: 'black',
                        borderWidth: 5,
                        borderRadius: width/10,
                        boxShadow: '10px 10px 8px 4px #00000044'
                        
                    }}>
                    <h3 style={{fontSize: width/25, color: colors.darkPrimary}}>
                    Download on <br></br>the App Store
                    </h3>
                    </button>
                    </div>
        </div>
        <div style={{backgroundColor: colors.primary, width: '100%', height: '60vh', display: 'flex'}}>
            <div style={{flex: 1}}></div>
            <div style={{flex: 1, padding: '10%', color: 'white', fontSize: width/60, textAlign: 'center'}}>
                Speak into the microphone to recieve an instant translation in one of nine Languages: 
            <div style={{textAlign: 'left', marginLeft: '30%'}}>
                <br></br>
                🇬🇧 English<br></br>
                🇪🇸 Spanish<br></br>
                🇫🇷 French<br></br>
                🇩🇪 German<br></br> 
                🇵🇹 Portuguese<br></br>
                🇮🇹 Italian<br></br> 
                🇷🇺 Russian<br></br> 
                🇮🇳 Hindi<br></br>
                🇹🇭 Thai<br></br>   
            </div>
            </div>
        </div>
        <div style={{backgroundColor: colors.primary, width: '100%', height: '60vh', display: 'flex', alignItems: 'center'}}>
            <p style={{color: 'white', fontSize: width/60, textAlign: 'center', padding: '10%'}}>
                Atocha supports instant translation via speech or text, 
                teacher explanations, suggested responses, broadening vocabulary, 
                and a histoy + phrasebook you can keep coming back to. 
                Take your first step on your next adventure today!
            </p>
        </div>
    </div>
            // <div>
            //     <img id="screenshot" src="screengrab.png" />
            //     <div className="ribbon r-odd flx">
            //         <h1 className='flxd'>Atocha</h1>
            //         <p id="top-text" className='flxd'>Speak someone's language</p>
            //     </div>
                
            //     <div className="ribbon r-even flx">
            //         <p id="op-button" className='flxd'>
            //             . .
            //         </p>
            //         <div className='flxd btn'>
            //             Download on <br></br>the App Store
            //         </div>
            //     </div>
            //     <div className="ribbon r-odd-2">
            //         <p className='flxd'>. .</p>
            //         <p className='flxd bottom-text'>
            //             Capable of translating over 5 languages and counting. Instant speech translation to text, using state-of-the art deep neural networks and data analysis and all types of other buzzwords.
            //             <br></br><br></br>
            //             Make new friends, everywhere you go.
            //             <br></br><br></br>
            //         </p>

            //     </div>
            // </div>
    );
};


const colors = {
    primary: '#470024',
    fadedPrimary: '#832454',
    brightPrimary: '#c70042',
    lightPrimary: '#FB97A6',
    purple: '#8100ff',
    lightPurple: '#9388db',
    lightGrayPurple: '#f7f7fb',
    ecru: '#71706e',
    lightEcru: '#b8b7b4',
    pink: '#ff3d69',
    gray: '#797777',
    white: '#e6e6e6',
    darkGray: '#272727',
    black: '#000',
    transparentPrimary: '#130006CC',
    darkPrimary: '#621236',
}

export default Main;
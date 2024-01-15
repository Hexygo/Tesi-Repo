import React, {useEffect, useState} from 'react';
import '../styles/Progressbar.css';

function Progressbar(props) {
    const [animationName, setAnimationName] = useState("");

    useEffect(() => {
        if (props.initStyle === 'twenty%') {
            if (props.step > props.previousStep) { // Going forward
                switch (props.step) {
                    case 1:
                        setAnimationName("expand20to40");
                        break;
                    case 2:
                        setAnimationName("expand40to60");
                        break;
                    case 3:
                        setAnimationName("expand60to80");
                        break;
                    case 4:
                        setAnimationName("expand80to100");
                        break;
                }
            } else if (props.step < props.previousStep) { // Going backward
                switch (props.previousStep) {
                    case 1:
                        setAnimationName("reduce40to20");
                        break;
                    case 2:
                        setAnimationName("reduce60to40");
                        break;
                    case 3:
                        setAnimationName("reduce80to60");
                        break;
                    case 4:
                        setAnimationName("reduce100to80");
                        break;
                }
            }
        } else if (props.initStyle === 'fifty%') {
            if (props.step > props.previousStep) { // Going forward
                setAnimationName("expand50to100");
            } else if (props.step < props.previousStep) { // Going backward
                setAnimationName("reduce100to50");
            }
        }
    }, [props.step, props.initStyle, props.previousStep]);

    return (
        <div className='bar_container'>
            <div id='status'
                 style={{
                     animationName: animationName,
                     animationDuration: "0.3s",
                     animationFillMode: "forwards",
                     animationTimingFunction: 'ease-in-out'
                 }}
                 className={props.initStyle === 'fifty%' && props.step === 0 ? 'two' : props.initStyle === 'twenty%' && props.step === 0 ? 'five' : 'one'}>
            </div>
        </div>
    );
}

export default Progressbar;

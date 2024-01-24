import React from "react";
import EvForm from '../components/evaluation/EvForm.js'


function Evaluation(props){
    return(


        <EvForm previousevStep={props.previousevStep} setPreviousevStep={props.setPreviousevStep} evStep={props.evStep} setEvStep={props.setEvStep} />
    );
}

export default Evaluation;
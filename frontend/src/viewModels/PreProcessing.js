import React from 'react';
import Form from '../components/preProcessing/Form.js';
import '../styles/preProcessing/PreProcessing.css';
import {Container, Typography} from "@mui/material";

function PreProcessing(props) {

    return (
        <Container sx={{display: 'flex',justifyContent: 'center',
            alignContent: 'center', flexDirection: 'column',
            boxShadow: (props.preStep && props.previousStep!==5) ? 'rgba(105, 165, 196, 0.5) 0 1px 30px': 'none',
            gap: '30px', mb: '80px', mt:'40px',p: '40px', borderRadius: '25px'}}>
            <Typography
                        sx={{
                            fontFamily: "'Merriweather', serif;",
                            textAlign: 'center',
                            fontWeight: 'bold',
                            mt: 5, mb: 5,
                            fontSize: '2.3em'

                        }}
            >Data preprocessing
            </Typography>
            <Form setPreviousStep={props.setPreviousStep} setStep={props.setStep} setSubmitButton={props.setSubmitButton} previousStep={props.previousStep} step={props.step} submitButton={props.submitButton} preStep={props.preStep} setPreStep={props.setPreStep}/>
        </Container>
    );
}

export default PreProcessing;
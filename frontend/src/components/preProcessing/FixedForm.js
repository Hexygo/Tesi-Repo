import React, {useEffect} from 'react';
import Progressbar from '../Progressbar.js';
import '../../styles/preProcessing/FixedForm.css'
import Form from './Form.js';
import {
    Container,
    Button,
    FormGroup,
    Box,
    Checkbox,
    FormControlLabel,
    Typography,
    Tooltip, IconButton, TextField
} from '@mui/material';
import Zoom from "@mui/material/Zoom";
import CancelIcon from "@mui/icons-material/Cancel";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import {enqueueSnackbar} from "notistack";
import FixedFile from "./FixedFile";


function FixedForm(props) {

    const requestState = props.requestState;
    const setRequestState = props.setRequestState;
    const isValid = props.isValid;
    const setIsValid = props.setIsValid;

    useEffect(() => {
        if (requestState.random_seed) {
            setIsValid(true);
        } else {
            setIsValid(false);
        }
    }, [requestState.random_seed]);

    const next = () => {
        if (!isValid) {
            enqueueSnackbar('Compila tutti i campi richiesti prima di procedere.', {variant: 'error'})
        } else {
            props.setStep(props.step + 1);
            props.setPreviousStep(props.step);
            props.setSubmitButton(true);
        }
    }


    const previous = () => {
        props.setIsValid(true);
        props.setStep(props.step - 1);
        props.setPreviousStep(props.step)
        props.setSubmitButton(false);
    }
    const reset = () => {
        setRequestState(props.request)
        props.setStep(0);
        props.setPreviousStep(5)
        props.setSubmitButton(false);
    }

    return (
        <Container sx={{width: '100%'}}>
            {props.step === 0 &&
                <Box className='FixedContainetr'>
                    <Progressbar previousStep={props.previousStep} step={props.step} initStyle='fifty%'/>
                    <FormGroup sx={{alignItems: 'center', position: 'relative', width: '100%'}}>
                        <Tooltip arrow TransitionComponent={Zoom} title="Reset input parameters" className='reset'
                                 placement="bottom">
                            <IconButton onClick={reset}><CancelIcon></CancelIcon> </IconButton></Tooltip>
                        <Typography className='dtTextFixed' sx={{fontSize: '1em'}}>
                            Set the <b>random seed</b> for your experiment</Typography>

                        <TextField type='number' variant="outlined" label="Random seed" required
                                   sx={{mt: 2, fontSize: 'var(--joy-fontSize-sm)'}} value={requestState.random_seed}
                                   onChange={(event) => setRequestState({
                                       ...requestState,
                                       random_seed: event.target.value
                                   })}/>

                        <Typography sx={{fontSize: '1em'}} className='dtTextFixed'>
                            Check to <b>binarize</b> the ratings of your dataset</Typography>

                        <FormControlLabel control={<Checkbox className='Checkbox' sx={{
                            '&.Mui-checked': {
                                color: '#297cb5',
                            },
                        }}/>} label="Dataset binarization" checked={requestState.binarize}
                                          onChange={(event) => setRequestState({
                                              ...requestState,
                                              binarize: event.target.checked
                                          })}/>

                        <div className='bttContainer'>
                            <Button sx={{position: 'absolute', right: '-10px'}} type='button' className='next'
                                    variant='contained' onClick={next}>
                                <Typography sx={{
                                    display: {xs: "none", md: 'inline'},
                                    fontFamily: '"Arial Black", Gadget, sans-serif;',
                                    textAlign: 'center'
                                }}>Next</Typography>
                                <NavigateNextIcon></NavigateNextIcon> </Button>
                        </div>
                    </FormGroup>
                </Box>
            }


            {props.step === 1 &&
                <Box className='FixedContainetr'>
                    <Typography
                        sx={{
                            fontFamily: "'Merriweather', serif;",
                            textAlign: 'center',
                            fontWeight: '300',
                            fontSize: '2em',
                            mb: 2,
                            position: 'relative',
                            top: '-40px'
                        }}>
                        Fidex strategy</Typography>
                    <Progressbar previousStep={props.previousStep} step={props.step} initStyle='fifty%'/>
                    <FormGroup sx={{
                        alignItems: 'center',
                        position: 'relative',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                    }}>
                        <Tooltip arrow TransitionComponent={Zoom} title="Reset input parameters" className='reset'
                                 placement="bottom">
                            <IconButton onClick={reset}><CancelIcon></CancelIcon> </IconButton></Tooltip>
                        <FixedFile ListFile={props.ListFile} handleChangeListFile={props.handleChangeListFile}
                                   requestState={requestState} setIsValid={setIsValid}></FixedFile>

                        <div className='bttContainer'>
                            <Button sx={{position: 'absolute', left: {xs: "-20px", sm: '-10px'}, bottom: '-50px'}}
                                    type='button' className='previous' variant='contained' onClick={previous}>
                                <NavigateBeforeIcon></NavigateBeforeIcon>
                                <Typography sx={{
                                    display: {xs: "none", md: 'inline'},
                                    fontFamily: '"Arial Black", Gadget, sans-serif;',
                                    textAlign: 'center',
                                }}>Previous</Typography>
                            </Button>
                        </div>
                    </FormGroup>

                </Box>
            }

            {props.step === 5 &&
                <Form/>
            }

        </Container>
    )
}


export default FixedForm;
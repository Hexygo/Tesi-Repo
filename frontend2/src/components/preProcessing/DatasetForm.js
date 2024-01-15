import React, {useState, useEffect} from 'react';
import Progressbar from '../Progressbar.js';
import '../../styles/preProcessing/DataSetForm.css'
import Form from './Form.js';
import {IconButton} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import Zoom from '@mui/material/Zoom';
import {enqueueSnackbar} from 'notistack'


import {
    Box,
    Button,
    Checkbox,
    Container,
    FormControlLabel,
    FormGroup,
    TextField,
    Typography,
    Tooltip
} from '@mui/material';
import PreFiltering from './PreFiltering.js';
import TestSplitting from './TestSplitting.js';
import ValidationSplitting from './ValidationSplitting.js';
import DatasetFile from "./DatasetFile";

function DatasetForm(props) {
    const isValid = props.isValid;
    const setIsValid = props.setIsValid;
    const requestState = props.requestState;
    const setRequestState = props.setRequestState;
    const step = props.step;
    const [StringAllert, setStringAllert] = useState('Fill in all the required fields before proceeding.');

    useEffect(() => {
        if (requestState.random_seed) {
            setIsValid(true);
        } else {
            setIsValid(false);
        }
    }, [requestState.random_seed]);

    const next = () => {
        if (!isValid) {
            enqueueSnackbar(StringAllert, {variant: 'error'})
        } else {
            props.setStep(props.step + 1);
            props.setPreviousStep(props.step)
            if (props.step === 3) {
                props.setSubmitButton(true)
            }
        }
    }

    const previous = () => {
        props.setStep(props.step - 1);
        props.setPreviousStep(props.step)
        props.setSubmitButton(false);
        setIsValid(true)
    }

    const reset = () => {
        props.setStep(0);
        props.setPreviousStep(5)
        setRequestState(props.request)
        props.setSubmitButton(false);
    }
    return (
        <Container sx={{width: '100%'}}>
            {step === 0 &&
                <Box className='DatasetContainetr'>
                    <Progressbar previousStep={props.previousStep} step={props.step} initStyle='twenty%'/>
                    <FormGroup sx={{alignItems: 'center', position: 'relative', width: '100%'}}>
                        <Tooltip arrow TransitionComponent={Zoom} title="Reset input parameters" className='reset'
                                 placement="bottom">
                            <IconButton onClick={reset}><CancelIcon></CancelIcon> </IconButton></Tooltip>
                        <Typography className='dtText' sx={{fontSize: '1em'}}>

                            Set the <b>random seed</b> for your experiment</Typography>

                        <TextField type="number" variant="outlined" label="Random seed" required
                                   sx={{mt: 2, fontSize: 'var(--joy-fontSize-sm)'}} value={requestState.random_seed}
                                   onChange={(event) => setRequestState({
                                       ...requestState,
                                       random_seed: event.target.value
                                   })}/>

                        <Typography sx={{fontSize: '1em'}} className='dtText'>
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


            {step === 1 &&
                <Box className='DatasetContainetr'>
                    <Progressbar previousStep={props.previousStep} step={props.step} initStyle='twenty%'/>
                    <FormGroup sx={{alignItems: 'center', position: 'relative', width: '100%'}}>
                        <Tooltip arrow TransitionComponent={Zoom} title="Reset input parameters" className='reset'
                                 placement="bottom">
                            <IconButton onClick={reset}><CancelIcon></CancelIcon> </IconButton></Tooltip>
                        <PreFiltering requestState={requestState} setRequestState={setRequestState}
                                      setIsValid={setIsValid} setStringAllert={setStringAllert}/>
                        <div className='bttContainer'>
                            <Button sx={{position: 'absolute', right: '-10px'}} type='button' className='next'
                                    variant='contained' onClick={next}>
                                <Typography sx={{
                                    display: {xs: "none", md: 'inline'},
                                    fontFamily: '"Arial Black", Gadget, sans-serif;',
                                    textAlign: 'center'
                                }}>Next</Typography>
                                <NavigateNextIcon></NavigateNextIcon> </Button>
                            <Button sx={{position: 'absolute', left: '-10px'}} type='button' className='previous'
                                    variant='contained' onClick={previous}>
                                <NavigateBeforeIcon></NavigateBeforeIcon>
                                <Typography sx={{
                                    display: {xs: "none", md: 'inline'},
                                    fontFamily: '"Arial Black", Gadget, sans-serif;',
                                    textAlign: 'center'
                                }}>Previous</Typography>
                            </Button>
                        </div>
                    </FormGroup>
                </Box>
            }


            {step === 2 &&
                <Box className='DatasetContainetr'>
                    <Progressbar previousStep={props.previousStep} step={props.step} initStyle='twenty%'/>
                    <FormGroup sx={{alignItems: 'center', position: 'relative', width: '100%'}}>
                        <Tooltip arrow TransitionComponent={Zoom} title="Reset input parameters" className='reset'
                                 placement="bottom">
                            <IconButton onClick={reset}><CancelIcon></CancelIcon> </IconButton></Tooltip>
                        <TestSplitting setStringAllert={setStringAllert} requestState={requestState}
                                       setRequestState={setRequestState} setIsValid={setIsValid}/>
                        <div className='bttContainer'>
                            <Button sx={{position: 'absolute', right: '-10px'}} type='button' className='next'
                                    variant='contained' onClick={next}>
                                <Typography sx={{
                                    display: {xs: "none", md: 'inline'},
                                    fontFamily: '"Arial Black", Gadget, sans-serif;',
                                    textAlign: 'center'
                                }}>Next</Typography>
                                <NavigateNextIcon></NavigateNextIcon> </Button>
                            <Button sx={{position: 'absolute', left: '-10px'}} type='button' className='previous'
                                    variant='contained' onClick={previous}>
                                <NavigateBeforeIcon></NavigateBeforeIcon>
                                <Typography sx={{
                                    display: {xs: "none", md: 'inline'},
                                    fontFamily: '"Arial Black", Gadget, sans-serif;',
                                    textAlign: 'center'
                                }}>Previous</Typography>
                            </Button>
                        </div>
                    </FormGroup>
                </Box>
            }


            {step === 3 &&
                <Box className='DatasetContainetr'>
                    <Progressbar previousStep={props.previousStep} step={props.step} initStyle='twenty%'/>
                    <FormGroup sx={{alignItems: 'center', position: 'relative', width: '100%'}}>
                        <Tooltip arrow TransitionComponent={Zoom} title="Reset input parameters" className='reset'
                                 placement="bottom">
                            <IconButton onClick={reset}><CancelIcon></CancelIcon> </IconButton></Tooltip>
                        <ValidationSplitting requestState={requestState} setRequestState={setRequestState}
                                             setIsValid={setIsValid}/>
                        <div className='bttContainer'>
                            <Button sx={{position: 'absolute', right: '-10px'}} type='button' className='next'
                                    variant='contained' onClick={next}>
                                <Typography sx={{
                                    display: {xs: "none", md: 'inline'},
                                    fontFamily: '"Arial Black", Gadget, sans-serif;',
                                    textAlign: 'center'
                                }}>Next</Typography>
                                <NavigateNextIcon></NavigateNextIcon> </Button>
                            <Button sx={{position: 'absolute', left: '-10px'}} type='button' className='previous'
                                    variant='contained' onClick={previous}>
                                <NavigateBeforeIcon></NavigateBeforeIcon>
                                <Typography sx={{
                                    display: {xs: "none", md: 'inline'},
                                    fontFamily: '"Arial Black", Gadget, sans-serif;',
                                    textAlign: 'center'
                                }}>Previous</Typography>
                            </Button>
                        </div>
                    </FormGroup>
                </Box>
            }

            {step === 4 &&
                <Box className='DatasetContainetr'>
                    <Progressbar previousStep={props.previousStep} step={props.step} initStyle='twenty%'/>
                    <FormGroup sx={{
                        alignItems: 'center',
                        position: 'relative',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '50px'
                    }}>
                        <Tooltip arrow TransitionComponent={Zoom} title="Reset input parameters" className='reset'
                                 placement="bottom">
                            <IconButton onClick={reset}><CancelIcon></CancelIcon> </IconButton></Tooltip>
                        <Typography sx={{fontSize: '1em'}} className='dtText'>Upload your <b>dataset
                            file</b> in <strong>.tsv</strong> format</Typography>
                        <DatasetFile requestState={requestState} isValid={isValid} setIsValid={setIsValid}
                                     handleChangeFile={props.handleChangeFile} fileName={props.fileName}></DatasetFile>
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

            {step === 5 &&
                <Box>
                    <Form/>
                </Box>
            }

        </Container>
    )

}

export default DatasetForm;
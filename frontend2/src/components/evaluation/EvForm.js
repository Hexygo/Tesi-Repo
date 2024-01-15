import React, {useState, useEffect} from 'react';
import Progressbar from '../Progressbar.js'
import SimpleMetrics from './SimpleMetrics.js';
import ComplexMetrics from './ComplexMetrics.js';
import '../../styles/evaluation/EvForm.css';
import Cutoffs from './Cutoffs.js';
import Metrics from '../../json/Metrics.json';
import EvParameter from "./EvParameter";
import {
    Box,
    Button,
    Container,
    FormGroup,
    Typography,
    Tooltip, IconButton, useMediaQuery, useTheme
} from '@mui/material';
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Zoom from "@mui/material/Zoom";
import CancelIcon from "@mui/icons-material/Cancel";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LoadingButton from "@mui/lab/LoadingButton";
import objectToFormData from "../../objectToFormData";
import {enqueueSnackbar} from "notistack";

function EvForm({evStep, previousevStep, setPreviousevStep, setEvStep}) {

    const request = {
        top_k: 0,
        rev_tresh: 0,
        t_test: false,
        wilcoxon: false,
        cutoffs: [],
        train_dataset: undefined,
        test_dataset: undefined,
        recs_dataset: undefined,

        fairness: {}

    }
    const trainDatasetRef = React.useRef();
    const testDatasetRef = React.useRef();
    const recsDatasetRef = React.useRef();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('md'));
    const [requestState, setRequestState] = useState(request);
    const [ListFile, setListFile] = useState({});
    const [loading, setLoading] = useState(false)
    const [isValid, setIsValid] = useState(true);
    const [StringAllert, setStringAllert] = useState('');
    const [fairCheck, setFairCheck] = useState({});


    useEffect(() => {
        setStringAllert('Fill in all the required fields before proceeding.')
        if (requestState.recs_dataset && requestState.train_dataset && requestState.test_dataset) {
            setIsValid(true);
        } else {
            setIsValid(false);
        }

    }, [requestState.recs_dataset, requestState.train_dataset, requestState.test_dataset])


    const handleChangeListFile = (e) => {
        const selectedFile = e.target.files[0];
            setListFile(ListFile => ({...ListFile, [e.target.name]: selectedFile?.name}));
            setRequestState((prevRequestState) => ({...prevRequestState, [e.target.name]: selectedFile}));
            // setRequestState(prevRequestState => {
            //   let updatedFiles = { ...prevRequestState.file, [e.target.name]: selectedFile };
            //   return   {...prevRequestState, file: updatedFiles}});
            // console.log(requestState)
            // const fileReader = new FileReader();
            // fileReader.readAsText(e.target.files[0], "UTF-8");
            // fileReader.onload = e => {
            //    setRequestState(requestState => ({...requestState, file: e.target.result}));
            // };
    };


    const handleStart = () => {
        setPreviousevStep(evStep);
        setEvStep(evStep + 1);
        setRequestState(request);
    }
    const next = () => {
        if (isValid) {
            setPreviousevStep(evStep)
            setEvStep(evStep + 1);
        } else {
            enqueueSnackbar(StringAllert, {variant: 'error'})
        }
    }

    const previous = () => {
        setIsValid(true);
        setPreviousevStep(evStep)
        setEvStep(evStep - 1);
    }

    const reset = () => {
        if (evStep === 0) {
            trainDatasetRef.current.value = null;
            testDatasetRef.current.value = null;
            recsDatasetRef.current.value = null;

        }
        setEvStep(0);
        setPreviousevStep(0)
        setRequestState(request)

    }
    const FormSubmit = (e) => {
        e.preventDefault()
        setLoading(true);
        const formData = objectToFormData(requestState)
        fetch("http://127.0.0.1:5000/api/v1/recommendationmodel-json", {
            method: 'POST',
            body: formData
        }).then(res => res.json())
            .then(j => {
                setLoading(false);
            }).catch(e => {
            setLoading(false);
            enqueueSnackbar('An error occurred.', {variant: 'error'})
        })
    }


    return (
        <Container sx={{
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
            flexDirection: 'column',
            gap: '30px',
            mb: '80px',
            mt: '40px',
            p: '40px',
            borderRadius: '25px',
            boxShadow: (evStep !== -1) ? 'rgba(105, 165, 196, 0.5) 0 1px 30px' : 'none',
        }}>

            {evStep === (-1) &&
                <Box sx={{display: 'flex', flexDirection: 'column', gap: '30px'}}>
                    <Typography
                        sx={{
                            fontFamily: "'Merriweather', serif;",
                            textAlign: 'center',
                            fontWeight: 'bold',
                            mt: 5, mb: 5,
                            fontSize: '2.3em'

                        }}
                    > Evaluation</Typography>

                    <Typography className='textEv'
                                sx={{textAlign: 'center',}}>
                        <strong>Use this tool to setup evaluation configuration and simple/complex
                            metrics </strong><br/>
                        You can choose from 36 rating metrics, divided into seven families: accuracy, rating error,
                        coverage, novelty, diversity, bias and fairness.

                    </Typography>

                    <Box sx={{textAlign: 'center'}}>
                        <Button type='button' variant='contained' size='large' onClick={handleStart}
                                className='startEV'> start </Button>
                    </Box>
                </Box>
            }


            <form action='' method='POST' encType="multipart/form-data" id='evForm'>
                {evStep === 0 &&
                    <Box className='EvContainetr' sx={{pl: {xs: '0', sm: '30px'}, pr: {xs: '0', sm: '30px'}}}>
                        <Typography
                            sx={{
                                fontFamily: "'Merriweather', serif;",
                                textAlign: 'center',
                                fontWeight: 'bold',
                                mt: 5, mb: 5,
                                fontSize: '2.5em'

                            }}>Evaluation</Typography>

                        <Progressbar step={evStep} previousStep={previousevStep} initStyle='twenty%'/>
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
                            <Typography className='dtTextEv' sx={{mt: 4}}>Input <strong>Train</strong> dataset
                                in <strong>.tsv</strong> format</Typography>
                            <input ref={trainDatasetRef} type="file" name="train_dataset" id="train_dataset"
                                   className='File' accept=".tsv" label="Select a .tsv file"
                                   onChange={handleChangeListFile} required/>
                            <label htmlFor="train_dataset" className='labelStyle'> <UploadFileIcon
                                sx={{pt: '2px'}}></UploadFileIcon>{requestState.train_dataset ? ListFile.train_dataset : 'Select a .tsv file'}
                            </label>


                            <Typography className='dtTextEv'>Input <strong>Test</strong> dataset
                                in <strong>.tsv</strong> format</Typography>
                            <input type="file" ref={testDatasetRef} name="test_dataset" id="test_dataset"
                                   className='File' accept=".tsv" label="Select a .tsv file"
                                   onChange={handleChangeListFile} required/>
                            <label htmlFor="test_dataset" className='labelStyle'> <UploadFileIcon
                                sx={{pt: '2px'}}></UploadFileIcon>{requestState.test_dataset ? ListFile.test_dataset : 'Select a .tsv file'}
                            </label>


                            <Typography className='dtTextEv'>Input <strong>Recs</strong> dataset
                                in <strong>.tsv</strong> format</Typography>
                            <input ref={recsDatasetRef} type="file" name="recs_dataset" id="recs_dataset"
                                   className='File' accept=".tsv" label="Select a .tsv file"
                                   onChange={handleChangeListFile} required/>
                            <label htmlFor="recs_dataset" className='labelStyle'> <UploadFileIcon
                                sx={{pt: '2px'}}></UploadFileIcon>{requestState.recs_dataset ? ListFile.recs_dataset : 'Select a .tsv file'}
                            </label>

                            <Box sx={{textAlign: 'center', mb: 4}}>
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
                            </Box>
                        </FormGroup>
                    </Box>
                }


                {evStep === 1 &&
                    <Box className='EvContainetr' sx={{pl: {xs: '0', sm: '30px'}, pr: {xs: '0', sm: '30px'}}}>
                        <Typography
                            sx={{
                                fontFamily: "'Merriweather', serif;",
                                textAlign: 'center',
                                fontWeight: 'bold',
                                mt: 5, mb: 5,
                                fontSize: '2.5em'

                            }}>Evaluation</Typography>
                        <Progressbar step={evStep} previousStep={previousevStep} initStyle='twenty%'/>
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
                            <EvParameter setStringAllert={setStringAllert} setIsValid={setIsValid} reset={reset}
                                         next={next} previous={previous} requestState={requestState}
                                         setRequestState={setRequestState}></EvParameter>
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
                {evStep === 2 &&
                    <Box className='EvContainetr' sx={{pl: {xs: '0', sm: '30px'}, pr: {xs: '0', sm: '30px'}}}>
                        <Typography sx={{
                            fontFamily: "'Merriweather', serif;",
                            textAlign: 'center',
                            fontWeight: 'bold',
                            mt: 5, mb: 5,
                            fontSize: '2.5em'

                        }}
                        >Cutoffs</Typography>
                        <Progressbar step={evStep} previousStep={previousevStep} initStyle='twenty%'/>
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
                            <Cutoffs setStringAllert={setStringAllert} setIsValid={setIsValid}
                                     requestState={requestState} setRequestState={setRequestState}/>
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
                {evStep === 3 &&
                    <Box className='EvContainetr' sx={{pl: {xs: '0', sm: '30px'}, pr: {xs: '0', sm: '30px'}}}>
                        <Typography sx={{
                            fontFamily: "'Merriweather', serif;",
                            textAlign: 'center',
                            fontWeight: 'bold',
                            mt: 5, mb: 5,
                            fontSize: '2.5em'

                        }}> Simple Metrics </Typography>
                        <Progressbar step={evStep} previousStep={previousevStep} initStyle='twenty%'/>
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
                            <SimpleMetrics setIsValid={setIsValid} Metrics={Metrics} requestState={requestState}
                                           setRequestState={setRequestState}/>

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
                {evStep === 4 &&
                    <Box className='EvContainetr' sx={{pl: {xs: '0', sm: '30px'}, pr: {xs: '0', sm: '30px'}}}>
                        <Typography
                            sx={{
                                fontFamily: "'Merriweather', serif;",
                                textAlign: 'center',
                                fontWeight: 'bold',
                                mt: 5, mb: 5,
                                fontSize: '2.5em'

                            }}>Complex Metrics</Typography>
                        <Progressbar step={evStep} previousStep={previousevStep} initStyle='twenty%'/>
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
                            <ComplexMetrics setIsValid={setIsValid} Metrics={Metrics} requestState={requestState}
                                            setRequestState={setRequestState} fairCheck={fairCheck}
                                            setFairCheck={setFairCheck} handleChangeListFile={handleChangeListFile} ListFile={ListFile} setListFile={setListFile}/>

                            <div className='bttContainer'>
                                <Button sx={{position: 'absolute', left: '-10px', bottom: '-55px'}} type='button'
                                        className='previous' variant='contained' onClick={previous}>
                                    <NavigateBeforeIcon></NavigateBeforeIcon>
                                    <Typography sx={{
                                        display: {xs: "none", md: 'inline'},
                                        fontFamily: '"Arial Black", Gadget, sans-serif;',
                                        textAlign: 'center'
                                    }}>Previous</Typography>
                                </Button>
                            </div>

                        </FormGroup>
                        <Box sx={{textAlign: 'center'}}>
                            <LoadingButton loading={loading} type='submit' value='Evaluate' className='runData'
                                           onClick={FormSubmit} sx={{fontSize: {xs: "13px", sm: '15px'}}}
                                           disabled={!isValid}
                                           varinat='outline'>
                                {!matches ? 'Evaluate with this options' : 'Evaluate'}
                            </LoadingButton>
                        </Box>


                    </Box>
                }
            </form>
        </Container>
    )
}

export default EvForm;
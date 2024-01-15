import React, {useEffect, useState} from 'react';
import AddForm from './AddForm.js';
import '../../styles/recommendation/RecForm.css';
import {
    Button,
    Container,
    Typography,
    Box,
    Stack,
    FormGroup,
    FormControlLabel,
    Checkbox, TextField,
} from '@mui/material';
import Models from '../../json/result.json';
import objectToFormData from "../../objectToFormData";
import Results from "../Results";
import LoadingButton from "@mui/lab/LoadingButton";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {enqueueSnackbar} from "notistack";


function RecForm() {

    const request = {
        top_k: false,
        top_k_value: undefined,
        models: undefined,
        train_file: undefined,
        test_file: undefined,
    }


    const [forms, setForms] = useState([]);
    const [formNumb, setFormNumb] = useState(0);
    const [trainFile, setTrainFile] = useState()
    const [testFile, setTestFile] = useState()
    const [loading, setLoading] = useState(false)
    const [downloadLink, setDownloadLink] = useState()
    const KNOWN_KEYS = ["id", "modelClass", "loading_model"];
    const [requestState, setRequestState] = useState(request);

    const filterKey = (obj, keysToKeep) => {
        return Object.keys(obj).filter((key) => keysToKeep.includes(key)).reduce((ObjAcc, key) => {
            ObjAcc[key] = obj[key];
            return ObjAcc;
        }, {})
    }


    useEffect(() => {
        setRequestState((preRequestState) => ({...preRequestState, models: forms}));
    }, [forms])


    const addModel = () => {
        setFormNumb(formNumb + 1);
        setForms([...forms, {id: formNumb, modelClass: null, loading_model: null}]);

    }
    const removeModel = (id) => {
        setForms(
            forms.filter(
                (form) => id !== form.id
            ));
    };

    const setModelClass = (id, selectedClass) => {
        setForms(
            forms.map((form) => id !== form.id ? form : {
                ...filterKey(form, KNOWN_KEYS),
                modelClass: selectedClass,
                loading_model: null
            })
        );
    }

    const setModel = (id, selectedModel) => {
        setForms(
            forms.map((form) => id !== form.id ? form : {...filterKey(form, KNOWN_KEYS), loading_model: selectedModel})
        );
    }

    const setParameter = (id, parameter, value) => {
        setForms(prevState =>
            prevState.map(form =>
                id !== form.id ? form : {...form, [parameter]: value}
            )
        );
    }
    const handleChange = (e) => {
        setRequestState((requestState) => ({...requestState, top_k_value: e.target.value}))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        const formData = objectToFormData({...requestState, models: JSON.stringify(forms)})
        fetch('http://127.0.0.1:5000/api/v1/recommendationmodel-json', {
            method: 'POST',
            body: formData
        }).then(res => res.json())
            .then(j => {
                setLoading(false)
                setDownloadLink('http://127.0.0.1:5000/api/v1/recommendationmodel/download/' + j)
            }).catch(e => {
                setLoading(false);
                enqueueSnackbar('An error occurred.', {variant: 'error'})
            }
        )
    }


    return (
        <div>                          {downloadLink &&
            <Results url={downloadLink} removeDownloadLink={() => setDownloadLink()}/>}


            <Container>
                <Typography sx={{
                    textAlign: 'center',
                    mt: 4,
                    fontSize: '1.05em',
                    fontFamily: "'Montserrat', sans-serif;"
                }}><strong>Use this tool to train one or more recommendation
                    models on your data.</strong></Typography>
                <Typography sx={{textAlign: 'center', fontSize: '1.05em', fontFamily: "'Montserrat', sans-serif;"}}>Add
                    one or more recommendation models with the button below, then
                    adjust their parameters.</Typography>

                <form method='POST' encType="multipart/form-data" id='recForm'>

                    <Box sx={{textAlign: 'center', mt: 5}}>
                        <Typography className='textR'>Select your <b>training set</b> in <b>.tsv</b> format</Typography>
                        <input type="file" name="train_file" id="train_file" className='File' accept=".tsv"
                               label="Select a .tsv file" onChange={e => {
                            setTrainFile(e.target.files[0].name);
                            setRequestState(requestState => ({...requestState, train_file: e.target.files[0]}));
                        }}/>
                        <label htmlFor="train_file" className='labelStyle'> <UploadFileIcon
                            sx={{pt: '2px'}}></UploadFileIcon>{requestState.train_file ? trainFile : 'Select a .tsv file'}
                        </label>

                        <Typography className='textR' sx={{mt: 3}}>Select your <b>test
                            set</b> in <b>.tsv</b> format</Typography>
                        <input type="file" name="test_file" id="test_file" className='File' accept=".tsv"
                               label="Select a .tsv file" required onChange={e => {
                            setTestFile(e.target.files[0].name);
                            setRequestState(requestState => ({...requestState, test_file: e.target.files[0]}));
                        }}/>
                        <label htmlFor="test_file" className='labelStyle'> <UploadFileIcon
                            sx={{pt: '2px'}}></UploadFileIcon>{requestState.test_file ? testFile : 'Select a .tsv file'}
                        </label>

                    </Box>

                    <Box sx={{mt: 1}}>
                        <FormGroup sx={{alignItems: 'center'}}>
                            <FormControlLabel label="Use top-k" control={<Checkbox/>} onChange={() => {
                                setRequestState(requestState => ({...requestState, top_k: !requestState.top_k}));
                            }}/>
                            {requestState.top_k ? (
                                <TextField onChange={handleChange} size="small" type="number" label="Value for k"/>
                            ) : (<></>)}
                        </FormGroup>
                    </Box>

                    <Box sx={{textAlign: 'center', mt: 3, width: '100%'}}>
                        <Button className='addModel' type='button' variant='contained' onClick={addModel}>Add
                            Model</Button></Box>

                    <Stack direction="row" flexWrap="wrap" alignItems="flex-start" sx={{mt: 5}}>
                        {forms.map((form, index) => {
                            return (
                                <AddForm key={index} Models={Models} {...form} removeModel={removeModel}
                                         setModelClass={setModelClass}
                                         setModel={setModel} setParameter={setParameter}/>
                            );

                        })}
                    </Stack>

                    <Box sx={{textAlign: 'center'}}>
                        <LoadingButton type='submit' loading={loading} className='TrainModels'
                                       onClick={handleSubmit} sx={{fontSize: '15px'}}
                                       varinat='outline'>
                            Train models
                        </LoadingButton>

                    </Box>
                </form>

            </Container>

        </div>
    );
}

export default RecForm;
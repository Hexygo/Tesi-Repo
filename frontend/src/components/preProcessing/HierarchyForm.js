import React, { useEffect} from 'react';
import '../../styles/preProcessing/HierarchyForm.css';

import {
    Container,
    Box,
    FormGroup,
    Typography,
    IconButton,
    Tooltip, TextField
} from '@mui/material';
import Form from './Form.js';
import Progressbar from '../Progressbar';
import Zoom from "@mui/material/Zoom";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CancelIcon from "@mui/icons-material/Cancel";

function HierarchyForm(props) {


    const requestState = props.requestState;
    const setRequestState = props.setRequestState;
    const setIsValid = props.setIsValid;

    const reset = () => {
        props.setStep(0);
        props.setPreviousStep(5)
        setRequestState(props.request)
        props.setSubmitButton(false);
    }
    useEffect(() => {
        if (requestState.random_seed && requestState.file) {
            setIsValid(true);
        } else {
            setIsValid(false);
        }
    }, [requestState.random_seed, requestState.file]);
    return (
        <Container sx={{mt: 5}}>

            {props.step === 0 &&
                <Box sx={{textAlign: 'center'}}>
                    <Progressbar step={props.step} initStyle='one%'/>
                    <FormGroup sx={{alignItems: 'center', position: 'relative', width: '100%', mb: '20px'}}>
                        <Tooltip arrow TransitionComponent={Zoom} title="Reset input parameters" className='reset'
                                 placement="bottom">
                            <IconButton onClick={reset}><CancelIcon></CancelIcon> </IconButton></Tooltip>
                        <Typography className='dtText' sx={{fontSize: '1em'}}>

                            Set the <b>random seed</b> for your experiment</Typography>

                        <TextField type='number' variant="outlined" label="Random seed" required
                                   sx={{mt: 2, fontSize: 'var(--joy-fontSize-sm)'}} value={requestState.random_seed}
                                   onChange={(event) => setRequestState({
                                       ...requestState,
                                       random_seed: event.target.value
                                   })}/>
                        <Typography sx={{fontSize: '1em', mb: '5px'}} className='dtText'>Input files of a root
                            folder <strong>(in .zip)</strong> for a hierarchy strategy</Typography>
                        <input type="file" name="hier_folder" id="hier_folder" accept='application/zip'
                               label="Select a .zip file" required onChange={props.handleChangeFile}/>
                        <label htmlFor="hier_folder" className='labelStyle'> <UploadFileIcon
                            sx={{pt: '2px'}}></UploadFileIcon>{props.fileName ? props.fileName : 'Select a .zip file'}
                        </label>
                    </FormGroup>
                </Box>
            }

            {props.step === 5 &&
                <Form/>
            }

        </Container>

    )

}

export default HierarchyForm;
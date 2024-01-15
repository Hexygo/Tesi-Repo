import UploadFileIcon from "@mui/icons-material/UploadFile";
import React, {useEffect} from "react";
import {Typography} from "@mui/material";

function FixedFile(props) {

    useEffect(() => {
        if (props.requestState.validation_file && props.requestState.file && props.requestState.test_file) {
            props.setIsValid(true);
        } else {
            props.setIsValid(false);
        }
    }, [props.requestState.file, props.requestState.validation_file, props.requestState.test_file]);

    return (
        <>
            <Typography
                sx={{fontSize: '1em', fontFamily: "'Montserrat', sans-serif;", textAlign: 'center', marginTop: '40px'}}>
                Input <strong>Train</strong> dataset in <strong>.tsv</strong> format</Typography>
            <input type="file" name="train_file" id="train_file" className='File' accept=".tsv"
                   label="Select a .tsv file" onChange={props.handleChangeListFile}/>
            <label htmlFor="train_file" className='labelStyle'> <UploadFileIcon
                sx={{pt: '2px'}}></UploadFileIcon>{props.ListFile['train_file'] ? props.ListFile['train_file'] : 'Select a .tsv file'}
            </label>

            <Typography sx={{fontSize: '1em'}} className='dtTextFixed'>
                Input <strong>Validation</strong> dataset in <strong>.tsv</strong> format </Typography>
            <input type="file" name="validation_file" id="validation_file" className='File' accept=".tsv"
                   label="Select a .tsv file" required onChange={props.handleChangeListFile}/>
            <label htmlFor="validation_file" className='labelStyle'> <UploadFileIcon
                sx={{pt: '2px'}}></UploadFileIcon>{props.ListFile['validation_file'] ? props.ListFile['validation_file'] : 'Select a .tsv file'}
            </label>

            <Typography sx={{fontSize: '1em'}} className='dtTextFixed'>
                Input <strong>Test</strong> dataset in <strong>.tsv</strong> format</Typography>
            <input type="file" name="test_file" id="test_file" className='File' accept=".tsv" label="Select a .tsv file"
                   required onChange={props.handleChangeListFile}/>
            <label htmlFor="test_file" className='labelStyle'> <UploadFileIcon
                sx={{pt: '2px'}}></UploadFileIcon>{props.ListFile['test_file'] ? props.ListFile['test_file'] : 'Select a .tsv file'}
            </label>
        </>
    )
}

export default FixedFile;
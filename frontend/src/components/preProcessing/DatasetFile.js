import UploadFileIcon from "@mui/icons-material/UploadFile";
import React, {useEffect} from "react";

function DatasetFile(props) {
    useEffect(() => {
        if (props.requestState.file) {
            props.setIsValid(true);
        } else {
            props.setIsValid(false);
        }
    }, [props.requestState.file]);

    return (<>
        <input type="file" name="dataset_file" id="dataset_file" accept=".tsv" label="Select a .tsv file" required
               onChange={props.handleChangeFile}/>
        <label htmlFor="dataset_file" className='labelStyle'> <UploadFileIcon
            sx={{pt: '2px'}}></UploadFileIcon>{props.fileName ? props.fileName : 'Select a .tsv file'}  </label>
    </>)
}

export default DatasetFile;
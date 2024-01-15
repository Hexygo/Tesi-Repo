import {
    Box,
    Container,
    FormGroup,
    Typography,
    Checkbox,
    FormControlLabel,
    TextField, IconButton, ListItem
} from '@mui/material';
import React, {useEffect} from 'react';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import UploadFileIcon from "@mui/icons-material/UploadFile";
import "../../styles/evaluation/ComplexMetrics.css"

function ComplexMetrics(props) {


    const requestState = props.requestState;
    const setRequestState = props.setRequestState;
    const setFairCheck = props.setFairCheck;
    const fairCheck = props.fairCheck;

    useEffect(() => {
        setRequestState((prevRequestState) => ({...prevRequestState, fairness: fairCheck}));
    }, [fairCheck])

    useEffect(() => {
        validateFields();
    }, [props.requestState])
    const validateFields = () => {
        let valid = true;
        for (let metric of props.Metrics) {
            for (let complex_metric of metric.complex_metrics) {
                if (fairCheck[complex_metric.id]) {
                    for (let param of complex_metric.parameters) {
                        let parameters = `${param}_${complex_metric.id}`;
                        if (!fairCheck[parameters] || fairCheck[parameters] === '') {
                            valid = false;
                            break;
                        }

                    }
                }
                if (requestState[complex_metric.id]) {
                    for (let param of complex_metric.parameters) {
                        let parameters = `${param}_${complex_metric.id}`;
                        if (!requestState[parameters] || requestState[parameters] === '') {
                            valid = false;
                            break;
                        }

                    }

                }
            }

        }
        props.setIsValid(valid);

    }
    const handleChangeListFile = (e) => {
        const selectedFile = e.target.files[0];
            props.setListFile((prevListFile) => ({...prevListFile, [e.target.name]:selectedFile?.name }));
            setFairCheck((prevFairCheck) => ({...prevFairCheck, [e.target.name]: selectedFile}));
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

return (
    <Container>
        <Box className='optionWrapper'>
            {props.Metrics.map((el, i) =>
                    el.complex_metrics.length > 0 && <React.Fragment key={i}>
                        <ListItem className='TitContainer'
                                  sx={{ml: 4, mt: 4, '&:hover .showOnHover': {opacity: 1, cursor: 'pointer'}}}>
                            <Typography variant='h5'>{el.id}</Typography>
                            <IconButton sx={{opacity: 0}} href={'https://elliot.readthedocs.io/en/v0.3.1/guide/' + el.url}>
                                <AttachFileIcon fontSize='small'/>
                            </IconButton>
                        </ListItem>
                        <Box sx={{ml: 2, mb: 2}}>
                            {el.complex_metrics.map((metrics, index) =>
                                <React.Fragment key={index}>

                                    <FormControlLabel key={index} control={<Checkbox/>} label={metrics.id}
                                                      className='clustCheck'
                                                      checked={el.id === 'Fairness' ? fairCheck?.[metrics.id] || false : requestState[metrics.id] || false}
                                                      onChange={(event) => el.id === 'Fairness' ? setFairCheck({
                                                          ...fairCheck,
                                                          [metrics.id]: event.target.checked
                                                      }) : setRequestState({
                                                          ...requestState,
                                                          [metrics.id]: event.target.checked
                                                      })}/>

                                    <FormGroup>
                                        {
                                            metrics.parameters.length > 0 && (fairCheck?.[metrics.id] || requestState?.[metrics.id]) && metrics.parameters.map((param, k) => {
                                                if (param.includes('file')) {
                                                    return (
                                                        <React.Fragment key={k}>
                                                            <Typography sx={{mt: 1}}> {metrics.id} clustering file</Typography>
                                                            <input type="file" name={`${param}_${metrics.id}`}
                                                                   id={`${param}_${metrics.id}`} className='File'
                                                                   label="Select a file" onChange={handleChangeListFile}/>
                                                            <label htmlFor={`${param}_${metrics.id}`} className='labelStyle'>
                                                                <UploadFileIcon
                                                                    sx={{pt: '2px'}}></UploadFileIcon>{fairCheck[`${param}_${metrics.id}`] ? props.ListFile[`${param}_${metrics.id}`] : 'Select a file'}
                                                            </label>
                                                        </React.Fragment>)
                                                } else if (param.includes('clustering')) {
                                                    return (<TextField key={k} sx={{maxWidth: '230px', mt: 1}} type='text'
                                                                       label={` ${param}_${metrics.id}`} required
                                                                       value={fairCheck[`${param}_${metrics.id}`] || ''}
                                                                       onChange={(event) => setFairCheck({
                                                                           ...fairCheck,
                                                                           [`${param}_${metrics.id}`]: event.target.value
                                                                       })}/>)

                                                } else {
                                                    return (<TextField key={k} sx={{maxWidth: '230px', mt: 1}}
                                                                       type={param.includes('beta') ? 'number' : 'text'}
                                                                       label={param} required
                                                                       value={requestState[`${param}_${metrics.id}`] || ''}
                                                                       onChange={(event) => setRequestState({
                                                                           ...requestState,
                                                                           [`${param}_${metrics.id}`]: event.target.value
                                                                       })}/>)
                                                }


                                            })
                                        }
                                    </FormGroup>
                                </React.Fragment>
                            )

                            }

                        </Box>

                    </React.Fragment>
            )
            }


        </Box>
    </Container>
);
}

export default ComplexMetrics;
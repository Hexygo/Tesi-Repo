import React, {useEffect} from 'react';
import {
    Box,
    FormControlLabel,
    FormGroup,
    Container,
    Typography,
    TextField,
    Radio
} from '@mui/material';


function ValidationSplitting({requestState, setRequestState, setIsValid}) {
    useEffect(() => {
        let valid = true;
        if (requestState.validation_fixed_timestamp && !requestState.validation_fixed_timestamp_value) {
            valid = false;
        }
        if (requestState.validation_temporal_hold_out && (!requestState.validation_temporal_hold_out_leave_n_out && !requestState.validation_temporal_hold_out_test_ratio)) {
            valid = false;
        }

        if (requestState.validation_random_subsampling && !requestState.validation_random_subsampling_test_ratio) {
            valid = false;

        }
        if (requestState.validation_random_cross_validation && !requestState.validation_random_cross_validation_folds) {
            valid = false;

        }
        setIsValid(valid);
    }, [requestState.validation_fixed_timestamp, requestState.validation_fixed_timestamp_value, requestState.validation_temporal_hold_out, requestState.validation_temporal_hold_out_leave_n_out, requestState.validation_temporal_hold_out_test_ratio, requestState.validation_random_subsampling, requestState.validation_random_subsampling_test_ratio, requestState.validation_random_cross_validation, requestState.validation_random_cross_validation_folds])
    const handleRadioChange = (event) => {
        const {value} = event.target;

        const newState = {
            validation_fixed_timestamp: false,
            validation_temporal_hold_out: false,
            validation_random_subsampling: false,
            validation_random_cross_validation: false
        };

        newState[value] = true;

        setRequestState({
            ...requestState,
            ...newState
        });

    };
    return (
        <Container>
            <Typography
                className='dtText' sx={{fontSize: '1em'}}>
                Select the <b>validation splitting</b> strategy </Typography>

            <Box sx={{mt: 1}}>
                <FormGroup sx={{alignItems: 'center'}}>
                    <FormControlLabel label="Fixed Timestamp" control={<Radio
                        checked={requestState.validation_fixed_timestamp} value='validation_fixed_timestamp'
                        onChange={handleRadioChange}/>}/>
                    {requestState.validation_fixed_timestamp ? (
                        <TextField type="text" className='inputNumber' label="Timestamp (UNIX format or string)"
                                   size="small" sx={{mt: 1, mb: 2}}
                                   value={requestState.validation_fixed_timestamp_value}
                                   onChange={(event) => setRequestState({
                                       ...requestState,
                                       validation_fixed_timestamp_value: event.target.value
                                   })}/>
                    ) : (<></>)}
                </FormGroup>
            </Box>

            <Box sx={{}}>
                <FormGroup sx={{alignItems: 'center'}}>
                    <FormControlLabel label="Temporal Hold-Out" control={<Radio
                        checked={requestState.validation_temporal_hold_out} value='validation_temporal_hold_out'
                        onChange={handleRadioChange}/>}/>
                    {requestState.validation_temporal_hold_out ? (
                        <FormGroup>
                            <TextField type="number" className='inputNumber' size="small"
                                       label="Value of n for Leave n-out" sx={{mt: 1, mb: 2}}
                                       value={requestState.validation_temporal_hold_out_leave_n_out}
                                       disabled={!!requestState?.validation_temporal_hold_out_test_ratio}
                                       onChange={(event) => setRequestState({
                                           ...requestState,
                                           validation_temporal_hold_out_leave_n_out: event.target.value
                                       })}/>
                            <TextField type="number" className='inputNumber' size="small"
                                       label="(OR) Validation set ratio" sx={{mt: 1, mb: 2}}
                                       value={requestState.validation_temporal_hold_out_test_ratio}
                                       disabled={!!requestState?.validation_temporal_hold_out_leave_n_out}
                                       onChange={(event) => setRequestState({
                                           ...requestState,
                                           validation_temporal_hold_out_test_ratio: event.target.value
                                       })}/>
                        </FormGroup>) : (<></>)}
                </FormGroup>
            </Box>

            <Box sx={{}}>
                <FormGroup sx={{alignItems: 'center'}}>
                    <FormControlLabel label="Random Subsampling" control={<Radio
                        checked={requestState.validation_random_subsampling} value='validation_random_subsampling'
                        onChange={handleRadioChange}/>}/>
                    {requestState.validation_random_subsampling ? (
                        <TextField type="number" className='inputNumber' label="Validation set ratio" size="small"
                                   sx={{mt: 1, mb: 2}}
                                   value={requestState.validation_random_subsampling_test_ratio}
                                   onChange={(event) => setRequestState({
                                       ...requestState,
                                       validation_random_subsampling_test_ratio: event.target.value
                                   })}/>
                    ) : (<></>)}
                </FormGroup>
            </Box>

            <Box sx={{}}>
                <FormGroup sx={{alignItems: 'center'}}>
                    <FormControlLabel label="Random k-fold Cross Validation" control={<Radio
                        checked={requestState.validation_random_cross_validation}
                        value='validation_random_cross_validation' onChange={handleRadioChange}/>}/>
                    {requestState.validation_random_cross_validation ? (
                        <TextField type="number" className='inputNumber' size="small" label="Value of k"
                                   sx={{mt: 1, mb: 2}}
                                   value={requestState.validation_random_cross_validation_folds}
                                   onChange={(event) => setRequestState({
                                       ...requestState,
                                       validation_random_cross_validation_folds: event.target.value
                                   })}/>
                    ) : (<></>)}
                </FormGroup>
            </Box>

        </Container>
    );
}

export default ValidationSplitting;
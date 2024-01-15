import React, {useEffect} from 'react';
import {
    Box,
    Radio,
    FormControlLabel,
    FormGroup,
    Container,
    Typography,
    TextField
} from '@mui/material';


function TestSplitting({requestState, setRequestState, setIsValid, setStringAllert}) {
    const handleRadioChange = (event) => {
        const {value} = event.target;

        const newState = {
            test_fixed_timestamp: false,
            test_temporal_hold_out: false,
            test_random_subsampling: false,
            test_random_cross_validation: false
        };

        newState[value] = true;

        setRequestState({
            ...requestState,
            ...newState
        });

    };
    useEffect(() => {
        let valid = true;
        if (requestState.test_fixed_timestamp || requestState.test_temporal_hold_out || requestState.test_random_subsampling || requestState.test_random_cross_validation) {
            setStringAllert('Fill in all the required fields before proceeding.')
        } else {
            valid = false;
            setStringAllert('Please select at least one field before moving forward.');

        }
        if (requestState.test_fixed_timestamp && !requestState.test_fixed_timestamp_value) {
            valid = false;
        }
        if (requestState.test_temporal_hold_out && (!requestState.test_temporal_hold_out_leave_n_out && !requestState.test_temporal_hold_out_test_ratio)) {
            valid = false;
        }

        if (requestState.test_random_subsampling && !requestState.test_random_subsampling_test_ratio) {
            valid = false;

        }
        if (requestState.test_random_cross_validation && !requestState.test_random_cross_validation_folds) {
            valid = false;

        }

        setIsValid(valid);

    }, [requestState.test_fixed_timestamp, requestState.test_fixed_timestamp_value, requestState.test_temporal_hold_out, requestState.test_temporal_hold_out_leave_n_out, requestState.test_temporal_hold_out_test_ratio, requestState.test_random_subsampling, requestState.test_random_subsampling_test_ratio, requestState.test_random_cross_validation, requestState.test_random_cross_validation_folds])

    return (
        <Container>
            <Typography sx={{fontSize: '1em'}}
                        className='dtText'>
                Select the <b>test splitting</b> strategy </Typography>

            <Box sx={{mt: 1}}>
                <FormGroup sx={{alignItems: 'center'}}>
                    <FormControlLabel label="Fixed Timestamp" control={<Radio value='test_fixed_timestamp'
                                                                              checked={requestState.test_fixed_timestamp}
                                                                              onChange={handleRadioChange}/>}/>
                    {requestState.test_fixed_timestamp ? (
                        <TextField type="text" className='inputNumber' label="Timestamp (UNIX format or string)"
                                   size="small" sx={{mt: 1, mb: 2}}
                                   value={requestState.test_fixed_timestamp_value}
                                   onChange={(event) => setRequestState({
                                       ...requestState,
                                       test_fixed_timestamp_value: event.target.value
                                   })}/>
                    ) : (<></>)}
                </FormGroup>
            </Box>

            <Box sx={{}}>
                <FormGroup sx={{alignItems: 'center'}}>
                    <FormControlLabel label="Temporal Hold-Out" control={<Radio
                        checked={requestState.test_temporal_hold_out} value='test_temporal_hold_out'
                        onChange={handleRadioChange}/>}/>
                    {requestState.test_temporal_hold_out ? (
                        <FormGroup>
                            <TextField type="number" className='inputNumber' size="small"
                                       label="Value of n for Leave n-out" sx={{mt: 1, mb: 2}}
                                       value={requestState.test_temporal_hold_out_leave_n_out}
                                       disabled={!!requestState.test_temporal_hold_out_test_ratio}
                                       onChange={(event) => setRequestState({
                                           ...requestState,
                                           test_temporal_hold_out_leave_n_out: event.target.value
                                       })}/>
                            <TextField type="number" className='inputNumber' size="small" label="(OR) Test set ratio"
                                       sx={{mt: 1, mb: 2}}
                                       value={requestState.test_temporal_hold_out_test_ratio}
                                       disabled={!!requestState.test_temporal_hold_out_leave_n_out}
                                       onChange={(event) => setRequestState({
                                           ...requestState,
                                           test_temporal_hold_out_test_ratio: event.target.value
                                       })}/>
                        </FormGroup>) : (<></>)}
                </FormGroup>
            </Box>

            <Box sx={{}}>
                <FormGroup sx={{alignItems: 'center'}}>
                    <FormControlLabel label="Random Subsampling" control={<Radio value='test_random_subsampling'
                                                                                 checked={requestState.test_random_subsampling}
                                                                                 onChange={handleRadioChange}/>}/>
                    {requestState.test_random_subsampling ? (
                        <TextField type="number" className='inputNumber' label="Test set ratio" size="small"
                                   sx={{mt: 1, mb: 2}}
                                   value={requestState.test_random_subsampling_test_ratio}
                                   onChange={(event) => setRequestState({
                                       ...requestState,
                                       test_random_subsampling_test_ratio: event.target.value
                                   })}/>
                    ) : (<></>)}
                </FormGroup>
            </Box>

            <Box sx={{}}>
                <FormGroup sx={{alignItems: 'center'}}>
                    <FormControlLabel label="Random k-fold Cross Validation"
                                      control={<Radio value='test_random_cross_validation'
                                                      checked={requestState.test_random_cross_validation}
                                                      onChange={handleRadioChange}/>}/>
                    {requestState.test_random_cross_validation ? (
                        <TextField type="number" className='inputNumber' size="small" label="Value of k"
                                   sx={{mt: 1, mb: 2}}
                                   value={requestState.test_random_cross_validation_folds}
                                   onChange={(event) => setRequestState({
                                       ...requestState,
                                       test_random_cross_validation_folds: event.target.value
                                   })}/>
                    ) : (<></>)}
                </FormGroup>
            </Box>

        </Container>
    );
}

export default TestSplitting;
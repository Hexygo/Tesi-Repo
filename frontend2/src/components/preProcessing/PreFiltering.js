import React, { useEffect} from 'react';

import {
    Box,
    Checkbox,
    Container,
    FormControlLabel,
    FormGroup,
    TextField,
    Typography
} from '@mui/material';


function PreFiltering(props) {

    const requestState = props.requestState;
    const setRequestState = props.setRequestState;

    useEffect(() => {
        let valid = true;
        props.setStringAllert('Fill in all the required fields before proceeding.')

        if (requestState.global_threshold && !requestState.global_threshold_threshold) {
            valid = false;
        }

        if (requestState.user_k_core && !requestState.user_k_core_core) {
            valid = false;
        }
        if (requestState.item_k_core && !requestState.item_k_core_core) {
            valid = false;
        }
        if (requestState.iterative_k_core && !requestState.iterative_k_core_core) {
            valid = false;
        }
        if (requestState.n_rounds_k_core && !requestState.n_rounds_k_core_core) {
            valid = false;
        }
        if (requestState.n_rounds_k_core && !requestState.n_rounds_k_core_rounds) {
            valid = false;
        }
        if (requestState.cold_users && !requestState.cold_users_threshold) {
            valid = false;
        }

        props.setIsValid(valid);
    }, [requestState.global_threshold, requestState.global_threshold_threshold, requestState.user_k_core, requestState.user_k_core_core, requestState.item_k_core, requestState.item_k_core_core, requestState.iterative_k_core, requestState.iterative_k_core_core, requestState.n_rounds_k_core, requestState.n_rounds_k_core_core, requestState.n_rounds_k_core_rounds, requestState.cold_users, requestState.cold_users_threshold]);


    return (
        <Container>
            <Typography
                className='dtText' sx={{fontSize: '1em'}}>
                Select the <b>prefiltering</b> strategies you want to apply to your dataset
            </Typography>

            <Box sx={{mt: 1}}>
                <FormGroup sx={{alignItems: 'center'}}>
                    <FormControlLabel label="Global Threshold"
                                      control={<Checkbox checked={requestState.global_threshold}
                                                         onChange={(event) => {
                                                             setRequestState({
                                                                 ...requestState,
                                                                 global_threshold: event.target.checked
                                                             })
                                                         }}/>}/>
                    {requestState.global_threshold ? (
                        <TextField type="number" className='inputNumber' size="small" label="Global Threshold"
                                   sx={{mt: 1, mb: 2}}
                                   value={requestState.global_threshold_threshold} onChange={(event) => {
                            setRequestState({...requestState, global_threshold_threshold: event.target.value})
                        }}/>
                    ) : (<></>)}
                </FormGroup>
            </Box>

            <Box sx={{textAlign: 'center'}}>
                <FormControlLabel label="User Average"
                                  control={<Checkbox checked={requestState.user_average} onChange={(event) => {
                                      setRequestState({...requestState, user_average: event.target.checked})
                                  }}/>}/>
            </Box>

            <Box>
                <FormGroup sx={{alignItems: 'center'}}>
                    <FormControlLabel label="User k-Core" control={<Checkbox checked={requestState.user_k_core}
                                                                             onChange={(event) => {
                                                                                 setRequestState({
                                                                                     ...requestState,
                                                                                     user_k_core: event.target.checked
                                                                                 })
                                                                             }}/>}/>
                    {requestState.user_k_core ? (
                        <TextField type="number" className='inputNumber' size="small" label="Value of k"
                                   sx={{mt: 1, mb: 2}}
                                   value={requestState.user_k_core_core} onChange={(event) => {
                            setRequestState({...requestState, user_k_core_core: event.target.value})
                        }}/>
                    ) : null}
                </FormGroup>
            </Box>

            <Box>
                <FormGroup sx={{alignItems: 'center'}}>
                    <FormControlLabel label="Item k-Core" control={<Checkbox
                        checked={requestState.item_k_core} onChange={(event) => {
                        setRequestState({...requestState, item_k_core: event.target.checked})
                    }}/>}/>
                    {requestState.item_k_core ? (
                        <TextField type="number" className='inputNumber' size="small" label="Value of k"
                                   sx={{mt: 1, mb: 2}}
                                   value={requestState.item_k_core_core} onChange={(event) => {
                            setRequestState({...requestState, item_k_core_core: event.target.value})
                        }}/>
                    ) : null}
                </FormGroup>
            </Box>

            <Box sx={{}}>
                <FormGroup sx={{alignItems: 'center'}}>
                    <FormControlLabel label="Iterative K-Core" control={<Checkbox
                        checked={requestState.iterative_k_core} onChange={(event) => {
                        setRequestState({...requestState, iterative_k_core: event.target.checked})
                    }}/>}/>
                    {requestState.iterative_k_core ? (
                        <TextField type="number" className='inputNumber' size="small" label="Value of k"
                                   sx={{mt: 1, mb: 2}}
                                   value={requestState.iterative_k_core_core} onChange={(event) => {
                            setRequestState({...requestState, iterative_k_core_core: event.target.value})
                        }}/>
                    ) : (<></>)}
                </FormGroup>
            </Box>

            <Box sx={{}}>
                <FormGroup sx={{alignItems: 'center'}}>
                    <FormControlLabel label="N-rounds k-core" control={<Checkbox checked={requestState.n_rounds_k_core}
                                                                                 onChange={(event) => {
                                                                                     setRequestState({
                                                                                         ...requestState,
                                                                                         n_rounds_k_core: event.target.checked
                                                                                     })
                                                                                 }}/>}/>
                    {requestState.n_rounds_k_core ? (
                        <FormGroup>
                            <TextField type="number" className='inputNumber' size="small" label="Value of k"
                                       sx={{mt: 1, mb: 2}}
                                       value={requestState.n_rounds_k_core_core} onChange={(event) => {
                                setRequestState({...requestState, n_rounds_k_core_core: event.target.value})
                            }}/>
                            <TextField type="number" className='inputNumber' size="small" label="Value of N"
                                       sx={{mt: 1, mb: 2}}
                                       value={requestState.n_rounds_k_core_rounds} onChange={(event) => {
                                setRequestState({...requestState, n_rounds_k_core_rounds: event.target.value})
                            }}/>
                        </FormGroup>
                    ) : null}
                </FormGroup>
            </Box>

            <Box sx={{}}>
                <FormGroup sx={{alignItems: 'center'}}>
                    <FormControlLabel label="Cold Users" control={<Checkbox
                        checked={requestState.cold_users} onChange={(event) => {
                        setRequestState({...requestState, cold_users: event.target.checked})
                    }}/>}/>
                    {requestState.cold_users ? (
                        <TextField type="number" className='inputNumber' size="small" label="Threshold"
                                   sx={{mt: 1, mb: 2}}
                                   value={requestState.cold_users_threshold} onChange={(event) => {
                            setRequestState({...requestState, cold_users_threshold: event.target.value})
                        }}/>
                    ) : null}
                </FormGroup>
            </Box>

        </Container>
    );
}

export default PreFiltering;
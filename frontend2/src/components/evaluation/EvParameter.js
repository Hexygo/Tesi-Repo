import React, {useEffect} from "react";
import {Checkbox, FormControlLabel, FormGroup, TextField} from "@mui/material";


function EvParameter({setRequestState, requestState, setIsValid, setStringAllert}) {
    useEffect(() => {
        setStringAllert('Fill in all the required fields before proceeding.')
        if (requestState.rev_tresh && requestState.top_k) {
            setIsValid(true);
        } else {
            setIsValid(false);
        }
    }, [requestState.rev_tresh, requestState.top_k])

    return (
        <>
            <TextField type="number" variant="outlined" id="treshold" name="treshold" label="Relevance Treshold"
                       sx={{mt: 5, fontSize: 'var(--joy-fontSize-sm)'}} value={requestState.rev_tresh}
                       onChange={(event) => setRequestState({...requestState, rev_tresh: event.target.value})}/>
            <TextField type='number' variant="outlined" id='top_k' name='top_k' label="Top K"
                       sx={{mt: 2, fontSize: 'var(--joy-fontSize-sm)'}} value={requestState.top_k}
                       onChange={(event) => setRequestState({...requestState, top_k: event.target.value})}/>

            <FormGroup sx={{mt: 1, alignItems: 'center'}}>
                <FormControlLabel control={<Checkbox/>} label="Paired tTest" checked={requestState.t_test}
                                  onChange={(event) => setRequestState({
                                      ...requestState,
                                      t_test: event.target.checked
                                  })}/>
                <FormControlLabel sx={{mt: 1}} control={<Checkbox/>} label="Wilicoxon Test"
                                  checked={requestState.wilcoxon} onChange={(event) => setRequestState({
                    ...requestState,
                    wilcoxon: event.target.checked
                })}/>
            </FormGroup>

        </>
    )

}

export default EvParameter;
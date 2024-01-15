import {
    Typography,
    Button,
    TextField,
    ListItem,
    List,
    IconButton,
} from '@mui/material';
import React, {useEffect} from 'react';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';



function Cutoffs(props) {

    const requestState = props.requestState;
    const setRequestState = props.setRequestState;

    const handleChange = (e) => {
        setRequestState((prevRequestState) => ({
            ...prevRequestState,
            cutoffs: prevRequestState.cutoffs.map((el, i) => i.toString() === e.target.name ? e.target.value : el)
        }));
    }
    const handleAddCutoffs = () => {
        const newCutoffs = requestState.cutoffs;
        newCutoffs.push(null)
        setRequestState((preRequestState) => ({...preRequestState, cutoffs: newCutoffs}))
    }

    const Resetcutoff = () => {
        setRequestState({...requestState, cutoffs: []})
    }
    const handleRemove = (indexToRemove) => {
        const newArr = requestState.cutoffs.filter((el, i) => i !== indexToRemove);
        setRequestState((preRequestState) => ({
            ...preRequestState, cutoffs: newArr
        }))

    }
    useEffect(() => {
        if (requestState.cutoffs.length === 0) {
            props.setStringAllert('Set at least one cutoff value.');
            props.setIsValid(false);
        } else if (requestState.cutoffs.some(el => el === null || el === '')) {
            props.setStringAllert('Fill in all the required fields before proceeding.');
            props.setIsValid(false);
        } else {
            props.setIsValid(true);
        }
    }, [props.requestState]);


    return (
        <>

            <Typography className='dtTextEv' sx={{textAlign: 'center', mb: 1, mt: 4.5}}>Set a number
                of <strong> cutoffs</strong> </Typography>
            <Button className='AddCutoffs'   onClick={handleAddCutoffs}>
                       Add Cutoffs  <AddIcon/></Button>

            <Typography className='dtTextEv'
                        sx={{textAlign: 'center', mt: 3, display: requestState.cutoffs.length > 0 ? 'block' : 'none'}}>Set
                the <strong> cutoffs</strong> value </Typography>
            <List sx={{textAlign: 'center', maxWidth: 360}}>
                {requestState.cutoffs.map((el, index) => (
                    <ListItem key={index}>
                        <TextField
                            type='number'
                            value={el || ''}
                            onChange={handleChange}
                            name={`${index}`}
                            label={`cutoff ${index + 1}`}
                            required
                        />
                        <IconButton onClick={() => handleRemove(index)}>
                            <ClearIcon/>
                        </IconButton>
                    </ListItem>
                ))}
            </List>
            <Button onClick={Resetcutoff} sx={{
                color: 'red', borderRadius: '10px', display: requestState.cutoffs.length > 0 ? 'block' : 'none',
                '&:hover': {
                    backgroundColor: 'rgba(210, 25, 25, 0.08)'
                }
            }}> reset</Button>

        </>
    );
}

export default Cutoffs;
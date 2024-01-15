import {
    FormControlLabel,
    Checkbox,
    Container,
    Typography,
    Box,
    ListItem, IconButton
} from '@mui/material';
import React from 'react';
import '../../styles/evaluation/SimpleMetrics.css';
import AttachFileIcon from '@mui/icons-material/AttachFile';

function SimpleMetrics(props) {

    const requestState = props.requestState;
    const setrequestState = props.setRequestState;

    return (

        <Container>
            <Box sx={{display: 'flex', flexDirection: 'column'}}>
                {props.Metrics.map((el, i) =>
                    el.simple_metrics.length > 0 &&
                    <React.Fragment key={i}>

                        <ListItem className='TitContainer'
                                  sx={{ml: 4, mt: 4, '&:hover .showOnHover': {opacity: 1, cursor: 'pointer'}}}>
                            <Typography id='fairTit' className='metricTit' variant='h5'>{el.id}</Typography>
                            <IconButton className="showOnHover" sx={{opacity: 0}}
                                        href={'https://elliot.readthedocs.io/en/v0.3.1/guide/' + el.url}>
                                <AttachFileIcon fontSize='small'/>
                            </IconButton>
                        </ListItem>


                        <Box sx={{display: 'flex', flexWrap: 'wrap', ml: 2, mb: 2}}>
                            {
                                el.simple_metrics.map((metrics, index) => <FormControlLabel key={index}
                                                                                            control={<Checkbox/>}
                                                                                            label={metrics}
                                                                                            className='check_label'
                                                                                            checked={requestState?.[metrics] || false}
                                                                                            onChange={(event) => setrequestState({
                                                                                                ...requestState,
                                                                                                [metrics]: event.target.checked
                                                                                            })}/>)
                            }

                        </Box>
                    </React.Fragment>
                )}

            </Box>

        </Container>
    );
}

export default SimpleMetrics;
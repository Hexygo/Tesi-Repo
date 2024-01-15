import React from 'react';
import RecForm from '../components/recommendation/RecForm.js';
import '../styles/recommendation/Recommendation.css';
import {Container, Typography} from "@mui/material";

function Recommendation() {
    return (
        <Container sx={{ display: 'flex',justifyContent: 'center',
            alignContent: 'center', flexDirection: 'column',
            gap: '10px', my: 2}}>
            <Typography
                        sx={{
                            fontFamily: "'Merriweather', serif;",
                            textAlign: 'center',
                            fontWeight: 'bold',
                            mt: 7, mb: 1,
                            fontSize: { xs: "2.1em", sm: '2.3em' }

                        }}
            >Recommendation
            </Typography>
            <RecForm/>
        </Container>
    )
}

export default Recommendation;

import React from 'react';
import imgPath from '../images/elliot_img.png'
import '../styles/Home.css'
import {Typography} from '@mui/material';

function Home(){
    return(
        <div className='Conatainer' sx={{ mb: '20px'}}>
            <Typography sx={{  fontFamily: "'Merriweather', serif;",
                textAlign: 'center',
                fontWeight: 'bold',
                mt: 5,
                fontSize: '2.9em'}} className='homeTit'
            >What is Elliot?</Typography>

            <Typography  sx={{textAlign:'center',mx:'25%',
                fontFamily: "'Montserrat', sans-serif;",
                fontSize: {
                    xs: '0.9rem',
                    sm: '1.15rem'
                }}} className='introduction'>
                Elliot is a comprehensive recommendation framework that analyzes the recommendation problem
                from the researcher’s perspective. It conducts a whole experiment, from dataset loading to
                results gathering. The core idea is to feed the system with a simple and straightforward
                configuration file that drives the framework through the experimental setting choices.
                Elliot untangles the complexity of combining splitting strategies, hyperparameter model optimization,
                model training, and the generation of reports of the experimental results.

            </Typography>

            <img src={imgPath} className='img' alt='' />

            <Typography variant='body1' sx={{textAlign:'center',fontFamily: "'Montserrat', sans-serif;"}} className='moreInfo'>
                Visit the official web-site of <a href='https://elliot.readthedocs.io/en/latest/#'>Elliot framework </a>
                to get more info.
            </Typography>

        </div>

    );
}

export default Home;
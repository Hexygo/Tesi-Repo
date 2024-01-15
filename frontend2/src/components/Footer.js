import { Typography, Box} from '@mui/material';
import React from 'react';
import Container from '@mui/material/Container';
import '../styles/Footer.css'

function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                py: 3,
                px: 2,
                mt: 'auto',
                backgroundColor: '#343131'
            }}
        >
            <Container maxWidth="lg">
                <Typography variant="body2"
                            sx={{color: 'white', textAlign: 'center', fontFamily: '"Arial Black", Gadget, sans-serif'}}>
                    Elliot è un progetto del gruppo SisInfLab del Politecnico di Bari.
                </Typography>
            </Container>
        </Box>
    );
}

export default Footer;
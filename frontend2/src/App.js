import React, {useState} from 'react';
import {Routes, Route} from 'react-router-dom';
import PreProcessing from './viewModels/PreProcessing.js';
import Home from './viewModels/Home.js';
import Recommendation from './viewModels/Recommendation.js';
import Evaluation from './viewModels/Evaluation.js';
import {Box, Container, CssBaseline} from "@mui/material";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { StyledEngineProvider } from '@mui/material/styles';
import {SnackbarProvider} from 'notistack';
import './styles/App.css'

function App() {
    const [previousStep, setPreviousStep] = useState(5);
    const [step, setStep] = useState(0);
    const [evStep,setEvStep]=useState(-1);
    const [previousevStep, setPreviousevStep] =useState(-1);

    const [submitButton, setSubmitButton] = useState(false);
    const [preStep, setPreStep] = useState(false);


    return (
        <StyledEngineProvider injectFirst>
            <div style={{ position: 'sticky', top: 0, zIndex: 2000 }}>
            <SnackbarProvider anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }} autoHideDuration={3000} preventDuplicate  style={{ position: 'sticky', top: 0, left: '50%', transform: 'translateX(-50%)' }}
            />
            </div>
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                backgroundColor: '#fdfdfd',
                zIndex: 1,

            }}>
            <Navbar setPreviousStep={setPreviousStep} setStep={setStep} setSubmitButton={setSubmitButton} setPreStep={setPreStep} setPreviousevStep={setPreviousevStep} setEvStep={setEvStep} >

            </Navbar>
            <CssBaseline/>
            <Container component="main">
                <Routes>
                    <Route path='/' element={<Home/>}/>
                    <Route path="/preprocessing" element={<PreProcessing setPreviousStep={setPreviousStep} setStep={setStep} setSubmitButton={setSubmitButton} previousStep={previousStep} step={step} submitButton={submitButton} preStep={preStep} setPreStep={setPreStep}  />}/>
                    <Route path='/recommendation' element={<Recommendation />}/>
                    <Route path='/evaluation' element={<Evaluation previousevStep={previousevStep} setPreviousevStep={setPreviousevStep} evStep={evStep} setEvStep={setEvStep} />}/>
                </Routes>
            </Container>
            <Footer/>
        </Box>
        </StyledEngineProvider>
    );
}

export default App;

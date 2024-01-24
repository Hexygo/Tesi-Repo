import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, BrowserRouter as Router} from 'react-router-dom';
import {createTheme, ThemeProvider} from "@mui/material";

const THEME = createTheme({
    typography: {
        fontFamily: `'Titillium Web', sans-serif`
    }
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ThemeProvider theme={THEME}>
    <BrowserRouter>
       <App />
    </BrowserRouter>
    </ThemeProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

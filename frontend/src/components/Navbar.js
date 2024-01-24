import React, {useState} from 'react';
import '../styles/Navbar.css';
import {Link as RouterLink} from 'react-router-dom';
import {AppBar, Button, Divider, Drawer, IconButton, List, ListItem, Toolbar, Typography} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';


function Navbar(props) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const change = () => {
        props.setPreStep(false);
        props.setStep(5);
        props.setPreviousStep(5)
        props.setSubmitButton(false);
        props.setEvStep(-1);
        props.setPreviousevStep(-1)
    }
    const headersData = [
        {
            label: "Data preprocessing",
            href: "/preprocessing",
        },
        {
            label: "Recommendation",
            href: "/recommendation",
        },
        {
            label: "Evaluation",
            href: "/evaluation",
        }
    ];


    return (
        <AppBar position="static" sx={{backgroundColor: '#297db6'}}>
            <Toolbar className="toolbar">
                <RouterLink className='link' to='/'>
                    <HomeIcon
                        fontSize='large'
                        sx={{
                            display: {xs: "none", md: 'block'},
                            pl: '2px',
                            color: 'white',
                        }}></HomeIcon>
                    <Typography variant='h5'
                                sx={{
                                    textAlign: 'center',
                                    color: 'white',
                                    ml: 1,
                                    fontWeight: 'bold',
                                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                                    fontFamily: '"Arial Black", Gadget, sans-serif',
                                    pt: '2px'
                                }}>
                        Elliot Web</Typography></RouterLink>
                <div>
                    {headersData.map(({label, href}) => (
                        <Button
                            key={label}
                            onClick={change}
                            {...{
                                color: "inherit",
                                to: href,
                                component: RouterLink,
                                className: "button",
                                sx: {
                                    display: {xs: "none", md: 'inline'},
                                    color: 'white',
                                    fontFamily: '"Arial Black", Gadget, sans-serif',
                                    p: '10px',
                                    ml: '10px',
                                    borderRadius: '10px',
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                    }
                                }

                            }}
                        >{label}
                        </Button>
                    ))}
                    <Drawer
                        open={isDrawerOpen}
                        onClose={() => setIsDrawerOpen(false)}
                        anchor='top'
                    >
                        <List sx={{backgroundColor: '#297db6', p: 0}}>
                            {headersData.map(({label, href}) => (
                                <React.Fragment key={label}> <ListItem button key={label} component={RouterLink}
                                                                       to={href} sx={{
                                    color: 'white', fontFamily: '"Arial Black", Gadget, sans-serif', display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: '10px',
                                    fontSize: '1.1em',
                                    p: '16px',
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                    }
                                }} onClick={() => {
                                    setIsDrawerOpen(false);
                                    change()
                                }}>
                                    {label}

                                </ListItem>
                                    <Divider></Divider>
                                </React.Fragment>
                            ))}
                        </List>
                    </Drawer>
                    <IconButton edge="start" color="inherit" onClick={() => setIsDrawerOpen(true)}
                                sx={{display: {xs: "block", md: 'none'}}}>
                        <ArrowDropDownIcon fontSize='large'/>
                    </IconButton>
                </div>
            </Toolbar>

        </AppBar>


    );
}

export default Navbar;
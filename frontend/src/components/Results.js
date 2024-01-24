import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'white',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function Results(props) {
    const handleClose = () => props.removeDownloadLink();

    return (
        <Modal
            open={props.url ? true : false}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Elaborazione completata!
                </Typography>
                <Typography id="modal-modal-description" sx={{mt: 2}}>
                    Scarica i tuoi risultati da <a data-testid='result' href={props.url} onClick={handleClose}>questo link</a>.
                </Typography>
            </Box>
        </Modal>
    )
}
import {
    Checkbox,
    FormControlLabel,
    Typography,
    Box,
    Container,
    Card,
    IconButton, TextField, Link, Button,
} from '@mui/material';
import '../../styles/recommendation/Recommendation.css'
import React from 'react';
import {Close} from '@mui/icons-material';
import Autocomplete from '@mui/material/Autocomplete';


function AddForm({...props}) {
    function determineType(defaultValue) {
        if (/^\d+(\.\d+)?$/.test(defaultValue)) {
            return 'number';
        } else {
            return 'text';
        }
    }

    const handleChangeWeights = (e) => {
        props.setParameter(props.id, e.target.name, e.target.checked);
    }
    const handleChange = e => props.setParameter(props.id, e.target.name, e.target.value)
    const setDefaultValues = () => {
        const currentModelClass = props.Models.find(el => el.id === props.modelClass);
        if (currentModelClass) {
            const currentModel = currentModelClass.models.find(el => el.id === props.loading_model);
            if (currentModel) {
                currentModel.parameters.forEach(param => {
                    props.setParameter(props.id, param.name, param.default);
                });
            }
        }

    }
    return (

        <Container data-testid='model' sx={{display: 'flex', width: '400px', p: 0}}>
            <Card variant="outlined" sx={{
                width: '100%',
                mb: 3,
                p: 2,
                boxShadow: 'rgba(105, 165, 196, 0.5) 0 1px 30px;',
                borderRadius: '20px'
            }}>
                <Box>
                    <IconButton data-testid='close' onClick={() => props.removeModel(props.id)}>
                        <Close/>
                    </IconButton>
                </Box>
                <Box sx={{mb: 3}}>
                    <Box sx={{mt: 1, textAlign: 'center'}}>
                        <Typography>Select a recommendation model</Typography>
                        <Box sx={{m: 1.2, mr: 3.5, ml: 3.5}}>
                            <Autocomplete
                                id="loading_rec_model"
                                options={props.Models.map(model => model.id)}
                                value={props.modelClass || null}
                                onChange={(event, newValue) => {
                                    props.setModelClass(props.id, newValue)
                                }}
                                renderInput={(params) => <TextField sx={{minWidth: 120}}  {...params}
                                                                    label="Model class" required/>}
                                disableClearable
                                sx={{mt: 1}}
                            />
                        </Box>
                    </Box>


                    <Box sx={{m: 1.2, mr: 3.5, ml: 3.5, textAlign: 'center'}}>
                        <Autocomplete
                            isOptionEqualToValue={(option, value) => option === value}
                            id="loading_model"
                            options={((props.Models.find(el => el.id === props.modelClass))?.models || []).map((el) => el.name)}
                            value={props.loading_model || null}
                            onChange={(event, newValue) => props.setModel(props.id, newValue ? newValue : null)}
                            disabled={!props.modelClass}
                            renderInput={(params) => <TextField {...params} label="Model" required/>}
                            disableClearable
                            sx={{mt: 1, minWidth: 120, width: null}}
                        />
                    </Box>

                    <Box sx={{textAlign: 'center', mt: 1}}>
                        <Typography>Choose the parameters for this model<br/>Read the
                            {props.loading_model ? <Link
                                href={'https://elliot.readthedocs.io/en/v0.3.1/guide/' + props.Models.find(el => el.id === props.modelClass).models.find(el => el.id === props.loading_model).url}
                                underline="none"> documentation </Link> : ' documentation '}
                            in case you
                            need</Typography>
                        <Box sx={{maxHeight: '250px', overflow: 'auto'}}>
                            {
                                props.Models.map(modelClass =>
                                    modelClass.id === props.modelClass &&
                                    modelClass.models.map(model =>
                                        model.id === props.loading_model &&
                                        model.parameters.map((value, index) =>
                                            <Box key={index} sx={{textAlign: 'center', mt: 1}}>
                                                <TextField
                                                    onChange={handleChange}
                                                    label={value.name}
                                                    type={determineType(value.default)}
                                                    key={index}
                                                    id={value.name}
                                                    name={value.name}
                                                    value={props[value.name] || ''}
                                                />
                                            </Box>
                                        )
                                    )
                                )
                            }

                        </Box>
                    </Box>

                    <Box sx={{textAlign: 'center', mt: 1}}>
                        <FormControlLabel
                            control={<Checkbox disabled={!props.loading_model} checked={props.save_weights || false}
                                               onChange={handleChangeWeights}/>} label='Save weights' id='save_weights'
                            name='save_weights'/>
                    </Box>
                    <Box sx={{textAlign: 'center', mt: 1}}>
                        <TextField onChange={handleChange} disabled={!props.loading_model}
                                   value={props.validation_metric || ''} type='text' id='validation_metric'
                                   name='validation_metric' label='Validation metric'
                                   className='textInput'/>
                    </Box>
                    <Box sx={{textAlign: 'center', mt: 1}}>
                        <TextField onChange={handleChange} disabled={!props.loading_model} type='number'
                                   value={props.validation_rate || ''} id='validation_rate' name='validation_rate'
                                   label='Validation rate'
                                   className='textInput'/>
                    </Box>
                    <Box sx={{textAlign: 'center', mt: 1}}>
                        <TextField onChange={handleChange} disabled={!props.loading_model} type='text'
                                   value={props.hyper_opt_alg || ''} id='hyper_opt_alg' name='hyper_opt_alg'
                                   label='Hyperopt algorithm'
                                   className='textInput'/>
                    </Box>
                    <Box sx={{textAlign: 'center', mt: 1}}>
                        <TextField onChange={handleChange} disabled={!props.loading_model} type='text'
                                   value={props.hyper_max_evals || ''} id='hyper_max_evals' name='hyper_max_evals'
                                   label='Hyperopt max evals'
                                   className='textInput'/>
                    </Box>
                </Box>
                <Box sx={{textAlign: 'center', mt: 1, display: props.loading_model ? 'block' : 'none'}}>
                    <Button sx={{color: '#297db6'}} onClick={setDefaultValues}>Set Default Values </Button>
                </Box>
            </Card>
        </Container>
    )
        ;
}

export default AddForm;
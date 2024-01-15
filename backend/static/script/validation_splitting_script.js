//gestione radio buttons dello splitting
/*const validation_fixed_timestamp_radio = document.getElementById('validation_fixed_timestamp');
const validation_temporal_hold_out_radio = document.getElementById('validation_temporal_hold_out');
const validation_random_subsampling_radio = document.getElementById('validation_random_subsampling');
const validation_random_cross_validation_radio = document.getElementById('validation_random_cross_validation');*/

//gestione text associate ai radio nella validation
const validation_fixed_timestamp_value = document.getElementById('validation_fixed_timestamp_value');

validation_fixed_timestamp_radio.addEventListener('change', () => {
    show_text(validation_fixed_timestamp_value);
})

const validation_temporal_hold_out_test_ratio = document.getElementById('validation_temporal_hold_out_test_ratio');
const validation_temporal_hold_out_leave_n_out = document.getElementById('validation_temporal_hold_out_leave_n_out');

validation_temporal_hold_out_radio.addEventListener('change', () => {
    show_text(validation_temporal_hold_out_test_ratio);
    show_text(validation_temporal_hold_out_leave_n_out);
})

const validation_random_subsampling_test_ratio = document.getElementById('validation_random_subsampling_test_ratio');
const validation_random_subsampling_leave_n_out = document.getElementById('validation_random_subsampling_leave_n_out');
const validation_random_subsampling_folds = document.getElementById('validation_random_subsampling_folds');

validation_random_subsampling_radio.addEventListener('change', () => {
    show_text(validation_random_subsampling_test_ratio);
    show_text(validation_random_subsampling_leave_n_out);
    show_text(validation_random_subsampling_folds);
})
// a tempo perso gestire che se sceglie uno dei due parametri l'altra casella viene disabilitata

const validation_random_cross_validation_folds = document.getElementById('validation_random_cross_validation_folds');

validation_random_cross_validation_radio.addEventListener('change', () => {
    show_text(validation_random_cross_validation_folds);
})
function show_text(ogg){
if (ogg.hidden === true){
    ogg.hidden = false;}
    }
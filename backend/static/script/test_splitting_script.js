//gestione radio buttons dello splitting
/*const test_fixed_timestamp_radio = document.getElementById('test_fixed_timestamp');
const test_temporal_hold_out_radio = document.getElementById('test_temporal_hold_out');
const test_random_subsampling_radio = document.getElementById('test_random_subsampling');
const test_random_cross_validation_radio = document.getElementById('test_random_cross_validation');*/

//gestione text associate ai radio
const test_fixed_timestamp_value = document.getElementById('test_fixed_timestamp_value');

test_fixed_timestamp_radio.addEventListener('change', () => {
    show_text(test_fixed_timestamp_value);
})

const test_temporal_hold_out_test_ratio = document.getElementById('test_temporal_hold_out_test_ratio');
const test_temporal_hold_out_leave_n_out = document.getElementById('test_temporal_hold_out_leave_n_out');

test_temporal_hold_out_radio.addEventListener('change', () => {
    show_text(test_temporal_hold_out_test_ratio);
    show_text(test_temporal_hold_out_leave_n_out);
})

const test_random_subsampling_test_ratio = document.getElementById('test_random_subsampling_test_ratio');
const test_random_subsampling_leave_n_out = document.getElementById('test_random_subsampling_leave_n_out');
const test_random_subsampling_folds = document.getElementById('test_random_subsampling_folds');

test_random_subsampling_radio.addEventListener('change', () => {
    show_text(test_random_subsampling_test_ratio);
    show_text(test_random_subsampling_leave_n_out);
    show_text(test_random_subsampling_folds);
})
// a tempo perso gestire che se sceglie uno dei due parametri l'altra casella viene disabilitata

const test_random_cross_validation_folds = document.getElementById('test_random_cross_validation_folds');

test_random_cross_validation_radio.addEventListener('change', () => {
    show_text(test_random_cross_validation_folds);
})
function show_text(ogg){
if (ogg.hidden === true){
    ogg.hidden = false;}}
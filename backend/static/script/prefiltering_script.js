//gestione delle checkbox
/*const global_threshold_check = document.getElementById('global_threshold');
// const user_average_check = document.getElementById('user_average'); non serve
const user_k_core_check = document.getElementById('user_k_core');
const item_k_core_check = document.getElementById('item_k_core');
const iterative_k_core_check = document.getElementById('iterative_k_core');
const n_rounds_k_core_check = document.getElementById('n_rounds_k_core');
const cold_users_check = document.getElementById('cold_users');*/

//gestione delle text associate alle checkbox

const global_threshold_threshold = document.getElementById('global_threshold_threshold');

global_threshold_check.addEventListener('click',()=>{
    show_text(global_threshold_threshold);
})

const user_k_core_core = document.getElementById('user_k_core_core');

user_k_core_check.addEventListener('click',()=>{
    show_text(user_k_core_core);
})

const item_k_core_core = document.getElementById('item_k_core_core');

item_k_core_check.addEventListener('click',()=>{
    show_text(item_k_core_core);
})

const iterative_k_core_core = document.getElementById('iterative_k_core_core');

iterative_k_core_check.addEventListener('click',()=>{
    show_text(iterative_k_core_core);
})

const n_rounds_k_core_core = document.getElementById('n_rounds_k_core_core');
const n_rounds_k_core_rounds = document.getElementById('n_rounds_k_core_rounds');


n_rounds_k_core_check.addEventListener('click',()=>{
    show_text(n_rounds_k_core_core);
    show_text(n_rounds_k_core_rounds);
})

const cold_users_threshold = document.getElementById('cold_users_threshold');

cold_users_check.addEventListener('click',()=>{
    show_text(cold_users_threshold);
})

function show_text(ogg){
if (ogg.hidden === true){
    ogg.hidden = false;}
    else {
    ogg.hidden = true;}}
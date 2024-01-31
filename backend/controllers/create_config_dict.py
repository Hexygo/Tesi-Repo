import os
import shutil
from datetime import datetime
import hashlib
import uuid  # se proprio dopo vogliamo farla con hash il nome del dataset
from flask import Flask, request
import zipfile  # per gestire lo zip inviato nella strategia hierarchy
import json

def dataset_config(experiment, request):
    name = str(uuid.uuid4()) # genera un nome univoco per il salvataggio del file
    _path = 'data/' + name
    os.makedirs(_path, exist_ok=False)
    dataset_path = _path + '/dataset.tsv'
    request.files.get('file').save(dataset_path)  # dataset salvato in dataset path
    experiment['data_config']['dataset_path'] = dataset_path

    # Prefiltering
    # Con questa ottimizzazione si passa da O(N) a O(1)
    experiment['prefiltering'] = [] # Lista delle strategie di Prefiltering
    for strat in request.form.get('prefiltering_strategies', type=json.loads):
        if 'threshold' in strat:
            strat['threshold'] = int(strat['threshold'])
        if 'core' in strat:
            strat['core'] = int(strat['core'])
        if 'rounds' in strat:
            strat['rounds'] = int(strat['rounds'])
        experiment['prefiltering'].append(strat)
    # experiment['prefiltering'] = [] 
    # if request.form.get('global_threshold', type=json.loads):
    #     experiment['prefiltering'].append(dict(
    #         strategy = 'global_treshold',
    #         threshold = int(request.form.get('global_treshold_treshold'))
    #     ))
    # if request.form.get('user_average', type=json.loads):
    #     experiment['prefiltering'].append(dict(
    #         strategy = 'user_average'
    #     ))
    # if request.form.get('user_k_core', type=json.loads):
    #     experiment['prefiltering'].append(dict(
    #         strategy = 'user_k_core',
    #         core = int(request.form.get('user_k_core_core'))
    #     ))
    # if request.form.get('item_k_core', type=json.loads):
    #     experiment['prefiltering'].append(dict(
    #         strategy = 'item_k_core',
    #         core = int(request.form.get('item_k_core_core'))
    #     ))
    # if request.form.get('iterative_k_core', type=json.loads):
    #     experiment['prefiltering'].append(dict(
    #         strategy = 'iterative_k_core',
    #         core = int(request.form.get('iterative_k_core_core'))
    #     ))
    # if request.form.get('n_rounds_k_core', type=json.loads):
    #     experiment['prefiltering'].append(dict(
    #         strategy = 'n_rounds_k_core',
    #         core = int(request.form.get('n_rounds_k_core_core')),
    #         rounds = int(request.form.get('n_rounds_k_core_rounds'))
    #     ))
    # if request.form.get('cold_users', type=json.loads):
    #     experiment['prefiltering'].append(dict(
    #         strategy = 'cold_users',
    #         threshold = int(request.form.get('cold_users_threshold'))
    #     ))  
    
    experiment['splitting'] = dict()

    # Test Splitting
    experiment['splitting']['test_splitting'] = dict()
    experiment['splitting']['test_splitting']['strategy'] = request.form.get('test_splitting_strategy')
    if 'test_splitting_timestamp' in request.form:
        if request.form.get('test_splitting_timestamp') == 'best':
            experiment['splitting']['test_splitting']['timestamp'] = 'best'
        else:
            experiment['splitting']['test_splitting']['timestamp'] = int(request.form.get('test_splitting_timestamp_value', type=json.loads))
    if 'test_splitting_ratio' in request.form:
        experiment['splitting']['test_splitting']['test_ratio'] = float(request.form.get('test_splitting_ratio'))
    if 'test_splitting_leave_n_out' in request.form:
        experiment['splitting']['test_splitting']['leave_n_out'] = int(request.form.get('test_splitting_leave_n_out'))
    if 'test_splitting_folds' in request.form:
        experiment['splitting']['test_splitting']['folds'] = int(request.form.get('test_splitting_folds'))

    # Validation Splitting
    experiment['splitting']['validation_splitting'] = dict()
    experiment['splitting']['validation_splitting']['strategy'] = request.form.get('validation_splitting_strategy')
    if 'validation_splitting_timestamp' in request.form:
        if request.form.get('validation_splitting_timestamp') == 'best':
            experiment['splitting']['validation_splitting']['timestamp'] = 'best'
        else:
            experiment['splitting']['validation_splitting']['timestamp'] = int(request.form.get('validation_splitting_timestamp_value', type=json.loads))
    if 'validation_splitting_ratio' in request.form:
        experiment['splitting']['validation_splitting']['validation_ratio'] = float(request.form.get('validation_splitting_ratio'))
    if 'validation_splitting_leave_n_out' in request.form:
        experiment['splitting']['validation_splitting']['leave_n_out'] = int(request.form.get('validation_splitting_leave_n_out'))
    if 'validation_splitting_folds' in request.form:
        experiment['splitting']['validation_splitting']['folds'] = int(request.form.get('validation_splitting_folds'))

    experiment['dataset'] = request.files['file'].filename
    # così ho preso il nome del dataset passato dall'utente (caso strategia dataset)
    # vedi come funziona con hierarchy e fixed poi

    # gestione salvataggio dati splittati (scegliamo lato backend di salvarli, non sceglie l'utente)
    save_folder = 'splitted_data/' + name
    experiment['splitting']['save_on_disk'] = True
    experiment['splitting']['save_folder'] = save_folder
    
def fixed_config(experiment, request):
    name = str(uuid.uuid4()) # genera un nome univoco per il salvataggio del file
    _path = '../data/' + name
    os.makedirs(_path, exist_ok=False)

    train_path = _path + 'test_dataset.tsv'
    test_path = _path + 'test_dataset.tsv'
    request.files.get('file').save(train_path)
    request.files.get('test_file').save(test_path)
    experiment['data_config']['train_path'] = train_path
    experiment['data_config']['test_path'] = test_path
    if request.files.get('validation_file'):
        validation_path = _path + 'validation_dataset.tsv'
        request.files.get('validation_file').save(validation_path)
        experiment['data_config']['validation_path'] = validation_path

    experiment['dataset'] = request.files['file'].filename

    # gestione salvataggio dati splittati (scegliamo lato backend di salvarli, non sceglie l'utente)
    save_folder = 'splitted_data/' + name
    experiment['splitting'] = dict()
    experiment['splitting']['save_on_disk'] = True
    experiment['splitting']['save_folder'] = save_folder
    return

def hierarchy_config(experiment, request):
    name = str(uuid.uuid4()) # genera un nome univoco per il salvataggio del file
    _path = '../data/' + name
    os.makedirs(_path, exist_ok=False)

    with zipfile.ZipFile(request.files['file'], 'r') as zip_ref:
        zip_ref.extractall(_path)
    experiment['data_config']['root_folder'] = _path

    experiment['dataset'] = request.files['file'].filename

    # gestione salvataggio dati splittati (scegliamo lato backend di salvarli, non sceglie l'utente)
    save_folder = 'splitted_data/' + name
    experiment['splitting']=dict()
    experiment['splitting']['save_on_disk'] = True
    experiment['splitting']['save_folder'] = save_folder
    return


def set_strategy(experiment, request):
    experiment['data_config'] = dict()
    experiment['data_config']['strategy'] = request.form.get('loading_strategy') # Strategia impostata, ora si passa alla fase di configurazione specifica della strategia scelta.

    if experiment['data_config']['strategy'] == 'dataset':
        dataset_config(experiment, request)
    elif experiment['data_config']['strategy'] == 'fixed':
        fixed_config(experiment, request)
    else:
        hierarchy_config(experiment, request)    
    
    return

def create_config_dict(request):
    config = dict()
    config['experiment'] = dict()
    set_strategy(config['experiment'], request)

    # selezione del seed random
    if request.form.get('random_seed'):
        config['experiment']['random_seed'] = int(request.form.get('random_seed'))
    # gestione binarize
    config['experiment']['binarize'] = bool(request.form.get('binarize', type=json.loads))
    # valutare se inserire accelerazione GPU
    return config


# questa funzione viene utilizzata per creare un dizionario di configurazione a partire dall'oggetto richiesta proveniente dal client
# TODO sistemare il bug con il fixed timestamp
# TODO sistemare il bug nel temporal hold out
# DEPRECATO
""" def create_config_dict(request):
    config = dict()
    config['experiment'] = dict()
    config['experiment']['data_config'] = dict()
    # salvataggio dei file in un path a seconda della situazione da gestire
    config['experiment']['data_config']['strategy'] = request.form.get(
        'loading_strategy')  # no valore di default perché almeno una strategia la deve scegliere
    timestamp = datetime.now()
    timestamp_string = timestamp.strftime("%d-%m-%Y-%H-%M-%S")  # timestamp con cui salvare il dataset utilizzato
    if config['experiment']['data_config']['strategy'] == 'dataset':

        print('Selected dataset strategy')
        # datasetPath = 'data/' + md5(timestamp_string) + '/' + 'dataset.tsv'
        cript = hashlib.md5((timestamp_string + 'request/').encode('utf-8'))
        _path = 'data/' + cript.hexdigest()
        os.makedirs(_path, exist_ok=False)
        dataset_path = _path + '/dataset.tsv'
        # with open(dataset_path, "w") as f:
        #    f.write(request.files.get('file'))
        request.files.get('file').save(dataset_path)  # dataset salvato in dataset path
        config['experiment']['data_config']['dataset_path'] = dataset_path

        config['experiment']['splitting'] = dict()
        config['experiment']['splitting']['test_splitting'] = dict()

        # gestione prefiltering
        # prefiltering_strategies = dict() //non dovrebbe servire più, se dà errori rimetterlo
        prefiltering_strategies = {i for i in {'global_threshold', 'user_average', 'user_k_core', 'item_k_core',
                                               'iterative_k_core', 'n_rounds_k_core', 'cold_users'} if request.form.get(i, type=json.loads)}

        config['experiment']['prefiltering'] = []
        # è una lista di dizionari, creaimo un nuovo dizionario e lo aggiungiamo in coda alla lista (usa metodo append)
        # gestione delle strategie di prefiltering
        if prefiltering_strategies:
            if ('global_threshold' in prefiltering_strategies):
                print('Selected global_threshold as prefiltering strategy')
                d1 = dict()
                d1['strategy'] = 'global_threshold'
                d1['threshold'] = int(request.form.get('global_threshold_threshold'))  # come metto average
                config['experiment']['prefiltering'].append(d1)
            if ('user_average' in prefiltering_strategies):
                print('Selected user_average as prefiltering strategy')
                d2 = dict()
                d2['strategy'] = 'user_average'
                config['experiment']['prefiltering'].append(d2)
            if ('user_k_core' in prefiltering_strategies):
                print('Selected item_k_core as prefiltering strategy')
                d3 = dict()
                d3['strategy'] = 'user_k_core'
                d3['core'] = int(request.form.get('user_k_core_core'))
                config['experiment']['prefiltering'].append(d3)
            if ('item_k_core' in prefiltering_strategies):
                print('Selected item_k_core as prefiltering strategy')
                d4 = dict()
                d4['strategy'] = 'item_k_core'
                d4['core'] = int(request.form.get('item_k_core_core'))
                config['experiment']['prefiltering'].append(d4)
            if ('iterative_k_core' in prefiltering_strategies):
                print('Selected iterative_k_core as prefiltering strategy')
                d5 = dict()
                d5['strategy'] = 'iterative_k_core'
                d5['core'] = int(request.form.get('iterative_k_core_core'))
                config['experiment']['prefiltering'].append(d5)
            if ('n_rounds_k_core' in prefiltering_strategies):
                print('Selected n_rounds_k_core as prefiltering strategy')
                d6 = dict()
                d6['strategy'] = 'n_rounds_k_core'
                d6['core'] = int(request.form.get('n_rounds_k_core_core'))
                d6['rounds'] = int(request.form.get('n_rounds_k_core_rounds'))
                config['experiment']['prefiltering'].append(d6)
            if ('cold_users' in prefiltering_strategies):
                print('Selected cold_users as prefiltering strategy')
                d7 = dict()
                d7['strategy'] = 'cold_users'
                d7['threshold'] = int(request.form.get('cold_users_threshold'))
                config['experiment']['prefiltering'].append(d7)

        test_splitting_strategy = [i for i in {'fixed_timestamp', 'temporal_hold_out', 'random_subsampling',
                                               'random_cross_validation'} if request.form.get('test_' + i, type=json.loads)]
        assert len(test_splitting_strategy) == 1, 'Test Splitting Strategy should be 1'
        test_splitting_strategy = test_splitting_strategy[0]

        config['experiment']['splitting']['test_splitting']['strategy'] = test_splitting_strategy
        if test_splitting_strategy == 'fixed_timestamp':
            # gestione test_fixed_timestamp
            print('Selected a fixed timestamp test splitting strategy ')
            if request.form.get('test_fixed_timestamp_value') == 'best':
                config['experiment']['splitting']['test_splitting']['timestamp'] = request.form.get(
                    'test_fixed_timestamp_value')
            else:
                config['experiment']['splitting']['test_splitting']['timestamp'] = int(request.form.get(
                    'test_fixed_timestamp_value',
                    type=json.loads))
        elif test_splitting_strategy == 'temporal_hold_out':
            print('Selected a temporal hold out test splitting strategy ')
            if request.form.get('test_temporal_hold_out_test_ratio'):
                config['experiment']['splitting']['test_splitting']['test_ratio'] = float(request.form.get(
                    'test_temporal_hold_out_test_ratio'))
            else:
                config['experiment']['splitting']['test_splitting']['leave_n_out'] = int(request.form.get(
                    'test_temporal_hold_out_test_leave_n_out'))
        elif test_splitting_strategy == 'random_subsampling':
            print('Selected a random subsampling test splitting strategy ')
            if request.form.get('test_random_subsampling_test_ratio'):
                config['experiment']['splitting']['test_splitting']['test_ratio'] = float(request.form.get(
                    'test_random_subsampling_test_ratio'))
            else:
                config['experiment']['splitting']['test_splitting']['leave_n_out'] = int(request.form.get(
                    'test_random_subsampling_leave_n_out'))
            if request.form.get('test_random_subsampling_folds'):
                config['experiment']['splitting']['test_splitting']['folds'] = int(request.form.get(
                    'test_random_subsampling_folds'))
        elif test_splitting_strategy == 'random_cross_validation':
            print('Selected a random cross validation test splitting strategy ')
            config['experiment']['splitting']['test_splitting']['folds'] = int(request.form.get(
                'test_random_cross_validation_folds'))

        # gestione validation data splitting
        validation_splitting_strategy = [i for i in {'fixed_timestamp', 'temporal_hold_out', 'random_subsampling',
                                               'random_cross_validation'} if request.form.get('validation_' + i, type=json.loads)]
        if len(validation_splitting_strategy) == 1:
            validation_splitting_strategy = validation_splitting_strategy[0]
            config['experiment']['splitting']['validation_splitting'] = dict()
            config['experiment']['splitting']['validation_splitting']['strategy'] = validation_splitting_strategy
            if validation_splitting_strategy == 'fixed_timestamp':
                # gestione validation_fixed_timestamp
                print('Selected a fixed timestamp validation splitting strategy ')
                if request.form.get('validation_fixed_timestamp_value') == 'best':
                    config['experiment']['splitting']['test_splitting']['timestamp'] = request.form.get(
                        'validation_fixed_timestamp_value')
                else:
                    config['experiment']['splitting']['test_splitting']['timestamp'] = int(request.form.get(
                        'validation_fixed_timestamp_value',
                        type=json.loads))
            elif validation_splitting_strategy == 'temporal_hold_out':
                print('Selected a temporal hold out validation splitting strategy ')
                if request.form.get('validation_temporal_hold_out_test_ratio'):
                    config['experiment']['splitting']['validation_splitting']['test_ratio'] = float(request.form.get(
                        'validation_temporal_hold_out_test_ratio'))
                else:
                    config['experiment']['splitting']['validation_splitting']['leave_n_out'] = int(request.form.get(
                        'validation_temporal_hold_out_test_leave_n_out'))
            elif validation_splitting_strategy == 'random_subsampling':
                print('Selected a random subsampling validation splitting strategy ')
                if request.form.get('validation_random_subsampling_test_ratio'):
                    config['experiment']['splitting']['validation_splitting']['test_ratio'] = float(request.form.get(
                        'validation_random_subsampling_test_ratio'))
                else:
                    config['experiment']['splitting']['validation_splitting']['leave_n_out'] = int(request.form.get(
                        'validation_random_subsampling_leave_n_out'))
                config['experiment']['splitting']['validation_splitting']['folds'] = int(request.form.get(
                    'validation_random_subsampling_folds'))
            elif validation_splitting_strategy == 'random_cross_validation':
                print('Selected a random cross validation splitting strategy ')
                config['experiment']['splitting']['validation_splitting']['folds'] = int(request.form.get(
                    'validation_random_cross_validation_folds'))

    elif config['experiment']['data_config']['strategy'] == 'fixed':

        print('selected fixed strategy')
        cript = hashlib.md5((timestamp_string + 'request/').encode('utf-8'))
        _path = '../data/' + hashlib.md5((timestamp_string + '_request/').encode('utf-8'))
        os.makedirs(_path, exist_ok=False)
        train_path = _path + 'test_dataset.tsv'
        test_path = _path + 'test_dataset.tsv'
        request.files.get('train_file').save(train_path)
        request.files.get('test_file').save(test_path)
        config['experiment']['data_config']['train_path'] = train_path
        config['experiment']['data_config']['test_path'] = test_path
        if request.files.get('validation_file'):
            validation_path = _path + 'validation_dataset.tsv'
            request.files.get('validation_file').save(validation_path)
            config['experiment']['data_config']['validation_path'] = validation_path


    elif config['experiment']['data_config']['strategy'] == 'hierarchy':

        print('selected hierarchy strategy')
        root_folder = '../data/' + hashlib.md5((timestamp_string + '_request/').encode('utf-8'))
        temp_path = '../data/temp/' + timestamp_string + 'zip_dataset'
        request.files['dataset_folder'].save(temp_path)
        with zipfile.ZipFile(temp_path, 'r') as zip_ref:
            zip_ref.extractall(root_folder)
        shutil.rmtree(temp_path)  # pulire la cartella di files temporanei
        config['experiment']['data_config']['root_folder'] = root_folder

    config['experiment']['dataset'] = request.files['file'].filename
    # così ho preso il nome del dataset passato dall'utente (caso strategia dataset)
    # vedi come funziona con hierarchy e fixed poi

    # gestione salvataggio dati splittati (scegliamo lato backend di salvarli, non sceglie l'utente)
    save_folder = 'splitted_data/' + cript.hexdigest()
    config['experiment']['splitting']['save_on_disk'] = True
    config['experiment']['splitting']['save_folder'] = save_folder

    # selezione del seed random
    if request.form.get('random_seed'):
        config['experiment']['random_seed'] = int(request.form.get('random_seed'))
    # gestione binarize
    config['experiment']['binarize'] = bool(request.form.get('binarize', type=json.loads))
    # valutare se inserire accelerazione GPU
    return config
 """
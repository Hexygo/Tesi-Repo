import os
import json
import shutil
from datetime import datetime
import hashlib  # se proprio dopo vogliamo farla con hash il nome del dataset
from flask import Flask, request
import zipfile  # per gestire lo zip inviato nella strategia hierarchy
import ast

def create_model_config_dict(request):
    config = dict()
    timestamp = datetime.now()
    timestamp_string = timestamp.strftime("%d-%m-%Y-%H-%M-%S")
    cript = hashlib.md5((timestamp_string + 'request/').encode('utf-8'))
    base_path = 'data/' + cript.hexdigest() #da scrivere per indirizzare i file nel giusto path di base sono tutti dentro data
    os.makedirs(base_path, exist_ok=False)
    train_dataset_path = base_path + '/train_dataset.tsv'
    test_dataset_path = base_path + '/test_dataset.tsv'
    log_path=base_path+'/log'
    os.makedirs(log_path, exist_ok=False)
    request.files.get('train_file').save(train_dataset_path)
    request.files.get('test_file').save(test_dataset_path)
    config['experiment'] = dict()
    config['experiment']['path_log_folder']=log_path
    if request.form.get('top_k'):
        top_k = int(request.form.get('top_k'))
        #rev_tresh=json.loads(request.form.get('rev_tresh'))
        config['experiment']['top_k'] = top_k
    else:
        config['experiment']['top_k'] = 10
    config['experiment']['dataset'] = 'dataset_name' #devo gestire il nome del dataset usato per l'esperimento
    config['experiment']['data_config'] = dict()
    config['experiment']['data_config']['strategy'] = "evaluation"
    config['experiment']['data_config']['train_path'] = train_dataset_path
    config['experiment']['data_config']['test_path'] = test_dataset_path

    config['experiment']['models'] = dict()

    models = request.form.get('models', type=json.loads)

    for model in models:
        config['experiment']['models'][model['loading_model']] = dict()
        config['experiment']['models'][model['loading_model']]['meta'] = dict()
        config['experiment']['models'][model['loading_model']]['meta']['verbose'] = False
        config['experiment']['models'][model['loading_model']]['meta']['save_weights'] = True
        config['experiment']['models'][model['loading_model']]['meta']['validation_metric'] = model.get('validation_metric', '')
        validation_rate = int(model.get('validation_rate'))
        config['experiment']['models'][model['loading_model']]['meta']['validation_rate'] = validation_rate
        config['experiment']['models'][model['loading_model']]['meta']['hyper_opt_alg'] = model.get('hyper_opt_alg')
        config['experiment']['models'][model['loading_model']]['meta']['hyper_max_evals'] = model.get('hyper_max_evals')
        for parameter in model:
            try:
                config['experiment']['models'][model['loading_model']][parameter] = ast.literal_eval(model[parameter])
            except:
                config['experiment']['models'][model['loading_model']][parameter] = model[parameter]

    config['experiment']['evaluation'] = dict()
    config['experiment']['evaluation']['simple_metrics'] = [models[0]['validation_metric'].split('@')[0]]
    cutoffs = int(models[0]['validation_metric'].split('@')[1])
    config['experiment']['evaluation']['cutoffs'] = [cutoffs]
    config['experiment']['evaluation']['paired_ttest'] = False

    save_folder = 'results/' + cript.hexdigest()
    config['experiment']['save_folder'] = save_folder

    return config, base_path

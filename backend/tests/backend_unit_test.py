from testcontainers.core.container import DockerContainer
from testcontainers.core import waiting_utils

import pytest
import os

import requests

BASE_URL='http://127.0.0.1:5000'

@pytest.fixture
def  start_container(): #fixture per avviare il container
    with DockerContainer('tesi--backend').with_bind_ports(5000,5000) as container:
        return container

def test_container_running(start_container): # Verifica che il container sia attivo, e quindi che non ci siano stati errori di build
    delay = waiting_utils.wait_container_is_ready(start_container)
    pass

def test_API_alive(start_container): # Verifica che gli endpoint siano attivi
    container = start_container.start()
    waiting_utils.wait_for_logs(container,'Press')
    req = requests.get(BASE_URL+'/contatti')
    assert req.status_code == 200

def setup_request_preprocess():# Funzione helper per produrre la richiesta
    form_data = {
            'loading_strategy': 'dataset',
            'random_seed': '42',
            'binarize': 'false',
            'global_threshold': 'false',
            'user_average': 'true',
            'user_k_core': 'false',
            'item_k_core': 'false',
            'iterative_k_core': 'false',
            'n_rounds_k_core': 'false',
            'cold_users': 'false',
            'global_threshold_threshold': '0',
            'user_k_core_core': '0',
            'item_k_core_core': '0',
            'iterative_k_core_core': '0',
            'n_rounds_k_core_core': '0',
            'n_rounds_k_core_rounds': '0',
            'cold_users_threshold': '0',
            'test_fixed_timestamp': 'false',
            'test_temporal_hold_out': 'false',
            'test_random_subsampling': 'true',
            'test_random_cross_validation': 'false',
            'test_fixed_timestamp_value': '',
            'test_temporal_hold_out_test_ratio': '0',
            'test_temporal_hold_out_leave_n_out': '0',
            'test_random_subsampling_test_ratio': '0.2',
            'test_random_cross_validation_folds': '0',
            'validation_fixed_timestamp': 'false',
            'validation_temporal_hold_out': 'false',
            'validation_random_subsampling': 'false',
            'validation_random_cross_validation': 'true',
            'validation_fixed_timestamp_value': '',
            'validation_temporal_hold_out_test_ratio': '0',
            'validation_temporal_hold_out_leave_n_out': '0',
            'validation_random_cross_validation_folds': '5',
            'validation_random_subsampling_test_ratio': '0'
    }
    files =[('file',('sample_dataset',open(os.path.join(os.path.dirname(__file__),'data','sample_dataset.tsv'),'rb'),'application/octet-stream'))]
    headers = {
      'Host': '127.0.0.1:5000',
      'Accept': '*/*',
      'Accept-Encoding': 'gzip, deflate, br'
    }
    req = requests.request("POST", BASE_URL+'/api/v1/preprocessing-json', headers=headers, data=form_data, files=files)
    return req

@pytest.mark.slow
def test_preprocess_dataset(start_container): # Verifica la corretta funzionalità di preprocess-json - DATASET
    container = start_container.start()
    waiting_utils.wait_for_logs(container, 'Press')
    setup_request_preprocess().raise_for_status() # Lancerà un HTTPException in caso di errore

@pytest.mark.slow
def test_preprocess_fixed(start_container): # Verifica la corretta funzionalità di preprocess-json - FIXED
    container = start_container.start()
    waiting_utils.wait_for_logs(container, 'Press')
    form_data = {
        'random_seed':'42',
        'loading_strategy':'fixed',
        'binarize':'false',        
    }
    files =[
        ('file',            ('sample_train',        open(os.path.join(os.path.dirname(__file__),'data','sample_train.tsv'),'rb'),   'application/octet-stream')),
        ('test_file',       ('sample_test',         open(os.path.join(os.path.dirname(__file__),'data','sample_test.tsv'),'rb'),    'application/octet-stream')),
        ('validation_file', ('sample_validation',   open(os.path.join(os.path.dirname(__file__),'data','sample_val.tsv'),'rb'),     'application/octet-stream'))
    ]
    headers = {
      'Host': '127.0.0.1:5000',
      'Accept': '*/*',
      'Accept-Encoding': 'gzip, deflate, br'
    }
    requests.request("POST", BASE_URL+'/api/v1/preprocessing-json', headers=headers, data=form_data, files=files).raise_for_status()

@pytest.mark.slow
def test_preprocess_hierarchy(start_container): # Verifica la corretta funzionalità di preprocess-json - HIERARCHY
    container = start_container.start()
    waiting_utils.wait_for_logs(container, 'Press')
    form_data = {
        'random_seed':'42',
        'loading_strategy':'hierarchy',
        'binarize':'false',        
    }
    files =[('file',('sample_hierarchy', open(os.path.join(os.path.dirname(__file__), 'data', 'sample_hierarchy.zip'),'rb'), 'application/octet-stream'))]
    headers = {
      'Host': '127.0.0.1:5000',
      'Accept': '*/*',
      'Accept-Encoding': 'gzip, deflate, br'
    }
    requests.request("POST", BASE_URL+'/api/v1/preprocessing-json', headers=headers, data=form_data, files=files).raise_for_status()

@pytest.mark.slow
def test_download_preprocess(start_container): # Verifica il corretto funzionamento del download del dataset preprocessato
    container = start_container.start()
    waiting_utils.wait_for_logs(container, 'Press')
    requests.request("GET", BASE_URL+'/api/v1/preprocessing/download/'+setup_request_preprocess().json()).raise_for_status() # Lancerà un HTTPException in caso di errore

def setup_request_recommendation():
    form_data = { # Configurazione Esempio sulla documentazione di Elliot
        'top_k':'10',
        'models':'[{"id":0,"modelClass":"Unpersonalized Recommenders","loading_model":"MostPop","validation_metric":"nDCG","validation_rate":"10"},{"id":1,"modelClass":"Neighborhood-based Models","loading_model":"ItemKNN","neighbors":"50","similarity":"cosine","implementation":"standard","validation_metric":"nDCG","validation_rate":"10"}]'}
    files = [
        ('train_file',      ('sample_train',    open(os.path.join(os.path.dirname(__file__),'data','sample_train.tsv'),'rb'),   'application/octet-stream')),
        ('test_file',       ('sample_test',     open(os.path.join(os.path.dirname(__file__),'data','sample_test.tsv'),'rb'),    'application/octet-stream'))
    ]
    headers = {
      'Host': '127.0.0.1:5000',
      'Accept': '*/*',
      'Accept-Encoding': 'gzip, deflate, br'
    }
    return requests.request("POST", BASE_URL+'/api/v1/recommendationmodel-json', headers=headers, data=form_data, files=files)

@pytest.mark.slow
def test_recommendation(start_container): # Verifica il corretto funzionamento della raccomandazione dei modelli
    container = start_container.start()
    waiting_utils.wait_for_logs(container, 'Press')
    setup_request_recommendation().raise_for_status()

@pytest.mark.slow
def test_recommendation_download(start_container): # Verifica il corretto funzionamento del download di "recs"
    container = start_container.start()
    waiting_utils.wait_for_logs(container, 'Press')
    req = setup_request_recommendation()
    requests.request("GET", BASE_URL+'/api/v1/recommendationmodel/download/'+req.json()).raise_for_status()

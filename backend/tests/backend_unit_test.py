from testcontainers.core.container import DockerContainer
from testcontainers.core import waiting_utils

import pytest
import os

import requests

BASE_URL='http://127.0.0.1:5000'

def setup_request_preprocess():# Funzione helper per produrre la richiesta
    form_data = {
        "loading_strategy": "dataset",
        "binarize": False,
        "random_seed": "42",
        "prefiltering_strategies": "[{\"strategy\":\"user_average\"}]",
        "test_splitting_strategy": "random_subsampling",
        "test_splitting_ratio": "0.2",
        "validation_splitting_strategy": "random_cross_validation",
        "validation_splitting_folds": "5"
    }
    files =[('file',('sample_dataset',open(os.path.join(os.path.dirname(__file__),'data','sample_dataset.tsv'),'rb'),'application/octet-stream'))]
    req = requests.request("POST", BASE_URL+'/api/v1/preprocessing-json', data=form_data, files=files)
    return req

def setup_request_recommendation():
    form_data = { # Configurazione Esempio sulla documentazione di Elliot
        'top_k':'10',
        'models':'[{"id":0,"modelClass":"Unpersonalized Recommenders","loading_model":"MostPop","validation_metric":"nDCG","validation_rate":"10"},{"id":1,"modelClass":"Neighborhood-based Models","loading_model":"ItemKNN","neighbors":"50","similarity":"cosine","implementation":"standard","validation_metric":"nDCG","validation_rate":"10"}]'}
    files = [
        ('train_file',      ('sample_train',    open(os.path.join(os.path.dirname(__file__),'data','sample_train.tsv'),'rb'),   'application/octet-stream')),
        ('test_file',       ('sample_test',     open(os.path.join(os.path.dirname(__file__),'data','sample_test.tsv'),'rb'),    'application/octet-stream'))
    ]
    return requests.request("POST", BASE_URL+'/api/v1/recommendationmodel-json', data=form_data, files=files)

def setup_request_evaluation():
    form_data = {
        'top_k': '1',
        'rev_tresh': '1',
        't_test': 'false',
        'wilcoxon': 'false',
        'simple_metrics[]': 'AUC',
        'complex_metrics[]': '{"id":"ExtendedF1"}'
    }
    files = [
        ('test_dataset',        ('sample_test', open(os.path.join(os.path.dirname(__file__),'data','sample_test.tsv'),'rb'),    'application/octet-stream')),
        ('train_dataset',       ('sample_train',open(os.path.join(os.path.dirname(__file__),'data','sample_train.tsv'),'rb'),   'application/octet-stream')),
        ('recs_dataset',        ('sample_recs', open(os.path.join(os.path.dirname(__file__),'data','sample_recs.tsv'), 'rb'),   'application/octet-stream'))
    ]
    return requests.request("POST", BASE_URL+'/api/v1/evaluation', data=form_data, files=files)

@pytest.fixture
def  start_container(): #fixture per avviare il container
    with DockerContainer('tesi-repo-backend').with_bind_ports(5000,5000) as container:
        return container

def test_container_running(start_container): # Verifica che il container sia attivo, e quindi che non ci siano stati errori di build
    delay = waiting_utils.wait_container_is_ready(start_container)
    pass

def test_API_alive(start_container): # Verifica che gli endpoint siano attivi
    container = start_container.start()
    waiting_utils.wait_for_logs(container,'Press')
    req = requests.get(BASE_URL+'/contatti')
    assert req.status_code == 200

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
    requests.request("POST", BASE_URL+'/api/v1/preprocessing-json', data=form_data, files=files).raise_for_status()

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
    requests.request("POST", BASE_URL+'/api/v1/preprocessing-json', data=form_data, files=files).raise_for_status()

@pytest.mark.slow
def test_download_preprocess(start_container): # Verifica il corretto funzionamento del download del dataset preprocessato
    container = start_container.start()
    waiting_utils.wait_for_logs(container, 'Press')
    requests.request("GET", BASE_URL+'/api/v1/preprocessing/download/'+setup_request_preprocess().json()).raise_for_status() # Lancerà un HTTPException in caso di errore

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

def test_evaluation(start_container): # Verifica il corretto funzionamento della valutazione delle prestazioni dei modelli di raccomandazione
    container = start_container.start()
    waiting_utils.wait_for_logs(container, 'Press')
    setup_request_evaluation().raise_for_status()
    
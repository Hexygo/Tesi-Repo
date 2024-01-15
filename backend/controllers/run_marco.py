"""
Module description:

"""

__version__ = '0.3.1'
__author__ = 'Vito Walter Anelli, Claudio Pomo'
__email__ = 'vitowalter.anelli@poliba.it, claudio.pomo@poliba.it'

import importlib
import json
import os
from os import path

import numpy as np
import sys

from elliot.namespace.namespace_model_builder import NameSpaceBuilder
from elliot.result_handler.result_handler import ResultHandler, HyperParameterStudy, StatTest
from hyperopt import Trials, fmin
from elliot.utils import logging as logging_project
import elliot.hyperoptimization as ho

_rstate = np.random.RandomState(42)
here = path.abspath(path.dirname(__file__) + '/../')

print(u'''
__/\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\___/\\\\\\\\\\\\______/\\\\\\\\\\\\_________________________________________        
 _\\/\\\\\\///////////___\\////\\\\\\_____\\////\\\\\\_________________________________________       
  _\\/\\\\\\_________________\\/\\\\\\________\\/\\\\\\______/\\\\\\_____________________/\\\\\\______      
   _\\/\\\\\\\\\\\\\\\\\\\\\\_________\\/\\\\\\________\\/\\\\\\_____\\///_______/\\\\\\\\\\______/\\\\\\\\\\\\\\\\\\\\\\_     
    _\\/\\\\\\///////__________\\/\\\\\\________\\/\\\\\\______/\\\\\\____/\\\\\\///\\\\\\___\\////\\\\\\////__    
     _\\/\\\\\\_________________\\/\\\\\\________\\/\\\\\\_____\\/\\\\\\___/\\\\\\__\\//\\\\\\_____\\/\\\\\\______   
      _\\/\\\\\\_________________\\/\\\\\\________\\/\\\\\\_____\\/\\\\\\__\\//\\\\\\__/\\\\\\______\\/\\\\\\_/\\\\__  
       _\\/\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\___/\\\\\\\\\\\\\\\\\\___/\\\\\\\\\\\\\\\\\\__\\/\\\\\\___\\///\\\\\\\\\\/_______\\//\\\\\\\\\\___ 
        _\\///////////////___\\/////////___\\/////////___\\///______\\/////__________\\/////____''')

print(f'Version Number: {__version__}')


def run_experiment(config_dict):

    builder = NameSpaceBuilder(config_dict, here, here) #modifica rispetto alla versione tradizionale di elliot
    base = builder.base

    dataloader_class = getattr(importlib.import_module("elliot.dataset"),
                               "DataSetLoader")
    # la funzione import_module importa il modulo di cui specifichiamo il path, nello specifico di tale modulo vogliamo l'attributo
    # DataSetLoader
    dataloader = dataloader_class(
        base.base_namespace)   #Passare il namespace di configurazione costruito a partire dal dizionario config
    data_test_list = dataloader.generate_dataobjects() #i nostri risultati

    return data_test_list

def run_evaluation(config_dict, path):
    builder = NameSpaceBuilder(config_dict, here, here)
    base = builder.base_evaluation
    logging_project.init(base.base_namespace.path_logger_config, base.base_namespace.path_log_folder)

    base.base_namespace.evaluation.relevance_threshold = getattr(base.base_namespace.evaluation, "relevance_threshold",
                                                                 0)
    res_handler = ResultHandler(rel_threshold=base.base_namespace.evaluation.relevance_threshold)
    hyper_handler = HyperParameterStudy(rel_threshold=base.base_namespace.evaluation.relevance_threshold)
    dataloader_class = getattr(importlib.import_module("elliot.dataset"),
                               "DataSetLoader")
    dataloader = dataloader_class(
        base.base_namespace)  # Passare il namespace di configurazione costruito a partire dal dizionario config

    data_test_list = dataloader.generate_dataobjects()
    key, model_base= builder.proxy_recommender()
    test_results = []
    test_trials = []
    data_test = data_test_list[0]

    logging_project.prepare_logger(key, base.base_namespace.path_log_folder)

    model_class = getattr(importlib.import_module("elliot.recommender"), key)

    model_placeholder = ho.ModelCoordinator(data_test, base.base_namespace, model_base, model_class,
                                            0)

    print(f"Training begun for {model_class.__name__}\\n")
    single = model_placeholder.single()

    return single['test_results']

def run_recommendation(config_dict, path): #modifica tonì
    builder = NameSpaceBuilder(config_dict, here, here)
    base = builder.base_recommendation
    logging_project.init(base.base_namespace.path_logger_config, base.base_namespace.path_log_folder)
    logger = logging_project.get_logger("__main__")

    base.base_namespace.evaluation.relevance_threshold = getattr(base.base_namespace.evaluation, "relevance_threshold",
                                                                 0)
    res_handler = ResultHandler(rel_threshold=base.base_namespace.evaluation.relevance_threshold)
    hyper_handler = HyperParameterStudy(rel_threshold=base.base_namespace.evaluation.relevance_threshold)
    dataloader_class = getattr(importlib.import_module("elliot.dataset"),
                               "DataSetLoader")
    dataloader = dataloader_class(
        base.base_namespace)  # Passare il namespace di configurazione costruito a partire dal dizionario config

    data_test_list = dataloader.generate_dataobjects()
    # key, model_base= builder.fill_model() #modifica con nome modello
    # test_results = []
    # test_trials = []

    for key, model_base in builder.models():
        test_results = []
        test_trials = []
        for test_fold_index, data_test in enumerate(data_test_list):
            logging_project.prepare_logger(key, base.base_namespace.path_log_folder)
            if key.startswith("external."):
                spec = importlib.util.spec_from_file_location("external",
                                                              path.relpath(base.base_namespace.external_models_path))
                external = importlib.util.module_from_spec(spec)
                sys.modules[spec.name] = external
                spec.loader.exec_module(external)
                model_class = getattr(importlib.import_module("external"), key.split(".", 1)[1])
            else:
                model_class = getattr(importlib.import_module("elliot.recommender"), key)

            model_placeholder = ho.ModelCoordinator(data_test, base.base_namespace, model_base, model_class,
                                                    test_fold_index)
            if isinstance(model_base, tuple):
                logger.info(f"Tuning begun for {model_class.__name__}\\n")
                trials = Trials()
                fmin(model_placeholder.objective,
                     space=model_base[1],
                     algo=model_base[3],
                     trials=trials,
                     verbose=False,
                     rstate=_rstate,
                     max_evals=model_base[2])

                # argmin relativo alla combinazione migliore di iperparametri
                min_val = np.argmin([i["result"]["loss"] for i in trials._trials])
                ############################################
                best_model_loss = trials._trials[min_val]["result"]["loss"]
                best_model_params = trials._trials[min_val]["result"]["params"]
                best_model_results = trials._trials[min_val]["result"]["test_results"]
                ############################################

                # aggiunta a lista performance test
                test_results.append(trials._trials[min_val]["result"])
                test_trials.append(trials)
                logger.info(f"Tuning ended for {model_class.__name__}")
            else:
                logger.info(f"Training begun for {model_class.__name__}\\n")
                single = model_placeholder.single()

                ############################################
                best_model_loss = single["loss"]
                best_model_params = single["params"]
                best_model_results = single["test_results"]
                ############################################

                # aggiunta a lista performance test
                test_results.append(single)
                logger.info(f"Training ended for {model_class.__name__}")

            logger.info(f"Loss:\\t{best_model_loss}")
            logger.info(f"Best Model params:\\t{best_model_params}")
            logger.info(f"Best Model results:\\t{best_model_results}")

            # Migliore sui test, aggiunta a performance totali
        min_val = np.argmin([i["loss"] for i in test_results])

        res_handler.add_oneshot_recommender(**test_results[min_val])

        if isinstance(model_base, tuple):
            hyper_handler.add_trials(test_trials[min_val])

    data_test = data_test_list[0]

    logging_project.prepare_logger(key, base.base_namespace.path_log_folder)

    model_class = getattr(importlib.import_module("elliot.recommender"), key)

    model_placeholder = ho.ModelCoordinator(data_test, base.base_namespace, model_base, model_class,
                                            0)

    print(f"Training begun for {model_class.__name__}\\n")
    single = model_placeholder.single()

    return single['test_results']
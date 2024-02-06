import os
import json
import uuid
from flask import Flask

def create_evaluation_config_dict(request:Flask.request_class):
    config = dict()
    name = str(uuid.uuid4())
    base_path = 'data/' + name #da scrivere per indirizzare i file nel giusto path di base sono tutti dentro data
    os.makedirs(base_path, exist_ok=False)
    train_dataset_path = base_path + '/test_dataset.tsv'
    test_dataset_path = base_path + '/train_dataset.tsv'
    log_path=base_path+'/log'
    os.makedirs(log_path, exist_ok=False)
    request.files.get('train_dataset').save(train_dataset_path)
    request.files.get('test_dataset').save(test_dataset_path)

    config['experiment'] = dict()
    config['experiment']['path_log_folder']=log_path

    output_path = 'results/'+name+'/performance'
    os.makedirs(output_path, exist_ok=False)
    config['experiment']['path_output_rec_performance'] = output_path

    config['experiment']['dataset'] = 'dataset_name' #devo gestire il nome del dataset usato per l'esperimento
    
    config['experiment']['data_config'] = dict()
    config['experiment']['data_config']['strategy'] = "evaluation"
    config['experiment']['data_config']['train_path'] = train_dataset_path
    config['experiment']['data_config']['test_path'] = test_dataset_path

    config['experiment']['evaluation'] = dict()
    top_k = int(request.form.get('top_k'))
    config['experiment']['top_k'] = top_k
    config['experiment']['evaluation']['relevance_threshold'] = int(request.form.get('rev_tresh'))
    config['experiment']['evaluation']['paired_ttest'] = request.form.get('t_test') == 'true'
    config['experiment']['evaluation']['wilcoxon_test'] = request.form.get('wilcoxon') == 'true'

    cutoffs = request.form.getlist('cutoffs[]')
    cutoffs = [int(cutoff) for cutoff in cutoffs]
    if cutoffs:
        config['experiment']['evaluation']['cutoffs'] = cutoffs
    else:
        config['experiment']['evaluation']['cutoffs']=top_k

    simple_metrics = request.form.getlist('simple_metrics[]')
    if simple_metrics:
        config['experiment']['evaluation']['simple_metrics']=simple_metrics
    else:
        config['experiment']['evaluation']['simple_metrics']=['Precision']
    
    complex_metrics = request.form.getlist('complex_metrics[]', type=json.loads)
    config['experiment']['evaluation']['complex_metrics'] = []

    for metric in complex_metrics:
        metric['metric']=metric.pop('id')
        if metric['metric'] in ['BiasDisparityBD','BiasDisparityBR','BiasDisparityBS']:
            spec = metric['metric'][-2:]
            user_path = base_path + '/BiasDisparity'+spec+'_user_clustering_file.tsv'
            item_path = base_path + '/BiasDisparity'+spec+'_item_clustering_file.tsv'
            request.files.get('fairness.user_clustering_file_BiasDisparity'+spec).save(user_path)
            request.files.get('fairness.item_clustering_file_BiasDisparity'+spec).save(item_path)
            metric['user_clustering_name'] = request.form.get('fairness.user_clustering_name_BiasDisparity'+spec)
            metric['user_clustering_file'] = user_path
            metric['item_clustering_name'] = request.form.get('fairness.item_clustering_name_BiasDisparity'+spec)
            metric['item_clustering_file'] = item_path

        if metric['metric'] in ['ItemMADranking','ItemMADrating','UserMADranking','UserMADrating']:
            path = base_path + '/'+metric['metric']+'.tsv'
            request.files.get('fairness.clustering_file_'+metric['metric']).save(path)
            metric['clustering_name'] = request.form.get('fairness.clustering_name_'+metric['metric'])
            metric['clustering_file'] = path

        if metric['metric'] in ['REO','RSP']:
            path = base_path + '/'+metric['metric']+'.tsv'
            request.files.get('fairness.clustering_file_'+metric['metric']).save(path)
            metric['clustering_name'] = request.form.get('fairness.clustering_name_'+metric['metric'])
            metric['clustering_file'] =path

        if 'beta' in metric.keys():
            metric['beta'] = int(metric['beta'])

        if metric['metric'] in ['DSC', 'ExtendedF1']:
            metric['metric_0'] = 'Precision'
            metric['metric_1'] = 'Recall'

        config['experiment']['evaluation']['complex_metrics'].append(metric)
            
    # DEPRECATO
    # if complex_metrics:
    #     # if 'DSC' in complex_metrics:
    #     #     d1 = dict()
    #     #     d1['metric'] = 'DSC'
    #     #     d1['beta'] = json.loads(request.form.get('beta'))
    #     #     d1['metric_0'] = 'Precision'
    #     #     d1['metric_1'] = 'Recall'
    #     #     config['experiment']['evaluation']['complex_metrics'].append(d1)
    #     # if 'ExtendedF1' in complex_metrics:
    #     #     d2 = dict()
    #     #     d2['metric'] = 'ExtendedF1'
    #     #     d2['metric_0'] = 'Precision'
    #     #     d2['metric_1'] = 'Recall'
    #     #     config['experiment']['evaluation']['complex_metrics'].append(d2)
    #     # if 'ExtendedEFD' in complex_metrics:
    #     #     d3 = dict()
    #     #     d3['metric'] = 'ExtendedEFD'
    #     #     config['experiment']['evaluation']['complex_metrics'].append(d3)
    #     # if 'ExtendedEPC' in complex_metrics:
    #     #     d4 = dict()
    #     #     d4['metric'] = 'ExtendedEPC'
    #     #     config['experiment']['evaluation']['complex_metrics'].append(d4)
    #     # if 'ExtendedPopreo' in complex_metrics:
    #     #     d5 = dict()
    #     #     d5['metric'] = 'ExtendedPopREO'
    #     #     config['experiment']['evaluation']['complex_metrics'].append(d5)
    #     # if 'ExtendedPoprsp' in complex_metrics:
    #     #     d6 = dict()
    #     #     d6['metric'] = 'ExtendedPopRSP'
    #     #     config['experiment']['evaluation']['complex_metrics'].append(d6)
    #     # if 'BiasDisparityBD' in complex_metrics:
    #     #     user_path = base_path + '/BiasDisparityBD_user_clustering_file.tsv'
    #     #     item_path = base_path + '/BiasDisparityBD_item_clustering_file.tsv'
    #     #     request.files.get('user_clustering_file_BD').save(user_path)
    #     #     request.files.get('item_clustering_file_BD').save(item_path)
    #     #     d7=dict()
    #     #     d7['metric'] = 'BiasDisparityBD'
    #     #     d7['user_clustering_name'] = request.form.get('user_clustering_name_BD')
    #     #     d7['user_clustering_file'] = user_path
    #     #     d7['item_clustering_name'] = request.form.get('item_clustering_name_BD')
    #     #     d7['item_clustering_file'] = item_path
    #     #     config['experiment']['evaluation']['complex_metrics'].append(d7)
    #     # if 'BiasDisparityBR' in complex_metrics:
    #     #     user_path = base_path + '/BiasDisparityBR_user_clustering_file.tsv'
    #     #     item_path = base_path + '/BiasDisparityBR_item_clustering_file.tsv'
    #     #     request.files.get('user_clustering_file_BR').save(user_path)
    #     #     request.files.get('item_clustering_file_BR').save(item_path)
    #     #     d8=dict()
    #     #     d8['metric'] = 'BiasDisparityBR'
    #     #     d8['user_clustering_name'] = request.form.get('user_clustering_name_BR')
    #     #     d8['user_clustering_file'] = user_path
    #     #     d8['item_clustering_name'] = request.form.get('item_clustering_name_BR')
    #     #     d8['item_clustering_file'] = item_path
    #     #     config['experiment']['evaluation']['complex_metrics'].append(d8)
    #     # if 'BiasDisparityBS' in complex_metrics:
    #     #     user_path = base_path + '/BiasDisparityBS_user_clustering_file.tsv'
    #     #     item_path = base_path + '/BiasDisparityBS_item_clustering_file.tsv'
    #     #     request.files.get('user_clustering_file_BS').save(user_path)
    #     #     request.files.get('item_clustering_file_BS').save(item_path)
    #     #     d9=dict()
    #     #     d9['metric'] = 'BiasDisparityBS'
    #     #     d9['user_clustering_name'] = request.form.get('user_clustering_name_BS')
    #     #     d9['user_clustering_file'] = user_path
    #     #     d9['item_clustering_name'] = request.form.get('item_clustering_name_BS')
    #     #     d9['item_clustering_file'] = item_path
    #     #     config['experiment']['evaluation']['complex_metrics'].append(d9)
    #     # if 'ItemMADranking' in complex_metrics:
    #     #     path = base_path + '/IMADranking.tsv'
    #     #     request.files.get('clustering_file_iMADranking').save(path)
    #     #     d10=dict()
    #     #     d10['metric'] = 'ItemMADranking'
    #     #     d10['clustering_name'] = request.form.get('clustering_name_iMADranking')
    #     #     d10['clustering_file'] = path
    #     #     config['experiment']['evaluation']['complex_metrics'].append(d10)
    #     # if 'ItemMADrating' in complex_metrics:
    #     #     path = base_path + '/IMADrating.tsv'
    #     #     request.files.get('clustering_file_iMADrating').save(path)
    #     #     d11=dict()
    #     #     d11['metric'] = 'ItemMADrating'
    #     #     d11['clustering_name'] = request.form.get('clustering_name_iMADrating')
    #     #     d11['clustering_file'] =path
    #     #     config['experiment']['evaluation']['complex_metrics'].append(d11)
    #     # if 'UserMADranking' in complex_metrics:
    #     #     path = base_path + '/UMADranking.tsv'
    #     #     request.files.get('clustering_file_uMADranking').save(path)
    #     #     d12=dict()
    #     #     d12['metric'] = 'UserMADranking'
    #     #     d12['clustering_name'] = request.form.get('clustering_name_uMADranking')
    #     #     d12['clustering_file'] =path
    #     #     config['experiment']['evaluation']['complex_metrics'].append(d12)
    #     # if 'UserMADrating' in complex_metrics:
    #     #     path = base_path + '/IMADrating.tsv'
    #     #     request.files.get('clustering_file_uMADrating').save(path)
    #     #     d13=dict()
    #     #     d13['metric'] = 'UserMADrating'
    #     #     d13['clustering_name'] = request.form.get('clustering_name_uMADrating')
    #     #     d13['clustering_file'] =path
    #     #     config['experiment']['evaluation']['complex_metrics'].append(d13)
    #     if 'REO' in complex_metrics:
    #         path = base_path + '/REO.tsv'
    #         request.files.get('clustering_file_REO').save(path)
    #         d14=dict()
    #         d14['metric'] = 'REO'
    #         d14['clustering_name'] = request.form.get('clustering_name_REO')
    #         d14['clustering_file'] =path
    #         config['experiment']['evaluation']['complex_metrics'].append(d14)
    #     if 'RSP' in complex_metrics:
    #         path = base_path + '/RSP.tsv'
    #         request.files.get('clustering_file_RSP').save(path)
    #         d15 = dict()
    #         d15['metric'] = 'RSP'
    #         d15['clustering_name'] = request.form.get('clustering_name_RSP')
    #         d15['clustering_file'] =path
    #         config['experiment']['evaluation']['complex_metrics'].append(d15)

    proxyRecommenderPath=base_path +'/recsdataset.tsv'
    request.files.get('recs_dataset').save(proxyRecommenderPath)
    config['experiment']['models']=dict()
    config['experiment']['models']['ProxyRecommender']=dict()
    config['experiment']['models']['ProxyRecommender']['path'] = proxyRecommenderPath


    return config,base_path

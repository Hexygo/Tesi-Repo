from flask import Flask, render_template, request, jsonify, send_file, json

from flask_cors import CORS
from controllers.create_config_dict import create_config_dict
from controllers.create_evaluation_config_dict import create_evaluation_config_dict
from controllers.create_model_config_dict import create_model_config_dict
from controllers.run_marco import run_experiment, run_evaluation, run_recommendation
import shutil
import os

app = Flask(__name__)
CORS(app)

# @app.route("/")  # decoratore che specifica quale percorso poi richiama la def homepage
# def homepage():
#     return render_template("index.html") ==>#non necessario con frontend react

@app.route("/contatti")  # decoratore che specifica quale percorso poi richiama la def contatti
def contatti():
    # TODO mettere redirect a pagina di contatto per eventuali contatti a sviluppatori
    return "Contattaci!"


# API usata per il preprocessing del dataset con una richiesta sincrona
# TODO implementare selezione da frontend tra richiesta sincrona/asincrona a seconda delle necessit dell'utente

# @app.route("/evaluation")
# def evaluation():
#     return render_template("evaluation.html") ==>#non necessario con frontend react

@app.route("/api/v1/preprocessing", methods=['GET', 'POST'])
def preprocess():
    # request deve essere passato ad una funzione che generi un dizionario contenente le informazioni che ci servono
    if request.method == 'POST':
        print("received a preprocessing request!")  # debug string
        print("trying to create a dataframe with pandas ")
        config = create_config_dict(request)  # creo dizionario di configurazione da cui creare un namespace
        preprocessed_dataset = run_experiment(
            config)  # grazie al dizionario costruirò un namespace che darò al run per ottenere il dataset preprocessato in cambio
        request_no = config['experiment']['splitting']['save_folder'].split('splitted_data/')[1]
        return render_template("results.html", config=config, PP=request_no)


# API usato per effettuare il preprocessing con una richiesta asincrona
@app.route("/api/v1/preprocessing-json", methods=['GET', 'POST'])
def preprocess_json():
    # request deve essere passato ad una funzione che generi un dizionario contenente le informazioni che ci servono
    if request.method == 'POST':
        print("received a preprocessing request!")
        print("trying to create a dataframe with pandas ")
        config = create_config_dict(request)  # creo dizionario di configurazione da cui creare un namespace
        preprocessed_dataset = run_experiment(
            config)  # grazie al dizionario costruirò un namespace che darò al run per ottenere il dataset preprocessato in cambio
        request_no = config['experiment']['splitting']['save_folder'].split('splitted_data/')[1]
        return jsonify(request_no)

@app.route("/api/v1/evaluation", methods=['POST'])
def evaluationApi():
    print("richiesta in elaborazione ")
    config, path = create_evaluation_config_dict(request)
    test = run_evaluation(config, path)
    return jsonify({'status':'success', 'result': test, 'path':path}), 201

@app.route("/api/v1/evaluation/download", methods=['GET'])
def download_file():
    path=request.args.get('path')
    output_filename='evaluation_zipped'
    shutil.make_archive(output_filename,'zip',path)
    response = send_file(output_filename + '.zip')
    return response


# API per scaricare il dataset preprocessato
@app.route('/api/v1/preprocessing/download/<request_no>', methods=['GET'])
def send_results(request_no):
    print('received a request of download')
    print(request_no)
    dir_path = 'splitted_data/' + request_no
    output_filename = 'zipped_data/' + request_no
    shutil.make_archive(output_filename, 'zip', dir_path)
    response = send_file(output_filename + '.zip')
    return response

# Load the json file into memory
with open(os.path.join(os.path.dirname(__file__),'static','js','models2.json')) as f:
    file = json.load(f)

#@app.route("/recommendation")
#def home():
#    res=file
#    return render_template("test.html", data=res) ==>#non necessario con frontend react
    #return render_template("test.html")

#test send form data tonio
@app.route("/api/v1/recommendationmodel", methods=['GET', 'POST'])
def recommendationmodel():
    # request deve essere passato ad una funzione che generi un dizionario contenente le informazioni che ci servono
    if request.method == 'POST':
        print("received a recommendations model!")  # debug string
        config, path = create_model_config_dict(request)  # creo dizionario di configurazione da cui creare un namespace
        #try:
        test = run_recommendation(config, path)  # grazie al dizionario costruirò un namespace che darò al run
        #except:
        #    return
        request_no = config['experiment']['save_folder'].split('results/')[1] #controllare
        return render_template("results.html", config=config, PP=request_no) #modificare con la pagina da mostrare come risultato

# API usato con una richiesta asincrona
@app.route("/api/v1/recommendationmodel-json", methods=['GET', 'POST'])
def recommendationmodel_json():
    # request deve essere passato ad una funzione che generi un dizionario contenente le informazioni che ci servono
    if request.method == 'POST':
        print("received a recommendations model!")  # debug string
        config, path = create_model_config_dict(request)  # creo dizionario di configurazione da cui creare un namespace
        test = run_recommendation(config, path)  # grazie al dizionario costruirò un namespace che darò al run
        request_no = config['experiment']['save_folder'].split('results/')[1]
        return jsonify(request_no)

# API per scaricare il dataset preprocessato
@app.route('/api/v1/recommendationmodel/download/<request_no>', methods=['GET'])
def send_results_model(request_no):
    print('received a request of download')
    print(request_no)
    dir_path = 'results/' + request_no
    output_filename = 'zipped_data/' + request_no
    shutil.make_archive(output_filename, 'zip', dir_path)
    response = send_file(output_filename + '.zip')
    return response

#fill second select
# @app.route("/getDataAjax",methods=['GET','POST'])
# def getDataAjax():
#     res=[]
#     if request.method=='POST':
#         for el in file:
#             if el["id"]==request.form['data']:
#                 res=el["models"]
#                 break
#     return render_template("get_data_ajax.html",data=res)  ==>#non necessario con frontend react

#display parameters
 #@app.route("/getParametersAjax",methods=['GET','POST'])
 #def getParametersAjax():
#   res=[]
 #    if request.method=='POST':
  #       #i=int(0)
   #      for el in file:
    #         i = int(0)
     #        for i in range(len(el["models"])):
      #           if el["models"][i]["id"]==request.form['data']:
       #              res=el["models"][i]["parameters"]
        #             break
         #        i+=1
#    return render_template("get_parameters_ajax.html",data=res)  #==>#non necessario con frontend react


if __name__ == '__main__':
    app.run(debug=True)

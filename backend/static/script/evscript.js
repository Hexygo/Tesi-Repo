const train_file = document.getElementById('train_dataset');
const test_file = document.getElementById('test_dataset');
const recs_file = document.getElementById('recs_dataset');
const myform = document.getElementById('main_form');
const simple_metrics_button = document.getElementById('simple_metrics');
const simple_accuracy_button = document.getElementById('simple_accuracy');
const simple_bias_button = document.getElementById('simple_bias');
const simple_coverage_button = document.getElementById('simple_coverage');
const simple_diversity_button = document.getElementById('simple_diversity');
const simple_rating_button = document.getElementById('simple_rating');
const simple_novelty_button = document.getElementById('simple_novelty');
const complex_metrics_button = document.getElementById('complex_metrics');
const complex_accuracy_button = document.getElementById('complex_accuracy');
const complex_bias_button = document.getElementById('complex_bias');
const complex_fairness_button = document.getElementById('complex_fairness');
const complex_novelty_button = document.getElementById('complex_novelty');
const dsc_check = document.getElementById('DSC');
const bd_BD_check = document.getElementById('BiasDisparityBD');
const bd_BR_check = document.getElementById('BiasDisparityBR');
const bd_BS_check = document.getElementById('BiasDisparityBS');
const iMADranking_check = document.getElementById('ItemMADranking');
const iMADrating_check = document.getElementById('ItemMADrating');
const uMADranking_check = document.getElementById('UserMADranking');
const uMADrating_check = document.getElementById('UserMADrating');
const reo_check = document.getElementById('REO');
const rsp_check = document.getElementById('RSP');
const cutoff_check = document.getElementById('cutoffs')
const ok_button = document.getElementById('ok')
const resetButton = document.getElementById('reset')
const ufile_BD = document.getElementById('ucf_BD');
const ifile_BD = document.getElementById('icf_BD');
const ufile_BR = document.getElementById('ucf_BR');
const ifile_BR = document.getElementById('icf_BR');
const ufile_BS = document.getElementById('ucf_BS');
const ifile_BS = document.getElementById('icf_BS');
const file_iMADranking = document.getElementById('cf_iMADranking')
const file_iMADrating = document.getElementById('cf_iMADrating')
const file_uMADranking = document.getElementById('cf_uMADranking')
const file_uMADrating = document.getElementById('cf_uMADrating')
const file_REO = document.getElementById('cf_REO')
const file_RSP = document.getElementById('cf_RSP')
const buttonDownload=document.getElementById('download')
let path=''

simple_metrics_button.addEventListener('click', (e)=>{
    e.preventDefault()
    const box = document.getElementById('simple_box')
    if(box.hidden){
        box.hidden=false
    }else{
        box.hidden=true
    }
})

simple_accuracy_button.addEventListener('click', (e)=>{
    e.preventDefault();
    const box = document.getElementById('simple_accuracy_metrics_box')

    if(box.hidden){
        box.hidden=false
    }else{
        box.hidden=true
    }
})

simple_bias_button.addEventListener('click', (e)=>{
    e.preventDefault();
    const box = document.getElementById('simple_bias_metrics_box')

    if(box.hidden){
        box.hidden=false
    }else{
        box.hidden=true
    }
})

simple_coverage_button.addEventListener('click', (e)=>{
    e.preventDefault();
    const box = document.getElementById('simple_coverage_metrics_box')

    if(box.hidden){
        box.hidden=false
    }else{
        box.hidden=true
    }
})

simple_diversity_button.addEventListener('click', (e)=>{
    e.preventDefault();
    const box = document.getElementById('simple_diversity_metrics_box')

    if(box.hidden){
        box.hidden=false
    }else{
        box.hidden=true
    }
})

simple_rating_button.addEventListener('click', (e)=>{
    e.preventDefault();
    const box = document.getElementById('simple_rating_metrics_box')

    if(box.hidden){
        box.hidden=false
    }else{
        box.hidden=true
    }
})

simple_novelty_button.addEventListener('click', (e)=>{
    e.preventDefault();
    const box = document.getElementById('simple_novelty_metrics_box')

    if(box.hidden){
        box.hidden=false
    }else{
        box.hidden=true
    }
})

complex_metrics_button.addEventListener('click', (e)=>{
    e.preventDefault()
    const box = document.getElementById('complex_box')
    if(box.hidden){
        box.hidden=false
    }else{
        box.hidden=true
    }
})

complex_accuracy_button.addEventListener('click', (e)=>{
    e.preventDefault()
    const box = document.getElementById('complex_accuracy_box');
    if(box.hidden){
        box.hidden=false
    }else{
        box.hidden=true
    }
})

complex_bias_button.addEventListener('click', (e)=>{
    e.preventDefault()
    const box = document.getElementById('complex_bias_box');
    if(box.hidden){
        box.hidden=false
    }else{
        box.hidden=true
    }
})

complex_fairness_button.addEventListener('click', (e)=>{
    e.preventDefault()
    const box = document.getElementById('complex_fairness_box');
    if(box.hidden){
        box.hidden=false
    }else{
        box.hidden=true
    }
})

complex_novelty_button.addEventListener('click', (e)=>{
    e.preventDefault()
    const box = document.getElementById('complex_novelty_box');
    if(box.hidden){
        box.hidden=false
    }else{
        box.hidden=true
    }
})

dsc_check.addEventListener('change', (e)=>{
    if (e.target.checked){
        document.getElementById('beta').hidden=false

    }else{
        document.getElementById('beta').hidden=true
    }
})

bd_BD_check.addEventListener('change', (e)=>{
const hiddenElements = document.getElementsByClassName('bdBDcontrol');
const hiddenBox = document.getElementById('bdBDbox')
    if(e.target.checked){
        hiddenBox.style.display="block"
        for (let item of hiddenElements) {
            item.hidden=false
        }
    }else{
        hiddenBox.style.display="none"
        for (let item of hiddenElements) {
            item.hidden=true
        }
    }
})

bd_BR_check.addEventListener('change',  (e)=>{
    const hiddenElements = document.getElementsByClassName('bdBRcontrol');
    const hiddenBox = document.getElementById('bdBRbox')
        if(e.target.checked){
            hiddenBox.style.display="block"
            for (let item of hiddenElements) {
                item.hidden=false
            }
        }else{
            hiddenBox.style.display="none"
            for (let item of hiddenElements) {
                item.hidden=true
            }
        }
    })

bd_BS_check.addEventListener('change',  (e)=>{
    const hiddenElements = document.getElementsByClassName('bdBScontrol');
    const hiddenBox = document.getElementById('bdBSbox')
        if(e.target.checked){
            hiddenBox.style.display="block"
            for (let item of hiddenElements) {
                item.hidden=false
            }
        }else{
            hiddenBox.style.display="none"
            for (let item of hiddenElements) {
                item.hidden=true
            }
        }
    } )

    iMADranking_check.addEventListener('change', (e)=>{
        const hiddenElements = document.getElementsByClassName('iMADrankingControl');
        const hiddenBox = document.getElementById('iMADrankingbox')
            if(e.target.checked){
                hiddenBox.style.display="block"
                for (let item of hiddenElements) {
                    item.hidden=false
                }
            }else{
                hiddenBox.style.display="none"
                for (let item of hiddenElements) {
                    item.hidden=true
                }
            }
        }  )
    iMADrating_check.addEventListener('change', (e)=>{
        const hiddenElements = document.getElementsByClassName('iMADratingControl');
        const hiddenBox = document.getElementById('iMADratingbox')
            if(e.target.checked){
                hiddenBox.style.display="block"
                for (let item of hiddenElements) {
                    item.hidden=false
                }
            }else{
                hiddenBox.style.display="none"
                for (let item of hiddenElements) {
                    item.hidden=true
                }
            }
        } )
    uMADranking_check.addEventListener('change', (e)=>{
        const hiddenElements = document.getElementsByClassName('uMADrankingControl');
        const hiddenBox = document.getElementById('uMADrankingbox')
            if(e.target.checked){
                hiddenBox.style.display="block"
                for (let item of hiddenElements) {
                    item.hidden=false
                }
            }else{
                hiddenBox.style.display="none"
                for (let item of hiddenElements) {
                    item.hidden=true
                }
            }
        } )
    uMADrating_check.addEventListener('change', (e)=>{
        const hiddenElements = document.getElementsByClassName('uMADratingControl');
        const hiddenBox = document.getElementById('uMADratingbox')
            if(e.target.checked){
                hiddenBox.style.display="block"
                for (let item of hiddenElements) {
                    item.hidden=false
                }
            }else{
                hiddenBox.style.display="none"
                for (let item of hiddenElements) {
                    item.hidden=true
                }
            }
        } )

    reo_check.addEventListener('change', (e)=>{
        const hiddenElements = document.getElementsByClassName('REOcontrol');
        const hiddenBox = document.getElementById('REObox')
            if(e.target.checked){
                hiddenBox.style.display="block"
                for (let item of hiddenElements) {
                    item.hidden=false
                }
            }else{
                hiddenBox.style.display="none"
                for (let item of hiddenElements) {
                    item.hidden=true
                }
            }
        } )

    rsp_check.addEventListener('change', (e)=>{
        const hiddenElements = document.getElementsByClassName('RSPcontrol');
        const hiddenBox = document.getElementById('RSPbox')
            if(e.target.checked){
                hiddenBox.style.display="block"
                for (let item of hiddenElements) {
                    item.hidden=false
                }
            }else{
                hiddenBox.style.display="none"
                for (let item of hiddenElements) {
                    item.hidden=true
                }
            }
        } )

   cutoff_check.addEventListener('change', (e)=>{
    if (e.target.checked){
        document.getElementById('n_k').hidden=false
        document.getElementById('ok').hidden=false
    }else{
        document.getElementById('n_k').hidden=true
        document.getElementById('ok').hidden=true
    }
   })
ok_button.addEventListener('click', (e)=>{
    e.preventDefault()
    if(document.getElementById('n_k').value<=0 || parseInt(document.getElementById('n_k').value)>parseInt(document.getElementById('top_k').value) ) {
        alert('INVALID NUMBER OF CUTOFFS')
    }else{
        if(resetButton.hidden){
        resetButton.hidden =false
    }
    const box = document.getElementById('cutoffInput')
    if(box.hidden){
        box.hidden=false
    }
    ok_button.hidden=true
    const n = document.getElementById('n_k').value
        for(let i=0 ; i<n; i++){
            const numberField = document.createElement("input");
            const placeHolderString = 'valore '+String(i+1)
  	        numberField.setAttribute("type", "number");
  	        numberField.setAttribute("name", "c_value");
            numberField.setAttribute('class', 'c_value');
            numberField.setAttribute('placeholder', placeHolderString)
            box.appendChild(numberField)
            const space = document.createElement('br')
            space.setAttribute('name', 'c_value')
            box.appendChild(space)
            }

        }
   })

resetButton.addEventListener('click', (e)=>{
    e.preventDefault()
    ok_button.hidden=false
    resetButton.hidden=true
    const box = document.getElementById('cutoffInput')
    box.hidden=true
    while (box.firstChild) {
      box.removeChild(box.lastChild);
    }
    document.getElementById('n_k').value=0;
})

ufile_BD.addEventListener('click', (e)=>{
    ufile_BD.style.color='black'
})
ifile_BD.addEventListener('click', (e)=>{
    ifile_BD.style.color='black'
})
ufile_BR.addEventListener('click', (e)=>{
    ufile_BR.style.color='black'
})
ifile_BR.addEventListener('click', (e)=>{
    ifile_BR.style.color='black'
})
ufile_BS.addEventListener('click', (e)=>{
    ufile_BS.style.color='black'
})
ifile_BS.addEventListener('click', (e)=>{
    ifile_BS.style.color='black'
})
file_iMADranking.addEventListener('click', ()=>{
    file_iMADranking.style.color='black'
})
file_iMADrating.addEventListener('click', ()=>{
    file_iMADrating.style.color='black'
})
file_uMADranking.addEventListener('click', ()=>{
    file_uMADranking.style.color='black'
})
file_uMADrating.addEventListener('click', ()=>{
    file_uMADrating.style.color='black'
})
file_REO.addEventListener('click', ()=>{
    file_REO.style.color='black'
})
file_RSP.addEventListener('click', ()=>{
    file_RSP.style.color='black'
})

train_file.addEventListener('click', ()=>{
    train_file.style.color='black'
})
test_file.addEventListener('click', ()=>{
    test_file.style.color='black'
})

recs_file.addEventListener('click', ()=>{
    recs_file.style.color='black'
})
myform.addEventListener('submit', (e)=>{
    e.preventDefault();
    if(controlForm()){
       document.getElementById('load_div').hidden=false
    const data = new FormData();
    let simpleMetrics=[];
    let complexMetrics=[];
    let cutoffs=[]
    data.append("train_dataset", train_file.files[0]);
    data.append("test_dataset", test_file.files[0]);
    data.append("recs_dataset", recs_file.files[0]);
    for (let field of myform){
        if(field.name == 'cutoffs' && field.checked){
            const values = document.getElementsByClassName('c_value');
            for (element of values) {
                cutoffs.push(parseInt(element.value))
            }
            data.append('cutoffs', JSON.stringify(cutoffs))
        }else if(field.name=='cutoffs' && !(field.checked)){
            data.append('cutoffs', parseInt(document.getElementById('top_k').value) )
        }

        if(field.name=='t_test' || field.name=='wilcoxon' && field.checked){
            data.append(field.name, true)
        }else if(field.name=='t_test' || field.name=='wilcoxon' && !(field.checked)){
            data.append(field.name, false)
        }




        if(field.name == "simple_metrics" && field.checked){
            simpleMetrics.push(field.value);
        }else if(field.name =='complex_metrics' && field.checked){
            complexMetrics.push(field.value);
            if(field.value == 'DSC'){
                data.append('beta', parseInt(document.getElementById('beta').value));
            }
            if(field.value == 'BiasDisparityBD'){
                data.append('user_clustering_name_BD', document.getElementById('ucn_BD').value);
                data.append('user_clustering_file_BD', document.getElementById('ucf_BD').files[0]);
                data.append('item_clustering_name_BD', document.getElementById('icn_BD').value);
                data.append('item_clustering_file_BD', document.getElementById('icf_BD').files[0]);
            }
            if(field.value == "BiasDisparityBR"){
                data.append('user_clustering_name_BR', document.getElementById('ucn_BR').value);
                data.append('user_clustering_file_BR', document.getElementById('ucf_BR').files[0]);
                data.append('item_clustering_name_BR', document.getElementById('icn_BR').value);
                data.append('item_clustering_file_BR', document.getElementById('icf_BR').files[0]);
            }
            if(field.value == "BiasDisparityBS"){
                data.append('user_clustering_name_BS', document.getElementById('ucn_BS').value);
                data.append('user_clustering_file_BS', document.getElementById('ucf_BS').files[0]);
                data.append('item_clustering_name_BS', document.getElementById('icn_BS').value);
                data.append('item_clustering_file_BS', document.getElementById('icf_BS').files[0]);
            }
            if(field.value == "ItemMADranking"){
                data.append('clustering_name_iMADranking', document.getElementById('cn_iMADranking').value);
                data.append('clustering_file_iMADranking', document.getElementById('cf_iMADranking').files[0]);
            }
            if(field.value == 'ItemMADrating'){
                data.append('clustering_name_iMADrating', document.getElementById('cn_iMADrating').value);
                data.append('clustering_file_iMADrating', document.getElementById('cf_iMADrating').files[0]);
            }
            if(field.value == 'UserMADranking'){
                data.append('clustering_name_uMADranking', document.getElementById('cn_uMADranking').value);
                data.append('clustering_file_uMADranking', document.getElementById('cf_uMADranking').files[0]);
            }
            if(field.value == 'UserMADrating'){
                data.append('clustering_name_uMADrating', document.getElementById('cn_uMADrating').value);
                data.append('clustering_file_uMADrating', document.getElementById('cf_uMADrating').files[0]);
            }
            if(field.value == 'REO'){
                data.append('clustering_name_REO', document.getElementById('cn_REO').value);
                data.append('clustering_file_REO', document.getElementById('cf_REO').files[0]);
            }
            if(field.value == 'RSP'){
                data.append('clustering_name_RSP', document.getElementById('cn_RSP').value);
                data.append('clustering_file_RSP', document.getElementById('cf_RSP').files[0]);
            }
        }
    }
    data.append('simple_metrics', JSON.stringify(simpleMetrics));
    data.append('complex_metrics', complexMetrics);
     data.append('top_k', parseInt(document.getElementById('top_k').value));
     if(document.getElementById('treshold').value>0){
         data.append('rev_tresh', parseInt(document.getElementById('treshold').value));
     }else{
         data.append('rev_tresh', 0);
     }


    fetch('/api/v1/evaluation', {
        method: 'POST',
        body : data
    }).then(res=>res.json()).then(data =>{
        if (data.status=='success'){
            const resultData=data.result
            path=data.path
            document.getElementById('title').innerText='Evaluation Success'
            document.getElementById('main_form').hidden=true
            document.getElementById('result_div').hidden=false
            const p = document.getElementById('result_text')
            for(const key in resultData) {
                const p2=document.createElement('p')
                p2.setAttribute('id', 'cutoffResult')
                p2.style.fontWeight='bold'
                p2.innerText='cutoff: '+key
                p.appendChild(p2)
                const listMetric = resultData[key]
                for(const key2 in listMetric){
                    const p3=document.createElement('p')
                    p3.style.fontSize='0.6em';
                    const metric = document.createTextNode(key2 +' : ')
                    p3.appendChild(metric)
                    const metricValue=document.createTextNode(JSON.stringify(listMetric[key2]))
                    p3.appendChild(metricValue)
                    p.appendChild(p3)
                }

            }

        }else{
            document.getElementById('title').innerText='Evaluation Failure'
        }
        document.getElementById('load_div').hidden=true
        }).catch(err=>{
            document.getElementById('load_div').hidden=true
            alert('Some error occured see your console')
            console.log(err)
    })
    }else{
        alert('INVALID FORM CHECK IT ')
    }


})

buttonDownload.addEventListener('click', ()=>{

    const args='?path='+path+'/log';
    fetch('/api/v1/evaluation/download'+args, {
        method:'GET'
    }).then(res=>res.blob()).then(file=>{
        const date = new Date()
        const day = date.getDate().toString()+'-'
        const month = (date.getMonth()+1).toString()+'-';
        const year = date.getFullYear().toString()+'-';
        const hour=date.getHours().toString()+'-';
        const minute=date.getMinutes().toString()+'-';
        const id=day+month+year+hour+minute
        const name='evaluation'+id+'.zip'
        saveAs(file,name)
    })
})

function controlForm(){
    let result=true
    if(train_file.files[0]==undefined || test_file.files[0]==undefined || recs_file.files[0]=='undefined'){
        result=false;
        if (train_file.files[0]==undefined){
            document.getElementById('train_div').style.borderColor='red'
        }
        if(test_file.files[0]==undefined){
            document.getElementById('test_div').style.borderColor='red'
        }
        if(recs_file.files[0]==undefined){
            document.getElementById('recommender_div').style.borderColor='red'
        }
    }
    for(let field of myform){
        if(field.name=='top_k' && field.value<=0){
            result=false;
            document.getElementById('div_top_k').style.borderColor='red'
        }
        if(field.name=='treshold' && field.value<0){
            result=false;
            document.getElementById('div_tresh').style.borderColor='red'
        }
    }
    return result
}




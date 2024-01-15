const axios= require('axios');
const cheerio= require('cheerio');
const fs= require('fs');


const url= 'https://elliot.readthedocs.io/en/latest/guide/alg_intro.html'
const url1='https://elliot.readthedocs.io/en/latest/guide/metrics_intro.html'
async function getHTML(url){
    try {
        const {data: html}= await axios.get(url);
        return html
    }catch (error){
        console.log(error.message);
    }

}
async function ScrapingR() {
    try {
    let html = await getHTML(url);
    let $ = cheerio.load(html);
    let modelGroups = [];

    $('.simple').each((i, Name) => {
        const id = $(Name).find('strong').text();
        modelGroups.push({ 'id': id, 'models': [] });
    });

    const tables = $('.simple + table').toArray();

    for (let i = 0; i < tables.length; i++) {
        const rows = $(tables[i]).find('tr').toArray();

        for (let row of rows) {
            const url = $(row).find('a[href]').attr('href');
            const id = $(row).find('a[title]').text().split('.').pop();
            const description=$(row).find('td + td p').text()
            modelGroups[i].models.push({ 'id': id, 'name': id, 'description': description, parameters: [], 'url': url });

            const html1 = await getHTML('https://elliot.readthedocs.io/en/v0.3.1/guide/' + url);
            const $recom = cheerio.load(html1);
            $recom('.highlight pre').find(`span:contains(${id}) ~ .nt`).each((k, param) =>
                {
                    const parametro = $(param).text();
                 if (parametro !== 'save_recs' && parametro !== 'meta') {
                     const default_value = $(param).nextAll('.l.l-Scalar.l-Scalar-Plain').first().text();
                    const indice = modelGroups[i].models.findIndex((el) => el.id === id);
                    modelGroups[i].models[indice].parameters.push({ 'name': parametro, 'default': default_value});
                    }
                }
            );

        }
    }
    fs.writeFileSync('./json/result.json', JSON.stringify(modelGroups, null, 4), 'utf8');
    return modelGroups;


    } catch (error) {
        console.log("Errore durante lo ScrapingR:", error);
    }

}
async function ScrapingEv(){
    try{
        let html = await getHTML(url1);
        let $ = cheerio.load(html);
        let MetricsGroup=[];
        const Simple= $('.simple').toArray()
        for(let i = 0; i < Simple.length; i++){
            const row = $(Simple[i]);
            const id = $(row).find('strong').text();
            const url=$(row).next().first( '.row-odd').find('a[href]').attr('href');
            MetricsGroup.push({ 'id': id, 'simple_metrics': [], 'complex_metrics':[], 'url': url });
            const html1 = await getHTML('https://elliot.readthedocs.io/en/v0.3.1/guide/' + url);
            const $eval = cheerio.load(html1);
            const metrics= $eval('pre').toArray();
            for (let metric of metrics){
                $eval(metric).find(`span:contains(simple_metrics) ~ .nv`).each((k,met)=>{
                  const Metric= $(met).text();
                    MetricsGroup[i].simple_metrics.push(Metric);
                });
                const id= $eval(metric).find(`span:contains(complex_metrics)`).nextAll('.l.l-Scalar.l-Scalar-Plain').first().text();
               id ? MetricsGroup[i].complex_metrics.push({id: id, parameters: []}): null;
                const indice = MetricsGroup[i].complex_metrics.findIndex((el) => el.id === id);

                $eval(metric).find(`span:contains(complex_metrics) ~ .nt`).each((k,param)=>{
                        const parametro= $(param).text();
                    if (!parametro.includes('metric') ) {
                        MetricsGroup[i].complex_metrics[indice].parameters.push(parametro);
                    }
                })

            }

        }

        fs.writeFileSync('./json/Metrics.json', JSON.stringify(MetricsGroup, null, 4), 'utf8');
        return MetricsGroup;


    }
    catch (error){
        console.log("Errore durante lo Scrapingev:", error);
    }
}


ScrapingR();
ScrapingEv();






const browserPage = require('./browserPage');
var fs = require('fs');

var searchDrug = require('./searchDrug');

var buscaDrogas = function(drogas){
    searchDrug(drogas)
}

if(!fs.existsSync('./drogas.json')){

    var url = "http://www.anmat.gov.ar/atc/CodigosATC.asp";

    (async () => {
    
        var page = await browserPage(url);  

        const items = await page.evaluate(() => {            
            
          return [...document.getElementsByClassName("StrDesc3")].map(e=>{ var obj = {}; obj[e.innerText] = (function(){
                
                
                var actual  = e
                
                var comp = [];
                
                while(actual.nextElementSibling.className != "StrCodigo3"){
                    
                    
                    if(actual.className === "StrCodigo4"){       
                        var temp = {}
                        temp['codigo'] = actual.innerText;
                        if(actual.nextElementSibling.className === "StrDesc4"){  
                            temp['descripcion'] = actual.nextElementSibling.innerText;     
                        }    
                        comp.push(temp);
                    }
    
    
                    actual = actual.nextElementSibling;
    
                    if(!actual.nextElementSibling){
                        
                        if(actual.className === "StrCodigo4"){       
                            var temp2 = {}
                            temp2['codigo'] = actual.innerText;
                            if(actual.nextElementSibling.className === "StrDesc4"){  
                                temp2['descripcion'] = actual.nextElementSibling.innerText;     
                            }    
                            comp.push(temp2);
                        }
                        break;
                    };
    
                }
                return comp;
            })(); return obj})
     
        }).then((res) => {
            
            fs.writeFile('drogas.json', JSON.stringify(res), function (err) {
                if (err) throw err;
                console.log('Archivo Creado con éxito');
                var drogas = res.reduce((a,c)=>{
                    for(p in c){
                        c[p].forEach(d => {
                            if(d){
                                if(d.descripcion){
                                    a.push(d.descripcion)
                                }
                            }
                        })
                    }
                        return a;
                    },[])
                buscaDrogas(drogas);
              });
          
       });
       browser.close()
    })();


}
else
{
    drogas = require('./drogas.json');    
    
    var drogas = drogas.reduce((a,c)=>{
        for(p in c){
            c[p].forEach(d => {
                if(d){
                    if(d.descripcion){
                        a.push(d.descripcion)
                    }
                }
            })
        }
            return a;
        },[])
    
    
    buscaDrogas(drogas);
}

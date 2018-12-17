const browserPage = require('./browserPage');
var fs = require('fs');

var searchDrug = require('./searchDrug');

var buscaDrogas = function(drogas){
    searchDrug(drogas)
}

var unDia = 86400000;
var existeArchivo = false;

var drogas = {fechaCreacion:0};

if(fs.existsSync('tmp/drogas.json')){
    drogas = require('./tmp/drogas.json');     
    existeArchivo = true;
}

if(!existeArchivo || (drogas.fechaCreacion - Date.now()) > unDia){

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

           var resultado = {};

           resultado.datos = res;
            
           resultado.fechaCreacion = Date.now();

            fs.writeFile('tmp/drogas.json', JSON.stringify(resultado), function (err) {
                if (err) throw err;
                console.log('Archivo de drogas con éxito');
                
                buscaDrogas(resultado);
              });
          
       });
    })();


}
else
{
    drogas = require('./tmp/drogas.json');      
    
    buscaDrogas(drogas);
}

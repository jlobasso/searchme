const puppeteer = require('puppeteer');
var fs = require('fs');

var credenciales = false;

if(fs.existsSync('./credenciales.json')){
    credenciales = require('./credenciales.json');
}


(async () => {

    const browser = await puppeteer.launch(    
       {
        //    headless:false,
           args: (credenciales)?[credenciales.path]:[] 
    });

    const page = await browser.newPage();
    (credenciales)?page.authenticate({username: credenciales.username, password: credenciales.passwrd}):"";
    await page.goto('http://www.anmat.gov.ar/atc/CodigosATC.asp');

    
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

        // (credenciales)?page.authenticate({username: credenciales.username, password: credenciales.passwrd}):"";
        // await page.goto('http://www.anmat.gov.ar/atc/CodigosATC.asp');

         // Buscar cada uno en la ruta https://servicios.pami.org.ar/vademecum/views/consultaPublica/listado.zul
        
        // var pagina =     [...document.querySelectorAll(".vd-grid.z-row")].map(e=>{ return [...e.getElementsByTagName("td")].map((ei)=>{return [...ei.querySelectorAll(".z-label")].map(r=>r.innerText)})})
        
        // paginador document.getElementsByClassName("z-paging-next")[1].click()
        
        // const page = await browser.newPage({ args: [ '--proxy-server=dsibot.sintys.gob.ar/service/dindex.php:443' ] });
        
    }).then((res) => {
        
        console.log(res);
        var Worker = require('webworker-threads').Worker;

        

        // obtener todos ls datos y guardarlos en una colection de una base NOSQL
        
        //    fs.writeFile("/home/andres/Documents/PROYECTOS/delibery/public/fakeAPI/menuBarPrimoHermano.json", JSON.stringify(res), function(err) {
            //        if(err) {
                //            return console.log(err);
    //        }

    //        console.log("The file was saved!");
    //    });
   });
   // console.log(items)
   //  await browser.close();
})();





// var actual  = document.getElementsByClassName("StrDesc3")[881]
            
//             var comp = [];

            
//             while(actual.nextElementSibling.className != "StrCodigo3"){
                                
//                 if(actual.nextElementSibling.className === "StrDesc4" ){       
//                     comp.push(actual.nextElementSibling.innerText);
//                 }    
//                 actual = actual.nextElementSibling;
//                 if(!actual.nextElementSibling){
                    
//                     if(actual.className === "StrDesc4" ){       
//                         comp.push(actual.innerText);
//                     }   
                    
//                     break;
//                 };

//             }
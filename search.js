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
 
    }).then((res) => {
        
        console.log(res);

   });
})();
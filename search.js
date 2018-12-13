const puppeteer = require('puppeteer');
var fs = require('fs');

(async () => {

    const browser = await puppeteer.launch(    
       {
           headless:false,
           args: [ '--proxy-server=proxy.sintys.gob.ar:8080' ] 
    });

//no borrar ver error en 880

    const page = await browser.newPage();
    page.authenticate({username: 'jlobasso', password: 'Jorge-0000'});
    await page.goto('http://www.anmat.gov.ar/atc/CodigosATC.asp');
    
    const items = await page.evaluate(() => {
        
        
        [...document.getElementsByClassName("StrDesc3")].map(e=>{ var obj = {}; obj[e.innerText] = (function(){
            
            
            var actual  = e
            
            var comp = [];
            
            if(!('nextElementSibling' in actual)) return comp;
            while(actual.nextElementSibling.className != "StrCodigo3"){
                
                if(!('nextElementSibling' in actual)) break;
                
                if(actual.nextElementSibling.className === "StrDesc4" ){       
                    comp.push(actual.nextElementSibling.innerText);
                }    
                actual = actual.nextElementSibling;
            }
            return comp;
        })(); return obj})
        
        
        // var pagina =     [...document.querySelectorAll(".vd-grid.z-row")].map(e=>{ return [...e.getElementsByTagName("td")].map((ei)=>{return [...ei.querySelectorAll(".z-label")].map(r=>r.innerText)})})
        
        // paginador document.getElementsByClassName("z-paging-next")[1].click()
        
        //    const page = await browser.newPage({ args: [ '--proxy-server=dsibot.sintys.gob.ar/service/dindex.php:443' ] });
        
        
        
    }).then((res) => {
        //    fs.writeFile("/home/andres/Documents/PROYECTOS/delibery/public/fakeAPI/menuBarPrimoHermano.json", JSON.stringify(res), function(err) {
            //        if(err) {
                //            return console.log(err);
    //        }
    console.log('Hola PUTO');
    //        console.log("The file was saved!");
    //    });
   });

   // console.log(items)

   //  await browser.close();
})();

const puppeteer = require('puppeteer');
var fs = require('fs');

var credenciales = false;

if(fs.existsSync('./credenciales.json')){
    credenciales = require('./credenciales.json');
}

buscaDroga = (url, droga)=>{

    (async () => {

        const browser = await puppeteer.launch(    
           {
            //    headless:false,
               args: (credenciales)?[credenciales.path]:[] 
        });
    
        const page = await browser.newPage();
        (credenciales)?page.authenticate({username: credenciales.username, password: credenciales.passwrd}):"";
        await page.goto(url);
    
        
        const items = await page.evaluate(() => {
            return "si si"
        }).then((res) => {
            
            console.log(res);
    
       });
       browser.close()
    })();

} 

module.exports = buscaDroga;



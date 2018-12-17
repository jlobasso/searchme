
const puppeteer = require('puppeteer');
var fs = require('fs');

var credenciales = false;

if (fs.existsSync('./credenciales.json')) {
    credenciales = require('./credenciales.json');
}

async function browserPage(url){
    const browser = await puppeteer.launch(
        {
            headless: false,
            args: (credenciales) ? [credenciales.path] : []
        });

    const page = await browser.newPage();
    (credenciales) ? page.authenticate({ username: credenciales.username, password: credenciales.passwrd }) : "";

    await page.goto(url);

    return page;
}


module.exports = browserPage;
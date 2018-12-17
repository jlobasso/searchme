const browserPage = require('./browserPage');
var fs = require('fs');

async function buscaDroga(drogas) {

    paginasDroga = [];

    var drogas = drogas.datos.reduce((a,c)=>{
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
    
    var url = "https://servicios.pami.org.ar/vademecum/views/consultaPublica/listado.zul";

    var page = await browserPage(url);

    ///A ESTE NIVEL, FOR DE DROGAS
    async function buscaDroga(page, drogas, index) {

        await page.evaluate(()=>{
            document.getElementById("zk_comp_28").value = "";
        })


        await page.type('#zk_comp_28', drogas[index]);

        await page.click('#zk_comp_80');

        ///A ESTE NIVEL, FOR DE PAGINAS DE CADA DROGA
        async function pasaPagina(page, paginaActual = 1) {

            if (paginaActual !== 1) {
                await page.click('a[name=zk_comp_98-next]');
            }

            await page.waitFor(20000);

            const items = await page.evaluate(() => {

                maxPaginasPorDroga = +[...document.getElementsByClassName("z-paging-text")][1].innerText.replace(/\//g, "")

                paginaActual = [...document.getElementsByClassName("z-paging-input")][1].value

                return {
                    "max": maxPaginasPorDroga,
                    "paginaActual": paginaActual,
                    "drogas": [...document.getElementsByClassName("vd-grid z-row")].map(f => {
                        var temp = {};
                        temp.certificado = [...f.querySelectorAll("td span")][1].innerText
                        temp.laboratorio = [...f.querySelectorAll("td span")][2].innerText
                        temp.nombreComercial = [...f.querySelectorAll("td span")][3].innerText
                        temp.formaFarmaceutica = [...f.querySelectorAll("td span")][4].innerText
                        temp.presentacion = [...f.querySelectorAll("td span")][5].innerText
                        temp.precioVentaAlPublico = [...f.querySelectorAll("td span")][6].innerText
                        temp.generico = [...f.querySelectorAll("td span")][7].innerText
                        return temp;
                    })
                }

            });


            //ACA GUARDAMOS LOS ITEMS de cada pagina de cada droga
            paginasDroga.push(items);
            // console.log(items);

            if (items.max > paginaActual) {
                console.log("cambiamos de pagina a la "+paginaActual++)
                pasaPagina(page, paginaActual++)//la recursiva
            }else{
                //termino la droga 

                var nombreArchivo = drogas[index].replace(/ /g,"_")+".json"
                
                var archivo = {};
                archivo.fechaCreacion = Date.now();
                archivo.datos = paginasDroga;
                

                fs.writeFile('tmp/'+nombreArchivo, JSON.stringify(archivo), function (err) {
                    if (err) throw err;
                    console.log('Archivo '+nombreArchivo+' guardado con éxito');
                  });

                  paginasDroga = [];  

                //cambiamos de droga
                if(drogas[index++]){
                    console.log("buscamos "+drogas[index++]) 
                    
                    //ver la edad del archivo
                    buscaDroga(page, drogas, index++)//la recursiva
                }else{
                    //browse close aca
                    console.log("termino todo");                    
                }
                
                
            }


        }

        pasaPagina(page)//esta es la pimera vez
        //FIN DE PAGINA DE DROGA

    }    
    buscaDroga(page, drogas, 0)//esta es la pimera vez

}

module.exports = buscaDroga;
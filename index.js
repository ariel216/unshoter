const request = require('request')
const conexionPG  = require('./config_pg');

//const uri = 'https://goo.gl/maps/omjc2ES5YwWAwNrS6'

const init = (url)=>{
    request(
        {
          uri: url,
          followRedirect: false,
        },
        function (err, httpResponse) {
          if (err) {
            return console.error(err)
          }
          const unshorted = httpResponse.headers.location || url; 
          //console.log('url original', unshorted);
      
          const regexUrl = /(?<=q=)(.*?)(?=&)/;
              
          const latLongStr = unshorted.match(regexUrl);
          console.log(latLongStr);
        //   const latLongArray = latLongStr[0].split(",");
          
        //   console.log(latLongArray[0]);
        //   console.log(latLongArray[1].replace("+", ""));
      
        },
    )
}


const listarData = async ()=>{
    let consulta = `select * from public.ubicaciones 
                    where referencia  <> '' or referencia <> null order by id asc limit 5`;    
    let resultados = await conexionPG.query(consulta);
    for (let i = 0; i < resultados.rowCount; i++) {
        const element = resultados.rows[i];
        console.log(element.id);   
        console.log(init(element.referencia));
    }
}

listarData();

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
                    where (referencia  <> '' or referencia <> null)
                    and (link  = '' or link isnull )
                    order by id asc`;    
    let resultados = await conexionPG.query(consulta);
    for (let i = 0; i < resultados.rowCount; i++) {
      const element = resultados.rows[i];
      console.log(element.id);   
      //console.log(getUrl(element.referencia));

      request(
        {
          uri: element.referencia,
          followRedirect: false,
        },
        async function (err, httpResponse) {
          if (err) {
            return console.error(err)
          }
          const unshorted = await httpResponse.headers.location || url; 
          console.log(unshorted);      
          consultaInserta = `update public.ubicaciones set link = $2 where id = $1`;
          await conexionPG.query(consultaInserta, [element.id, unshorted]);
        },
      )
    }
}

const listarLink = async ()=>{
  let consulta = `select * from public.ubicaciones 
                  where (referencia  <> '' or referencia <> null)
                  and (link  <> '' or link <> null) and id <> 860
                  --order by id asc`;    
  let resultados = await conexionPG.query(consulta);
  for (let i = 0; i < resultados.rowCount; i++) {
    const element = resultados.rows[i];
    console.log(element.id);   
    //console.log(getUrl(element.referencia));
    var splitUrl = element.link.split('!3d');
    var latLong = splitUrl[splitUrl.length-1].split('!4d');
    var longitude;

    if (latLong.indexOf('?') !== -1) {
        longitude = latLong[1].split('?')[0];
        console.log('split');
    } else {
        //longitude = latLong[1];
        longitude = latLong[1].split('?')[0];
    }
    var latitude = latLong[0];

    consultaInserta = `update public.ubicaciones set lat = $2, lon = $3 where id = $1`;
    await conexionPG.query(consultaInserta, [element.id, latitude, longitude]);

  }
}

listarLink();

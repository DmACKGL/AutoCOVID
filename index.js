const { default: fetchSession } = require("fetch-session");

const session = fetchSession();

// Default UNAB URL
const defaultUrl = "https://unab-form.dentidesk.cl";

function censorRut(rut) {
    return rut.toString().replace(/.(?=.{3})/g, 'x')
}

async function loadConfig() {
    const { rut } = process.env;
    if (!rut || !Number.isInteger(rut)) {
        throw new Error('RUT is required or must be an integer!');
    }
    console.log(`[ 👤 ] RUT ${censorRut(rut)} loaded!`);
    return rut;
}

async function getAndSaveHeaders() {
    await session.fetch(defaultUrl);
    let xsrf = session.cookieJar.getCookieValue('XSRF-TOKEN');
    let headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
        'x-xsrf-token': xsrf,
        'x-csrf-token': xsrf,
        'x-requested-with': 'XMLHttpRequest'
    }
    return headers;
}

async function getData(rut) {
    const headers = await getAndSaveHeaders();
    headers['Content-Type'] = 'application/json';

    const response = await session.fetch(`${defaultUrl}/api/getPaciente`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            'rut': {
                'rut': rut,
            },
            'tipoUsuario': 'ACCESO_INTERNO'
        })
    });

    return response.body;
}

async function checkIfAuthorized(rut) {

    const json = await getData(rut);

    if (json.status !== 200) throw new Error(`[ 👤 ] RUT ${censorRut(rut)} not found!`);

    const { autorizado_hasta } = json[0];
    const date = new Date(autorizado_hasta);
    const now = new Date(new Date().toLocaleString("en-US", {timeZone: "America/Santiago"}));

    if (date < now) {
        console.log(`[ 🚫 ] Rut ${censorRut(rut)} is not authorized!`);
        return false;
    } else {
        console.log(`[ ✅ ] Rut ${censorRut(rut)} is authorized!`);
        return true;
    }
}

async function processRut(rut) {
    console.log(`[ 📋 ] Starting process for ${censorRut(rut)}...`);
    
    const RUTData = await getData(rut);
    postBody = {
        "data": ["20"],
        "datosUsuario": {
           "_token": session.cookieJar.getCookieValue('XSRF-TOKEN'),
           "tipoAcceso": "ACCESO_INTERNO",
           "datosUsuario": RUTData[0]
        }
    }

    const headers = await getAndSaveHeaders();
    headers['Content-Type'] = 'application/json';

    console.log(`[ 📩 ] Sending request`)
    const response = await session.fetch(`${defaultUrl}/sintomas`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(postBody)
    });

    if (response.body.icono == 'success') {
        console.log('[ ✅ ] Success, user should be authorized!');
        return true;
    }else{
        console.log('[ 🚫 ] Error! Favor verificar manualmente.');
        return false;
    }

}

(async () => {
    console.log(`Bienvenido! este script fue desarrollado para utilizacion personal y unica de la persona quien lo ejecute, el creador del mismo no se hace responsable en el caso de que la persona edite/no informe/detenga el script en el caso de presentar un sitoma de COVID-19.\nStay safe, stay home!\n`);
    console.log('[ 🚀 ] Starting...');
    try {
        const rut = await loadConfig();
        
        if(await checkIfAuthorized(rut)) return

        await processRut(rut);

        console.log(`[ 📋 ] Last check for ${censorRut(rut)}`);
        await checkIfAuthorized(rut);
    } catch (error) {
        console.error(`ERROR: ${error.message}`);
    }
})();
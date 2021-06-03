/*
recognition.onstart = function() {} start() es invocada el navegador empieza a "escuchar" seria reconocedor.start();
recognition.onerror = function(event) {}  es para indicar al usuario se hay algun problema con el reconocimiento como que no tiene microfono o no acepto los permisos,etc.
recognition.onend = function() {} = function(event) {}   se usa para indicar al reconocedor que el asistente a dejado de escuchar
recognition.onend = function() {}  es el elemento mas importante ya que nos debuelve en texto lo que el usuario dijo en sonido
*/




window.onload = () => {
    document.getElementById('filtrar').value = 'Filtrar';

}

if (!('webkitSpeechRecognition' in window))//aqui le digo que si el elemento de reconocimiento de voz webkitSpeechRecognition no existe en la ventana mande una alerta
{                                         //esto para comprovar que el navegador sea compatible con la api del reconocimiento de voz
    alert("Este navegador no soporta el reconocimiento de voz,intentar con google chrome");
}
else {


    var xhttp = new XMLHttpRequest();
    var reconocedor = new webkitSpeechRecognition();
    var so = navigator.platform.toLowerCase(), plataformaIos = ['iphone', 'ipad', 'ipod', 'ipod touch'];//es para ver que sistema operativo estas usando
    var voz = new SpeechSynthesisUtterance();
    var microfono = true;//esta variable es para indicar si se esta en modo escucha
    reconocedor.continuous = false;//por Si la API de Reconocimiento de Voz se encuentra disponible o está implementada en el navegador
    reconocedor.interimResults = false;//se usa con el objetivo de avisar al reconocedor que has finalizado una horacion cuando se deja de hablar
    //variables de configuracion de voz
    var TipoDeVoz = 19;
    var VelocidadDeVoz = 1;
    var TonoDeVoz = 1;


    var sistema = sistema_operativo();
   
    idioma("es-MX");

    reconocedor.start();
    mostrar_voces();



    reconocedor.onresult = (e) => {


        let frace;//guarda la frace recogida por oneresult
        
        //aqui llamo a mi texto del html para que el e.result en la poscion 0 me transcriba de voz a texto y coloque el resultado en html    
        document.getElementById('texto').innerHTML = e.results[e.results.length - 1][0].transcript;
        frace = e.results[0][0].transcript;
        frace =quitarAcentos(frace);
        frace = frace.toLowerCase();
        siempre_escuchar(true);
console.log(frace);
        document.getElementById("texto").className = document.getElementById("texto").className.replace(/(?:^|\s)animate__animated animate__fadeIn(?!\S)/g, ' ')//para iniciar sin borde en el texto mostrado en pantalla
        document.getElementById("texto").style.border = 'none';



        xhttp.onreadystatechange = function () {
            if (xhttp.status === 200 && xhttp.readyState === 4) {
                var data = JSON.parse(xhttp.responseText);
                findPerson(data, frace);
                
            }
        }
        xhttp.open("GET", "scripts/archivo1.json", true);
        xhttp.send();
    
       

  

        buscarEnGoogleMaps(frace);
        buscarEnGoogle(frace);
        buscarInstagram(frace);
        buscarFacebook(frace);
        buscar_amazon(frace);
        buscarMercado(frace);
        buscar_amazon(frace);

        if (frace == "power point") {
            window.open("https://www.office.com/launch/powerpoint?ui=es-ES&rs=ES&auth=1");
        }
        if (frace == "abrir power point") {
            window.open("https://www.office.com/launch/powerpoint?ui=es-ES&rs=ES&auth=1");
        }
        if (frace == "word") {
            window.open("https://www.office.com/launch/word?ui=es-ES&rs=ES&auth=1");
        }
        if (frace == "abrir word") {
            window.open("https://www.office.com/launch/word?ui=es-ES&rs=ES&auth=1");
        }
        if (frace == "excel") {
            window.open("https://www.office.com/launch/excel?ui=es-ES&rs=ES&auth=1");
        }
        if (frace == "abrir excel") {
            window.open("https://www.office.com/launch/excel?ui=es-ES&rs=ES&auth=1");
        }

}

}
//Funcion para eliminar tildes
function quitarAcentos(cadena){
    const acentos = {'á':'a','é':'e','í':'i','ó':'o','ú':'u','Á':'A','É':'E','Í':'I','Ó':'O','Ú':'U', '¿':'', '?':''};
    return cadena.split('').map( letra => acentos[letra] || letra).join('').toString();
}

function findPerson(objetoJSON, user) {
    var arrayEntry = [];
    var arrayOutput = [];
    var find = false;


    for (var i in objetoJSON) {
        var people = objetoJSON[i]

        arrayEntry.push(people.entradab);
        arrayOutput.push(people.salidab);
        var index = arrayEntry.indexOf(user);


        if (arrayEntry.indexOf(user) > -1) {
            find = true;
            var auxOutput = arrayOutput[index].split('-');
            console.log(arrayOutput);
            if (auxOutput.length > 1) {
                var random = Math.round(Math.random() * (auxOutput.length - 1));
                var arrayAux = auxOutput;
                console.log(arrayAux[random]);
                hablar(arrayAux[random], TipoDeVoz, VelocidadDeVoz, TonoDeVoz);
            }
            else {
                var arrayOnesize = auxOutput;
                console.log(arrayOnesize[0]);
                hablar(arrayOnesize, TipoDeVoz, VelocidadDeVoz, TonoDeVoz);
            }
            break;
        }

    }

    if (find === false) {
        console.log("No encontrado")
    }

}

function findInter(objetoJSON, user) {
    var arrayEntry = [];
    var arrayOutput = [];
    var arrayPage = [];
    var find = false;


    for (var i in objetoJSON) {
        var people = objetoJSON[i]

        arrayEntry.push(people.entradai);
        arrayOutput.push(people.salidai);
        arrayPage.push(people.pagina);
        var index = arrayEntry.indexOf(user);


        if (arrayEntry.indexOf(user) > -1) {
            find = true;
                var arrayAux = arrayOutput[index];
                hablar(arrayAux, TipoDeVoz, VelocidadDeVoz, TonoDeVoz);
                window.open(arrayPage[index]);
        
          
                
    
        }

    }

    if (find === false) {
        console.log("No encontrado")
    }

}

function buscarEnGoogleMaps(Frace) {
    lista = Frace.split(" ");//separa cada palabra co cada que contenga un ""

    buscar = false // es para identificar si la palabra buscar esta n la cadena
    maps = false  // lo mismo que la de arriba

    const palabra1 = "busca";// es para comparar si esiste en la lista
    const palabra2 = "maps";

    for (i = 0; i < lista.length; i++) {
        if (lista[i] == palabra1 || lista[i] == palabra1 + 'r') {
            if (lista[i] == "buscar") {
                lista[i] = "busca";
            }
            buscar = true;
        }
        else if (lista[i] == palabra2) {
            maps = true;
        }
    }

    try {

        pos1 = lista.indexOf("busca")//indxOf es para buscar la posicion de la lista si se encuentra en la primera posicion sera 0 y asi 
        if (lista[pos1] == "busca")
            lista.splice(pos1, 1)//splice es para eliminar un elemento sprit es ´para agregar poss es para la pisicion a eliminar y el uno para cuantos elemento vas a borrar
        //if(lista[pos1] =="buscar")

        pos2 = lista.indexOf("en")
        if (lista[pos2] == "en")
            lista.splice(pos2, 1)

        pos3 = lista.indexOf("google")
        if (lista[pos3] == "google")
            lista.splice(pos3, 1)

        pos4 = lista.indexOf("maps")
        if (lista[pos4] == "maps")
            lista.splice(pos4, 1)

        var busqueda = lista.join("+")//join es para separar cada palabra con el caracter " " en este caso para hacer de lista a cadena

    } catch (error) {
        console.log(error)
    }
    if (maps && buscar) {
        hablar(`buscando`, TipoDeVoz, VelocidadDeVoz, TonoDeVoz);
        window.open(`https://www.google.com.mx/maps/search/${busqueda}`);
    }


}
function buscarEnGoogle(Frace) {
    lista = Frace.split(" ");//separa cada palabra co cada que contenga un ""

    buscar = false // es para identificar si la palabra buscar esta n la cadena
    google = false  // lo mismo que la de arriba

    const palabra1 = "busca";// es para comparar si esiste en la lista
    const palabra2 = "google";

    for (i = 0; i < lista.length; i++) {
        if (lista[i] == palabra1 || lista[i] == palabra1 + 'r') {
            if (lista[i] == "buscar") {
                lista[i] = "busca";
            }
            buscar = true;
        }
        else if (lista[i] == palabra2) {
            google = true;
        }
    }

    try {

        pos1 = lista.indexOf("busca")//indxOf es para buscar la posicion de la lista si se encuentra en la primera posicion sera 0 y asi 
        if (lista[pos1] == "busca")
            lista.splice(pos1, 1)//splice es para eliminar un elemento sprit es ´para agregar poss es para la pisicion a eliminar y el uno para cuantos elemento vas a borrar
        //if(lista[pos1] =="buscar")

        pos2 = lista.indexOf("en")
        if (lista[pos2] == "en")
            lista.splice(pos2, 1)

        pos3 = lista.indexOf("google")
        if (lista[pos3] == "google")
            lista.splice(pos3, 1)


        var busqueda = lista.join("+")//join es para separar cada palabra con el caracter " " en este caso para hacer de lista a cadena

    } catch (error) {
        console.log(error)
    }
    if (google && buscar) {
        hablar(`buscando`, TipoDeVoz, VelocidadDeVoz, TonoDeVoz);
        window.open(`https://www.google.com/search?q=${busqueda}`);
    }
    else {
        console.log("no entro");
    }

}

function buscarInstagram(Frace) {
    lista = Frace.split(" ");//separa cada palabra co cada que contenga un ""

    buscar = false // es para identificar si la palabra buscar esta n la cadena
    google = false  // lo mismo que la de arriba

    const palabra1 = "busca";// es para comparar si esiste en la lista
    const palabra2 = "instagram";

    for (i = 0; i < lista.length; i++) {
        if (lista[i] == palabra1 || lista[i] == palabra1 + 'r') {
            if (lista[i] == "buscar") {
                lista[i] = "busca";
            }
            buscar = true;
        }
        else if (lista[i] == palabra2) {
            google = true;
        }
    }

    try {

        pos1 = lista.indexOf("busca")//indxOf es para buscar la posicion de la lista si se encuentra en la primera posicion sera 0 y asi 
        if (lista[pos1] == "busca")
            lista.splice(pos1, 1)//splice es para eliminar un elemento sprit es ´para agregar poss es para la pisicion a eliminar y el uno para cuantos elemento vas a borrar
        //if(lista[pos1] =="buscar")

        pos2 = lista.indexOf("en")
        if (lista[pos2] == "en")
            lista.splice(pos2, 1)

        pos3 = lista.indexOf("instagram")
        if (lista[pos3] == "instragram")
            lista.splice(pos3, 1)


        var busqueda = lista.join("+")//join es para separar cada palabra con el caracter " " en este caso para hacer de lista a cadena

    } catch (error) {
        console.log(error)
    }
    if (google && buscar) {
        hablar(`buscando`, TipoDeVoz, VelocidadDeVoz, TonoDeVoz);
        window.open(`https://www.instagram.com/search?q=${busqueda}`);
    }
    else {
        console.log("no entro");
    }

}


function buscarEnGoogle(Frace) {
    lista = Frace.split(" ");//separa cada palabra co cada que contenga un ""

    buscar = false // es para identificar si la palabra buscar esta n la cadena
    google = false  // lo mismo que la de arriba

    const palabra1 = "busca";// es para comparar si esiste en la lista
    const palabra2 = "google";

    for (i = 0; i < lista.length; i++) {
        if (lista[i] == palabra1 || lista[i] == palabra1 + 'r') {
            if (lista[i] == "buscar") {
                lista[i] = "busca";
            }
            buscar = true;
        }
        else if (lista[i] == palabra2) {
            google = true;
        }
    }

    try {

        pos1 = lista.indexOf("busca")//indxOf es para buscar la posicion de la lista si se encuentra en la primera posicion sera 0 y asi 
        if (lista[pos1] == "busca")
            lista.splice(pos1, 1)//splice es para eliminar un elemento sprit es ´para agregar poss es para la pisicion a eliminar y el uno para cuantos elemento vas a borrar
        //if(lista[pos1] =="buscar")

        pos2 = lista.indexOf("en")
        if (lista[pos2] == "en")
            lista.splice(pos2, 1)

        pos3 = lista.indexOf("google")
        if (lista[pos3] == "google")
            lista.splice(pos3, 1)


        var busqueda = lista.join("+")//join es para separar cada palabra con el caracter " " en este caso para hacer de lista a cadena

    } catch (error) {
        console.log(error)
    }
    if (google && buscar) {
        hablar(`buscando`, TipoDeVoz, VelocidadDeVoz, TonoDeVoz);
        window.open(`https://www.google.com/search?q=${busqueda}`);
    }
    else {
        console.log("no entro");
    }

}


function buscarMercado(Frace) {
    lista = Frace.split(" ");//separa cada palabra co cada que contenga un ""

    buscar = false // es para identificar si la palabra buscar esta n la cadena
    google = false  // lo mismo que la de arriba

    const palabra1 = "busca";// es para comparar si esiste en la lista
    const palabra2 = "mercadolibre";

    for (i = 0; i < lista.length; i++) {
        if (lista[i] == palabra1 || lista[i] == palabra1 + 'r') {
            if (lista[i] == "buscar") {
                lista[i] = "busca";
            }
            buscar = true;
        }
        else if (lista[i] == palabra2) {
            google = true;
        }
    }

    try {

        pos1 = lista.indexOf("busca")//indxOf es para buscar la posicion de la lista si se encuentra en la primera posicion sera 0 y asi 
        if (lista[pos1] == "busca")
            lista.splice(pos1, 1)//splice es para eliminar un elemento sprit es ´para agregar poss es para la pisicion a eliminar y el uno para cuantos elemento vas a borrar
        //if(lista[pos1] =="buscar")

        pos2 = lista.indexOf("en")
        if (lista[pos2] == "en")
            lista.splice(pos2, 1)

        pos3 = lista.indexOf("mercadolibre")
        if (lista[pos3] == "mercadolibre")
            lista.splice(pos3, 1)


        var busqueda = lista.join("+")//join es para separar cada palabra con el caracter " " en este caso para hacer de lista a cadena

    } catch (error) {
        console.log(error)
    }
    if (google && buscar) {
        hablar(`buscando`, TipoDeVoz, VelocidadDeVoz, TonoDeVoz);
        window.open(`https://listado.mercadolibre.com.mx/${busqueda}`);
    }
    else {
        console.log("no entro");
    }

}
function buscarFacebook(Frace) {
    lista = Frace.split(" ");//separa cada palabra co cada que contenga un ""

    buscar = false // es para identificar si la palabra buscar esta n la cadena
    google = false  // lo mismo que la de arriba

    const palabra1 = "busca";// es para comparar si esiste en la lista
    const palabra2 = "facebook";

    for (i = 0; i < lista.length; i++) {
        if (lista[i] == palabra1 || lista[i] == palabra1 + 'r') {
            if (lista[i] == "buscar") {
                lista[i] = "busca";
            }
            buscar = true;
        }
        else if (lista[i] == palabra2) {
            google = true;
        }
    }

    try {

        pos1 = lista.indexOf("busca")//indxOf es para buscar la posicion de la lista si se encuentra en la primera posicion sera 0 y asi 
        if (lista[pos1] == "busca")
            lista.splice(pos1, 1)//splice es para eliminar un elemento sprit es ´para agregar poss es para la pisicion a eliminar y el uno para cuantos elemento vas a borrar
        //if(lista[pos1] =="buscar")

        pos2 = lista.indexOf("en")
        if (lista[pos2] == "en")
            lista.splice(pos2, 1)

        pos3 = lista.indexOf("facebook")
        if (lista[pos3] == "facebook")
            lista.splice(pos3, 1)


        var busqueda = lista.join("+")//join es para separar cada palabra con el caracter " " en este caso para hacer de lista a cadena

    } catch (error) {
        console.log(error)
    }
    if (google && buscar) {
        hablar(`buscando`, TipoDeVoz, VelocidadDeVoz, TonoDeVoz);
        window.open(`https://www.facebook.com/search?q=${busqueda}`);
    }
    else {
        console.log("no entro");
    }

}

function sistema_operativo() {
    //para ver el sistema operativo
    if (so.includes('win')) {
        return "windows"
    }
    else if (/linux/.test(so)) {
        return "linux"
    }
    else if (so.includes('mac')) {
        return "macos";
    }
    else if (plataformaIos.includes(so)) {
        return "ios"
    }
    else if (/android/.test(navigator.userAgent.toLowerCase())) {
        return "android"
    }
}
//funcion para cambiar idioma al asisntente 
function idioma(idioma = new String) {
    reconocedor.lang = idioma;
}
//funcion para escuchar siempre o terminar cuando termines de hablar 
function siempre_escuchar(verdadero_falso = new Boolean) {


    if (verdadero_falso = true) {
        reconocedor.onend = () => {

            reconocedor.start();
           console.log("di una nueva frase");

         
        }
    }
    else {


    }

}

//module.exports = siempre_escuchar(frace_);

function hablar(texto = new String, tipoDeVoz, velocidadDeVoz, tonoDeVoz) {

    document.getElementById('texto').className += ' animate__animated animate__fadeIn';
    document.getElementById('texto').style.border = '3px #23A9F2 solid';
    voz.text = texto;
    voz.voice = speechSynthesis.getVoices()[tipoDeVoz];
    voz.pitch = tonoDeVoz;
    voz.rate = velocidadDeVoz;

    window.speechSynthesis.speak(voz);


}



function mostrar_voces() {
    // Tell Chrome to wake up and get the voices.
    speechSynthesis.getVoices();

    setTimeout(function () {
        // After 1 second, get the voices now Chrome is listening.
        speechSynthesis.getVoices().forEach(function (voice) {
            console.log('Hi! My name is ', voice.name);
        });
    }, 1000);
}


function buscar_amazon(Frace) {
    lista = Frace.split(" ");//separa cada palabra co cada que contenga un ""

    buscar = false // es para identificar si la palabra buscar esta n la cadena
    google = false  // lo mismo que la de arriba

    const palabra1 = "busca";// es para comparar si esiste en la lista
    const palabra2 = "amazon";

    for (i = 0; i < lista.length; i++) {
        if (lista[i] == palabra1 || lista[i] == palabra1 + 'r') {
            if (lista[i] == "buscar") {
                lista[i] = "busca";
            }
            buscar = true;
        }
        else if (lista[i] == palabra2) {
            google = true;
        }
    }

    try {

        pos1 = lista.indexOf("busca")//indxOf es para buscar la posicion de la lista si se encuentra en la primera posicion sera 0 y asi 
        if (lista[pos1] == "busca")
            lista.splice(pos1, 1)//splice es para eliminar un elemento sprit es ´para agregar poss es para la pisicion a eliminar y el uno para cuantos elemento vas a borrar
        //if(lista[pos1] =="buscar")

        pos2 = lista.indexOf("en")
        if (lista[pos2] == "en")
            lista.splice(pos2, 1)

        pos3 = lista.indexOf("amazon")
        if (lista[pos3] == "amazon")
            lista.splice(pos3, 1)


        var busqueda = lista.join("+")//join es para separar cada palabra con el caracter " " en este caso para hacer de lista a cadena

    } catch (error) {
        console.log(error)
    }
    if (google && buscar) {
        hablar(`buscando`, TipoDeVoz, VelocidadDeVoz, TonoDeVoz);
        window.open(`https://www.amazon.com.mx/s?k=${busqueda}&__mk_es_MX=%C3%85M%C3%85%C5%BD%C3%95%C3%91&ref=nb_sb_noss_1`);
    }
    else {
        console.log("no entro");
    }

}
function Filtrar() {
    let value_input = document.getElementById('filtrar').value;

    if (value_input == 'Filtrar') {


        document.getElementById('filtrar').value = "";

    }
    if (value_input == '') {
        document.getElementById('filtrar').value = "Filtrar";
    }

}
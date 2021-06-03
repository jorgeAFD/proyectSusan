const express = require('express');
const app = express();
const fs = require('fs');

//seteamos urlencodepara capturar los datos del formulario
app.use(express.urlencoded({ extended: false }));
app.use(express(JSON));

//invocamos dotnev 
const dotenv = require('dotenv');
dotenv.config({ path: './env/.env' });

//Hacemos conecion con la base de datos
const conexion = require('./database/db');

//Seteamos la carpeta de public y JavaScript
app.use('/resource', express.static('public'));
app.use('/resource', express.static(__dirname + '/public'));

app.use('/scripts', express.static('scripts'));
app.use('/scripts', express.static(__dirname + '/scripts'))

app.use('database', express.static('database'));
app.use('/database', express.static(__dirname + '/database'))

//Establecemos le motor de plantillas ejs

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/ingresar', (req, res) => {
    res.render('ingresar')
})


app.get('/interactivo', (req, res) => {
    res.render('interactivo')
})

//const frase = require('./scripts/voz');
//console.log(frase);



//Registro de comandos
app.post('/', async (req, res) => {
    const entrada = req.body.entrada;
    const salida = req.body.salida;
    conexion.query('INSERT INTO comandobasicos SET?', { entradab: entrada, salidab: salida }, async (error, results) => {
        if (error) {
            console.log("Error al cargas los datos");
        }
        else {
            res.render('ingresar', {
                alert: true,
                alertTitle: 'Registro Exitosamente',
                alertMessage: 'Registro Guardado',
                alerIcon: 'success',
                showConfirmButton: false,
                timer: 1500,
                ruta: ''
            })
        }
    })
});

//Mostrar resultados
app.get('/mostrar', (req, res) => {
    conexion.query("SELECT * FROM comandobasicos", (error, results) => {
        if (error) {
            throw error;
        }
        else {

            fs.writeFile('scripts/archivo3.json', JSON.stringify(results), 'utf8', (err) => {
                if (err) throw err;
                console.log('The file has been saved!');
            });
            res.render('mostrar', { results: results });
        }
    });
})

app.get('/mostrarinter', (req, res) => {
    conexion.query("SELECT * FROM comandointeractivos", (error, results1) => {
        if (error) {
            throw error;
        }
        else {
            fs.writeFile('scripts/archivointer1.json', JSON.stringify(results1), 'utf8', (err) => {
                if (err) throw err;
                console.log('The file has been saved!');
            });
            res.render('mostrarinter', { results1: results1 });
        }
    });
})
//Rutas para eliminar usuarios
app.get('/delete/:entrada', (req, res) => {
    const entrada = req.params.entrada;
    conexion.query('DELETE FROM comandobasicos WHERE entradab = ?', [entrada], (error, results) => {
        if (error) {
            console.log(error);
        }
        else {
            res.redirect('/mostrar');
        }
    });
})
app.get('/deleteinter/:entrada', (req, res) => {
    const entrada = req.params.entrada;
    conexion.query('DELETE FROM comandointeractivos WHERE entradai = ?', [entrada], (error, results) => {
        if (error) {
            console.log(error);
        }
        else {
            res.redirect('/mostrarinter');
        }
    });
})




app.post('/inter', async (req, res) => {
    const entrada = req.body.entrada;
    const salida = req.body.salida;
    const respuesta = req.body.respuesta
    conexion.query('INSERT INTO comandointeractivos SET?', { entradai: entrada, salidai: salida, pagina: respuesta }, async (error, results) => {
        if (error) {
            console.log("Error al cargas los datos");
        }
        else {
            res.render('ingresar', {
                alert: true,
                alertTitle: 'Registro Exitosamente',
                alertMessage: 'Registro Guardado',
                alerIcon: 'success',
                showConfirmButton: false,
                timer: 1500,
                ruta: ''
            })
        }
    })
});


app.listen(8000, (req, res) => {
    console.log("SERVER RUNNING IN http://localhost:8000");
})
# Node.js REST Colores-API

[![Build Status](https://travis-ci.org/radocode/api-color-selector.svg?branch=master)](https://travis-ci.org/radocode/api-color-selector)

Este endpoint sirve como Backend REST que otorga informacion metadata de colores desde un CSV. Permite paginacion y salida Json y XML.

## Documentacion Endpoints
* `GET /health`: Obtiene el status del API
* `GET /colores`: Lista todos los colores y su metadata
* `GET /colores/id`: Lista un color por su identificador
* `GET /colores/id?xml=1`: Lista un color por su identificador, en formato XML
* `GET /colores?xml=1`: Lista todos los colores y su metadata, en formato XML
* `GET /colores?page=X`: Lista todos los colores y su metadata, mostrando la pagina X
* `GET /colores?xml=1`: Lista todos los colores y su metadata, en formato XML.

* `POST /colores/create`: Crea un color nuevo, el cual requiere del siguiente body de ejemplo:

```
{
	"name":"Cornflower Blue",
	"year":"2020",
	"color":"#6195ED",
	"pantone_value":"15-4020"
}
```

Se puede combinar los flags de page con xml, ej:
* `GET /colores?page=1&xml=1`: Lista todos los colores y su metadata, en formato XML.

## Instrucciones de instalacion

Ejecutar los siguientes comandos. Estos aseguraran de que se instale las dependencias
y ademas ejecutara las pruebas unitarias.

```
npm install
npm test
npm run test-coverage
npm start
```

Si solo se desea probar la api, bastaria con:

```
npm install
npm start
```
## Instrucciones de Docker

Es posible ejecutar esta API dentro de un contenedor Docker, para tal efecto, bastaria con ejecutar:

```
docker build -t [nombre_de_usuario]/colores-api .  
docker run -p 49160:3000 -d [nombre_de_usuario]/colores-api
```

Donde [nombre_de_usuario] es el username de la shell en el que ejecutara el comando.

## Instrucciones de Ejecucion

Luego, bastaria con apuntar con Postman a:

```
http://localhost:3000/colores 
```

para obtener todos los colores.

'use strict';
const csv = require('csv-parser')
const fs = require('fs')
const errors = require('../errors');
// xml parser
const builder = require('xmlbuilder');


// singleton bd
const colors = getColorsDb();

// estructura generica
const genericRes = require('../models').genericResponse;

// paginacion inicial
const page_size = 6;

// utility function to convert to XML
function sendXml(res) {
  let xml = builder.create(genericRes).end({ pretty: true });
  res.set('Content-Type', 'text/xml');
  res.send(xml);
}

/**
 * Database functions to manipulate CSV data
 */
function getColorsDb() {
  const result = [];
  fs.createReadStream('colors.csv')
    .pipe(csv(['id', 'name', 'year', 'color', 'pantone_value']))
    .on('data', (data) => {
      result.push(data);
    })
    .on('end', () => {
      console.log('db colors loaded');
      result.shift();
    })
    .on('error', function (err) {
      // do something with `err`
      console.log('file stream error: ', err);
    });
  return result;
}

function writeColorsDb(data) {
  if (data && data.length > 0) {
    const createCsvWriter = require('csv-writer').createObjectCsvWriter;
    const csvWriter = createCsvWriter({
      path: 'colors.csv',
      header: [
        { id: 'id', title: 'id' },
        { id: 'name', title: 'name' },
        { id: 'year', title: 'year' },
        { id: 'color', title: 'color' },
        { id: 'pantone_value', title: 'pantone_value' }
      ]
    });

    return csvWriter
      .writeRecords(data)
      .then(() => {
        console.log('The CSV file was written successfully');
        return true;
      }, (error) => {
        console.log('The CSV file generation had errors: ', error);
        return false;
      });
  }
}

exports.findAll = (req, res, next) => {
  console.log('findAll req query:', req.query);
  genericRes.data = colors;
  genericRes.actualPage = req.query && req.query.page && req.query.page > 0 ? req.query.page : 1;
  if (genericRes.data && genericRes.data.length > 0) {
    genericRes.totalElements = genericRes.data.length;
    // filtrar si hay paginacion
    if (genericRes.actualPage) {
      genericRes.data = genericRes.data.slice((genericRes.actualPage - 1) * page_size, genericRes.actualPage * page_size);
      genericRes.pageCount = Math.floor((genericRes.totalElements + page_size - 1) / page_size);
      if (req.query.xml) {
        sendXml(res);
      } else {
        res.status(200).json(genericRes);
      }
    } else {
      // sino entregar todo
      if (req.query.xml) {
        sendXml(res);
      } else {
        res.status(200).json(genericRes);
      }
    }
  } else {
    genericRes.error = "No data";
    if (req.query.xml) {
      res = res.status(400);
      sendXml(res);
    } else {
      res.status(400).json(genericRes);
    }
  }
};

exports.findById = (req, res, next) => {
  console.log('findById id: ', req.params.id);
  genericRes.data = colors.filter((x) => x.id === req.params.id);
  if (genericRes.data && genericRes.data.length > 0) {
    if (req.query.xml) {
      sendXml(res);
    } else {
      genericRes.totalElements = genericRes.data.length;
      res.status(200).json(genericRes);
    }
  } else {
    genericRes.error = "No data";
    if (req.query.xml) {
      res = res.status(400);
      sendXml(res);
    } else {
      res.status(400).json(genericRes);
    }
  }
};

function validateColor(color) {
  if (color.name &&
    color.year &&
    color.color &&
    color.pantone_value &&
    /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color.color.toString()) &&
    color.pantone_value.toString().includes('-')
  ) {
    return true;
  }
  return false;
}

exports.createOne = (req, res, next) => {
  console.log('createOne params: ', req.body);

  let maxid = 0;

  // obtiene el id mas alto, para efectos de autoincremento
  colors.map((obj) => {
    if (parseInt(obj.id) > maxid) maxid = obj.id;
  });

  // y con ese id,se incrementa +1
  maxid++;

  console.log('max id nuevo: ', maxid);
  if (maxid && validateColor(req.body)) {

    colors.push({
      id: maxid.toString(),
      name: req.body.name,
      year: req.body.year,
      color: req.body.color.toUpperCase(),
      pantone_value: req.body.pantone_value
    });

    if (writeColorsDb(colors)) {
      genericRes.data = colors;
      genericRes.totalElements = genericRes.data.length;
      console.log('insertado data en CSV OK');
      res.status(200).json(genericRes);
    } else {
      genericRes.data = null
      genericRes.error = "Error al insertar data en CSV";
      console.log('Error al insertar data en CSV');
      res.status(500).json(genericRes);
    }
  } else {
    genericRes.data = null
    genericRes.error = "Bad request: alguno de los parametros es nulo o invalido";
    res.status(400).json(genericRes);
  }
};

exports.buggyRoute = (req, res, next) => {
  next(errors.newHttpError(400, 'bad request'));
};


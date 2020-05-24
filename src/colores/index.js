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

exports.findAll = (req, res, next) => {
  console.log('findAll req query:', req.query);
  genericRes.data = colors;
  genericRes.actualPage = req.query.page ? req.query.page : null;
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
      sendXml(res);
    } else {
      res.status(400).json(genericRes);
    }
  }
};

exports.buggyRoute = (req, res, next) => {
  next(errors.newHttpError(400, 'bad request'));
};
function sendXml(res) {
  let xml = builder.create(genericRes).end({ pretty: true });
  res.set('Content-Type', 'text/xml');
  res.send(xml);
}


var express = require('express');
var router = express.Router();
const es = require('../src/esClient');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json()

router.get('/create-index/:name', function (req, res) {
    es.createIndex(req.params.name).then(x => {
        res.status(200);
        res.send('OK')
    })
});

router.get('/search_all_in_index/:index_name', function (req, res) {
    es.searchAllInIndex(req.params.index_name).then(x => res.send(x))
});

router.get('/search/index/:index_name/field/:field_name/:value', function (req, res, next) {
    es.search(req.params.index_name, req.params.field_name, req.params.value).then(x => {
        res.status(200);
        res.send(x);
    });
});

router.get('/delete_index/:index_name', function (req, res) {
    es.deleteIndex().then(x => {
        res.status(200);
        res.send('OK')
    })
});

router.post('/insert/:index_name', jsonParser, function (req, res) {
    console.log('catch');
    es.insertObjectToIndex(req.params.index_name, req.body).then(x => console.log('seems ok'));
    res.send('ok')
});

router.get('/ping', async function (req, res, next) {
    es.ping().then(r => {
    res.send(r);
  });
});

router.get('/insert/city/:abr/:name', function (req, res) {
    es.insert(req.params.abr, req.params.name).then(x => {
        console.log('done');
        res.status(200);
        res.send('OK');
        }
    );
});

module.exports = router;

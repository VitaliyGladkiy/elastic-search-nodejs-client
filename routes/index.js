var express = require('express');
var router = express.Router();
const es = require('../src/esClient');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();


router.get('/', function (req, res) {
            res.status(200);
            res.send({status:'OK'})
});

router.get('/create-index/:name', async function (req, res) {
    await es.createIndex(req.params.name).then(x => {
        console.log('index created OK');
        res.status(200);
        res.send({status:"ok"});
    }).catch(error=>{
        console.log('error while create index');
        res.status(500);
        res.message({error:error.message});
        send();
    })
});

router.get('/search_all_in_index/:index_name', function (req, res) {
    es.searchAllInIndex(req.params.index_name)
        .then(x => res.send(x))
        .catch(error=>{
            res.status(500);
            res.send({error:error})
    })
});

router.get('/search/index/:index_name/field/:field_name/:value', function (req, res, next) {
    es.search(req.params.index_name, req.params.field_name, req.params.value).then(x => {
        res.status(200);
        res.send(x);
    }).catch(error=>{
        res.status(500);
        res.send({error:error})
    });
});

router.get('/delete_index/:index_name', function (req, res) {
    es.deleteIndex().then(x => {
        res.status(200);
        res.send({response: 'OK'})
    }).catch(error=>{
        res.status(500);
        res.send({error:error})
    })
});

router.post('/insert/:index_name', jsonParser, function (req, res) {
    console.log('catch');
    es.insertObjectToIndex(req.params.index_name, req.body)
        .then(x => {
            res.status(200);
            res.send({response: 'OK'})})
        .catch(error=> {
            res.status(500);
            res.send({error:error})
    });
});

router.get('/ping', async function (req, res, next) {
    es.ping()
        .then(r => {
            res.status(200);
            res.send({response: 'OK'});
        })
        .catch(error => {
            res.status(500);
            res.send({error: error})
    });
});

router.get('/insert/city/:abr/:name', function (req, res) {
    es.insert(req.params.abr, req.params.name)
        .then(x => {
            res.status(200);
            res.send({response: 'OK'})
        }).catch(error=>{
            res.status(500);
            res.send({error: error})
    })
});

module.exports = router;

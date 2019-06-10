const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
    hosts: ['http://localhost:9200']
});

function createIndex (indexName) {
    return new Promise(
        client.indices.create({
            index: indexName
        }, function (error, response, status) {
            if (error) {
                console.error(error);
                return 0;
            } else {
                console.log('Index created');
                return 1;
            }
        })
    );
}

function searchAllInIndex(indexname) {
    let body = {
        size: 200,
        from: 0,
        query: {
            "match_all": {}
        }
    };

    return new Promise(x => client.search({
        index: indexname, body: body})
        .then(results => {
            return x(results.hits.hits);
        }).catch(error=>{
            console.error(error);
        }))
}

function search(index_name, field_name, value) {
    let body = createBody(field_name, value);
    console.log(body);
    return new Promise(x => client.search({
        index: index_name, body: body, type: 'data'})
        .then(results => {
            return x(results.hits.hits);
        }).catch(error=>{
            console.error(error);
        }))
}



function createBody(name, value) {
    return {
        size: 200,
        from: 0,
        query: {
            wildcard:{[name]: value}
        }
    };
}

function ping() {
    return new Promise((resolve, reject) => {
        client.ping({
            requestTimeout: 500,
        }, function (error) {
            if (error){
                return 'False'
            } else {
                return 'OK'
            }
        });
    });
}

function insertObjectToIndex(indexname, data) {

        const body = {
            index: indexname,
            type: 'data',
            body: data
        };

    client.index(body, function (err, response) {
        if (err) {
            console.error("Failed Bulk operation", err)
        } else {
            console.log("Successfully imported")
        }
    });
}

module.exports = { searchAllInIndex,insertObjectToIndex, createIndex, ping, search };
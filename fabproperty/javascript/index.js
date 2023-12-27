/*
 * Module dependencies
 */
const express = require('express')
const cors = require('cors')
const query = require('./query');
const createProperty = require('./createProperty')
const changePropertyDetails = require('./changePropertyDetails')
const bodyParser = require('body-parser')


const app = express()

// To control CORSS-ORIGIN-RESOURCE-SHARING( CORS )
app.use(cors())
app.options('*', cors()); 

// To parse encoded data
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


// get all property
app.get('/get-property', function (req, res) {
    
    query.main( req.query )
    .then(result => {
        const parsedData = JSON.parse( result )
        let propertyList
        console.log(parsedData)
        
        // if user search property

        // if(  req.query.key ){
        //     propertyList = [
        //         {
        //             Key: req.query.key,
        //             Record: {
        //                 ...parsedData
        //             }
        //         }
        //     ]
        //     res.send( propertyList )
        //     return
        // }
        
        propertyList = parsedData
        res.send( propertyList )
    })
    .catch(err => {
        console.error({ err })
        res.send('FAILED TO GET DATA!')
    })
})

// create a new property
app.post('/create', function (req, res) {
    createProperty.main( req.body  )
    .then(result => {
        res.send({message: 'Created successfully'})
    })
    .catch(err => {
        console.error({ err })
        res.send('FAILED TO LOAD DATA!')
    })
})

// change property owner
app.post('/update', function (req, res) {
    console.log("-------==========================[INSIDE UPDATE REQUEST]===========-------------------------");
    changePropertyDetails.main( req.body  )
    .then(result => {
        res.send({message: 'Updated successfully'})
    })
    .catch(err => {
        console.error({ err })
        res.send('FAILED TO LOAD DATA!')
    })
})

app.listen(3000, () => console.log('Server is running at port 3000'))
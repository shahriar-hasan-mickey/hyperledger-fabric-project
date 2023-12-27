/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class FabProperty extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const properties = [
            {
                address: '523, East Aveneue, Texas, USA',
                city: 'Austin',
                property_size: '30000',
                owner_name: 'Tomoko',
            },
            {
                address: '523, East Aveneue, Texas, USA',
                city: 'Austin',
                property_size: '30000',
                owner_name: 'Brad',
                
            },
            {
                address: '523, East Aveneue, Texas, USA',
                city: 'Austin',
                property_size: '30000',
                owner_name: 'Jin Soo',
                
            },
            {
                address: '523, East Aveneue, Texas, USA',
                city: 'Austin',
                property_size: '30000',
                owner_name: 'Max',
                
            },
            {
                address: '523, East Aveneue, Texas, USA',
                city: 'Austin',
                property_size: '30000',
                owner_name: 'Adriana',
                
            },
            {
                address: '523, East Aveneue, Texas, USA',
                city: 'Austin',
                property_size: '30000',
                owner_name: 'Michel',
                
            },
            {
                address: '523, East Aveneue, Texas, USA',
                city: 'Austin',
                property_size: '30000',
                owner_name: 'Aarav',
                
            },
            {
                address: '523, East Aveneue, Texas, USA',
                city: 'Austin',
                property_size: '30000',
                owner_name: 'Pari',
                
            },
            {
                address: '523, East Aveneue, Texas, USA',
                city: 'Austin',
                property_size: '30000',
                owner_name: 'Valeria',
                
            },
            {
                address: '523, East Aveneue, Texas, USA',
                city: 'Austin',
                property_size: '30000',
                owner_name: 'Shotaro',
                
            },
        ];

        for (let i = 0; i < properties.length; i++) {
            properties[i].docType = 'property';
            await ctx.stub.putState('PROPERTY' + i, Buffer.from(JSON.stringify(properties[i])));
            console.info('Added <--> ', properties[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async queryProperty(ctx, propertyNumber) {
        // const propertyAsBytes = await ctx.stub.getState(propertyNumber); // get the property from chaincode state
        // if (!propertyAsBytes || propertyAsBytes.length === 0) {
        //     throw new Error(`${propertyNumber} does not exist`);
        // }
        // console.log(propertyAsBytes.toString());
        // return propertyAsBytes.toString();



        let iterator = await ctx.stub.getHistoryForKey(propertyNumber);
        let result = [];
        let res = await iterator.next();
        let jsonResult = {};
        jsonResult.Key = propertyNumber;
        jsonResult.Record = [];
        while (!res.done) {
          if (res.value) {
            console.info(`found state update with value: ${res.value.value.toString('utf8')}`);
            const obj = JSON.parse(res.value.value.toString('utf8'));
            jsonResult.Record.push(obj);
          }
          res = await iterator.next();
        }
        result.push(jsonResult);
        await iterator.close();
        return result; 

        // const propertyAsBytes = await ctx.stub.getHistoryForKey(propertyNumber); // get the property from chaincode state
        // if (!propertyAsBytes || propertyAsBytes.length === 0) {
        //     throw new Error(`${propertyNumber} does not exist`);
        // }
        // console.log(propertyAsBytes.toString());
        // return propertyAsBytes.toString();
    }

    async queryPropertyByCity(ctx, cityName) {

        // https://www.youtube.com/watch?v=0yWheL3c8cg


        let query = {};
        query.selector = {"city" : cityName};
        let iterator = await ctx.stub.getQueryResult(JSON.stringify(query));

        const queryResult = [];
        while(true){
            let result = await iterator.next();
            let jsonResult = {};
            if(result.value && result.value.value.toString()){
                // jsonResult.key = result.value.key;
                // jsonResult.value = JSON.parse(result.value.value.toString('utf-8'));
                jsonResult.Key = result.value.key;
                jsonResult.Record = JSON.parse(result.value.value.toString('utf-8'));
                queryResult.push(jsonResult);
            }

            if(result.done){
                await iterator.close();
                return JSON.stringify(queryResult);
            }

        }



        


        // console.log(propertyAsBytes.toString());
        // return propertyAsBytes.toString();
    }

    // async getIteratorData(iterator){
        
    // }

    async createProperty(ctx, propertyNumber, address, city, property_size, owner_name) {
        console.info('============= START : Create Property ===========');

        const property = {
            property_size,
            docType: 'property',
            address,
            city,
            owner_name,
        };

        await ctx.stub.putState(propertyNumber, Buffer.from(JSON.stringify(property)));
        console.info('============= END : Create Property ===========');
    }

    async queryAllProperties(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    

    async changePropertyDetails(ctx, propertyNumber, ownerName, cityName, propertyAddress, propertySize) {
        console.info('============= START : changePropertyOwner ===========');

        const propertyAsBytes = await ctx.stub.getState(propertyNumber); // get the property from chaincode state
        if (!propertyAsBytes || propertyAsBytes.length === 0) {
            throw new Error(`${propertyNumber} does not exist`);
        }
        const property = JSON.parse(propertyAsBytes.toString());
        property.owner_name = ownerName;
        property.city = cityName;
        property.address = propertyAddress;
        property.property_size = propertySize;

        await ctx.stub.putState(propertyNumber, Buffer.from(JSON.stringify(property)));
        console.info('============= END : changePropertyOwner ===========');
    }

}

module.exports = FabProperty;

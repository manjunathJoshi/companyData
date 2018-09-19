const methods = {};
// const config = require('config');
var dbOps = require('./db');
var request = require('request');
 

// var External = config.get('api_url');

/**
 * Api GET for fetching company details from External API.  
 */
methods.getCompany =  (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            var companyData = await methods.makeRequest(data);
            resolve(companyData);
        } catch (err) {
            reject(err);
        }


    });

};
/**
 * Make request to External for getting details  
 */
methods.makeRequest = function (data) {
    return new Promise((resolve, reject) => {
        if (data === undefined) {
            return reject({
                status: false,
                message:"Did not find any data to request"
            });
        }
        var head = {
            url: '<ExternalApiurl>' + '/' + data.state,
            method: 'GET',
            headers: {
                "api-key": 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
            }
        }

        request(head, function (error, res, body) {
            if (res) {
                return resolve({
                    "status": true,
                    "response": body
                });
            } 
            else {
                return reject({
                    "status": false,
                    "message":"Request unsuccessful"
                });
            }
        });
    })

}
/**
 * Insert One company detail to MONGO from External API 
 */
methods.insertAllCompanyData = function(data){
    return new Promise(async (resolve,reject)=>{
        try{
            let getdata = await methods.getCompany({state:data.state});
            let cData = JSON.parse(getdata.response).response;
            // console.log("company-getdata",cData);            
            let records = cData.records;
            for(let i of records){
                // console.log(i);
                var obj = {};
                obj.CIN = i.corporate_identification_number;
                obj.companydata = i;
                obj.statecode = data.state
                await dbOps.create(obj);
            }
            resolve({status:true,message:"Successful PUT Operation"});
        }catch(err){
            reject({status:false,message:"Company data could not be fetched",err:err});
        }
        
    })
}
/**
 * Get one company detail from MONGO using CIN.... 
 */
methods.getCompaniesByCin = function(data){
    return new Promise(async (resolve,reject)=>{
        try{
            var cinno = data.CIN;
            // console.log("start",cinno);       
            let getComp = await dbOps.findOne({CIN:cinno});
            resolve(getComp);            
        }catch(err){
            reject({status:false,message:"Company data could not be fetched from mongo",err:err});
        }
    })
}
/**
 * Get one company detail from MONGO using Statecocde.... 
 */
methods.getCompaniesByState = function(data){
    return new Promise(async (resolve,reject)=>{
        try{       
            let getComp = await dbOps.find({statecode:data.statecode});
            resolve(getComp);            
        }catch(err){
            reject({status:false,message:"Company data could not be fetched from mongo",err:err});
        }
    })
}
/**
 * Get one company detail from MONGO with pagination.... 
 */
methods.getPaginationRecords = function(data){
    return new Promise(async (resolve,reject)=>{
        // {pageNo:pageNo,size:size}
        try{
            var pageNo = parseInt(data.pageNo);
            var size = parseInt(data.size);
            var query = {};
            if(pageNo === 0 || pageNo < 0){
              response = {"status":false,"message":"invalid page number"};
              reject(response);
            }
            query.skip = size * (pageNo-1);
            query.limit = size;
            dbOps.find({},{},query,function(err,data){
                if(err){
                    reject({"status": false, "message": "Error fetching data"});
                }else{
                    resolve({"status": true, "message": data});
                }
            })
        }catch(err){
            reject({"status":false,"message":"error occured while processing pagination data",err:err});
        }
    })
}

module.exports = methods;
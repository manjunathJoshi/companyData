var express = require('express');
var router = express.Router();
var request = require('request');
var company = require('../module/company');


/*  */
router.get('/',function(req,res,next){
  res.send('Express Working');
});


/* Fetch company records from External API according to state and insert into MONGO DB */
router.get('/fetchCompanyRecords/:state', async function (req, res, next) {
  try {
  let data = await company.insertAllCompanyData({ state: req.params.state });
    res.send("Successfully inserted company data of "+req.params.state+'');
  } catch (err) {
    res.send(err);
  }
});

/* Fetch company records from External API according to array of states and insert into MONGO DB */

router.get('/getCompanyRecords', async function (req, res, next) {
  try {
  let data = await company.getCompanyFromArray();
    res.send("Successfully inserted data from array into Mongo");
  } catch (err) {
    res.send(err);
  }
});

/* Get company records from MONGO with respect to CIN */
router.get('/getCompaniesByCin/:CIN', async function (req,res,next){
  try{
    let data= await company.getCompaniesByCin({CIN:req.params.CIN});
    res.send(data);
  }catch(err){
    res.send({status:false,message:"Company data could not be fetched because no parameter passed",err:err});
  }
});

/* Get company records from MONGO with respect to stateCode */
router.get('/getCompaniesByState/:statecode', async function (req,res,next){
  try{
    console.log("req.params",req.params);
    let data= await company.getCompaniesByState({statecode:req.params.statecode});
    res.send(data);
  }catch(err){
    res.send({status:false,message:"Company data could not be fetched because no parameter passed",err:err});
  }
});

/* Get company records from MONGO with Pagination */
router.get('/getPaginationRecords/:page/:perPage',async function(req,res,next){
  try{
    var pageNo = req.params.page;
    var size = req.params.perPage;
    let data = await company.getPaginationRecords({pageNo:pageNo,size:size});
    res.send(data);
  }catch(err){
    res.send({"status":false,"message":"error occured while processing pagination data",err:err})
  }

});

module.exports = router;

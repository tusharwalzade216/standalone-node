var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var sql = require('mssql');
var md5 = require('md5');
var tablesort = require('tablesort');
var nodeExcel=require('excel-export');

app.use(express.static(__dirname + '/MVC'));
app.use(bodyParser.json());

// Server Configuration : AdaptorSSO_04022016 , EDI_CHS_sFTP_FileDownload_30082017
var dbconfig = {
    server: 'localhost',
    database: 'EDI_CHS_sFTP_FileDownload_30082017',
    
    user: 'sa',
    password: 'gsg@12345',
    port: 1433,
    debug: false,
    multipleStatements: true,
    connectTimeout: 60000, 
    acquireTimeout: 60000
}

var dbconfigInv_VZB = {
    server: 'localhost',
    database: 'ETL_VZB_Production',    
    user: 'sa',
    password: 'gsg@123',
    port: 1433,
    debug: false,
    multipleStatements: true,
    connectTimeout: 60000, 
    acquireTimeout: 60000
}

var dbconfigInv_FR = {
    server: 'localhost',
    database: 'EDI_Frontier_Production',
    
    user: 'sa',
    password: 'gsg@123',
    port: 1433,
    debug: false,
    multipleStatements: true,
    connectTimeout: 60000, 
    acquireTimeout: 60000
}

var dbconfigInv_LVL3 = {
    server: 'localhost',
    database: 'EDI_Level3_Production',
    
    user: 'sa',
    password: 'gsg@123',
    port: 1433,
    debug: false,
    multipleStatements: true,
    connectTimeout: 60000, 
    acquireTimeout: 60000
}

// Login : Validate users
app.post('/getLogin',function(req, res){
    console.log(req.body);
    var lstatus="";
    var conn = new sql.Connection(dbconfig);
    conn.connect().then(function(){
        var sreq = new sql.Request(conn);
        sreq.input('EmailID',req.body.uname);
        // sreq.input('Password',md5(req.body.passwd));        
        sreq.input('Password',req.body.passwd);
        sreq.execute('ValidateUser').then(function(recordset){
            res.json(recordset);
            // console.log(recordset);
            conn.close();
        })
        .catch(function (err) {
            console.log(err);
            conn.close();
        });
    })
})

app.get('/populateUser',function(req, res){    
    var conn = new sql.Connection(dbconfig);    
    conn.connect().then(function(){
        var sreq = new sql.Request(conn);
        sreq.input('Type','All');        
        sreq.execute('getLoginUserList').then(function(recordset){
            // console.log(recordset);
            res.json(recordset);
            // console.log('Hi Jk');
            conn.close();
        })
        .catch(function (err) {
            console.log(err);
            conn.close();
        });
    })
})

app.get('/getEDISSISDetails',function(req, res){    
    var conn = new sql.Connection(dbconfig);    
    conn.connect().then(function(){
        var sreq = new sql.Request(conn);        
        sreq.execute('EDISSIS_GetSSISDetails').then(function(recordset){
            // console.log(recordset);
            res.json(recordset);
            // console.log('Hi Jk');
            conn.close();
        })
        .catch(function (err) {
            console.log(err);
            conn.close();
        });
    })
})

app.get('/getEDI_sFTP_Serverdetails',function(req, res){    
    var conn = new sql.Connection(dbconfig);    
    conn.connect().then(function(){
        var sreq = new sql.Request(conn);        
        sreq.execute('EDI_sFTP_Details').then(function(recordset){
            // console.log(recordset);
            res.json(recordset);            
            conn.close();
        })
        .catch(function (err) {
            console.log(err);
            conn.close();
        });
    })
})

app.get('/getEDIsFTPFileDownloadLog',function(req, res){    
    var conn = new sql.Connection(dbconfig);    
    conn.connect().then(function(){
        var sreq = new sql.Request(conn);        
        sreq.execute('EDIdownloadFileLog').then(function(recordset){
            // console.log(recordset);
            res.json(recordset);            
            conn.close();
        })
        .catch(function (err) {
            console.log(err);
            conn.close();
        });
    })
})

app.get('/getCHSInvoiceSummaryReport',function(req, res){    
    var conn = new sql.Connection(dbconfig);    
    conn.connect().then(function(){
        var sreq = new sql.Request(conn);        
        sreq.execute('EDICHS_InvoiceSummaryReport').then(function(recordset){
            // console.log(recordset);
            res.json(recordset);            
            conn.close();
        })
        .catch(function (err) {
            console.log(err);
            conn.close();
        });
    })
})

app.post('/getMenu',function(req, res){    
    var conn = new sql.Connection(dbconfig);    
    conn.connect().then(function(){
        var sreq = new sql.Request(conn);        
        sreq.execute('GetMenus').then(function(recordset){
            console.log(recordset);
            res.json(recordset);
            // console.log('Hi Menu');
            conn.close();
        })
        .catch(function (err) {
            console.log(err);
            conn.close();
        });
    })
})

app.get('/populateUserType',function(req, res){
    var conn = new sql.Connection(dbconfig);
    conn.connect().then(function(){
        var sreq = new sql.Request(conn);
        sreq.execute('getLoginUserType').then(function(recordset){
            res.json(recordset);
            conn.close();
        })
        .catch(function (err) {
            console.log(err);
            conn.close();
        });
    })
})

app.post('/addUser',function(req, res){
    //console.log(req.body);
    var lstatus="";
    var conn = new sql.Connection(dbconfig);
    conn.connect().then(function(){
        var sreq = new sql.Request(conn);
        sreq.input('AddEditDelete','ADD');
        sreq.input('LoginUserId',sql.Int, '1');
        sreq.input('FirstName',req.body.FirstName);
        sreq.input('LastName',req.body.LastName);
        sreq.input('EmailId',req.body.EmailId);
        sreq.input('Password',req.body.Password);
        sreq.input('LoginUserTypeId',sql.Int, req.body.LoginUserTypeId);
        sreq.input('CreatedBy',sql.Int, '1');
        sreq.input('IsEnable',sql.Int, '1');
        sreq.input('Notification', req.body.Notification);
        sreq.input('OutParam', sql.VarChar(500));
        sreq.execute('AddEditUser').then(function(recordset){
            //res.json(recordset);
            console.log(sreq.parameters.OUTPUT.value);
            conn.close();
        })
        .catch(function (err) {
            console.log(err);
            conn.close();
        });
    })
})

app.get('/getEDIInvoiceSummary',function(req, res){    
    var conn = new sql.Connection(dbconfigInv_VZB);    
    conn.connect().then(function(){
        var sreq = new sql.Request(conn);        
        sreq.execute('EDIUI_GetInvoiceSummary').then(function(recordset){
            // console.log(recordset);
            res.json(recordset);            
            conn.close();
        })
        .catch(function (err) {
            console.log(err);
            conn.close();
        });
    })
})

app.get('/getEDIUSOCExceptions',function(req, res){    
    var conn = new sql.Connection(dbconfigInv_VZB);    
    conn.connect().then(function(){
        var sreq = new sql.Request(conn);        
        sreq.execute('EDIUSOCExceptions_SELECT').then(function(recordset){
            // console.log(recordset);
            res.json(recordset);            
            conn.close();
        })
        .catch(function (err) {
            console.log(err);
            conn.close();
        });
    })
})

app.listen(2017);
console.log('Connected to server on port 2017');
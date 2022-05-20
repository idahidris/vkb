var fs = require('fs');
const express = require("express");
const session = require("express-session");
const app = express();
const path = require("path");
const router = express.Router();
const bodyParser= require("body-parser");
const multer = require('multer');
const upload =multer({dest: 'uploads/'});


var paths = require('path');


let myData =[];

var https = require('http');

var axios = require('axios');
var FormData = require('form-data');

const SESSION_NAME='sid';

const{
 PORT=3000,
 LIFETIME=100000000
}=process.env;




app.use(session({
    name: SESSION_NAME,
    secret: 'password2$',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: LIFETIME,
        secure: false,
        sameSite: true
    }
}));


const redirectLogin=(req, res, next)=>{
    if(!req.session.userId){
        res.redirect("/Login");

    }
    else {

        var createdTime = req.session.createdTime;
        createdTime= BigInt(createdTime.toString());
        var now = new Date().getTime();
        now = BigInt(now.toString());

        var diff = now - createdTime;

        var duration = req.session.refreshTokenDurationMs;
        duration = BigInt(duration);
        var timeLeft = duration - diff;

        if(timeLeft < 0)
            //token has expired please refresh
        {


            var obj2 = {
                "refreshToken": req.session.refreshToken
            };

            var jsonObject2 = JSON.stringify(obj2);


            var header = {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(jsonObject2, 'utf8')
            };


            var optionsget = {
                host: '127.0.0.1',
                port: 9032,
                path: '/vkb/api/auth/refreshtoken',
                method: 'POST',
                headers: header
            };

            console.info("Making a post call ...");
            console.info(optionsget);
            console.info("REQUEST:: " +jsonObject2);



            // do the POST call
            var reqGet= https.request(optionsget, function(res2) {
                console.log("statusCode: ", res2.statusCode);
                // uncomment it for header details
                //  console.log("headers: ", res.headers);

                res2.on('data', function(d) {
                    console.info('GET result:\n');
                    var response = JSON.parse(d);
                    console.log(response);
                    console.info('\n\nGET completed');



                        if(res2.statusCode===200){//successful

                            var records= response.responseBody;
                            req.session.token="Bearer "+records.accessToken;
                            req.session.refreshTokenDurationMs = records.refreshTokenDurationMs;
                            req.session.createdTime= new Date().getTime();
                            req.session.save();

                         next();
                        }

                    else if(res2.statusCode===400) {
                        var listError=[];
                        var k =0;
                        for(var item of response.apiErrors.apiErrorList){
                            listError[k]=item.message;
                            k=k+1;
                        }
                        console.log(listError);

                      logout(req, res);

                    }
                    else {
                         logout(req, res);
                    }


                });




            });


            reqGet.write(jsonObject2);
            reqGet.end();

            reqGet.on('error', function(e) {
                console.error(e);

                logout(req,res);
            });
        }


        else {
            next();
        }



    }

};


const redirectHome=(req, res, next)=>{
    if(req.session.userId){
        res.redirect("/dashboard");
    }
    else next();

};




app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));


router.get("/about", (req, res) => {
    res.render("about", { title: "Hey", message: "Hello there!" });
});

router.get("/login", redirectHome, (req, res) => {
    res.render("login");
});


router.get("/logout",redirectLogin, (req, res) => {
    logout(req, res);

});




router.get("/register", redirectHome, (req, res) => {
    res.render("register");
});


router.get("/shipping-order", (req, res) => {
    res.render("shipping-order");
});


router.get("/user-accounts", redirectLogin,(req, res) => {
    res.render("user-accounts");
});

router.get("/register-account", (req, res) => {
    res.render("register-account");
});

router.get("/goods", redirectLogin,(req, res) => {
    res.render("goods");
});


router.get("/sales",redirectLogin, (req, res) => {
    res.render("sales");
});

router.get("/subscriptions",redirectLogin, (req, res) => {
    res.render("subscriptions");
});

router.get("/service-subscription",redirectLogin, (req, res) => {

    {

        var obj2 = {
            "pageNumber": 0,
            "pageSize": 100

        };

        var jsonObject2 = JSON.stringify(obj2);


        var header = {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(jsonObject2, 'utf8'),
            'Authorization': req.session.token
        };


        var optionsget = {
            host: '127.0.0.1',
            port: 9032,
            path: '/vkb/api/v1/user',
            method: 'GET',
            headers: header
        };

        console.info("Making a get call ...");
        console.info(optionsget);
        console.info("REQUEST:: " +jsonObject2);



        // do the POST call
        var reqGet= https.request(optionsget, function(res2) {
            console.log("statusCode: ", res2.statusCode);
            // uncomment it for header details
            //  console.log("headers: ", res.headers);

            res2.on('data', function(d) {
                console.info('GET result:\n');
                var response = JSON.parse(d);
                console.log(response);
                console.info('\n\nGET completed');


                if(res2.statusCode===200){//successful
                    var records= response.responseBody.body.content;
                    myData = records;
                     res.render("service-subscription",{"data":myData});
                }
                else if(res2.statusCode===400) {
                    var listError=[];
                    var k =0;
                    for(var item of response.apiErrors.apiErrorList){
                        listError[k]=item.message;
                        k=k+1;
                    }
                    console.log(listError);
                    res.render("service-subscription",{"data":[]});




                }
                else {
                    res.render("service-subscription",{"data":[]});
                }


            });




        });


        reqGet.write(jsonObject2);
        reqGet.end();

        reqGet.on('error', function(e) {
            console.error(e);
            res.render("service-subscription",{"data":[]});
        });




    }

});


router.get("/register-goods", redirectLogin, (req, res) => {
    res.render("register-goods");
});



router.get("/",redirectLogin, (req, res) => {
    res.render("login");
});


app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());


router.get("/cancel-shopping-cart",redirectLogin, (req, res, next)=>{

        const id = req.query.id;
        console.log("item id==>"+ id);
        var header = {
            'Content-Type': 'application/json',
            'Authorization': req.session.token
        };

        var optionspost = {
            host: '127.0.0.1',
            port: 9032,
            path: '/vkb/api/v1/shoppingCart/'+id,
            method: 'DELETE',
            headers: header
        };

        console.info("Making a delete call ...");
        console.info(optionspost);


        var reqGet= https.request(optionspost, function(res2) {
            console.log("statusCode: ", res2.statusCode);

            res2.on('data', function(d) {
                console.info('POST result:\n');
                var response = JSON.parse(d);
                console.log(response);
                console.info('\n\nPOST completed');


                if(res2.statusCode===200){//successful
                    var records= response.responseBody;

                    res.render("shopping-carts", {"data":records});

                }
                else if(res2.statusCode===400) {
                    var listError=[];
                    var k =0;
                    for(var item of response.apiErrors.apiErrorList){
                        listError[k]=item.message;
                        k=k+1;
                    }
                    var record = response.responseBody;
                    record = (typeof record ==="undefined")?{"carts":[], total:"0.000"}:record.responseBody;
                    console.log(listError);
                    console.log(record);
                    res.render("shopping-carts", {"error":listError, "data":record});

                }
                else {
                    res.render("shopping-carts", {"error":["Error occurred, please try again later"],"data":{"carts":[], total:"0.00"}});
                }


            });




        });
        reqGet.end();

        reqGet.on('error', function(e) {
            console.error(e);
            res.render("shopping-carts", {"error":["Error occurred, please try again later "+e],"data":{"carts":[], total:"0.00"}});
        });







    }
);

router.get("/cancel-cart", redirectLogin, (req, res, next)=>{

        const id = req.query.id;
        console.log("item id==>"+ id);
        var header = {
            'Content-Type': 'application/json',
            'Authorization': req.session.token
        };

        var optionspost = {
            host: '127.0.0.1',
            port: 9032,
            path: '/vkb/api/v1/cart/'+id,
            method: 'DELETE',
            headers: header
        };

        console.info("Making a delete call ...");
        console.info(optionspost);


        var reqGet= https.request(optionspost, function(res2) {
            console.log("statusCode: ", res2.statusCode);

            res2.on('data', function(d) {
                console.info('POST result:\n');
                var response = JSON.parse(d);
                console.log(response);
                console.info('\n\nPOST completed');


                if(res2.statusCode===200){//successful
                    var records= response.responseBody;

                    res.render("carts", {"data":records});

                }
                else if(res2.statusCode===400) {
                    var listError=[];
                    var k =0;
                    for(var item of response.apiErrors.apiErrorList){
                        listError[k]=item.message;
                        k=k+1;
                    }
                    console.log(listError);
                    res.render("carts", {"data":{"carts":[], total:"0.00"}});

                }
                else {
                    res.render("carts", {"data":{"carts":[], total:"0.00"}});
                }


            });




        });
        reqGet.end();

        reqGet.on('error', function(e) {
            console.error(e);
            res.render("carts", {"data":{"carts":[], total:"0.00"}});
        });







    }
);


router.post("/add-to-shopping-cart", redirectLogin,(req, res, next)=>{


        const obj = req.body;
        var jsonObject = JSON.stringify(obj);


        var header = {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(jsonObject, 'utf8'),
            'Authorization': req.session.token
        };

        var optionsget = {
            host: '127.0.0.1',
            port: 9032,
            path: '/vkb/api/v1/shoppingCart',
            method: 'POST',
            headers: header
        };

        console.info("Making a POST call ...");
        console.info(optionsget);


        var reqPost= https.request(optionsget, function(res2) {
            console.log("statusCode: ", res2.statusCode);

            res2.on('data', function(d) {
                console.info('POST result:\n');
                var response = JSON.parse(d);
                console.log(response);
                console.info('\n\nPOST completed');


                if(res2.statusCode===200){//successful
                    console.log(response);
                    var id = response.responseBody.id;
                    var productName = response.responseBody.productName;
                    res.send({success: ["Successfully Added \""+productName+"\" to shopping cart, ref "+id+ " click <a href='/shopping-checkout'>here</a> to view list"]});


                }
                else if(res2.statusCode===400) {
                    var listError=[];
                    var k =0;
                    for(var item of response.apiErrors.apiErrorList){
                        listError[k]=item.message;
                        k=k+1;
                    }
                    console.log(listError);
                    res.send( {error: listError});

                }
                else {
                    res.send({error: ['Error occurred adding shopping cart, please try again later']});
                }


            });




        });
        console.log(jsonObject);
        reqPost.write(jsonObject);
        reqPost.end();

        reqPost.on('error', function(e) {
            console.error(e);
            res.send({error: ['Error occurred adding shopping cart, please try again later']});
        });







    }
);

router.post("/add-to-cart", redirectLogin,(req, res, next)=>{

        const id = req.body.id;
        const qty = req.body.qty;
        var header = {
            'Content-Type': 'application/json',
            'Authorization': req.session.token
        };

        var optionspost = {
            host: '127.0.0.1',
            port: 9032,
            path: '/vkb/api/v1/cart/'+id+'/'+qty,
            method: 'POST',
            headers: header
        };

        console.info("Making a post call ...");
        console.info(optionspost);


        var reqGet= https.request(optionspost, function(res2) {
            console.log("statusCode: ", res2.statusCode);

            res2.on('data', function(d) {
                console.info('POST result:\n');
                var response = JSON.parse(d);
                console.log(response);
                console.info('\n\nPOST completed');


                if(res2.statusCode===200){//successful
                    var records= response.responseBody;
                    var remain = records.remainder;
                    var name = records.data.itemId;
                    var message = name + " was successfully added to cart, remainder goods :"+ remain;
                    var reply ={
                        "successful": true,
                        "message": message
                    };
                    res.send(reply);

                }
                else if(res2.statusCode===400) {
                    var listError=[];
                    var k =0;
                    for(var item of response.apiErrors.apiErrorList){
                        listError[k]=item.message;
                        k=k+1;
                    }
                    console.log(listError);

                    var replies ={
                        "successful": false,
                        "message": listError
                    };
                    res.send(replies);

                }
                else {
                    var listErrors=["please try again, later"];

                    var responses ={
                        "successful": false,
                        "message": listErrors
                    };
                    res.send(responses);
                }


            });




        });
        reqGet.end();

        reqGet.on('error', function(e) {
            console.error(e);
            res.send([]);
        });







    }
);





router.post("/shopping-cart-to-order",redirectLogin, (req, res, next)=>{


        var shippingVendor = req.body.shippingVendor;
        var shippingVendorEmail = req.body.shippingVendorEmail;
        var description = req.body.shippingDescription;


        var obj={
            "shippingVendor": shippingVendor,
            "shippingVendorEmail": shippingVendorEmail,
            "description": description
        };

        var jsonObject = JSON.stringify(obj);


        var header = {
            'Content-Type': 'application/json',
            'Authorization': req.session.token
        };

        var optionspost = {
            host: '127.0.0.1',
            port: 9032,
            path: '/vkb/api/v1/shipping-order',
            method: 'POST',
            headers: header
        };

        console.info("Making a post call ...");
        console.info(optionspost);


        var reqPut= https.request(optionspost, function(res2) {
            console.log("statusCode: ", res2.statusCode);

            res2.on('data', function(d) {
                console.info('POST result:\n');
                var response = JSON.parse(d);
                console.log(response);
                console.info('\n\nPOST completed');


                if(res2.statusCode===200){//successful
                    var records= response.responseBody;
                    console.log(records);

                    var message =  "order was successful, ref:"+records.batchId;
                    var reply ={
                        "successful": true,
                        "message": message
                    };
                    res.render("confirmation", reply);

                }
                else if(res2.statusCode===400) {
                    var listError=[];
                    var k =0;
                    for(var item of response.apiErrors.apiErrorList){
                        listError[k]=item.message;
                        k=k+1;
                    }
                    console.log(listError);

                    var replies ={
                        "successful": false,
                        "message": listError
                    };
                    res.render("confirmation", replies);

                }
                else {
                    var listErrors=["please try again, later"];

                    var responses ={
                        "successful": false,
                        "message": listErrors
                    };
                    res.render("confirmation", responses);
                }


            });




        });
        reqPut.write(jsonObject);
        reqPut.end();

        reqPut.on('error', function(e) {
            console.error(e);
            var listError=["please try again, later"];

            var response ={
                "successful": false,
                "message": listError
            };
            res.render("confirmation", response);
        });







    }
);

router.post("/cart-to-sales",redirectLogin, (req, res, next)=>{

        const id = 'admin';
        var ref = req.body.customerRef;
        if(ref.length<1)
            ref="default";
        var obj={
            "ref": ref
        };

       var jsonObject = JSON.stringify(obj);

        console.log("ref ", ref);

        var header = {
            'Content-Type': 'application/json',
            'Authorization': req.session.token
        };

        var optionspost = {
            host: '127.0.0.1',
            port: 9032,
            path: '/vkb/api/v1/cart/'+id,
            method: 'PUT',
            headers: header
        };

        console.info("Making a put call ...");
        console.info(optionspost);


        var reqPut= https.request(optionspost, function(res2) {
            console.log("statusCode: ", res2.statusCode);

            res2.on('data', function(d) {
                console.info('PUT result:\n');
                var response = JSON.parse(d);
                console.log(response);
                console.info('\n\nPUT completed');


                if(res2.statusCode===200){//successful
                    var records= response.responseBody;
                    console.log(records);

                    var message =  "sales was successful, ref:"+records.batchId;
                    var reply ={
                        "successful": true,
                        "message": message
                    };
                    res.render("confirmation", reply);

                }
                else if(res2.statusCode===400) {
                    var listError=[];
                    var k =0;
                    for(var item of response.apiErrors.apiErrorList){
                        listError[k]=item.message;
                        k=k+1;
                    }
                    console.log(listError);

                    var replies ={
                        "successful": false,
                        "message": listError
                    };
                    res.render("confirmation", replies);

                }
                else {
                    var listErrors=["please try again, later"];

                    var responses ={
                        "successful": false,
                        "message": listErrors
                    };
                    res.render("confirmation", responses);
                }


            });




        });
    reqPut.write(jsonObject);
    reqPut.end();

    reqPut.on('error', function(e) {
            console.error(e);
            var listError=["please try again, later"];

            var response ={
                "successful": false,
                "message": listError
            };
        res.render("/confirmation", response);
        });







    }
);


router.get("/view-shipping-cart",redirectLogin, (req, res, next)=>{


        const id = req.query.id;
        var header = {
            'Content-Type': 'application/json',
            'Authorization': req.session.token
        };

        var optionsget = {
            host: '127.0.0.1',
            port: 9032,
            path: '/vkb/api/v1/shipping-order/'+id,
            method: 'GET',
            headers: header
        };


        console.info("Making a get call ...");
        console.info(optionsget);



        var reqGet= https.request(optionsget, function(res2) {
            console.log("statusCode: ", res2.statusCode);

            res2.on('data', function(d) {
                console.info('GET result:\n');
                var response = JSON.parse(d);
                console.log(response);
                console.info('\n\nGET completed');


                if(res2.statusCode===200){//successful

                    var records= response.responseBody;
                    var shippingOrderItems = records.shippingOrderItems;

                    console.log(records);
                    res.render("shopping-carts",{"data":{"carts":shippingOrderItems, "total":"0.00"}});


                }
                else if(res2.statusCode===400) {
                    var listError=[];
                    var k =0;
                    for(var item of response.apiErrors.apiErrorList){
                        listError[k]=item.message;
                        k=k+1;
                    }
                    console.log(listError);
                    res.render("shopping-carts",{"data":{"error":listError,"carts":[], "total":"0.00"}});

                }
                else {
                    res.render("shopping-carts",{"data":{"error":["error occurred, please try again later"],"carts":[], "total":"0.00"}});
                }


            });




        });

        reqGet.end();

        reqGet.on('error', function(e) {
            console.error(e);
            res.render("shopping-carts",{"data":{"error":["error occurred, please try again later "+e],"carts":[], "total":"0.00"}});
        });







    }
);

router.get("/goods-by-id",redirectLogin, (req, res, next)=>{

        const id = req.query.id;
        var header = {
            'Content-Type': 'application/json',
            'Authorization': req.session.token
        };

        var optionsget = {
            host: '127.0.0.1',
            port: 9032,
            path: '/vkb/api/v1/goods/'+id,
            method: 'GET',
            headers: header
        };

        console.info("Making a get call ...");
        console.info(optionsget);


        var reqGet= https.request(optionsget, function(res2) {
            console.log("statusCode: ", res2.statusCode);

            res2.on('data', function(d) {
                console.info('GET result:\n');
                var response = JSON.parse(d);
                console.log(response);
                console.info('\n\nGET completed');


                if(res2.statusCode===200){//successful
                    var records= response.responseBody.body.content;
                    res.send(records);

                }
                else if(res2.statusCode===400) {
                    var listError=[];
                    var k =0;
                    for(var item of response.apiErrors.apiErrorList){
                        listError[k]=item.message;
                        k=k+1;
                    }
                    console.log(listError);
                    res.send([]);

                }
                else {
                    res.send([]);
                }


            });




        });
        reqGet.end();

        reqGet.on('error', function(e) {
            console.error(e);
            res.send([]);
        });







    }
);




router.post("/submit-edited-goods",redirectLogin, (req, res, next)=>{

        const obj = req.body;
        var jsonObject = JSON.stringify(obj);


        var header = {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(jsonObject, 'utf8'),
            'Authorization': req.session.token
        };

        var optionsget = {
            host: '127.0.0.1',
            port: 9032,
            path: '/vkb/api/v1/goods',
            method: 'PUT',
            headers: header
        };

        console.info("Making a PUT call ...");
        console.info(optionsget);


        var reqPost= https.request(optionsget, function(res2) {
            console.log("statusCode: ", res2.statusCode);

            res2.on('data', function(d) {
                console.info('PUT result:\n');
                var response = JSON.parse(d);
                console.log(response);
                console.info('\n\nPUT completed');


                if(res2.statusCode===200){//successful
                    var id = response.responseBody.id;
                    res.send({success: ["Update Successfully Completed, ref "+id]});


                }
                else if(res2.statusCode===400) {
                    var listError=[];
                    var k =0;
                    for(var item of response.apiErrors.apiErrorList){
                        listError[k]=item.message;
                        k=k+1;
                    }
                    console.log(listError);
                    res.send( {error: listError});

                }
                else {
                    res.send({error: ['Error occurred updating goods, please try again later']});
                }


            });




        });
        reqPost.write(jsonObject);
        reqPost.end();

        reqPost.on('error', function(e) {
            console.error(e);
            res.send({error: ['Error occurred updating goods, please try again later']});
        });







    }
);

router.post("/submit-edited-user",redirectLogin, (req, res, next)=>{

        const obj = req.body;
        var jsonObject = JSON.stringify(obj);


        var header = {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(jsonObject, 'utf8'),
            'Authorization': req.session.token
        };

        var optionsget = {
            host: '127.0.0.1',
            port: 9032,
            path: '/vkb/api/v1/user',
            method: 'PUT',
            headers: header
        };

        console.info("Making a PUT call ...");
        console.info(optionsget);


        var reqPost= https.request(optionsget, function(res2) {
            console.log("statusCode: ", res2.statusCode);

            res2.on('data', function(d) {
                console.info('PUT result:\n');
                var response = JSON.parse(d);
                console.log(response);
                console.info('\n\nPUT completed');


                if(res2.statusCode===200){//successful
                    var id = response.responseBody.id;
                    res.send({success: ["Update Successfully Completed, ref "+id]});


                }
                else if(res2.statusCode===400) {
                    var listError=[];
                    var k =0;
                    for(var item of response.apiErrors.apiErrorList){
                        listError[k]=item.message;
                        k=k+1;
                    }
                    console.log(listError);
                    res.send( {error: listError});

                }
                else {
                    res.send({error: ['Error occurred updating user, please try again later']});
                }


            });




        });
        reqPost.write(jsonObject);
        reqPost.end();

        reqPost.on('error', function(e) {
            console.error(e);
            res.send({error: ['Error occurred updating user, please try again later']});
        });







    }
);




router.post("/submit-edited-subscription",redirectLogin,upload.single("file"), function(req, res){

        const id = req.body.id;
        const serviceTitle = req.body.serviceTitle;
        const description = req.body.description;
        const price = req.body.price;
        const paidAmount = req.body.paidAmount;
        const paidAmountDate = req.body.paidAmountDate;
        const lastPaymentReference = req.body.lastPaymentReference;
        const expectedDeliveryDate = req.body.expectedDeliveryDate;
        const actualDeliveryDate = req.body.actualDeliveryDate;
        const status = req.body.status;
        var documentLink;

    var fileName;

        if(req.file && req.file.filename) {
            fileName = req.file.filename;
             documentLink = req.file.originalname;

        }



        var obj = {
            "id": id,
            "serviceTitle": serviceTitle,
            "description": description,
            "price": price,
            "paidAmount": paidAmount,
            "paidAmountDate": paidAmountDate,
            "documentLink": documentLink,
            "lastPaymentReference": lastPaymentReference,
            "expectedDeliveryDate": expectedDeliveryDate,
            "actualDeliveryDate": actualDeliveryDate,
            "status": status

        };




        var jsonObject = JSON.stringify(obj);

            console.info("Making a put call ...");

            var data = new FormData();

            if(fileName) {
                data.append('file', fs.createReadStream(paths.resolve('./uploads/' + req.file.filename), {
                    originalFileName: req.file.originalname,
                    contentType: req.file.mimetype

                }));
            }
            data.append('subscription', jsonObject);


            var config = {
                method: 'put',
                url: 'http://127.0.0.1:9032/vkb/api/v1/subscription',
                headers: {
                    'Content-Type': 'multipart/form-data;boundary=1AE12345AF',
                    ...data.getHeaders()
                },
                data : data
            };
            console.info("REQUEST:: " +jsonObject);

            axios(config)
                .then(function (response) {
                    console.log("status::::::::::::::::::::::::::::::::::",response.status);
                    if(response.status===200){
                        let id = response.data.responseBody.id;
                        if(fileName) {
                            fs.unlinkSync(paths.resolve('./uploads/' + fileName));
                        }
                        res.send({success: ["Update Successfully Completed, ref "+id]});
                    }
                    else{
                        res.send({error: ['Error occurred updating subscription, please try again later']});

                    }

                })
                .catch(function (error) {

                    console.log("ERROR::::",error);
                    if(error.response.status===400){
                        let resp = error.response.data;
                        let listError=[];
                        let k =0;
                        for(var item of resp.apiErrors.apiErrorList){
                            listError[k]=item.message;
                            k=k+1;
                        }

                        if(fileName) {
                            fs.unlinkSync(paths.resolve('./uploads/' + fileName));
                        }
                        res.send( {error: listError})

                    }

                    else {
                        if(fileName) {
                            fs.unlinkSync(paths.resolve('./uploads/' + fileName));
                        }
                        res.send({error: ['Error occurred updating subscription, please try again later '+ error]});
                    }

                });







    }
);



router.get("/user-account-id", redirectLogin, (req, res, next)=>{

        const id = req.query.id;
        var header = {
            'Content-Type': 'application/json',
            'Authorization': req.session.token
        };

        var optionsget = {
            host: '127.0.0.1',
            port: 9032,
            path: '/vkb/api/v1/user/id/'+id,
            method: 'GET',
            headers: header
        };

        console.info("Making a get call ...");
        console.info(optionsget);


        var reqGet= https.request(optionsget, function(res2) {
            console.log("statusCode: ", res2.statusCode);

            res2.on('data', function(d) {
                console.info('GET result:\n');
                var response = JSON.parse(d);
                console.log(response);
                console.info('\n\nGET completed');


                if(res2.statusCode===200){//successful
                    var records= response.responseBody;
                    res.send(records);

                }
                else if(res2.statusCode===400) {
                    var listError=[];
                    var k =0;
                    for(var item of response.apiErrors.apiErrorList){
                        listError[k]=item.message;
                        k=k+1;
                    }
                    console.log(listError);
                    res.send([]);

                }
                else {
                    res.send([]);
                }


            });




        });
        reqGet.end();

        reqGet.on('error', function(e) {
            console.error(e);
            res.send([]);
        });







    }
);



router.get("/goods-id",redirectLogin, (req, res, next)=>{

        const id = req.query.id;
        var header = {
            'Content-Type': 'application/json',
            'Authorization': req.session.token
        };

        var optionsget = {
            host: '127.0.0.1',
            port: 9032,
            path: '/vkb/api/v1/goods/id/'+id,
            method: 'GET',
            headers: header
        };

        console.info("Making a get call ...");
        console.info(optionsget);


        var reqGet= https.request(optionsget, function(res2) {
            console.log("statusCode: ", res2.statusCode);

            res2.on('data', function(d) {
                console.info('GET result:\n');
                var response = JSON.parse(d);
                console.log(response);
                console.info('\n\nGET completed');


                if(res2.statusCode===200){//successful
                    var records= response.responseBody;
                    res.send(records);

                }
                else if(res2.statusCode===400) {
                    var listError=[];
                    var k =0;
                    for(var item of response.apiErrors.apiErrorList){
                        listError[k]=item.message;
                        k=k+1;
                    }
                    console.log(listError);
                    res.send([]);

                }
                else {
                    res.send([]);
                }


            });




        });
        reqGet.end();

        reqGet.on('error', function(e) {
            console.error(e);
            res.send([]);
        });







    }
);



router.get("/subscription-id",redirectLogin, (req, res, next)=>{

        const id = req.query.id;
           var header = {
        'Content-Type': 'application/json',
        'Authorization': req.session.token
    };

    var optionsget = {
        host: '127.0.0.1',
        port: 9032,
        path: '/vkb/api/v1/subscription/'+id,
        method: 'GET',
        headers: header
    };

    console.info("Making a get call ...");
    console.info(optionsget);


    var reqGet= https.request(optionsget, function(res2) {
        console.log("statusCode: ", res2.statusCode);

        res2.on('data', function(d) {
            console.info('GET result:\n');
            var response = JSON.parse(d);
            console.log(response);
            console.info('\n\nGET completed');


            if(res2.statusCode===200){//successful
                var records= response.responseBody;
                res.send(records);

            }
            else if(res2.statusCode===400) {
                var listError=[];
                var k =0;
                for(var item of response.apiErrors.apiErrorList){
                    listError[k]=item.message;
                    k=k+1;
                }
                console.log(listError);
                res.send([]);

            }
            else {
                res.send([]);
            }


        });




    });
    reqGet.end();

    reqGet.on('error', function(e) {
        console.error(e);
        res.send([]);
    });







    }
);



router.post("/register",redirectHome, (req, res)=>{

        const password = req.body.exampleInputPassword;
        const repeatPassword= req.body.exampleRepeatPassword
        const email = req.body.exampleInputEmail;
        const firstname = req.body.exampleFirstName;
        const lastname = req.body.exampleLastName;
        const username = req.body.exampleInputUsername;

        if(repeatPassword !==password){
            res.render("register", {"error":["Password mismatched Repeat Password"]});
        }


        let signupRequest = {
            "username": username,
            "email": email,
            "password": password,
            "firstname": firstname,
            "lastname": lastname,
            "role": [
                "ROLE_ADMIN"
            ]
        };

        var jsonObject = JSON.stringify(signupRequest);
        console.log(jsonObject);


        var header = {
            'Content-Type': 'application/json'
        };

        var optionsget = {
            host: '127.0.0.1',
            port: 9032,
            path: '/vkb/api/auth/signup',
            method: 'POST',
            headers: header
        };

        console.info("Making a post call ...");
        console.info(optionsget);


        var reqGet= https.request(optionsget, function(res2) {
            console.log("statusCode: ", res2.statusCode);

            res2.on('data', function(d) {
                console.info('POST result:\n');
                var response = JSON.parse(d);
                console.log(response);
                console.info('\n\nPOST completed');


                if(res2.statusCode===200){//successful

                    var records= response.responseBody;

                    req.session.save();

                    res.render("register", {"success":[records.message]});

                }
                else if(res2.statusCode===400) {
                    var listError=[];
                    var k =0;
                    for(var item of response.apiErrors.apiErrorList){
                        listError[k]=item.message;
                        k=k+1;
                    }
                    console.log(listError);
                    res.render("register", {"error":listError});

                }
                else {
                    res.render("register", {"error":["Unavailable, Please try again later"]});
                }


            });


        });
        reqGet.write(jsonObject);
        reqGet.end();

        reqGet.on('error', function(e) {
            console.error(e);
            res.render("register", {"error":["Unavailable, Please try again later: "+ e]});
        });

    }
);

router.post("/login",redirectHome, (req, res)=>{
        const username = req.body.username;
        const password = req.body.password;

        let loginRequest = {
            "username": username,
            "password": password
        };

    var jsonObject = JSON.stringify(loginRequest);


    var header = {
        'Content-Type': 'application/json'
    };

    var optionsget = {
        host: '127.0.0.1',
        port: 9032,
        path: '/vkb/api/auth/signin',
        method: 'POST',
        headers: header
    };

    console.info("Making a post call ...");
    console.info(optionsget);


    var reqGet= https.request(optionsget, function(res2) {
        console.log("statusCode: ", res2.statusCode);

        res2.on('data', function(d) {
            console.info('POST result:\n');
            var response = JSON.parse(d);
            console.log(response);
            console.info('\n\nPOST completed');


            if(res2.statusCode===200){//successful

                var records= response.responseBody;

                req.session.userId=records.username;
                req.session.email=records.email;
                req.session.token="Bearer "+records.token;
                req.session.roles=records.roles;
                req.session.refreshTokenDurationMs = records.expiresInMillis;
                req.session.refreshToken = records.refreshToken;
                req.session.createdTime= new Date().getTime();

                req.session.save();

                res.redirect("/dashboard");

            }
            else if(res2.statusCode===400) {
                var listError=[];
                var k =0;
                for(var item of response.apiErrors.apiErrorList){
                    listError[k]=item.message;
                    k=k+1;
                }
                console.log(listError);
                res.render("login", {"error":listError});

            }
            else {
                res.render("login", {"error":["Unavailable, Please try again later"]});
            }


        });


    });
    reqGet.write(jsonObject);
    reqGet.end();

    reqGet.on('error', function(e) {
        console.error(e);
        res.render("login", {"error":["Unavailable, Please try again later: "+ e]});
    });

    }
);




router.post("/submit-register-subscription",upload.single("documentLink"), function(req, res){

        const customerId = req.body.customerId;
        const serviceType = req.body.serviceType;
        const serviceTitle = req.body.serviceTitle;
        const description = req.body.description;
        const price = req.body.price;
        const paidAmount = req.body.paidAmount;
        const paidAmountDate = req.body.paidAmountDate;
        const lastPaymentReference = req.body.lastPaymentRef;
        const expectedDeliveryDate = req.body.expectedDeliveryDate;
        const actualDeliveryDate = req.body.actualDeliveryDate;
        const status = req.body.status;
        var documentLink;

        var fileName;

        if(req.file && req.file.filename) {
            fileName = req.file.filename;
            documentLink = req.file.originalname;

        }




        var result=[];
        var i =0;
        i = validate(customerId,'Customer ID',result,i);
        i = validate(serviceType,'Service Type',result,i);
        i = validate(status,'Status',result,i);

        var obj = {
            "customerId": customerId,
            "serviceType": serviceType,
            "serviceTitle": serviceTitle,
            "description": description,
            "price": price,
            "paidAmount": paidAmount,
            "paidAmountDate": paidAmountDate,
            "documentLink": documentLink,
            "lastPaymentReference": lastPaymentReference,
            "expectedDeliveryDate": expectedDeliveryDate,
            "actualDeliveryDate": actualDeliveryDate,
            "status": status

        };




        var jsonObject = JSON.stringify(obj);

    if(i>0) {
            console.log(i + "error(s) found");
            console.error(result);
            res.render("service-subscription", {error: result, data: myData, rec: obj});
        }

        else {


        console.info("Making a post call ...");

        var data = new FormData();

        if(fileName) {
            data.append('file', fs.createReadStream(paths.resolve('./uploads/' + req.file.filename), {
                originalFileName: req.file.originalname,
                contentType: req.file.mimetype

            }));
        }
        data.append('subscription', jsonObject);



        var config = {
            method: 'post',
            url: 'http://127.0.0.1:9032/vkb/api/v1/subscription',
            headers: {
                'Content-Type': 'multipart/form-data;boundary=1AE12345AF',
                ...data.getHeaders()
            },
            data : data
        };
        console.info("REQUEST:: " +jsonObject);

        axios(config)
            .then(function (response) {
                console.log("status::::::::::::::::::::::::::::::::::",response.status);
                if(response.status===200){
                    let id = response.data.responseBody.id;
                    if(fileName) {
                        fs.unlinkSync(paths.resolve('./uploads/' + req.file.filename));
                    }
                    res.render("service-subscription", {data: myData, success: ["Successfully Completed, ref "+id ]});
                }
                else{
                    res.render("service-subscription", {data:myData, rec: obj, error: ['Error occurred registering subscription, please try again later']});

                }

            })
            .catch(function (error) {

                console.log("ERROR::::",error);
                if(error.response.status===400){
                    let resp = error.response.data;
                    let listError=[];
                    let k =0;
                    console.log("ApiErrors ", resp.apiErrors);
                    console.log("apiErrorList ", resp.apiErrors.apiErrorList);
                    for(var item of resp.apiErrors.apiErrorList){
                        listError[k]=item.message;
                        k=k+1;
                    }
                    console.log(listError);
                    if(fileName) {
                        fs.unlinkSync(paths.resolve('./uploads/' + req.file.filename));
                    }
                    res.render("service-subscription", {error: listError, data: myData, rec:obj});

                }

                else {
                    if(fileName) {
                        fs.unlinkSync(paths.resolve('./uploads/' + req.file.filename));
                    }
                    res.render("service-subscription", {
                        data: myData,
                        rec: obj,
                        error: ['Error occurred registering subscription, please try again later:::' + error]
                    });
                }

            });





        }

    }
);

router.post("/submit-register-user",redirectLogin, (req, res)=>{

        const firstName = req.body.first_name;
        const lastName = req.body.last_name;
        const gender = req.body.gender;
        const email = req.body.email;
        const phone = req.body.phone;
        const description = req.body.description;
        const location = req.body.location;
        var result=[];
        var i =0;
        i = validate(email,'Email',result,i);
        i = validate(phone,'Phone',result,i);

        var obj = {
            "firstName": firstName,
            "lastName": lastName,
            "email": email,
            "phone": phone,
            "description": description,
            "gender": gender,
            "location":location

        };

        var jsonObject = JSON.stringify(obj);


        if(i>1) {
            console.log(i + "error(s) found");
            console.error(result);
            res.render("register-account", {error: result, data: obj});
        }

        else {

            var postheaders = {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(jsonObject, 'utf8'),
                'Authorization': req.session.token
            };


            var optionspost = {
                host: '127.0.0.1',
                port: 9032,
                path: '/vkb/api/v1/user',
                method: 'POST',
                headers: postheaders
            };

            console.info("Making a post call ...");
            console.info(optionspost);
            console.info("REQUEST:: " +jsonObject);



            // do the POST call
            var reqPost = https.request(optionspost, function(res2) {
                console.log("statusCode: ", res2.statusCode);
                // uncomment it for header details
                //  console.log("headers: ", res.headers);

                res2.on('data', function(d) {
                    console.info('POST result:\n');
                    var response = JSON.parse(d);
                    console.log(response);
                    console.info('\n\nPOST completed');


                    if(res2.statusCode===200){//successful
                        let id = response.responseBody.id;
                        let emails=response.responseBody.email;

                        res.render("register-account", {success: ["Successfully Completed, ref "+id +"-"+emails]});

                    }
                    else if(res2.statusCode===400) {
                        var listError=[];
                        var k =0;
                        for(var item of response.apiErrors.apiErrorList){
                            listError[k]=item.message;
                            k=k+1;
                        }
                        console.log(listError);
                        res.render("register-account", {error: listError, data: obj});


                    }
                    else {
                        res.render("register-account", {error: ['Error occurred registering user, please try again later'],data: obj});
                    }


                });




            });


            reqPost.write(jsonObject);
            reqPost.end();

            reqPost.on('error', function(e) {
                res.render("register-account", {error: ['Error occurred registering user, please try again later'],data: obj});
                console.error(e);
            });





        }

    }
);

router.post("/submit-register-goods",redirectLogin, (req, res)=>{


        const store = req.body.store;
        const name = req.body.name;
        const quantity = req.body.quantity;
        const unitprice = req.body.unitprice;
        const quantitysold = req.body.quantitysold;
        const description = req.body.description;
        const manufactureddate = req.body.manufactureddate;
        const expirydate = req.body.expirydate;
        var result=[];
        var i =0;
        i = validate(store,'store',result,i);
        i = validate(name,'Name*',result,i);
        i = validate(quantity,'Quantity*',result,i);
        i = validate(unitprice,'Unit Price*',result,i);
        i = validate(quantitysold,'Quantity Sold*',result,i);
        i = validate(description,'Description*',result,i);
        i = validate(manufactureddate,'Manufactured Date*',result,i);
        i = validate(expirydate,'Expiry Date*',result,i);

        var obj = {
            "name": name,
            "quantity": quantity,
            "unitPrice": unitprice,
            "quantitySold": quantitysold,
            "description": description,
            "manufacturedDate": manufactureddate,
            "expiryDate": expirydate

        };

         let jsonObject = JSON.stringify(obj);


        if(i>0) {
                console.log(i + "error(s) found");
                console.error(result);
                res.render("register-goods", {error: result, data: obj});
            }

        else {

            var postheaders = {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(jsonObject, 'utf8'),
                'Authorization': req.session.token
            };


            var optionspost = {
                host: '127.0.0.1',
                port: 9032,
                path: '/vkb/api/v1/goods',
                method: 'POST',
                headers: postheaders
            };

            console.info("Making a post call ...");
            console.info(optionspost);
            console.info("REQUEST:: " +jsonObject);



            // do the POST call
            var reqPost = https.request(optionspost, function(res2) {
                console.log("statusCode: ", res2.statusCode);
                // uncomment it for header details
                //  console.log("headers: ", res.headers);

                res2.on('data', function(d) {
                    console.info('POST result:\n');
                    var response = JSON.parse(d);
                    console.log(response);
                    console.info('\n\nPOST completed');


                    if(res2.statusCode===200){//successful
                        var id = response.responseBody.id;

                        res.render("register-goods", {success: ["Successfully Completed, ref "+id]});

                    }
                    else if(res2.statusCode===400) {
                        var listError=[];
                        var k =0;
                        for(var item of response.apiErrors.apiErrorList){
                            listError[k]=item.message;
                            k=k+1;
                        }
                        console.log(listError);
                        res.render("register-goods", {error: listError, data: obj});


                    }
                    else {
                        res.render("register-goods", {error: ['Error occurred registering goods, please try again later'], data: obj});
                    }


                });




            });


            reqPost.write(jsonObject);
            reqPost.end();

            reqPost.on('error', function(e) {
                res.render("register-goods", {error: ['Error occurred registering goods, please try again later'], data: obj});
                console.error(e);
            });





        }

    }
);



router.get("/shipping-order-data-source",redirectLogin, (req, res, next)=>{


        const length = req.query.length;
        const start = req.query.start;
        const draw = req.query.draw;
        const searchValue = req.query.search.value;

        console.log("search values ", searchValue);

        console.log("draw ===>"+draw);

        var obj2 = {
            "pageNumber": start/length,
            "pageSize": length,
            "searchValue": searchValue

        };

        var jsonObject2 = JSON.stringify(obj2);


        var header = {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(jsonObject2, 'utf8'),
            'Authorization': req.session.token
        };


        var optionsget = {
            host: '127.0.0.1',
            port: 9032,
            path: '/vkb/api/v1/shipping-order',
            method: 'GET',
            headers: header
        };

        console.info("Making a get call ...");
        console.info(optionsget);
        console.info("REQUEST:: " +jsonObject2);



        // do the POST call
        var reqGet= https.request(optionsget, function(res2) {
            console.log("statusCode: ", res2.statusCode);
            // uncomment it for header details
            //  console.log("headers: ", res.headers);

            res2.on('data', function(d) {
                console.info('GET result:\n');
                var response = JSON.parse(d);
                console.log(response);
                console.info('\n\nGET completed');


                if(res2.statusCode===200){//successful
                    var records= response.responseBody.body.content;
                    var totalRecord= response.responseBody.body.totalElements;
                    let dataInfo = {
                        "draw": draw,
                        //"search": true,
                        "recordsTotal": totalRecord,
                        "recordsFiltered": totalRecord,
                        "data": records
                    };
                    res.send(dataInfo);

                }
                else if(res2.statusCode===400) {
                    var listError=[];
                    var k =0;
                    for(var item of response.apiErrors.apiErrorList){
                        listError[k]=item.message;
                        k=k+1;
                    }
                    console.log(listError);
                    res.send([]);




                }
                else {
                    res.send([]);
                }


            });




        });


        reqGet.write(jsonObject2);
        reqGet.end();

        reqGet.on('error', function(e) {
            console.error(e);
            res.send([]);
        });



    }
);
router.get("/subscriptions-data-source", redirectLogin, (req, res, next)=>{


        const length = req.query.length;
        const start = req.query.start;
        const draw = req.query.draw;
        const searchValue = req.query.search.value;

        console.log("search values ", searchValue);

        console.log("draw ===>"+draw);

        var obj2 = {
            "pageNumber": start/length,
            "pageSize": length,
            "searchValue": searchValue

        };

        var jsonObject2 = JSON.stringify(obj2);


        var header = {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(jsonObject2, 'utf8'),
            'Authorization': req.session.token
        };


        var optionsget = {
            host: '127.0.0.1',
            port: 9032,
            path: '/vkb/api/v1/subscription',
            method: 'GET',
            headers: header
        };

        console.info("Making a get call ...");
        console.info(optionsget);
        console.info("REQUEST:: " +jsonObject2);



        // do the POST call
        var reqGet= https.request(optionsget, function(res2) {
            console.log("statusCode: ", res2.statusCode);
            // uncomment it for header details
            //  console.log("headers: ", res.headers);

            res2.on('data', function(d) {
                console.info('GET result:\n');
                var response = JSON.parse(d);
                console.log(response);
                console.info('\n\nGET completed');


                if(res2.statusCode===200){//successful
                    var records= response.responseBody.body.content;
                    var totalRecord= response.responseBody.body.totalElements;
                    let dataInfo = {
                        "draw": draw,
                        //"search": true,
                        "recordsTotal": totalRecord,
                        "recordsFiltered": totalRecord,
                        "data": records
                    };
                    res.send(dataInfo);

                }
                else if(res2.statusCode===400) {
                    var listError=[];
                    var k =0;
                    for(var item of response.apiErrors.apiErrorList){
                        listError[k]=item.message;
                        k=k+1;
                    }
                    console.log(listError);
                    res.send([]);




                }
                else {
                    res.send([]);
                }


            });




        });


        reqGet.write(jsonObject2);
        reqGet.end();

        reqGet.on('error', function(e) {
            console.error(e);
            res.send([]);
        });







    }
);

router.get("/users-data-source",redirectLogin, (req, res, next)=>{


        const length = req.query.length;
        const start = req.query.start;
        const draw = req.query.draw;
        const searchValue = req.query.search.value;

        console.log("search values ", searchValue);

        console.log("draw ===>"+draw);

        var obj2 = {
            "pageNumber": start/length,
            "pageSize": length,
            "searchValue": searchValue

        };

        var jsonObject2 = JSON.stringify(obj2);


        var header = {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(jsonObject2, 'utf8'),
            'Authorization': req.session.token
        };


        var optionsget = {
            host: '127.0.0.1',
            port: 9032,
            path: '/vkb/api/v1/user',
            method: 'GET',
            headers: header
        };

        console.info("Making a get call ...");
        console.info(optionsget);
        console.info("REQUEST:: " +jsonObject2);



        // do the POST call
        var reqGet= https.request(optionsget, function(res2) {
            console.log("statusCode: ", res2.statusCode);
            // uncomment it for header details
            //  console.log("headers: ", res.headers);

            res2.on('data', function(d) {
                console.info('GET result:\n');
                var response = JSON.parse(d);
                console.log(response);
                console.info('\n\nGET completed');


                if(res2.statusCode===200){//successful
                    var records= response.responseBody.body.content;
                    var totalRecord= response.responseBody.body.totalElements;
                    let dataInfo = {
                        "draw": draw,
                        //"search": true,
                        "recordsTotal": totalRecord,
                        "recordsFiltered": totalRecord,
                        "data": records
                    };
                    res.send(dataInfo);

                }
                else if(res2.statusCode===400) {
                    var listError=[];
                    var k =0;
                    for(var item of response.apiErrors.apiErrorList){
                        listError[k]=item.message;
                        k=k+1;
                    }
                    console.log(listError);
                    res.send([]);




                }
                else {
                    res.send([]);
                }


            });




        });


        reqGet.write(jsonObject2);
        reqGet.end();

        reqGet.on('error', function(e) {
            console.error(e);
            res.send([]);
        });







    }
);






router.get("/sales-data-source", redirectLogin, (req, res, next)=>{


        const length = req.query.length;
        const start = req.query.start;
        const draw = req.query.draw;
        const searchValue = req.query.search.value;

        console.log("search values ", searchValue);

        console.log("draw ===>"+draw);

        var obj2 = {
            "pageNumber": start/length,
            "pageSize": length,
            "searchValue": searchValue

        };

        var jsonObject2 = JSON.stringify(obj2);


        var header = {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(jsonObject2, 'utf8'),
            'Authorization': req.session.token
        };


        var optionsget = {
            host: '127.0.0.1',
            port: 9032,
            path: '/vkb/api/v1/sales',
            method: 'GET',
            headers: header
        };

        console.info("Making a get call ...");
        console.info(optionsget);
        console.info("REQUEST:: " +jsonObject2);



        // do the POST call
        var reqGet= https.request(optionsget, function(res2) {
            console.log("statusCode: ", res2.statusCode);
            // uncomment it for header details
            //  console.log("headers: ", res.headers);

            res2.on('data', function(d) {
                console.info('GET result:\n');
                var response = JSON.parse(d);
                console.log(response);
                console.info('\n\nGET completed');


                if(res2.statusCode===200){//successful
                    var records= response.responseBody.body.content;
                    var totalRecord= response.responseBody.body.totalElements;
                    let dataInfo = {
                        "draw": draw,
                        //"search": true,
                        "recordsTotal": totalRecord,
                        "recordsFiltered": totalRecord,
                        "data": records
                    };
                    res.send(dataInfo);

                }
                else if(res2.statusCode===400) {
                    var listError=[];
                    var k =0;
                    for(var item of response.apiErrors.apiErrorList){
                        listError[k]=item.message;
                        k=k+1;
                    }
                    console.log(listError);
                    res.send([]);




                }
                else {
                    res.send([]);
                }


            });




        });


        reqGet.write(jsonObject2);
        reqGet.end();

        reqGet.on('error', function(e) {
            console.error(e);
            res.send([]);
        });







    }
);


router.get("/dashboard",redirectLogin,(req, res, next)=>{

        var header = {
            'Content-Type': 'application/json',
            'Authorization': req.session.token
        };


        var optionsget = {
            host: '127.0.0.1',
            port: 9032,
            path: '/vkb/api/v1/report/dashboard',
            method: 'GET',
            headers: header
        };

        console.info("Making a get call ...");
        console.info(optionsget);


        // do the GET call
        var reqGet= https.request(optionsget, function(res2) {
            console.log("statusCode: ", res2.statusCode);
            // uncomment it for header details
            //  console.log("headers: ", res.headers);

            res2.on('data', function(d) {
                console.info('GET result:\n');
                var response = JSON.parse(d);
                console.log(response);
                console.info('\n\nGET completed');


                if(res2.statusCode===200){//successful
                    var records= response.responseBody;
                    var monthlyIncome = records.monthlyIncome;
                    var serviceTypes = records.service_type;
                    var statusReport = records.status_report;

                    const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
                    const date = new Date();

                    let thisMonth = months[date.getMonth()];

                    let yearIncome =0;
                    let monthIncome=0;
                    let yearSubscriptionIncome =0;
                    let pendingTask = 0;
                    let completedTask = 0;
                    let yearIncomeSop = 0;

                    for(var income of monthlyIncome){
                        yearIncome = yearIncome + income.measure;
                        if(income.factor === thisMonth) {
                            monthIncome = income.measure;
                        }
                    }

                    for(var status of statusReport){
                        if(status.factor==="Initiated" || status.factor==="In progress" )
                            pendingTask = pendingTask + status.measure;
                        if(status.factor==="Completed")
                            completedTask = status.measure;
                    }

                    for(var serviceType of serviceTypes){
                        yearSubscriptionIncome = yearSubscriptionIncome + serviceType.measure;
                        if(serviceType.factor==="S.O.P")
                            yearIncomeSop=serviceType.measure;
                    }

                    console.log(monthIncome, yearIncome);

                    let rec = "0, 10000, 5000, 15000, 10000, 20000, 15000, 25000, 20000, 30000, 25000, 40000";

                    let salesPerc = ((records.goodsValue.measure+yearIncome)===0)?0: Math.round(yearIncome*100/(records.goodsValue.measure+yearIncome));

                    res.render("index", {"yearIncomeSop":yearIncomeSop.toLocaleString(),"completedTask":completedTask.toLocaleString(),"pendingTask":pendingTask.toLocaleString(),"yearSubscriptionIncome":yearSubscriptionIncome.toLocaleString(),"salesPercent":salesPerc,"rec": rec,"monthIncome":monthIncome.toLocaleString(), "yearIncome": yearIncome.toLocaleString(), "goodsValue": records.goodsValue.measure.toLocaleString()});

                }
                else if(res2.statusCode===400) {
                    var listError=[];
                    var k =0;
                    for(var item of response.apiErrors.apiErrorList){
                        listError[k]=item.message;
                        k=k+1;
                    }
                    console.log(listError);
                    res.render("index");


                }
                else {
                    res.render("index");
                }


            });




        });

        reqGet.end();

        reqGet.on('error', function(e) {
            console.error(e);
            res.render("index");
        });







    }
);



router.get("/goods-data-source",redirectLogin, (req, res, next)=>{


    const length = req.query.length;
    const start = req.query.start;
    const draw = req.query.draw;
    const searchValue = req.query.search.value;

    console.log("search values ", searchValue);

    console.log("draw ===>"+draw);

        var obj2 = {
            "pageNumber": start/length,
            "pageSize": length,
            "searchValue": searchValue

        };

         let jsonObject2 = JSON.stringify(obj2);


            var header = {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(jsonObject2, 'utf8'),
                'Authorization': req.session.token
            };


            var optionsget = {
                host: '127.0.0.1',
                port: 9032,
                path: '/vkb/api/v1/goods',
                method: 'GET',
                headers: header
            };

            console.info("Making a get call ...");
            console.info(optionsget);
            console.info("REQUEST:: " +jsonObject2);



            // do the POST call
            var reqGet= https.request(optionsget, function(res2) {
                console.log("statusCode: ", res2.statusCode);
                // uncomment it for header details
                //  console.log("headers: ", res.headers);

                res2.on('data', function(d) {
                    console.info('GET result:\n');
                    var response = JSON.parse(d);
                    console.log(response);
                    console.info('\n\nGET completed');


                    if(res2.statusCode===200){//successful
                        var records= response.responseBody.body.content;
                        var totalRecord= response.responseBody.body.totalElements;
                        let dataInfo = {
                            "draw": draw,
                            //"search": true,
                            "recordsTotal": totalRecord,
                            "recordsFiltered": totalRecord,
                            "data": records
                        };
                        res.send(dataInfo);

                    }
                    else if(res2.statusCode===400) {
                        var listError=[];
                        var k =0;
                        for(var item of response.apiErrors.apiErrorList){
                            listError[k]=item.message;
                            k=k+1;
                        }
                        console.log(listError);
                        res.send([]);

                        //nin: 29839058364 idah aladi aminat


                    }
                    else {
                        res.send([]);
                    }


                });




            });


            reqGet.write(jsonObject2);
            reqGet.end();

            reqGet.on('error', function(e) {
                console.error(e);
                res.send([]);
            });







    }
);




router.get("/shopping-checkout", redirectLogin, (req, res, next)=>{

        var header = {
            'Content-Type': 'application/json',
            'Authorization': req.session.token

        };


        var optionsget = {
            host: '127.0.0.1',
            port: 9032,
            path: '/vkb/api/v1/shoppingCart',
            method: 'GET',
            headers: header
        };

        console.info("Making a get call ...");
        console.info(optionsget);


        // do the POST call
        var reqGet= https.request(optionsget, function(res2) {
            console.log("statusCode: ", res2.statusCode);
            // uncomment it for header details
            //  console.log("headers: ", res.headers);

            res2.on('data', function(d) {
                console.info('GET result:\n');
                var response = JSON.parse(d);
                console.log(response);
                console.info('\n\nGET completed');



                if(res2.statusCode===200){//successful
                    var records= response.responseBody;
                    res.render("shopping-carts",{"data":records});

                }
                else if(res2.statusCode===400) {
                    var listError=[];
                    var k =0;
                    for(var item of response.apiErrors.apiErrorList){
                        listError[k]=item.message;
                        k=k+1;
                    }
                    console.log(listError);
                    res.render("shopping-carts",{"error":listError,"data":{"carts":[], "total":"0.00"}});


                }
                else {
                    res.render("shopping-carts",{"data":{"error":["error occurred, please try again later"],"carts":[], "total":"0.00"}});
                }


            });




        });

        reqGet.end();

        reqGet.on('error', function(e) {
            console.error(e);
            res.render("shopping-carts",{"data":{"error":["error occurred, please try again later "+e],"carts":[], "total":"0.00"}});
        });







    }
);



router.get("/checkout", redirectLogin, (req, res, next)=>{


        var obj2 = {
            "userId": "admin"
        };

        var jsonObject2 = JSON.stringify(obj2);


        var header = {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(jsonObject2, 'utf8'),
            'Authorization': req.session.token
        };


        var optionsget = {
            host: '127.0.0.1',
            port: 9032,
            path: '/vkb/api/v1/cart',
            method: 'GET',
            headers: header
        };

        console.info("Making a get call ...");
        console.info(optionsget);
        console.info("REQUEST:: " +jsonObject2);



        // do the POST call
        var reqGet= https.request(optionsget, function(res2) {
            console.log("statusCode: ", res2.statusCode);
            // uncomment it for header details
            //  console.log("headers: ", res.headers);

            res2.on('data', function(d) {
                console.info('GET result:\n');
                var response = JSON.parse(d);
                console.log(response);
                console.info('\n\nGET completed');


                if(res2.statusCode===200){//successful
                    var records= response.responseBody;
                    res.render("carts",{"data":records});

                }
                else if(res2.statusCode===400) {
                    var listError=[];
                    var k =0;
                    for(var item of response.apiErrors.apiErrorList){
                        listError[k]=item.message;
                        k=k+1;
                    }
                    console.log(listError);
                    res.render("carts",{"data":{"carts":[], "total":"0.00"}});


                }
                else {
                    res.render("carts",{"data":{"carts":[], "total":"0.00"}});
                }


            });




        });


        reqGet.write(jsonObject2);
        reqGet.end();

        reqGet.on('error', function(e) {
            console.error(e);
            res.render("carts",{"data":{"carts":[], "total":"0.00"}});
        });







    }
);



function logout(req, res){

    req.session.destroy(err=>{
        if(err){
            console.log("There was an error logout ", err);
            return res.redirect("/dashboard")
        }
        res.clearCookie(SESSION_NAME);
        res.redirect("/login");
    });



}

function validate(data, name, result, i){
    if(typeof data ==="undefined" || data.trim().length===0){
        result[i] = "Kindly fill " +name ;
        i=i+1;
    }
    return i;
}










app.use("/", router);

require('express-dynamic-helpers-patch')(app);

app.dynamicHelpers({
    session: function (req, res) {
    return req.session;
    }
});


app.listen(PORT);

app.use(express.static(path.join(__dirname, 'public')));

console.log("Running at Port ", PORT);
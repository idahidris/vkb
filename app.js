const express = require("express");
const app = express();
const path = require("path");
const router = express.Router();
const bodyParser= require("body-parser");

let myData =[];

var https = require('http');

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));


router.get("/about", (req, res) => {
    res.render("about", { title: "Hey", message: "Hello there!" });
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/register", (req, res) => {
    res.render("register");
});


router.get("/shipping", (req, res) => {
    res.render("shipping");
});

router.get("/user-accounts", (req, res) => {
    res.render("user-accounts");
});

router.get("/register-account", (req, res) => {
    res.render("register-account");
});

router.get("/goods", (req, res) => {
    res.render("goods");
});


router.get("/sales", (req, res) => {
    res.render("sales");
});

router.get("/subscriptions", (req, res) => {
    res.render("subscriptions");
});

router.get("/service-subscription", (req, res) => {

    {

        var obj2 = {
            "pageNumber": 0,
            "pageSize": 100

        };

        var jsonObject2 = JSON.stringify(obj2);


        var header = {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(jsonObject2, 'utf8')
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
            res.render("service-subscription",{"data":[]});;
        });




    }

});


router.get("/register-goods", (req, res) => {
    res.render("register-goods");
});



router.get("/", (req, res) => {
    res.render("login");
});


app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());


router.get("/cancel-cart", (req, res, next)=>{

        const id = req.query.id;
        console.log("item id==>"+ id);
        var header = {
            'Content-Type': 'application/json'
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
            res.render("carts", {"data":{"carts":[], total:"0.00"}});;
        });







    }
);

router.post("/add-to-cart", (req, res, next)=>{

        const id = req.body.id;
        const qty = req.body.qty;
        var header = {
            'Content-Type': 'application/json'
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

                    var reply ={
                        "successful": false,
                        "message": listError
                    };
                    res.send(reply);

                }
                else {
                    var listError=["please try again, later"];

                    var response ={
                        "successful": false,
                        "message": listError
                    };
                    res.send(response);
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



router.post("/cart-to-sales", (req, res, next)=>{

        const id = 'admin';
        var ref = req.body.customerRef;
        if(ref.length<1)
            ref="default";

        console.log("ref ", ref);

        var header = {
            'Content-Type': 'application/json'
        };

        var optionspost = {
            host: '127.0.0.1',
            port: 9032,
            path: '/vkb/api/v1/cart/'+id+'/'+ref,
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

                    var reply ={
                        "successful": false,
                        "message": listError
                    };
                    res.render("confirmation", reply);

                }
                else {
                    var listError=["please try again, later"];

                    var response ={
                        "successful": false,
                        "message": listError
                    };
                    res.render("confirmation", response);
                }


            });




        });
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

router.get("/goods-by-id", (req, res, next)=>{

        const id = req.query.id;
        var header = {
            'Content-Type': 'application/json'
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




router.post("/submit-edited-user", (req, res, next)=>{

        const obj = req.body;
        var jsonObject = JSON.stringify(obj);


        var header = {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(jsonObject, 'utf8')
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
                    res.render( {error: listError});

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

router.post("/submit-edited-subscription", (req, res, next)=>{

        const obj = req.body;
        var jsonObject = JSON.stringify(obj);


        var header = {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(jsonObject, 'utf8')
        };

        var optionsget = {
            host: '127.0.0.1',
            port: 9032,
            path: '/vkb/api/v1/subscription',
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
                    res.render( {error: listError});

                }
                else {
                    res.send({error: ['Error occurred updating subscription, please try again later']});
                }


            });




        });
        reqPost.write(jsonObject);
        reqPost.end();

        reqPost.on('error', function(e) {
            console.error(e);
            res.send({error: ['Error occurred updating subscription, please try again later']});
        });







    }
);

router.get("/user-account-id", (req, res, next)=>{

        const id = req.query.id;
        var header = {
            'Content-Type': 'application/json'
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



router.get("/subscription-id", (req, res, next)=>{

        const id = req.query.id;
        var header = {
            'Content-Type': 'application/json'
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




router.post("/login", (req, res)=>{
        const username = req.body.username;
        const password = req.body.password;
        console.log(username);
        console.log(password);
        let loginResult= false;

        if(username==="Mrs Idah" && password==="eleojo" ){
            loginResult = true;
        }

        if(loginResult) {
            res.render("index");
        }
        else {
            res.render("login", {"error": true});
        }

    }
);



router.post("/submit-register-subscription", (req, res)=>{

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
        const documentLink = req.body.documentLink;

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
            "documentLink": documentLink,
            "price": price,
            "paidAmount": paidAmount,
            "paidAmountDate": paidAmountDate,
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

            var postheaders = {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(jsonObject, 'utf8')
            };


            var optionspost = {
                host: '127.0.0.1',
                port: 9032,
                path: '/vkb/api/v1/subscription',
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


                        res.render("service-subscription", {data: myData, success: ["Successfully Completed, ref "+id]});

                    }
                    else if(res2.statusCode===400) {
                        var listError=[];
                        var k =0;
                        for(var item of response.apiErrors.apiErrorList){
                            listError[k]=item.message;
                            k=k+1;
                        }
                        console.log(listError);
                        res.render("service-subscription", {error: listError, data: myData, rec:obj});


                    }
                    else {
                        res.render("service-subscription", {data:myData, rec: obj, error: ['Error occurred registering goods, please try again later']});
                    }


                });




            });


            reqPost.write(jsonObject);
            reqPost.end();

            reqPost.on('error', function(e) {
                res.render("service-subscription", {data: myData,rec: obj, error: ['Error occurred registering goods, please try again later']});
                console.error(e);
            });





        }

    }
);

router.post("/submit-register-user", (req, res)=>{

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
                'Content-Length': Buffer.byteLength(jsonObject, 'utf8')
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
                        var id = response.responseBody.id;
                        var email=response.responseBody.email;

                        res.render("register-account", {success: ["Successfully Completed, ref "+id +"-"+email]});

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
                        res.render("register-account", {error: ['Error occurred registering goods, please try again later']});
                    }


                });




            });


            reqPost.write(jsonObject);
            reqPost.end();

            reqPost.on('error', function(e) {
                res.render("register-account", {error: ['Error occurred registering goods, please try again later']});
                console.error(e);
            });





        }

    }
);

router.post("/submit-register-goods", (req, res)=>{


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

         jsonObject = JSON.stringify(obj);


        if(i>0) {
                console.log(i + "error(s) found");
                console.error(result);
                res.render("register-goods", {error: result, data: obj});
            }

        else {

            var postheaders = {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(jsonObject, 'utf8')
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
                        var name=response.responseBody.name;

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
                        res.render("register-goods", {error: ['Error occurred registering goods, please try again later']});
                    }


                });




            });


            reqPost.write(jsonObject);
            reqPost.end();

            reqPost.on('error', function(e) {
                res.render("register-goods", {error: ['Error occurred registering goods, please try again later']});
                console.error(e);
            });





        }

    }
);

router.get("/subscriptions-data-source", (req, res, next)=>{


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
            'Content-Length': Buffer.byteLength(jsonObject2, 'utf8')
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

router.get("/users-data-source", (req, res, next)=>{


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
            'Content-Length': Buffer.byteLength(jsonObject2, 'utf8')
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


router.get("/sales-data-source", (req, res, next)=>{


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
            'Content-Length': Buffer.byteLength(jsonObject2, 'utf8')
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


router.get("/dashboard", (req, res, next)=>{

        var header = {
            'Content-Type': 'application/json'
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
                        if(status.factor==="Initiated" || status.factor==="Incomplete" )
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



router.get("/goods-data-source", (req, res, next)=>{


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

         jsonObject2 = JSON.stringify(obj2);


            var header = {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(jsonObject2, 'utf8')
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




router.get("/checkout", (req, res, next)=>{


        var obj2 = {
            "userId": "admin"
        };

        var jsonObject2 = JSON.stringify(obj2);


        var header = {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(jsonObject2, 'utf8')
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
                    res.render("carts",{"data":[]});


                }
                else {
                    res.render("carts",{"data":[]});
                }


            });




        });


        reqGet.write(jsonObject2);
        reqGet.end();

        reqGet.on('error', function(e) {
            console.error(e);
            res.send("carts",{"data":[]});
        });







    }
);





function validate(data, name, result, i){
    if(typeof data ==="undefined" || data.trim().length===0){
        result[i] = "Kindly fill " +name ;
        i=i+1;
    }
    return i;
}

















app.use("/", router);


app.listen(process.env.port || 3000);

app.use(express.static(path.join(__dirname, 'public')));

console.log("Running at Port 3000");
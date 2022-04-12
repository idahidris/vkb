const express = require("express");
const app = express();
const path = require("path");
const router = express.Router();
const bodyParser= require("body-parser");

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
    res.render("service-subscription");
});

router.get("/dashboard", (req, res) => {
    res.render("index");
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
                        var desc 
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
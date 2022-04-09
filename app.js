const express = require("express");
const app = express();
const path = require("path");
const router = express.Router();
const bodyParser= require("body-parser");
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


app.use("/", router);


app.listen(process.env.port || 3000);

app.use(express.static(path.join(__dirname, 'public')));

console.log("Running at Port 3000");
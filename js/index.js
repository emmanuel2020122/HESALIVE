var  express = require('express');
 var  ejs = require('ejs');
 const path = require("path");
 var mysql = require('mysql')
 var http = require('http');
 var fs = require('fs');
 var bodyParser = require('body-parser');
 var mysql = require('mysql');
const { randomUUID } = require('crypto');
 //var session = require('express-session');
 var con = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"emmanuel9123",
    database:"node_project"
 })

 con.connect((err)=>{
    if(err){
    console.log(err);
    }
})


 var app = express();
 app.use(bodyParser.json())
 app.use(express.static('public'));
 app.set('view engine','ejs');
 app.set("views", path.join(__dirname, "/public/views")); 
 app.listen(3000);
 app.use(bodyParser.urlencoded({extended:true}));
// app.use(session({secret:"secret"}));

 app.get('/',function(req,res){

     
     con.query("SELECT * FROM products",(err,result)=>{
        res.render('pages/first.ejs',{result:result});
     })
    
//pages/index.ejs
 });
 app.post('/signUp',function(req,res){
    //get values from inputs
    var email= req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var phone=req.body.phone;
    var address= req.body.address;

  
                     var query =`INSERT INTO logindetails(email,username,password,phone,address) VALUES('${email}','${username}','${password}','${phone}','${address}')`;
                con.query(query,(err,result)=>{
                    if(err) throw new Error
                    res.redirect('/login');
                })
            // var values =[email,username,password,phone,address];
            
        
    })



 app.get('/cosmetics', (req,res)=>{
    res.render('pages/Cosmetics.ejs');
 })
 app.get('/checkout',(req,res)=>{
    res.render('pages/checkout.ejs');
 })
 app.get('/laundry', (req,res)=>{
    res.render('pages/laundry.ejs');
 })
 app.get('/login', (req,res)=>{
    res.render('pages/login.ejs');    
 })

 app.post('/auth', (req,res)=>{

        var query=`SELECT password from logindetails where username="${req.body.username}"`;
        //`SELECT password from logindetails where username = '${req.body.username}';`
        var pass = req.body.password;
             con.query(query,(err,result)=>{
                    if(err) throw new Error
                    if(result[0].password==pass){
                        con.query("SELECT * FROM products",(err,result)=>{
                            res.render('pages/first.ejs',{result:result});
                         })
                    }else{
                        res.redirect('/login')
                    }
        
                })
 })

 app.post('/place_order',(req,res)=>{
    var orders = req.body.orders;
    let m = new Date()
    var date =  m.getUTCFullYear() +"-"+ (m.getUTCMonth()+1) +"-"+ m.getUTCDate() + " " + m.getUTCHours() + ":" + m.getUTCMinutes() + ":" + m.getUTCSeconds();
    // console.log(orders)
    let query = "INSERT IGNORE INTO order_items ( product_id, customer_id, product_price,product_image, product_quantity, order_id, date_of_order, is_complete, product_name) values "
    query =  orders.reduce((query, order) => {
        // let order_id = randomUUID()
        return query + `('${order.product_id}', '${order.customer_id}', '${order.product_price}', '${order.product_image}','${order.quantity}','${order.order_id}','${date}','${0}','${order.product_name}'),`},query)
        query = query.slice(0,-1)

         con.query(query,(err,result)=>{
                if(err) {
                    console.log(err)
                    throw new Error
                }
                res.status(201).send("successful")   
            })
 })



 app.get('/signUp', (req,res)=>{
    res.render('pages/signUp.ejs');
 })
 app.get('/first', (req,res)=>{
    con.query("SELECT * FROM products",(err,result)=>{
        res.render('pages/first.ejs',{result:result});
     })
 })
        
    

/*function onRequest(request,response){
    response.writeHead(200, {'content-Type':'text/html'});
    if(request.url=='/' || request.url=='./Cosmetics.ejs'){
        fs.readFile('./Cosmetics.ejs',null,function(error,data){
            if(error) 
            {
                response.writeHead(404);
                response.write('File not found');
            }
            else
            {
                response.write(data);
            }
            response.end();
        });
    }
    if(request.url=='./laundry.ejs'){
        fs.readFile('./laundry.ejs',null,function(error,data){
            if(error) 
            {
                response.writeHead(404);
                response.write('File not found');
            }
            else
            {
                response.write(data);
            }
            response.end();
        });
    }
} */
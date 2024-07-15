import  express from 'express';
import dotenv from 'dotenv';
import stripe from 'stripe';
import mysql from 'mysql';
import body from 'body-parser';

dotenv.config();

const app=express();


var con=mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"",
  database:"ecom"
});

app.use(express.static('public'));
app.use(express.json());
app.use(body.urlencoded({extended:true}));

app.post('/data',(req,res)=>
  {
    var n=req.body.name;
    var e=req.body.email;
    var m=req.body.message;
    const sql='insert into contacts(name,email,message)values("'+n+'","'+e+'","'+m+'")';
    con.query(sql, function(err,result){
      if (err) {
        console.error(err);
        res.send('<script>alert("Error submitting feedback"); window.history.back();</script>');
      } else {
        res.send('<script>alert("Thank you for submitting your feedback!"); window.location.href = "/";</script>');
      }
    });
  });
  




//homeroute
app.get("/",(req,res)=>{
  res.sendFile('index.html',{root: "public" });
});

//success
app.get("/success",(req,res)=>{
  res.sendFile('success.html',{root: "public" });
});


//cancel
app.get("/cancel",(req,res)=>{
  res.sendFile('cancel.html',{root: "public" });
});










//stripe
let stripeGateway=stripe(process.env.stripe_api);

let DOMAIN=process.env.DOMAIN;

app.post('/stripe-checkout',async(req,res) => {

  const lineItems=req.body.items.map((item)=>{
    const unitAmount=parseInt(item.price.replace(/[^0-9.-]+/g, '') * 100);

    console.log('item-price:',item.price);
    console.log('unitAmount:',unitAmount);
    return{
price_data:{
  currency:'usd',
  product_data:{
    name:item.title,
    images:[item.productImg]
  },
  unit_amount:unitAmount,
},
quantity:item.quantity,
    };
  });
  console.log('lineItems:',lineItems);


  //creaate chechkout

const session=await stripeGateway.checkout.sessions.create({
payment_method_types: ["card"],
mode: "payment",
success_url :`${DOMAIN}/success`,
cancel_url:`${DOMAIN}/cancel`,
line_items: lineItems,
//asking addresss in stripe checkout page

billing_address_collection:"required",

});

res.json(session.url);
});

app.listen(2400,()=>{
  console.log("listening on port 2400;");
});

const Express=require("express")
const app=Express()
const CORS=require("cors")
const Bcrypt=require("bcrypt")
const Razorpay=require("razorpay")
const Crypto=require("crypto")

// app.use(Express.urlencoded())//to read the data

app.use(CORS())

//cors makes it possible to collect the request from any port number

const Mongoose=require("mongoose")
Mongoose.connect("mongodb+srv://raju:rani@cluster0.1uzqviq.mongodb.net/moviedatabase?retryWrites=true&w=majority&appName=Cluster0")

app.use(Express.json())
//json()-to read key value pairs

//Back end application
//Logic to read the data from the DB and after reading the data, give that data back to front end


const MovieSchema=new Mongoose.Schema({
    id:{
        type:Number,
      //   unique:true
    },
    movie_name:{
       type:String,
   //  unique:true
    },
    image_url:{
        type:String,
   //   unique:true
     }, description:{
        type:String,
   //   unique:true
     }, genre:{
        type:String,
   //   unique:true
     }, censor:{
        type:String,
   //   unique:true
     }, director:{
        type:String,
   //   unique:true
     }, cast:{
        type:Array,
   //   unique:true
     },
})

const MovieModel=Mongoose.model("moviescollections",MovieSchema)

app.get("/fetch/all/movies", async function(req,res)
{
    //Logic to read all the movies
    // const movieDetails=await MovieModel.find()
   MovieModel.find().then(function(output)
{

   res.json(output)
   //  console.log(output)
    
})
    // console.log(movieDetails)
    
})


const SignupSchema=new Mongoose.Schema({
  username:String,
  email:String,
  password:String
})

const SignupModel=Mongoose.model("signups",SignupSchema)
//insert ot create some data -- always POST method

app.post("/signup",async function(req,res)
{
  const signupDetails=req.body

  const hashedPassword=await Bcrypt.hash(signupDetails.myPassword,10)

  const SignupData=new SignupModel({
    username:signupDetails.myUsername,
    email:signupDetails.myEmail,
    password:hashedPassword
  })

  if(signupDetails.myPassword==signupDetails.myConfirmPassword){
    SignupData.save()
    return res.json({"message":"Registration Successful!"})
  }
  else{
    return res.json({"message":"Passwords doesn't match!"})
  }
})

app.post("/signin", async function(req,res)
{
  const signinDetails=req.body
  
  const output=await SignupModel.findOne({email:signinDetails.myEmail})

  if(output!=null)
  {
    //Email is valid, continue to verify password
    const enteredPassword=signinDetails.myPassword//Welcome
    const actualPassword=output.password//Bcrypt format

    const result=await Bcrypt.compare(enteredPassword, actualPassword)

    if(result==true)
    {
      //Valid user
      res.json({"message":"Login Successful!"})
    }else{
      //Invalid user
      // res.json({"message":"Don't have an account yet, signup first by clicking on Signup on the Navbar"})
      res.json({"message":"Login not Successful!"})
    }


  }
  
  
})


const TheatreSchema=new Mongoose.Schema({
  theatreName:String,
  showTimes:Array
})

const LocationSchema=new Mongoose.Schema({
  location:String,
  theatres:[TheatreSchema]
})

const LocationModel=Mongoose.model("locationandtheatres",LocationSchema)

app.get("/locations",async function(req,res)
{
  const allDetails=await LocationModel.find()
  res.json({"info":allDetails})
  
  
})

//to get innerdetails we can use map

//If our back end has to connect with razorpay===?2 keys==>razorpay_id and razorpay_secret_key

const razorpayDetails=new Razorpay({
  key_id:"rzp_test_hR4f04BpCLFIBJ",
  key_secret:"rOWvS6Gt0Ox1Xm5ns41CZbsP"
})

app.post("/create/order",function(req,res)
{
  const enteredAmount=req.body.amount
  // console.log(enteredAmount)

  const options={
    amount:enteredAmount*100,
    currency:"INR",
  }

  razorpayDetails.orders.create(options,function(error,orderInfo)
{
  if(!error)
  {
    res.json({output:orderInfo})
    
  }else{
    console.log(error)
    
  }
})
  
})

//if u r sending data from frontend and backend has to save in database=POST method

// 2 end points
// 1 Create the order-->book the ticket for 500 rs
// 2 Verify the order
//Order is successful


app.listen(9000,function()
{
    console.log("Server is running on the port 9000!")
    
})



//save or fetch some data=always POST method   

// MongoDB Atlas-->Company who has tied up with AWS==>Provided a computer (MongoDB)
// AWS-->Services to customer

//Heavy appl-->Live for 24 hrs*7 days
//Run any application-->Softwares, tools, dbs ,.....
//4gb ram, 8gb ram,.....100GB ram, 1000gb ram

//Companies used to purchase computers with 100gb ram configuration,.....
//5L, 7L cost

//AWS-->They are maintaining a lot of computers throughout the world, (Mumbai)
//Money->Provide computers

//money123

// app.post("/insert",function(req,res)
// {
//    const data=req.body
   
//    const movieData=new MovieModel(data)

//    movieData.save()
// })

//CORS-Cross Origin Resource sharing-Communication between different port numbers is not possible which results in cors error

// To make that communication(between 2 apps running at different port numbers) happen cors should be installed to which application you are getting connected (or the one who is collecting the request)(backend)
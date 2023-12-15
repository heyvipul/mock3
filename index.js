
const express = require("express")
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt")
const cors = require("cors");
const User = require("./models/user");
const jwt = require("jsonwebtoken")
const SECRET_KEY = "nmklhvlcxhkbxjzb@1651fd"
const bodyParser = require('body-parser');

const app = express()
app.use(express.json())
app.use(bodyParser.json());

app.use(
    cors({
      origin: "*",
    })
);

async function main(){
    try {
       await mongoose.connect("mongodb+srv://vipulgirhe:vipulgirhe@cluster0.ax4dqic.mongodb.net/evalmock3")
       console.log("mongodb connection successfully!");
    } catch (error) {
        console.log("connection failed");
    }
}
main()


app.get("/",(req,res)=>{
    res.send("base endpoint running")
})

app.post("/register", async(req,res)=>{
    try {
        const{name,email,password} = req.body
        const user_exist = await User.findOne({email})
        if(user_exist){
            return res.send({msg:"user exist"})
        }
        bcrypt.hash(password,4,async(err,hash)=>{
            await User.create({name,email,password:hash})
            res.send({msg:"signup successfull!"})
        })
    
    } catch (error) {
        res.send({error:"signup failed!"})
        console.log(error);
    }
})

app.post("/login",async (req,res)=>{
    const {email,password} = req.body
    const user = await User.findOne({email})
    if(!user){
        return res.send({msg:"User not exist!"})
    }
    const hash_password = user?.password
    bcrypt.compare(password,hash_password,async(err,result)=>{
        if(err){
            throw err;
        };
        if(result){
            const token = jwt.sign({userId:user._id},SECRET_KEY);
            res.send({msg:"Login successfull!",token:token})
        }else{
            res.send({msg:"password not match"})
        }
        
    })

})


app.post("/getProfile",async(req,res)=>{
    const {email} = req.body
    const user = await User.findOne({email})
    if(!user){
        return res.send({msg:"User not exist!"})
    }
    res.send({timestamp:user.timestamp,email:user.email,name:user.name,msg:"user match"})
})


app.post('/calculate', (req, res) => {
    const { annualInstalmentAmount, annualInterestRate, totalNumberOfYears } = req.body;
  
    const i = annualInterestRate / 100;
    const n = totalNumberOfYears;
  
    const totalInvestmentAmount = annualInstalmentAmount * n;
    const totalMaturityValue = annualInstalmentAmount * ((Math.pow((1 + i), n) - 1) / i);
    const totalInterestGained = totalMaturityValue - totalInvestmentAmount;
  
    res.json({
      totalInvestmentAmount,
      totalInterestGained,
      totalMaturityValue,
    });
  });


app.listen(8000,()=>{
    console.log("port running on 8000!");
})
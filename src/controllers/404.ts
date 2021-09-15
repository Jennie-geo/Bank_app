 import express from 'express';
 const app = express();

 app.all("*", (req, res) => {
     res.status(404).json({error : {
         msg: "Response Not Found"
     }})
 })
 
 module.exports = app;
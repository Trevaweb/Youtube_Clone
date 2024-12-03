import express from "express";

//define your app type and port
const app = express();
const port= 3000;

//defines a http get route that sends hello world
app.get("/", (req, res) => {
    res.send("Hello World");
});

//this listens on the defined port and logs that
app.listen(port, () =>{
    console.log(
        `Video processing service listening at http://localhost:${ port }`);
})
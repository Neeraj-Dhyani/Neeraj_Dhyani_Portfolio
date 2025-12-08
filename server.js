const http = require("http");
const fs = require("fs");
const path = require("path");
const Email = require("nodemailer")
const querystring = require("querystring");
const PORT  = 3000

let transport  = Email.createTransport({
    service:"gmail",
    auth:{
        user:"neerajdhyani47@gmail.com",
        pass:"gqme yppz oopo esok"
    }
})

const server = http.createServer((req, res)=>{
    if(req.method === "POST" && req.url === "/send_message"){
        let body = ''
        req.on("data", (chunck)=>{
            body += chunck.toString()
        })
        req.on("end", ()=>{
            const formData = querystring.parse(body)
            const {name, email, message} = formData
            transport.sendMail({
                from:email,
                to:"neerajdhyani47@gmail.com",
                subject:`New Message From Portfolio:${name}`,
                text:`Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
                html:`
                    <h3>Portfolio Contact Form Message</h3>
                    <p><b>Name:</b> ${name}</p>
                    <p><b>Email:</b> ${email}</p>
                    <p><b>Message:</b><br>${message}</p>
                `
            }, (err, info)=>{
                if(err){
                    res.writeHead(500, {"content-type":"text/plain"})
                    return res.end("Email sending email", err.message)
                }
                res.writeHead(302, {location: "tankyou.html"})
                return res.end()
            })
        })
        return;
    }

    let filepath = "./page"+(req.url == "/Neeraj_Dhyai"?"/index.html":req.url)
    let extname = path.extname(filepath)
     // Map MIME types
    const contentType = {
        ".html": "text/html",
        ".css": "text/css",
        ".js": "text/javascript",
        ".png": "image/png",
        ".jpg": "image/jpg",
        ".jpeg": "image/jpeg",
        ".ico": "image/x-icon",
        ".json": "application/json"
    }[extname] || "text/plain";

    fs.readFile(filepath, (err, content)=>{
        if(err){
            console.log(err)
            res.writeHead(404, {ContentType:"text/html"})
            return res.end("<h4>404 Page Not Found</h4>")
        }
        res.writeHead(200, { "Content-Type": contentType });
        res.end(content);
    })
})

server.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:${PORT}`)
})
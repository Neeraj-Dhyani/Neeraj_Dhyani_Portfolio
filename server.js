require("dotenv").config()
const http = require("http");
const fs = require("fs");
const path = require("path");
const querystring = require("querystring");
const PORT  = process.env.PORT || 3000;
const resend = new require("resend")

const email_resend = new resend.Resend("re_MybYgw47_DeQShFHFZzfFAkK2bUEhpWF2")



const server = http.createServer((req, res)=>{
    if(req.method === "POST" && req.url === "/send_message"){
        let body = ''
        req.on("data", (chunck)=>{
            body += chunck.toString()
        })
        req.on("end", async ()=>{
            const formData = querystring.parse(body)
            const {name, email, message} = formData
            try{
                 const result = await email_resend.emails.send({
                        from: process.env.USER_EMAIL,
                        to: process.env.USER_EMAIL,
                        subject: `New Message from ${name}`,
                        html: `
                        <h3>New Portfolio Message</h3>
                        <p><b>Name:</b> ${name}</p>
                        <p><b>Email:</b> ${email}</p>
                        <p><b>Message:</b><br>${message}</p>
                        
                        `})
            res.writeHead(302, {location: "/tankyou.html"})
            return res.end()
    
            }catch(err){
                console.log("Email Error:", error);
                res.writeHead(500, { "Content-Type": "text/plain" });
                return res.end("Failed to send email.");
            }
           
        })
        return;
    }
    if(req.url === "/download_Resume"){
        const filepath = path.join(__dirname, "/resume/Neeraj_Dhyani.pdf")
        res.writeHead(200, {
            "content-Type":"application/pdf",
            "content-disposition":"attachment; filename=Neerah_Dhyani_resume.pdf"
        })
        fs.createReadStream(filepath).pipe(res)
        return;
    }
    let filepath = "./page"+(req.url == "/"?"/index.html":req.url)
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
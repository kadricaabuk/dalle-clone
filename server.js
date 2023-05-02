const PORT = 8000
require('dotenv').config()
const cors = require('cors')
const express = require('express')
const { Configuration, OpenAIApi } = require("openai");

const app = express()
const fs = require('fs')
const multer = require('multer')
let filePath
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})
const upload = multer({storage: storage}).single('file')



app.use(cors())
app.use(express.json())

//Initialize OpenAI
const configuration = new Configuration({
apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/images", async (req, res) => {

    try {
        const response = await openai.createImage({
            prompt: req.body.message,
            n: 5,
            size: "256x256",
        });
        res.send(response.data.data)
    } catch (error) {
        console.log(error)
    }
})

app.post('/upload', async (req, res) => {
    upload(req, res, (err) => {
        if(err instanceof multer.MulterError){
            return res.status(500).json(err)
        }else if(err){
            return res.status(500).json(err)
        }
        filePath = req.file.path
        res.send({
            success: true
        })
    })
})


app.post('/variations', async (req, res) => {
    try {
        console.log(filePath)
        const response = await openai.createImageVariation(
            fs.createReadStream(filePath),
            2,
            "1024x1024"
          );
          res.send(response.data.data)
    } catch (error) {
        console.error(error)
    }
})

app.listen(PORT, () => console.log(`Server listening on ${PORT}`))
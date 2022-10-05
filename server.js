const express = require('express')
const mongoose = require('mongoose')
const shortUrlSchema = require('./models/shortUrl')    
const app = express()

mongoose.connect('mongodb://localhost/urlShortener', {useNewUrlParser: true, useUnifiedTopology: true})

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))

app.get('/', async (req, res)=>{
    const s_url = await shortUrlSchema.find()
    res.render('index', {"shortUrls": s_url})
})

app.post('/shortUrls', async (req, res)=>{
    await shortUrlSchema.create({full: req.body.fullUrl})
    res.redirect('/')
})

app.get('/:shortUrl', async (req, res)=>{
    const s_url = await shortUrlSchema.findOne({short: req.params.shortUrl})
    if(s_url == null) return res.sendStatus(404)

    s_url.clicks++
    s_url.save()

    res.redirect(s_url.full)
} )

app.listen(process.env.PORT || 5000);
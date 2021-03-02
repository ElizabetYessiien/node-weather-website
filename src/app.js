const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
const app = express()


//define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')

const viewsPath = path.join(__dirname, '../templates/views')

const partialsPath = path.join(__dirname, '../templates/partials')

//setup handlebars engine and views location

app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//setup static directory to serve
app.use(express.static(publicDirectoryPath))



app.get('',(req, res)=>{
    res.render('index',{
        title: 'weather app',
        name:'lizzy'
    } )
})

app.get('/about',(req, res)=>{
    res.render('about',{
        title:'about me',
        name:'lizzy'
    })
})


app.get('/help', (req, res)=>{
    res.render('help',{
        helpText:'this is some helpful text',
        title:'Help',
        name:'Lizzy Essien'
    })
})

app.get('/weather', (req, res)=>{
    if(!req.query.address){
        return res.send({
            error:'you must provide an address'
        })
    }
    geocode(req.query.address,(error,{latitude, longitude, location}={} )=>{
        if(error){
            return res.send({error})
        }
        forecast(latitude, longitude, (error, forecastData)=>{
            if(error){
                return res.send({error})
            }
            res.send({
                forecast:forecastData,
                location,
                address:req.query.address
            })
        })
    })


    // res.send({
    //     forecast: ' it is snowing',
    //     location: 'kyiv',
    //     address:req.query.address
    // })
})

app.get('/products', (req, res)=>{
    if(!req.query.search){
        return res.send({
            error:'you must provide a search term'
        })
    }
    console.log(req.query.search)
    res.send({
        products:[]
    })
})

app.get('/help/*',(req, res)=>{
    res.render('404',{
        title: '404',
        name:'Lizzy Essien',
        errorMessage:'help article not found'
    })
})

app.get('*', (req, res)=>{
    res.render('404',{
        title:404,
        name:'Lizzy Essien',
        errorMessage: 'page not found'
    })
})

app.listen(3000, ()=>{
    console.log('server is up on port 3000')
})

// nodemon src/app.js -e js,hbs
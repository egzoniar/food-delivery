const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const http = require('http');
const path = require('path')

const port = process.env.PORT || 8000;

const app = express();

const server = http.createServer(app);

const productRoutes = require('./api/routes/products');
const adminRoutes = require('./api/routes/admins');
const userRoutes = require('./api/routes/users');
const driverRoutes = require('./api/routes/drivers');
const latencyRoutes = require('./api/routes/latencies');
const orderRoutes = require('./api/routes/orders');

mongoose.connect(
    `mongodb+srv://${process.env.MONGO_US}:${process.env.MONGO_PA}@fresca-api-lnzk0.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`, 
        { useNewUrlParser: true, useFindAndModify: false }
)
    .then(() => {
        server.listen(port);
        console.log("Database is connected")
        const io = require('./socket').init(server)

        io.on('connection', socket => {
            console.log('Client connected')
        })
    })
    .catch(error => {
        console.log( error)
    })

mongoose.Promise = global.Promise;


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        "Access-Control-Allow-Headers", 
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    )
    if(req.method === 'OPTIONS') {
        res.header(
            'Access-Control-Allow-Methods', 
            'PUT, POST, PATCH, DELETE, GET'
        )
        return res.status(200).json({})
    }
    next();
})

app.use('/products', productRoutes);
app.use('/admins', adminRoutes);
app.use('/users', userRoutes);
app.use('/drivers', driverRoutes);
app.use('/latency', latencyRoutes);
app.use('/orders', orderRoutes)


app.use('/images', express.static('images'))

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error)
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});

module.exports = app;
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser') //to process json data easily
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')
const fileUpload = require('express-fileupload')



//----------------------------------------------------------------------[middlewares]

const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json({limit: '5mb'})); //allow our express app to easily parse any json request that are sent in
app.use(cors()); //enabling any website to hit this backend
app.use(fileUpload());



//----------------------------------------------------------------------[mongodb-settings]

// because useFindAndModify is deprecated and its true by default, so ..
mongoose.set('useFindAndModify', false);

//useNewUrlParser true to fix deprecation warnings
mongoose.connect(`mongodb+srv://test:${process.env.DB_PASSWORD}@todo-rccud.gcp.mongodb.net/final-project-rafiles?retryWrites=true&w=majority`, {useNewUrlParser: true});



//----------------------------------------------------------------------[routes]
const userRoutes = require('./routes/user');
const classRoutes = require('./routes/class');
const courseRoutes = require('./routes/course');
const bookRoutes = require('./routes/book');
const majorRoutes = require('./routes/major');
const noteRoutes = require('./routes/note');

app.use('/users', userRoutes);
app.use('/class', classRoutes);
app.use('/course', courseRoutes);
app.use('/book', bookRoutes);
app.use('/major', majorRoutes);
app.use('/note', noteRoutes);


app.post('/files/multiupload', (req, res) => {
    let datas = req.files.files;

    datas.forEach(data => {
        data.mv(`./uploads/${data.name}`, function(err){
            if(err){
                res.status(500).send(err);
            }
        })
    });
    res.status(200).json({
        message: 'got your file!',
        files: req.files
    })
})


const port = process.env.PORT || 8082;
app.listen(port, () => {console.log(`listening to port ${port}...`)});
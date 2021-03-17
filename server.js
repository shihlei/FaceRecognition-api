const express = require('express');
//因為使用express所以需要
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

//run knex function
const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1', //localhost
    user : '',
    password : '',
    database : 'smart-brain'
  }
});

const app = express();

//因為目前沒有DB，所以先自己建一組資料
// const database = {
// 	users: [
// 		{
// 			id: '12345',
// 			name: 'Laura',
// 			password: 'smile',
// 			email: 'shihlei@gmail.com',
// 			entries: 0, //記錄分數
// 			joined: new Date() //自動建立日期
// 		},
// 		{
// 			id: '1235',
// 			name: 'Sophia',
// 			password: 'hello',
// 			email: 'yoyo@gmail.com',
// 			entries: 0, //記錄分數
// 			joined: new Date() //自動建立日期 
// 		}
// 	]
// }

//Middleware 要在app 創建之後
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {res.send(database.users)})

app.post('/signin', (req, res) => { signin.handleSignin(db, bcrypt)(req, res)})

//目的是要把登入的資料輸入DB
//dependency injection
app.post('/register', (req,res) => { register.handleRegister(req, res, db, bcrypt)})

//profile/:userId > GET
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)})

//image > PUT(update)
app.put('/image', (req, res) => {image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)})

//port
app.listen(3000, () => {
	console.log('app is running on port 3000');
}) 


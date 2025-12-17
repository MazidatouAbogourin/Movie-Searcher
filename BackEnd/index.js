const express = require('express');
const cors = require('cors')
const app = express();
require('dotenv').config();
const apiKey = process.env.API_KEY;

app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
const usersData = require('./users')
app.use(express.urlencoded({extended: true}));
app.use(express.json())

app.get('/', (req, res)=>{
    res.send('hello world')
});
app.post('/login', (req, res)=>{
    const {username, password} = req.body;
    
     if (!username || !password) {
    return res.status(400).json({ message: 'Missing username or password' });
  }
    const user = usersData.find(user=>user.name === username);
    console.log(usersData);
  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }
  if (user.password === password) { 
    const { password: _, ...loginUser } = user;
    return res.status(200).json({
        jwt: 'Your Token ',
        user: loginUser
    });
  } else {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

})
app.get('/movie', async(req, res)=>{
    try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ message: 'Provide a movie name' }); // <-- RETURN
    }

    const response = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(name)}&apikey=${apiKey}`);
    const movies = await response.json();
    console.log(response)
    console.log(name)

    if (movies.Response === 'False') {
      return res.status(404).json({ message: movies.Error });
    }

    return res.status(200).json(movies);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }


})
app.listen(3000, ()=>{
    console.log('we are listening to port 3000');
})
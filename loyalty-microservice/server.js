const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());

app.use(express.json());

/* DB */
const users = [

];

const businesses = [

];

const rewards = [

];

const transactions = [

];

app.post('/redeem-points', (req, res) => {

  const { userId, businessId, points } = req.body;

  console.log('Alguien canjeo puntos', userId, businessId, points);

  return res.status(200).json({ message: 'Points redeemed successfully'});
});

/* ------------ USERS ------------- */
app.get('/users', (req, res) => {

  return res.status(200).json(users);
});

app.post('/users', (req, res) => {
  
  const user = req.body;

  users.push(user);

  return res.status(201).json({ message: 'User created successfully'});
});

app.put('/users/:id', (req, res) => {

  const { id } = req.params;

  let user = users.find(user => user.id === id);

  if(!user) {

    return res.status(400).json({ message: 'User not found'});
  }

  user = {...user, ...req.body};

  return res.status(201).json({ message: 'User updated successfully'});
  
});

//  http://localhost:3001/qr?userId=15

app.delete('/users/:id', (req, res) => {

  const { id } = req.params;

  const userIndex = users.findIndex(user => user.id === id);

  if(userIndex === -1) {

    return res.status(400).json({ message: 'User not found'});
  }

  users.splice(userIndex, 1);

  return res.status(201).json({ message: 'User deleted successfully'});
});

app.listen(port, () => {
  console.log(`Loyalty microservice listening at http://localhost:${port}`);
});
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const https = require('https');
const app = express();
const port = 3001;

// Cargar certificados SSL
const options = {
  key: fs.readFileSync('10.7.17.122-key.pem'),
  cert: fs.readFileSync('10.7.17.122.pem')
};

app.use(cors());
app.use(express.json());

/* DB */
const users = [
  { id: "user1", name: "Alice", password: "pass123", points: 100 },
  { id: "user2", name: "Bob", password: "qwerty", points: 200 },
  { id: "user3", name: "Charlie", password: "securepass", points: 50 },
  { id: "user4", name: "Diana", password: "letmein", points: 300 }
];

app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  const user = users.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  return res.status(200).json(user);
});

const businesses = [
  { id: "business1", nombre: "McDonald's", icono:"540ade66-b4bb-4ee4-8fc9-0202bba63bdc.png" },
  { id: "business2", nombre: "Starbucks", icono:"0c943621-b147-471f-aaa6-1d193df00439.png" },
  { id: "business3", nombre: "Burger King", icono:"6b68ed16-3b54-4f66-8e07-420b9c63e259.png" },
  { id: "business4", nombre: "Walmart", icono:"d1f16bfd-f594-4862-abd0-05d39283ea29.png" }
];
app.get('/businesses', (req, res) => {
  return res.status(200).json(businesses); // Devolver todos los negocios
});

const rewards = [
  { id: "reward1", local: "McDonald's", descripcion: "Combo Big Mac gratis", valor:1400 },
  { id: "reward2", local: "Starbucks", descripcion: "Café gratis", valor:600 },
  { id: "reward3", local: "Burger King", descripcion: "Whopper gratis", valor:1000 },
  { id: "reward4", local: "Walmart", descripcion: "Descuento en tu próxima compra", valor:1200 }
];
// Endpoint para obtener todas las recompensas
app.get('/rewards', (req, res) => {
  return res.status(200).json(rewards); // Devolver todas las recompensas
});

const products = [
  {id: "Vaso Reutilizable", local: "McDonald's", puntos: 50},
  {id: "Vaso Reutilizable", local: "Starbucks", puntos: 50},
  {id: "Vaso Reutilizable", local: "Burger King", puntos: 50},
  {id: "Bolsa Reutilizable", local: "Walmart", puntos: 25}
];

const transactions = [


];
// Endpoint para obtener las transacciones de un usuario específico por su ID
app.get('/transactions/:userId', (req, res) => {
  const { userId } = req.params; // Obtenemos el userId de los parámetros de la URL
  
  // Filtramos las transacciones para el usuario especificado
  const userTransactions = transactions.filter(txn => txn.userId === userId);

  // Devolvemos las transacciones encontradas
  if (userTransactions.length === 0) {
    return res.status(404).json({ message: 'No transactions found for this user' });
  }

  return res.status(200).json(userTransactions);
});

app.get('/products/:id', (req, res) => {
  const { id } = req.params;
  const businessProducts = products.filter(p => p.local === id);
  
  if (!businessProducts) {
    return res.status(404).json({ message: 'Product not found' });
  }
  
  return res.status(200).json(businessProducts);
});

app.post('/add-product', (req, res) => {
  const {id, local, puntos } = req.body;
  const newProduct = {
    id,
    local,
    puntos
  }

  products.push(newProduct);
  
  return res.status(201).json({ message: 'Product added successfully', newProduct });
});

app.post('/redeem-points', (req, res) => {

  const { userId, businessId, productId, points } = req.body;
  // Crear la transacción
  const newTransaction = {
    id: `txn_${Date.now()}`,
 // Generar un ID único usando timestamp
    userId,
    businessId,
    productId,
    points,
    date: new Date().toISOString() // Fecha actual en formato ISO
  };

  // Guardar la transacción en el array
  transactions.push(newTransaction);

  console.log("Nueva transacción registrada:", newTransaction);
  console.log('Puntos canjeados correctamente', userId, businessId, points);

  return res.status(200).json({ message: 'Points redeemed successfully'});
});

/* ------------ BUSINESSES ------------- !!!!!!!!!! CREAR VISTAS  !!!!!!!!!!!!!!!!!!!!!!     */  
app.get('/businesses', (req, res) => {
  return res.status(200).json(businesses);
});

app.get('/businesses/:id', (req, res) => {
  const { id } = req.params;
  const business = businesses.find(b => b.id === id);
  
  if (!business) {
    return res.status(404).json({ message: 'Business not found' });
  }
  
  return res.status(200).json(business);
});

app.post('/businesses', (req, res) => {
  const business = req.body;
  
  // Validación simple - podrías agregar más
  if (!business.name || !business.id) {
    return res.status(400).json({ message: 'Name and ID are required' });
  }
  
  businesses.push(business);
  return res.status(201).json({ message: 'Business created successfully', business });
});

app.put('/businesses/:id', (req, res) => {
  const { id } = req.params;
  const businessIndex = businesses.findIndex(b => b.id === id);
  
  if (businessIndex === -1) {
    return res.status(404).json({ message: 'Business not found' });
  }
  
  // Mantener el ID original y actualizar otros campos
  const updatedBusiness = { ...businesses[businessIndex], ...req.body, id };
  businesses[businessIndex] = updatedBusiness;
  
  return res.status(200).json({ message: 'Business updated successfully', business: updatedBusiness });
});

app.delete('/businesses/:id', (req, res) => {
  const { id } = req.params;
  const businessIndex = businesses.findIndex(b => b.id === id);
  
  if (businessIndex === -1) {
    return res.status(404).json({ message: 'Business not found' });
  }
  
  businesses.splice(businessIndex, 1);
  return res.status(200).json({ message: 'Business deleted successfully' });
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


https.createServer(options, app).listen(port, () => {
  console.log(`Loyalty microservice listening at https://10.7.17.122:${port}`);
});

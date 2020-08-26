const routes = require('express').Router();

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'api call success !!' });
});

routes.get('/check', (req, res) => {
  res.status(200).json({ message: 'api call success 2 !!' });
});


// Vendor Vat Reg


module.exports = routes;
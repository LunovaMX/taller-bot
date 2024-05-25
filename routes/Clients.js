const express = require('express');
const router = express.Router();
const Client = require('../models/Client');

// Add clients
router.post('/createclient', async (req, res) => {
	const client = req.body;
	const result = await Client.create(client);

	res.json(result);
});

// Get all clients
router.get('/', async (req, res) => {
	const clients = await Clients.find();

	res.json(clients);
});

// Search client 
router.get('/search/:id', async (req, res) => {
	const _id = req.params.id;
	try{
		const client = await Client.findOne({_id});
		res.json(client);
	}catch{
		res.status(404).send({error: 'Client not found'})
	}
	
});

// Delete client 
router.delete('/delete/:id', async(req, res) => {
	const _id = req.params.id;
	const clients = await Client.findByIdAndDelete({_id});

	res.json(clients);
})

// Update client
router.put('/put/:id', async(req, res) => {
	const _id = req.params.id;
	const client = req.body;
	
	try{
		const update = await Client.findByIdAndUpdate(_id,client,{new: true});
		res.json(update);
	}catch{
		res.status(404).send({error: 'Client not found'})
	}

})

module.exports = router;

//FALTA CONFIGURAR ROUTER, SIRVE PARA PODER MANDAR DATOS Y PODER PROBAR LA BASE DE DATOS (INV. COMO HACER LA CONEXIÓN)
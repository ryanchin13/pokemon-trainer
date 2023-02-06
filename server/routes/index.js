const pokemonRoutes = require('./pokemon');

const constructorMethod = (app) => {
	app.use('/pokemon', pokemonRoutes);

	app.use('*', (req, res) => {
		return res.json({ error: 'Route not valid' });
	});
};

module.exports = constructorMethod;

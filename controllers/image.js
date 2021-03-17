const Clarifai = require('clarifai');

//大部分的api key要這樣設置
//原本寫在前端，但這有有安全風險，我的api key會暴露出來
const app = new Clarifai.App({
  apiKey: '68a90ec1e22449a1b8cc31d0af64ab44'
});

const handleApiCall = (req,res) =>{
	app.models
		.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
		.then(data => {
			res.json(data);
		})
		.catch(err => res.status(404).json('unable to work with API'))
}

const handleImage = (req, res, db) => {
	const { id } = req.body;
	db('users').where('id', '=', id)
	.increment('entries', 1)
	.returning('entries')
	.then(entries => {
		res.json(entries[0]);
	})
	.catch(err => res.status(404).json('unable to get entries'))
}

module.exports = {
	handleImage,
	handleApiCall
}
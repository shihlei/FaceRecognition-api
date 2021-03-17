const handleProfileGet = (req, res, db) => {
	const { id } = req.params;
	//抓用戶資料// id: id
	db.select('*').from('users').where({id})
	  .then(user => {
	  	if(user.length){
	  		res.json(user[0])
	  	}
		else{
			res.status(404).json('not found')
		}
	  })
	  .catch(err => res.status(404).json('error getting user'))
}

module.exports = {
	handleProfileGet
}
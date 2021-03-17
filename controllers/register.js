const handleRegister = (req,res,db,bcrypt) => {
	const { email, name, password} = req.body;
	//確保輸入空的不能regiester
	if(!email || !name || !password){
		return res.status(400).json('incorrect form submission');
	}
	//密碼加密
	const hash = bcrypt.hashSync(password);
	//用Knex(insert) data connect with server
	//建立transaction當一次要做多件事情
	db.transaction(trx => {
		//insert進register table
		trx.insert({
			hash: hash,
			email: email
		})
		.into('login')
		.returning('email')
		.then(loginEmail => {
			return db('users')
				.returning('*')//user insert and return all the columns
				//insert進login table
				.insert({
					email: loginEmail[0],
					name: name,
					joined: new Date()
				})
				//記得要回傳response
				.then(user => {
					res.json(user[0]);//確保回傳object而不是array
				})
		})
		//if all pass, send transaction
		.then(trx.commit)
		.catch(trx.rollback)//預防有任何的fail
	})
	.catch(err => res.status(400).json('unable to register'));
}

module.exports = {
	handleRegister: handleRegister
};
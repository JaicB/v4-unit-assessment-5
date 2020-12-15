module.exports = {
    register: (req, res) => {
        const db = req.app.get('db')
        const {username, password} = req.body

        db.register([username, password]).then((user) => {
            res.status(200).send(user)
        })
        .catch((err) => {
            res.status(400).send(err)
        })
    },
    login: (req, res) => {
        const db = req.app.get('db')

        db.login().then((username) => {
            res.status(200).send(username)
        })
    },
    logout: (req, res) => {
        const db = req.app.get('db')

        db.logout().then((user) => {
            res.status(200).send(user)
        })
    },
     getUser: (req, res) => {
        const db = req.app.get('db')

        db.get_user().then(() => {
            res.status(200).send(user)
        })
        .catch((err) => {
            res.status(404).send(err)
        })
    }
}
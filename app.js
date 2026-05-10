const express = require('express')
const app = express()
const port = 4000

const db = require('./models')
const loginRoutes = require('./routes/login.routes')

db.sequelize.authenticate()
.then(() => console.log("Database (model) terkoneksi"))
.catch((error) => console.error(error))

app.use(express.json());
app.use('/', loginRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
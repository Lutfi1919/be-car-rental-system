const express = require('express')
const app = express()
const port = 4000

const db = require('./models')
const methodOverride = require('method-override')
const loginRoutes = require('./routes/login.routes')
const userRoutes = require('./routes/user.routes')
const verificationRoutes = require('./routes/verification.routes')
const vehicleRoutes = require('./routes/vehicle.routes')
const vehicleUnitRoutes = require('./routes/vehicle_unit.routes')

db.sequelize.authenticate()
.then(() => console.log("Database (model) terkoneksi"))
.catch((error) => console.error(error))

app.use(express.json());
app.use(methodOverride("_method"));
app.use('/', loginRoutes);
app.use('/users', userRoutes);
app.use('/verification', verificationRoutes);
app.use('/vehicles', vehicleRoutes);
app.use('/vehicle_unit', vehicleUnitRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
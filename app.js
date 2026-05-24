const express = require('express')
const app = express()
const port = 4000

const db = require('./models')
const methodOverride = require('method-override')
const { checkToken } = require('./middlewares/auth')
const loginRoutes = require('./routes/login.routes')
const userRoutes = require('./routes/user.routes')
const verificationRoutes = require('./routes/verification.routes')
const vehicleRoutes = require('./routes/vehicle.routes')
const vehicleUnitRoutes = require('./routes/vehicle_unit.routes')
const vehicleImageRoutes = require('./routes/vehicle_image.routes')
const bookingPackageRoutes = require('./routes/booking_package.routes')
const bookingRoutes = require('./routes/booking.routes')
const bookingItemRoutes = require('./routes/booking_item.routes')
const paymentRoutes = require('./routes/payment.routes')
const returnRoutes = require('./routes/return.routes')

db.sequelize.authenticate()
.then(() => console.log("Database (model) terkoneksi"))
.catch((error) => console.error(error))

app.use(express.json());
app.use(methodOverride("_method"));
app.use('/uploads', express.static('uploads'));
app.use(express.static('public'));
app.use('/', loginRoutes);
app.use('/users', checkToken, userRoutes);
app.use('/verification', checkToken, verificationRoutes);
app.use('/vehicles', checkToken, vehicleRoutes);
app.use('/vehicle_unit', checkToken, vehicleUnitRoutes);
app.use('/vehicle_image', checkToken, vehicleImageRoutes);
app.use('/booking_package', checkToken, bookingPackageRoutes);
app.use('/booking', checkToken, bookingRoutes);
app.use('/booking_item', checkToken, bookingItemRoutes);
app.use('/payments', checkToken, paymentRoutes);
app.use('/return', checkToken, returnRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
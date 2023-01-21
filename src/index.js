import app from './app.js'


//Port
const port = process.env.PPORT || 4001  

app.listen(port, () => console.log(`App running at http://localhost:${port}`))

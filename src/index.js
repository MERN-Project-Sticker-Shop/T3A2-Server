import app from './app.js'


//Port, listen on production port or local host
const port = process.env.PORT || 4001  

app.listen(port, () => console.log(`App running at http://localhost:${port}`))

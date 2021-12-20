import express from 'express';
import router from './Router';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', router);

const port = process.env.PORT || 5000
app.listen(port , () =>{
    console.log(`Server is running on port ${port}`);
})
import express from 'express';
import cors from 'cors';
import router from './Router';

const app = express();
const whiteList = [ 'http://localhost:3000' ]
const devMode = process.env.NODE_ENV === 'development';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: function (origin, callback) {
      if (whiteList.indexOf(origin) !== -1) {
        callback(null, true)
      }else if(devMode){
        callback(null, true)
      }
      else {
        callback(new Error('origin ' + origin + ' Not allowed by CORS'))
      }
    }
}));

app.use('/api/v1', router);

const port = process.env.PORT || 5000
app.listen(port , () =>{
    console.log(`Server is running on port ${port}`);
})
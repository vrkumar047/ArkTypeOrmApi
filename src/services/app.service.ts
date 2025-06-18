import express from 'express';
import * as fs from 'fs';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import xmlparser from 'express-xml-bodyparser';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import compression from 'compression';
dotenv.config();
const { allowedOrigins, feedbackBaseApi } = process.env;
import { CustomError } from '../helpers/customError';

//------------------------------------------------------api Server
const app = express();
app.use(compression());
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(xmlparser());
app.use(bodyParser.urlencoded({ extended: true }));
// create application/json parser
app.use(bodyParser.json({ limit: '50mb' }));
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000,
  }),
);

//let allowedOrigins: any = 'http://localhost:4200,http://127.0.0.1:4200';
app.get('/', function (req, res) {
  res.send('Hello ARK');
});

app.use(
  cors({
    origin: function (origin: any, callback) {
      if (!origin) return callback(null, true); //-----------allowing if request from tool like postman
      if (allowedOrigins.indexOf(origin) === -1) {
        // let msg:string = `The CORS policy for this site does not allow access from the specified Origin.`;
        let err: any = new CustomError('UnknownSource');
        return callback(err.message, false);
      }
      return callback(null, true);
    },
  }),
);

// app.use(express.static(__dirname));
// app.use(express.static(path.join(__dirname, 'Uploads/public/')));
// app.use(express.static(path.join(__dirname, 'Uploads/files/')));
// app.use(express.static(path.join(__dirname, 'Uploads/pdfs/')));
// app.use(express.static(path.join(__dirname, 'Uploads/icard/')));
// app.use(express.static(path.join(__dirname, 'Uploads/Erp/files/'))); // For Erp
// app.use(express.static(path.join(__dirname, 'Uploads/Erp/pdfs/'))); // For Erp
// app.use(express.static(path.join(__dirname, 'Uploads/picandsig/')));
// app.use(express.static(path.join(__dirname, 'Uploads/reportfiles/')));
// app.use(express.static(__dirname + '/Resources')); // load static resources

/** file path */
app.use(
  '/public',
  express.static(path.join(__dirname, '../../Uploads/public/')),
);
app.use(
  '/docfile',
  express.static(path.join(__dirname, '../../Uploads/files/')),
);
console.log(path.join(__dirname, '../../Uploads/files/'));
app.use('/docpdf', express.static(path.join(__dirname, '../../Uploads/pdfs/')));

app.use('/icard', express.static(path.join(__dirname, '../../Uploads/icard/')));

app.use(
  '/picandsig',
  express.static(path.join(__dirname, '../../Uploads/picandsig/')),
);

app.use(
  '/reportfiles',
  express.static(path.join(__dirname, '../../Uploads/reportfiles/')),
);

export { app };

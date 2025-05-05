import express from 'express';
import * as fs from 'fs';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import xmlparser from 'express-xml-bodyparser';
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

/** file path */
app.use(
  '/logo',
  express.static(path.join(__dirname, '../../uploads/clients/logos')),
);
app.use(
  '/userprofilepic',
  express.static(path.join(__dirname, '../../uploads/users')),
);
app.use(
  '/empprofilepic',
  express.static(path.join(__dirname, '../../uploads/employees')),
);

app.use(
  '/staffpic',
  express.static(path.join(__dirname, '../../uploads/staffs/pictures')),
);

app.use(
  '/staffidproof',
  express.static(path.join(__dirname, '../../uploads/staffs/idproofs')),
);

app.use(
  '/vehicleimg',
  express.static(path.join(__dirname, '../../uploads/vehicles')),
);

app.use(
  '/driverlgimg',
  express.static(path.join(__dirname, '../../uploads/snapshots/drivers')),
);

app.use(
  '/vehiclelgimg',
  express.static(path.join(__dirname, '../../uploads/snapshots/vehicles')),
);

export { app };

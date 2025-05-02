import 'reflect-metadata';
//import { Request, Response } from 'express';
import { createServer } from 'http';
import net from 'net';
import * as dotenv from 'dotenv';
import { CustomResponse } from './middlewares/response.middleware';
import { route } from './routes/route.index';
import { app } from './services/app.service';
import moment from 'moment';
dotenv.config();

const {
  http_port,
  tcp_port,
  mqtt_host,
  mqtt_port,
  mqtt_user,
  mqtt_pwd,
  device_topic,
} = process.env;
app.use('/api', route);
app.use(CustomResponse);
//--------------------------------------------------------------------------------------------- HTTP Server
const httpServer = createServer(app);

httpServer.listen(http_port, async () => {
  console.log(`HTTP server is running on http://localhost:${http_port}`);
  //connectMqtt();
});
//--------------------------------------------------------------------------------------------- end HTTP Server

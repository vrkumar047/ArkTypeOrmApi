import { GetCompanyDb } from '../_dbs/mssql/sqlConnection';
import { plainToClass } from 'class-transformer';
import constant from '../_dbs/mssql/constant';
import Logger from '../utils/logger';
import { CustomError } from '../helpers/customError';
import { Config } from '../helpers/config';
import * as path from 'path';
import * as cmdCammond from 'child_process';
let cameraStatus: any[] = [];

let options: any = {
  excludeExtraneousValues: true,
};

export class CmdService {
  async execBat(loggedInUser: any): Promise<any> {
    try {
      cmdCammond.exec(
        '"C:\\inetpub\\wwwroot\\ARK_2_0\\Api\\References\\vlc.bat"',
        function (err, stdout, stderr) {
          if (err) {
            throw err;
          } else if (stderr) {
            throw stderr;
          } else {
            var output = stdout.replace(/\s+/g, '');
            return { result: output };
          }
        },
      );
    } catch (error: any) {
      if (error.driverError || error.name == 'RequestError') {
        Logger.error({
          clientId: '',
          src: 'cmd/execBat',
          error: error.message,
        });
      }
      let err = new CustomError('InternalServerError');
      throw err;
    }
  }

  async pingCamera(loggedInUser: any, companyCode: string = ''): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let cameraDetails: any = await companyDb.query(
        `EXEC ${constant.P_GetAllBranchCameraDetails} @companyCode = @0`,
        [companyCode],
      );
      let branchList: any[] = cameraDetails;
      cameraStatus = [];
      branchList.forEach((b) => {
        let c_ip: string = b.camIP;
        this.checkPingCamera(c_ip);
      });
      setTimeout(() => {
        let xmlString: any = this.updateCameraStatus(cameraStatus);
        this.updateCameraStatus(loggedInUser, xmlString);
      }, 180000);
      return { result: '' };
    } catch (error: any) {
      if (error.driverError || error.name == 'RequestError') {
        Logger.error({
          clientId: '',
          src: 'cmd/pingCamera',
          error: error.message,
        });
      }
      let err = new CustomError('InternalServerError');
      throw err;
    }
  }

  async execCommand(
    ip: string = '',
    userId: string = '',
    pwd: string = '',
    branchCode: string = '',
  ): Promise<any> {
    try {
      let dynamicCommand = `"c:\\Program Files (x86)\\VideoLAN\\VLC\\vlc.exe" "rtsp://${userId}:${pwd}@${ip}/cam/realmonitor?channel=1" :sout=#transcode{vcodec=theo,vb=64,scale=Auto,acodec=vorb,ab=64,channels=2,samplerate=44100,scodec=none}:std{access=shout,mux=ogg,dst=//source:hackme@localhost:8000/${branchCode}.ogg} :sout-all :sout-keep`;
      //	console.log(dynamicCommand);
      cmdCammond.exec(dynamicCommand, function (err, stdout, stderr) {
        if (err) {
          throw err;
        } else if (stderr) {
          throw stderr;
        } else {
          return { result: stdout };
        }
      });
    } catch (error: any) {
      if (error.driverError || error.name == 'RequestError') {
        Logger.error({
          clientId: '',
          src: 'cmd/execCommand',
          error: error.message,
        });
      }
      let err = new CustomError('InternalServerError');
      throw err;
    }
  }

  async closeBat(pid: string = ''): Promise<any> {
    try {
      cmdCammond.exec(`taskkill/PID  ${pid}`);
      return { res: 'success' };
    } catch (error: any) {
      if (error.driverError || error.name == 'RequestError') {
        Logger.error({
          clientId: '',
          src: 'cmd/closeBat',
          error: error.message,
        });
      }
      let err = new CustomError('InternalServerError');
      throw err;
    }
  }

  async closeCommand(): Promise<any> {
    try {
      cmdCammond.exec('taskkill/im vlc.exe');
      return { res: 'success' };
    } catch (error: any) {
      if (error.driverError || error.name == 'RequestError') {
        Logger.error({
          clientId: '',
          src: 'cmd/closeCommand',
          error: error.message,
        });
      }
      let err = new CustomError('InternalServerError');
      throw err;
    }
  }

  async checkPingCamera(camperaIp) {
    var result: any = await this.resolveAfterSuccess(camperaIp);
    if (cameraStatus.find((x) => x.cameraIp == result.cameraIp) == undefined) {
      cameraStatus.push(result);
    } else {
      cameraStatus.find((x) => x.cameraIp == result.cameraIp).status =
        result.status;
    }
  }

  async updateCameraStatus(
    loggedInUser: any,
    cameraDetails: string = '',
  ): Promise<any> {
    try {
      let companyDb = await GetCompanyDb(loggedInUser.secret);
      let cameraStatusDetails: any = await companyDb.query(
        `EXEC ${constant.P_CameraStatus} @action = @0, @cameraXml = @1`,
        ['livestatus', cameraDetails],
      );
      return cameraStatusDetails;
    } catch (error: any) {
      if (error.driverError || error.name == 'RequestError') {
        Logger.error({
          clientId: '',
          src: 'cmd/updateCameraStatus',
          error: error.message,
        });
      }
      let err = new CustomError('InternalServerError');
      throw err;
    }
  }

  resolveAfterSuccess(camperaIp) {
    return new Promise((resolve) => {
      cmdCammond.exec('ping ' + camperaIp, function (err, stdout, stderr) {
        var camera: any = {};
        if (err) {
          camera.cameraIp = camperaIp;
          camera.status = 0;
        } else if (stderr) {
          camera.cameraIp = camperaIp;
          camera.status = 0;
        } else {
          if (
            stdout.indexOf('Destination host unreachable') == -1 &&
            (stdout.match(/Request timed out/g) || []).length == 0
          ) {
            camera.cameraIp = camperaIp;
            camera.status = 1;
          } else {
            camera.cameraIp = camperaIp;
            camera.status = 0;
          }
        }
        resolve(camera);
      });
    });
  }

  // updateCameraStatus(arrList) {
  //   var xmlNode = xmlBuilder.create('lst');
  //   for (var i = 0; i <= arrList.length - 1; i++) {
  //     var leafNode = xmlNode.ele('cm');
  //     leafNode.ele('cIp', arrList[i].cameraIp);
  //     leafNode.ele('stat', arrList[i].status);
  //   }
  //   xmlNode.end({ pretty: true });
  //   var xmlString = xmlNode.toString();
  //   return xmlString;
  // }
}

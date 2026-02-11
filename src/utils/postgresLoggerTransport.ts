import TransportStream, { TransportStreamOptions } from 'winston-transport';
import { ConnectionPool, config as SqlConfig } from 'mssql';

interface MSSQLTransportOptions extends TransportStreamOptions {
  connectionConfig: SqlConfig;
}

export class MSSQLTransport extends TransportStream {
  private pool: ConnectionPool;

  constructor(options: MSSQLTransportOptions) {
    super(options);
    this.pool = new ConnectionPool(options.connectionConfig);
    this.pool
      .connect()
      .then(() => {
        console.log('Connected to MSSQL');
      })
      .catch((err) => console.error('Error connecting to MSSQL:', err));
  }

  log(info: any, callback: () => void) {
    setImmediate(() => this.emit('logged', info));

    const { level, message, timestamp } = info;

    const clientId = message.clientId ?? 'unknown';
    const errorSource = message.src ?? 'unknown';
    const errorMessage = message.error ?? 'unknown';
    const requestPayload = message.requestPayload ?? 'unknown';
    const loggedAt = timestamp ?? new Date();
    const loggedBy = message.loggedBy ?? 'unknown';

    const query = `
      INSERT INTO error_logs (client_id,error_source,error_message,request_payload,logged_at,logged_by)
      VALUES (@clientId, @errorSource,@errorMessage,@requestPayload, @loggedAt, @loggedBy)
    `;

    this.pool
      .request()
      .input('clientId', clientId)
      .input('errorSource', errorSource)
      .input('errorMessage', errorMessage)
      .input('requestPayload', requestPayload)
      .input('loggedAt', loggedAt)
      .input('loggedBy', loggedBy)
      .query(query)
      .catch((err) => {
        console.error('Error inserting error_logs into MSSQL:', err);
      })
      .finally(() => callback());
  }

  // Make sure to properly close the client when the transport is finished
  close() {
    this.pool
      .close()
      .then(() => console.log('MSSQL connection closed.'))
      .catch((err) => console.error('Error closing MSSQL connection:', err));
  }
}

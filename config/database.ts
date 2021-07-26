/**
 * Config source: https://git.io/JesV9
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

import Env from '@ioc:Adonis/Core/Env';
import { DatabaseConfig } from '@ioc:Adonis/Lucid/Database';

//Use different database for test enviroment
interface ConnectionMySqlInterface {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}
let connectionMySql: ConnectionMySqlInterface | undefined;

if (Env.get('NODE_ENV') === 'development') {
  connectionMySql = {
    host: Env.get('MYSQL_HOST'),
    port: Env.get('MYSQL_PORT'),
    user: Env.get('MYSQL_USER'),
    password: Env.get('MYSQL_PASSWORD', ''),
    database: Env.get('MYSQL_DB_NAME'),
  };
} else if (Env.get('NODE_ENV') === 'test') {
  connectionMySql = {
    host: Env.get('MYSQL_HOST_TEST'),
    port: Env.get('MYSQL_PORT_TEST'),
    user: Env.get('MYSQL_USER_TEST'),
    password: Env.get('MYSQL_PASSWORD_TEST', ''),
    database: Env.get('MYSQL_DB_NAME_TEST'),
  };
}

const databaseConfig: DatabaseConfig = {
  /*
  |--------------------------------------------------------------------------
  | Connection
  |--------------------------------------------------------------------------
  |
  | The primary connection for making database queries across the application
  | You can use any key from the `connections` object defined in this same
  | file.
  |
  */
  connection: Env.get('DB_CONNECTION'),

  connections: {
    /*
    |--------------------------------------------------------------------------
    | MySQL config
    |--------------------------------------------------------------------------
    |
    | Configuration for MySQL database. Make sure to install the driver
    | from npm when using this connection
    |
    | npm i mysql
    |
    */
    mysql: {
      client: 'mysql',
      connection: connectionMySql,
      migrations: {
        naturalSort: true,
      },
      healthCheck: false,
      debug: false,
    },
  },
};

export default databaseConfig;

/*
|--------------------------------------------------------------------------
| Validating Environment Variables
|--------------------------------------------------------------------------
|
| In this file we define the rules for validating environment variables.
| By performing validation we ensure that your application is running in
| a stable environment with correct configuration values.
|
| This file is read automatically by the framework during the boot lifecycle
| and hence do not rename or move this file to a different location.
|
*/

import Env from '@ioc:Adonis/Core/Env';

export default Env.rules({
  HOST: Env.schema.string({ format: 'host' }),
  PORT: Env.schema.number(),
  PORT_TEST: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  APP_NAME: Env.schema.string(),
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  DB_CONNECTION: Env.schema.string(),
  MYSQL_HOST: Env.schema.string({ format: 'host' }),
  MYSQL_PORT: Env.schema.number(),
  MYSQL_USER: Env.schema.string(),
  MYSQL_PASSWORD: Env.schema.string.optional(),
  MYSQL_DB_NAME: Env.schema.string(),
  //  tests
  MYSQL_HOST_TEST: Env.schema.string({ format: 'host' }),
  MYSQL_PORT_TEST: Env.schema.number(),
  MYSQL_USER_TEST: Env.schema.string(),
  MYSQL_PASSWORD_TEST: Env.schema.string.optional(),
  MYSQL_DB_NAME_TEST: Env.schema.string(),

  //token secret
  ACCESS_TOKEN_SECRET: Env.schema.string(),
  REFRESH_TOKEN_SECRET: Env.schema.string(),
  EX_ACCESS_TOKEN: Env.schema.string(),
  EX_REFRESH_TOKEN: Env.schema.string(),
});

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import User from 'App/Models/User';
import { userSchema } from './../../../util/user.schema';
import { ValidationErrorsReporter } from 'App/Validators/Reporters/ValidationErrorsReporter';
import { sign } from 'jsonwebtoken';
import Env from '@ioc:Adonis/Core/Env';
import Hash from '@ioc:Adonis/Core/Hash';
import { randomBytes } from 'crypto';
import { clientRedis, getCache } from './../../../server';

export default class AuthController {
  public async signup({ request, response }: HttpContextContract) {
    const payload = await request.validate({
      schema: userSchema,
      messages: {
        required: 'The {{field}} is require!',
        unique: 'The {{field}} is available!',
        string: 'The {{field}} must be string',
      },
      reporter: ValidationErrorsReporter,
    });
    const newUser = await User.create(payload);
    const accessToken = this.generateToken({ id: newUser.id }, 'ACCESS_TOKEN_SECRET');
    const refreshToken = randomBytes(30).toString('hex');
    clientRedis.setex(String(newUser.id), 1000 * 60 * 60 * 24, refreshToken);
    response.status(201);
    return { data: { newUser, accessToken, refreshToken } };
  }

  public async login({ request, response }: HttpContextContract) {
    const body = request.body();
    let key = Object.keys(body).filter((k) => k !== 'password')[0];
    const user = await User.findByOrFail(key, body[key]);
    if (!user) {
      response.status(404);
      return { data: { error: 'user not found!' } };
    }
    if (!(await Hash.verify(user.password, body.password))) {
      response.status(401);
      return { data: { error: 'incorrect password!' } };
    }
    const accessToken = this.generateToken({ id: user.id }, 'ACCESS_TOKEN_SECRET');
    const refreshToken = randomBytes(30).toString('hex');
    clientRedis.setex(String(user.id), 1000 * 60 * 60 * 24, refreshToken);
    response.status(200);
    return { data: { user, accessToken } };
  }

  private generateToken(payload: { id: number }, secret: string) {
    let ex =
      secret === 'ACCESS_TOKEN_SECRET' ? Env.get('EX_ACCESS_TOKEN') : Env.get('EX_REFRESH_TOKEN');
    const token = sign(payload, Env.get(secret), { expiresIn: ex });
    return token;
  }

  public async refreshToken({ request, response }: HttpContextContract) {
    const body = request.body();
    console.log('userid', body.userId);

    const refreshToken = await getCache(String(body.userId));
    if (refreshToken) {
      response.status(200);
      const accessToken = this.generateToken({ id: body.userId }, 'ACCESS_TOKEN_SECRET');
      return { data: { accessToken } };
    } else {
      response.status(401);
      return { data: { message: 'invalid refresh token' } };
    }
  }
}

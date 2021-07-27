import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { JwtPayload, verify } from 'jsonwebtoken';
import Env from '@ioc:Adonis/Core/Env';
import User from 'App/Models/User';

interface Decode extends JwtPayload {
  id: number;
}

export interface AllowedUser extends HttpContextContract {
  user: User;
}
export default class ProtectedRoute {
  public async handle(ctx: AllowedUser, next: () => Promise<void>) {
    let { request: req, response: res } = ctx;

    let token: string;
    try {
      if (
        req.headers()['x-access-token'] &&
        (req.headers()['x-access-token']! as string).startsWith('Bearer')
      ) {
        [, token] = (req.headers()['x-access-token']! as string).split(' ');

        const decode = verify(token, Env.get('ACCESS_TOKEN_SECRET')) as Decode;

        const currentUser = await User.findOrFail(decode.id);
        if (!currentUser) {
          res.status(404);
          res.send({
            data: { message: 'the user belonging to this token is not exist' },
          });
        }

        ctx.user = currentUser;
        await next();
      } else {
        res.status(401);
        res.send({ data: { message: 'there is not token' } });
      }
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        res.status(401);
        res.send({ data: { message: 'token expired' } });
      }
    }
  }
}

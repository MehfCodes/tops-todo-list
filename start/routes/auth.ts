import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  Route.post('/signup', 'AuthController.signup');
  Route.post('/login', 'AuthController.login');
  Route.post('/refresh-token', 'AuthController.refreshToken');
}).prefix('/api/v1/auth');

export default Route;

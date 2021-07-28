import Route from '@ioc:Adonis/Core/Route';
Route.group(() => {
  Route.resource('/api/v1/todos', 'TasksController').apiOnly();
}).middleware('protectedRoute');

export default Route;

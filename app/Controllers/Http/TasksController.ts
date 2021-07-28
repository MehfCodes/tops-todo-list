import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { AllowedUser } from 'App/Middleware/ProtectedRoute';
import Task from 'App/Models/Task';
import { cacheOrSet } from './../../../util/cache';

export default class TasksController {
  public async store({ request, response, user }: AllowedUser) {
    const body = request.body();
    if (!body.note || !body.status) {
      response.status(406);
      return { data: { message: 'task failed!' } };
    }
    const task = await Task.create({ user_id: user.id, ...body });
    response.status(201);
    return { data: task };
  }

  public async index({ response }: HttpContextContract) {
    const tasks = await cacheOrSet('tasks', async () => {
      return await Task.all();
    });
    response.status(200);
    return { data: tasks };
  }
  public async update({ request, response, params }: AllowedUser) {
    const body = request.body();
    let task = await Task.findOrFail(params.id);
    if (!task) {
      response.status(404);
      return { data: { message: 'task not found!' } };
    }
    Object.keys(body).forEach((c) => {
      task[c] = body[c];
    });
    task = await task.save();
    response.status(200);
    return { data: task };
  }

  public async destroy({ response, params }: AllowedUser) {
    const task = await Task.findOrFail(params.id);
    if (!task) {
      response.status(404);
      return { data: { message: 'task not found!' } };
    }

    await task.delete();
    response.status(200);
    return { data: { message: 'task was deleted!' } };
  }
}

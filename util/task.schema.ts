import { schema } from '@ioc:Adonis/Core/Validator';
export const taskSchema = schema.create({
  user_id: schema.number(),
  status: schema.enum(['todo', 'doing', 'done']),
  note: schema.string({ trim: true }),
});

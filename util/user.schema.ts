import { schema, rules } from '@ioc:Adonis/Core/Validator';
export const userSchema = schema.create({
  username: schema.string({ trim: true }, [rules.unique({ table: 'users', column: 'username' })]),
  password: schema.string({ trim: true }, [rules.minLength(8), rules.maxLength(255)]),
  email: schema.string.optional({ trim: true }, [
    rules.email(),
    rules.unique({ table: 'users', column: 'email' }),
  ]),
  phone_number: schema.string({ trim: true }, [
    rules.mobile({ locales: ['fa-IR', 'en-US'] }),
    rules.unique({ table: 'users', column: 'phone_number' }),
  ]),
});

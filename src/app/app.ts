import * as path from 'path';
import { FastifyInstance } from 'fastify';
import AutoLoad from '@fastify/autoload';
import fastifyAuth from '@fastify/auth';
import fastifyBearerAuth from '@fastify/bearer-auth';
import { env } from '../env';
import { UsersService } from '../services';
import { asValue } from 'awilix';
import { parse } from 'url';
import { ServiceId } from '../services-id.enum';

/* eslint-disable-next-line */
export interface AppOptions {}

// Monkey patching for serialization
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export async function app(fastify: FastifyInstance, opts: AppOptions) {
  await fastify
    .register(fastifyAuth)
    .register(fastifyBearerAuth, {
      addHook: false,
      keys: [env.BEARER_AUTH_TOKEN],
      bearerType: 'Bearer',
      specCompliance: 'rfc6750',
      errorResponse: (err) => {
        return { ok: false, error: err.message };
      },
    })
    .decorate('allowAnonymous', function (req, reply, done) {
      if (req.headers.authorization) {
        return done(Error('not anonymous'));
      }
      return done();
    });

  // Place here your custom code!

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: { ...opts },
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    maxDepth: 5,
    dir: path.join(__dirname, 'routes'),
    options: { ...opts },
  });

  fastify.addHook<{
    Querystring: { userId?: string; chatId?: string };
    Body: { userId?: string; chatId?: string };
  }>('preHandler', async (request) => {
    let [_, serviceId] = parse(request.url).pathname?.split('/');
    const userId =
      request.body?.userId ??
      request.body?.chatId ??
      request.query?.chatId ??
      request.query?.userId;

    let user = null;
    if (!!userId) {
      user = await request.diScope
        .resolve<UsersService>('users')
        .findUserById(parseInt(userId));
    }

    request.diScope.register('user', asValue(user));
    if (Object.values(ServiceId).includes(serviceId as ServiceId)) {
      // Add serviceId to DI Container if its bot-related API request
      request.diScope.register('serviceId', asValue(serviceId));
    }
  });
}

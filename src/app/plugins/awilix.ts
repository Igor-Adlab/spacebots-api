import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import { fastifyAwilixPlugin } from '@fastify/awilix';
import { diContainer } from '../../di-container';

/**
 * This plugins adds DI container
 *
 * @see https://github.com/fastify/fastify-awilix
 */
export default fp(async function (fastify: FastifyInstance) {
  fastify.register(fastifyAwilixPlugin, {
    eagerInject: true,
    disposeOnClose: true,
    container: diContainer,
    disposeOnResponse: true,
    strictBooleanEnforced: true,
  });
});

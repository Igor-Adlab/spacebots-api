import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';

import cors from '@fastify/cors';

/**
 * This plugins adds Multer
 *
 * @see https://github.com/fox1t/fastify-multer
 */
export default fp(async function (fastify: FastifyInstance) {
  fastify.register(cors);
});

import { randomUUID } from 'crypto';
import { FastifyInstance } from 'fastify';
import { type GcpStorageService } from '../../services';

const UPLOADS_BUCKET = 'uploads';
const REMOVE_DELAY = 120 * 60 * 1000;

export default async function (fastify: FastifyInstance) {
  fastify.post('/api/uploads', async function (req) {
    const file = await req.file({
      limits: { fileSize: 1000 * Math.pow(1024, 2) },
    });
    const url = await req.diScope
      .resolve<GcpStorageService>('storage')
      .upload(
        UPLOADS_BUCKET,
        randomUUID(),
        await file.toBuffer(),
        REMOVE_DELAY
      );

    return { ok: true, url };
  });
}

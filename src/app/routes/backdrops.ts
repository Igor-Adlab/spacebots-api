import { join } from 'path';
import { randomUUID } from 'crypto';
import { FastifyInstance } from 'fastify';
import {
  type GcpStorageService,
  type DownloaderService,
  type BackdropsService,
} from '../../services';
import { createReadStream } from 'fs';

const BACKDROPS_BUCKET = 'backdrops';

export default async function (fastify: FastifyInstance) {
  fastify.post<{
    Body: {
      url: string;
      category: string;
    };
  }>(
    '/api/backdrop/import',
    {
      preHandler: fastify.auth([fastify.verifyBearerAuth]),
    },
    async (req, res) => {
      const storageService = req.diScope.resolve<GcpStorageService>('storage');
      const backdropsService =
        req.diScope.resolve<BackdropsService>('backdrops');
      const downloaderService =
        req.diScope.resolve<DownloaderService>('downloader');

      const { category, url } = req.body;
      if (!url.includes('youtube')) {
        return res.badGateway('Invalid source. Only Youtube videos supported');
      }

      const filePath = await downloaderService.downloadYoutubeVideo(url);
      let video = await backdropsService.addBackdropVideo({
        category,
        duration: 0,
        videoUrl: await storageService.upload(
          join(BACKDROPS_BUCKET, category),
          randomUUID(),
          createReadStream(filePath)
        ),
      });

      video = await backdropsService.updateVideoDuration(video);

      return { ok: true, video };
    }
  );

  fastify.post<{
    Params: { category: string };
  }>(
    '/api/backdrop/upload/:category',
    {
      preHandler: fastify.auth([fastify.verifyBearerAuth]),
    },
    async (req) => {
      const { category = null } = req.params;
      const file = await req.file({
        limits: { fileSize: 1000 * Math.pow(1024, 2) },
      });

      const backdropsService =
        req.diScope.resolve<BackdropsService>('backdrops');

      const videoUrl = await req.diScope
        .resolve<GcpStorageService>('storage')
        .upload(
          join(BACKDROPS_BUCKET, category),
          randomUUID(),
          await file.toBuffer()
        );

      let video = await backdropsService.addBackdropVideo({
        videoUrl,
        category,
        duration: 0,
      });

      video = await backdropsService.updateVideoDuration(video);

      return { ok: true, video };
    }
  );
}

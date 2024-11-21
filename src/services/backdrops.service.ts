import { BackdropVideos, Prisma, PrismaClient } from '@prisma/client';
import { Logger } from 'pino';
import { sample } from 'lodash';
import { getVideoDuration } from '../utils';

export class BackdropsService {
  private readonly logger: Logger;
  private readonly prisma: PrismaClient;

  constructor({ logger, prisma }) {
    this.prisma = prisma;
    this.logger = logger.child({ service: BackdropsService.name });
  }

  async addBackdropVideo(data: Prisma.BackdropVideosCreateInput) {
    this.logger.info(`Adding new video: ${JSON.stringify({ data })}`);
    return this.prisma.backdropVideos.create({
      data,
    });
  }

  async updateVideoDuration(video: BackdropVideos) {
    this.logger.info(`Calculating duration for ${JSON.stringify(video)}`);
    const duration = await getVideoDuration(video.videoUrl);
    return this.prisma.backdropVideos.update({
      where: { id: video.id },
      data: { duration: duration.seconds },
    });
  }

  async getVideoInfoByUrl(videoUrl: string) {
    return this.prisma.backdropVideos.findFirst({ where: { videoUrl } });
  }

  async getBackdropTypesPagination(page = 1, take = 5) {
    const skip = (page - 1) * take;

    const categories = await this.prisma.backdropVideos.findMany({
      distinct: 'category',
      select: { category: true },
    });

    const total = categories.length;

    const totalPages = Math.ceil(total / take);

    const list = await this.prisma.backdropVideos.findMany({
      skip,
      take,
      distinct: 'category',
      select: { category: true },
    });

    const hasPrev = page > 1;
    const hasNext = page < totalPages;

    return {
      total,
      totalPages,
      page,
      size: take,
      hasPrev,
      hasNext,
      list,
    };
  }

  async getRandomBackdropVideo(category?: string) {
    const where = category ? { category } : undefined;
    return sample(
      await this.prisma.backdropVideos.findMany({
        take: 5,
        where,
      })
    );
  }
}

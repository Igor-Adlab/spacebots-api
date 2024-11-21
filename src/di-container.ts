import {
  asClass,
  asFunction,
  asValue,
  createContainer,
  Lifetime,
} from 'awilix';
import {
  BackdropsService,
  CloudRunService,
  DownloaderService,
  FfMpegService,
  GcpStorageService,
  InvoicesService,
  MusicSearchService,
  OpenAiWhisperService,
  SubscriptionsService,
  UsageService,
  UsersService,
} from './services';
import { PrismaClient, User } from '@prisma/client';
import { I18n } from '@grammyjs/i18n';
import pino from 'pino';
import Redis from 'ioredis';
import { i18n } from './i18n';
import { logger } from './logger';
import { redis } from './redis';
import { prisma } from './prisma';

export const diContainer = createContainer<DiCradle>();

export interface DiCradle {
  // Globals
  i18n: I18n;
  redis: Redis;
  logger: pino.Logger;
  prisma: PrismaClient;

  // Transient scoped
  user: User;
  serviceId: string;

  // Singleton scoped
  usage: UsageService;
  users: UsersService;
  ffmpeg: FfMpegService;
  cloudRun: CloudRunService;
  storage: GcpStorageService;
  backdrops: BackdropsService;
  downloader: DownloaderService;
  whisper: OpenAiWhisperService;
  musicSearch: MusicSearchService;
  invoices: InvoicesService;
  subsciptions: SubscriptionsService;
}

diContainer.register({
  i18n: asValue(i18n),
  redis: asValue(redis),
  logger: asValue(logger),
  prisma: asValue(prisma),

  users: asClass(UsersService, { lifetime: Lifetime.SINGLETON }),
  ffmpeg: asClass(FfMpegService, { lifetime: Lifetime.SINGLETON }),
  cloudRun: asClass(CloudRunService, { lifetime: Lifetime.SINGLETON }),
  storage: asClass(GcpStorageService, { lifetime: Lifetime.SINGLETON }),
  backdrops: asClass(BackdropsService, { lifetime: Lifetime.SINGLETON }),
  downloader: asClass(DownloaderService, { lifetime: Lifetime.SINGLETON }),
  whisper: asClass(OpenAiWhisperService, { lifetime: Lifetime.SINGLETON }),
  musicSearch: asClass(MusicSearchService, { lifetime: Lifetime.SINGLETON }),

  usage: asClass(UsageService, { lifetime: Lifetime.TRANSIENT }),
  invoices: asClass(InvoicesService, { lifetime: Lifetime.TRANSIENT }),
  subsciptions: asClass(SubscriptionsService, { lifetime: Lifetime.TRANSIENT }),
});

import { InvoiceStatus, PrismaClient } from '@prisma/client';

import { DateTimeUtils } from '../utils';
import { Logger } from 'pino';
import { LanguageCode } from '../i18n';

export class UsersService {
  private logger: Logger;
  private readonly prisma: PrismaClient;

  constructor({ prisma, logger }) {
    this.prisma = prisma;
    this.logger = logger.child({ service: UsersService.name });
  }

  findUserById(userId: number) {
    return this.prisma.user.findFirst({ where: { id: userId } });
  }

  setLanguage(userId: number, language: LanguageCode) {
    this.logger.info(`Set ${language} for ${userId}`);
    return this.prisma.user.update({
      where: { id: userId },
      data: { language },
    });
  }

  async register(userId: number, name: string) {
    const now = DateTimeUtils.getDayStart().toDate();
    const relations = {
      usage: { where: { day: now } },
      subscriptions: {
        where: { startsAt: { lte: now }, endsAt: { gte: now } },
      },
      invoices: { where: { status: InvoiceStatus.Pending } },
    };

    const subscriber = await this.prisma.user.findFirst({
      where: { id: userId },
    });

    if (!subscriber) {
      this.logger.info(`Registering new user ${name}: ${userId}`);
      return this.prisma.user.create({
        data: { id: userId, name },
      });
    }

    return subscriber;
  }
}

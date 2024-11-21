import { Logger } from 'pino';
import { PrismaClient, User } from '@prisma/client';

import { DateTimeUtils } from '../utils';

export class UsageService {
  private logger: Logger;
  private readonly user: User;
  private readonly serviceId: string;
  private readonly prisma: PrismaClient;

  constructor({ prisma, user, serviceId, logger }) {
    this.user = user;
    this.prisma = prisma;
    this.serviceId = serviceId;
    this.logger = logger.child({ service: UsageService.name });
  }

  increase(date?: Date) {
    let day = DateTimeUtils.getDayStart(date).toDate();
    this.logger.info(
      `Increase usage for ${this.user.name}(${this.user.id}) of "${this.serviceId}" service`
    );
    return this.prisma.usage.upsert({
      where: {
        service: this.serviceId,
        subscriberId_day_service: {
          day,
          subscriberId: this.user.id,
          service: this.serviceId,
        },
      },
      update: { count: { increment: 1 } },
      create: {
        day,
        count: 1,
        service: this.serviceId,
        subscriberId: this.user.id,
      },
    });
  }

  getUsage(date?: Date) {
    let day = DateTimeUtils.getDayStart(date).toDate();
    const usage = this.prisma.usage.findFirst({
      where: {
        day,
        service: this.serviceId,
        subscriberId: this.user.id,
      },
    });

    this.logger.info(
      `Usage ${this.user.name}(${this.user.id}) of service "${this.serviceId}": `,
      usage
    );
    return usage;
  }

  async getUsageCount(date?: Date) {
    const data = await this.getUsage(date);
    return data?.count || 0;
  }
}

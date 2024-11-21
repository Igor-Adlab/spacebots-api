import { Invoice, InvoiceStatus, PrismaClient, User } from '@prisma/client';
import { Logger } from 'pino';

export class InvoicesService {
  private logger: Logger;
  private readonly user: User;
  private readonly serviceId: string;
  private readonly prisma: PrismaClient;

  constructor({ user, serviceId, logger, prisma }) {
    this.user = user;
    this.prisma = prisma;
    this.serviceId = serviceId;
    this.logger = logger.child({ service: InvoicesService.name });
  }

  createInvoice(invoice: Pick<Invoice, 'amount' | 'description' | 'payload'>) {
    this.logger.info(
      `Creating invoce for ${this.user.name}(${this.user.id}) in "${this.serviceId}" service`
    );
    return this.prisma.invoice.create({
      data: {
        ...invoice,
        service: this.serviceId,
        subscriberId: this.user.id,
      },
    });
  }

  findInvoiceById(invoiceId: string) {
    return this.prisma.invoice.findFirstOrThrow({
      where: {
        id: invoiceId,
        service: this.serviceId,
        subscriberId: this.user.id,
      },
    });
  }

  findPendingInvoice() {
    return this.prisma.invoice.findFirst({
      where: {
        service: this.serviceId,
        subscriberId: this.user.id,
        status: InvoiceStatus.Pending,
      },
    });
  }

  async payInvoice(invoiceId: string) {
    const invoice = await this.prisma.invoice.update({
      where: {
        id: invoiceId,
        service: this.serviceId,
        subscriberId: this.user.id,
        status: InvoiceStatus.Pending,
      },
      data: { status: InvoiceStatus.Paid, paidAt: new Date() },
    });
    this.logger.info(
      `${this.user.name}(${this.user.id}) paid invoice #${invoiceId}: `,
      invoice
    );

    return invoice;
  }
}

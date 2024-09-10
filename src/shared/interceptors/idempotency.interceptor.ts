import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { IdempotencyRepository } from '../repositories/idempotency.repository';
import { Observable, of, tap } from 'rxjs';

@Injectable()
export class IdempotencyKeyInterceptor implements NestInterceptor {
  constructor(private readonly idempotencyRepository: IdempotencyRepository) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const idempotencyKey = request.headers['x-idempotency-key'];

    if (!idempotencyKey) {
      throw new BadRequestException(
        "Header 'x-idempotency-key' is required for this request.",
      );
    }

    const idempotencyData =
      await this.idempotencyRepository.fetch(idempotencyKey);

    if (idempotencyData) return of(idempotencyData.value);

    return next.handle().pipe(
      tap(async (data) => {
        await this.idempotencyRepository.save(idempotencyKey, data);
        return data;
      }),
    );
  }
}

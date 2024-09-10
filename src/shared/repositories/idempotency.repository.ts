import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

export interface IdempotencyKV {
  key: string;
  value: any;
}

@Injectable()
export class IdempotencyRepository {
  static MAX_IDEMPOTENCY_TTL = 300000; // 5 minutes

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async fetch(key: string): Promise<IdempotencyKV> {
    const data = await this.cacheManager.get(key);
    if (data) {
      return { key, value: data };
    }
  }

  async save(key: string, response: any): Promise<void> {
    await this.cacheManager.set(
      key,
      response,
      IdempotencyRepository.MAX_IDEMPOTENCY_TTL,
    );
  }
}

import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantPayable, MerchantTransaction } from './domain/models';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CacheModule } from '@nestjs/cache-manager';
import { IdempotencyRepository } from './repositories/idempotency.repository';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot({ global: true }),
    CacheModule.register({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('ORM_LOCALHOST'),
          port: +configService.get('ORM_PORT'),
          username: configService.get('ORM_USERNAME'),
          password: configService.get('ORM_PASSWORD'),
          database: configService.get('ORM_DBNAME'),
          autoLoadEntities: true,
          entities: [MerchantTransaction, MerchantPayable],
          synchronize: true,
        };
      },
    }),
  ],
  providers: [IdempotencyRepository],
  exports: [IdempotencyRepository],
})
export class SharedModule {}

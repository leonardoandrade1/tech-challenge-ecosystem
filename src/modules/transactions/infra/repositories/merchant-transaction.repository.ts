import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MerchantTransaction } from 'src/shared/domain/models';
import { Repository } from 'typeorm';

@Injectable()
export class MerchantTransactionRepository extends Repository<MerchantTransaction> {
  constructor(
    @InjectRepository(MerchantTransaction)
    private readonly transactionRepository: Repository<MerchantTransaction>,
  ) {
    super(
      transactionRepository.target,
      transactionRepository.manager,
      transactionRepository.queryRunner,
    );
  }
}

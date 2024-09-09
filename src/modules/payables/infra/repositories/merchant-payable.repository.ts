import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MerchantPayable } from 'src/shared/domain/models';
import { Repository } from 'typeorm';

@Injectable()
export class MerchantPayableRepository extends Repository<MerchantPayable> {
  constructor(
    @InjectRepository(MerchantPayable)
    private readonly transactionRepository: Repository<MerchantPayable>,
  ) {
    super(
      transactionRepository.target,
      transactionRepository.manager,
      transactionRepository.queryRunner,
    );
  }
}

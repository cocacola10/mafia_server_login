import { Test, TestingModule } from '@nestjs/testing';
import { MafiaService } from './mafia.service';

describe('MafiaService', () => {
  let service: MafiaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MafiaService],
    }).compile();

    service = module.get<MafiaService>(MafiaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

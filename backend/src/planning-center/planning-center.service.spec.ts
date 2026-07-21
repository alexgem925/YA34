import { Test, TestingModule } from '@nestjs/testing';
import { PlanningCenterService } from './planning-center.service';

describe('PlanningCenterService', () => {
  let service: PlanningCenterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlanningCenterService],
    }).compile();

    service = module.get<PlanningCenterService>(PlanningCenterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

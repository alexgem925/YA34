import { Test, TestingModule } from '@nestjs/testing';
import { PlanningCenterController } from './planning-center.controller';

describe('PlanningCenterController', () => {
  let controller: PlanningCenterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanningCenterController],
    }).compile();

    controller = module.get<PlanningCenterController>(PlanningCenterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

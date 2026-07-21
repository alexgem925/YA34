import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PlanningCenterService } from './planning-center.service';
import { PlanningCenterController } from './planning-center.controller';

@Module({
  imports: [HttpModule],
  providers: [PlanningCenterService],
  controllers: [PlanningCenterController],
})
export class PlanningCenterModule {}
import { Controller, Get } from '@nestjs/common';
import { PlanningCenterService } from './planning-center.service';

@Controller('planning-center')
export class PlanningCenterController {
  constructor(private readonly planningCenterService: PlanningCenterService) {}

  @Get('people')
  getPeople() {
    return this.planningCenterService.getPeople();
  }

  @Get('groups')
  getGroups() {
    return this.planningCenterService.getGroups();
  }
}
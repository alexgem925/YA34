import { Controller, Get, Param } from '@nestjs/common';
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

  @Get('tag-groups')
    getTagGroups() {
        return this.planningCenterService.getTagGroups();
    }
@Get('connect-group-tags')
getConnectGroupTags() {
  return this.planningCenterService.getConnectGroupTags();
}

@Get('members')
getYA34Members() {
  return this.planningCenterService.getYA34Members();
}

@Get('person/:id')
getPersonDetails(@Param('id') id: string) {
  return this.planningCenterService.getPersonDetails(id);
}

@Get('upcoming-plans')
getUpcomingServicePlans() {
  return this.planningCenterService.getUpcomingServicePlans();
}

@Get('plan/:serviceTypeId/:planId/team-members')
getPlanTeamMembers(
  @Param('serviceTypeId') serviceTypeId: string,
  @Param('planId') planId: string,
) {
  return this.planningCenterService.getPlanTeamMembers(planId, serviceTypeId);
}

@Get('members-with-service')
getMembersWithServiceStatus() {
  return this.planningCenterService.getMembersWithServiceStatus();
}

@Get('plan-times')
getPlanTimes() {
  return this.planningCenterService.getPlanTimes();
}

@Get('sunday-plans')
getSundayPlans() {
  return this.planningCenterService.getSundayPlans();
}

@Get('upcoming-events')
getUpcomingEvents() {
  return this.planningCenterService.getUpcomingEvents();
}
}
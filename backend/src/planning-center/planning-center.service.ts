import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PlanningCenterService {
  private readonly baseUrl = 'https://api.planningcenteronline.com';
  private readonly appId = process.env.PLANNING_CENTER_APP_ID;
  private readonly secret = process.env.PLANNING_CENTER_SECRET;

  constructor(private readonly httpService: HttpService) {}

  private getAuthHeader() {
    const token = Buffer.from(`${this.appId}:${this.secret}`).toString('base64');
    return {
      Authorization: `Basic ${token}`,
      'User-Agent': 'YA34 App (ya34@church.com)',
    };
  }

  async getPeople() {
    const response = await firstValueFrom(
      this.httpService.get(`${this.baseUrl}/people/v2/people`, {
        headers: this.getAuthHeader(),
      }),
    );
    return response.data;
  }

  async getGroups() {
    const response = await firstValueFrom(
      this.httpService.get(`${this.baseUrl}/groups/v2/groups`, {
        headers: this.getAuthHeader(),
      }),
    );
    return response.data;
  }

  async getTagGroups() {
  const response = await firstValueFrom(
    this.httpService.get(`${this.baseUrl}/services/v2/tag_groups`, {
      headers: this.getAuthHeader(),
    }),
  );
  return response.data;
}

async getConnectGroupTags() {
  const response = await firstValueFrom(
    this.httpService.get(`${this.baseUrl}/services/v2/tag_groups/2904352/tags`, {
      headers: this.getAuthHeader(),
    }),
  );
  return response.data;
}
async getYA34Members() {
  // Step 1: Get all YA3/YA4 tagged members from Services
  const servicesResponse = await firstValueFrom(
    this.httpService.get(
      `${this.baseUrl}/services/v2/people?where[tag_ids][]=13786588&where[tag_ids][]=13786589&per_page=100`,
      { headers: this.getAuthHeader() },
    ),
  );

  const servicesPeople = servicesResponse.data.data;

  // Step 2: For each person, fetch their full People API profile
  const enrichedPeople = await Promise.all(
    servicesPeople.map(async (person: any) => {
      try {
        const peopleResponse = await firstValueFrom(
          this.httpService.get(
            `${this.baseUrl}/people/v2/people/${person.id}?include=emails,phone_numbers`,
            { headers: this.getAuthHeader() },
          ),
        );

        const profile = peopleResponse.data.data;
        const included = peopleResponse.data.included || [];

        const email = included.find((i: any) => i.type === 'Email')?.attributes?.address || null;
        const phone = included.find((i: any) => i.type === 'PhoneNumber')?.attributes?.national || null;

        return {
          id: person.id,
          name: profile.attributes.name,
          firstName: profile.attributes.first_name,
          lastName: profile.attributes.last_name,
          avatar: profile.attributes.avatar,
          status: profile.attributes.status,
          email,
          phone,
        };
      } catch {
        return {
          id: person.id,
          name: person.attributes.full_name,
          firstName: person.attributes.first_name,
          lastName: person.attributes.last_name,
          avatar: person.attributes.photo_thumbnail_url,
          status: person.attributes.status,
          email: null,
          phone: null,
        };
      }
    }),
  );

  return enrichedPeople;
}

async getPersonDetails(personId: string) {
  const response = await firstValueFrom(
    this.httpService.get(
      `${this.baseUrl}/people/v2/people/${personId}?include=emails,phone_numbers,addresses`,
      {
        headers: this.getAuthHeader(),
      },
    ),
  );
  return response.data;
}

async getUpcomingServicePlans() {
  const serviceTypeIds = ['726211', '1793098']
  
  const plans = await Promise.all(
    serviceTypeIds.map(async (id) => {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.baseUrl}/services/v2/service_types/${id}/plans?filter=future&per_page=3&include=team_members`,
          { headers: this.getAuthHeader() },
        ),
      );
      return {
        serviceType: id === '726211' ? 'Sunday Service' : 'North Sunday Service',
        plans: response.data.data,
        included: response.data.included,
      };
    }),
  );

  return plans;
}

async getPlanTeamMembers(planId: string, serviceTypeId: string) {
  const response = await firstValueFrom(
    this.httpService.get(
      `${this.baseUrl}/services/v2/service_types/${serviceTypeId}/plans/${planId}/team_members`,
      { headers: this.getAuthHeader() },
    ),
  );
  return response.data;
}

async getMembersWithServiceStatus() {
  // Step 1: Get all YA3/YA4 members
  const membersResponse = await firstValueFrom(
    this.httpService.get(
      `${this.baseUrl}/services/v2/people?where[tag_ids][]=13786588&where[tag_ids][]=13786589&per_page=100`,
      { headers: this.getAuthHeader() },
    ),
  );
  const members = membersResponse.data.data;

  // Step 2: Get BOTH Sunday plan team members
  const [plan930Response, plan1130Response] = await Promise.all([
    firstValueFrom(
      this.httpService.get(
        `${this.baseUrl}/services/v2/service_types/726211/plans/88802622/team_members?per_page=100`,
        { headers: this.getAuthHeader() },
      ),
    ),
    firstValueFrom(
      this.httpService.get(
        `${this.baseUrl}/services/v2/service_types/726211/plans/88802662/team_members?per_page=100`,
        { headers: this.getAuthHeader() },
      ),
    ),
  ]);

  const teamMembers930 = plan930Response.data.data;
  const teamMembers1130 = plan1130Response.data.data;

  // Step 3: Cross-reference
  const enriched = await Promise.all(
    members.map(async (member: any) => {
      const serving930 = teamMembers930.filter(
        (tm: any) => tm.relationships.person.data.id === member.id,
      );
      const serving1130 = teamMembers1130.filter(
        (tm: any) => tm.relationships.person.data.id === member.id,
      );

      try {
        const profileResponse = await firstValueFrom(
          this.httpService.get(
            `${this.baseUrl}/people/v2/people/${member.id}?include=emails,phone_numbers`,
            { headers: this.getAuthHeader() },
          ),
        );
        const profile = profileResponse.data.data;
        const included = profileResponse.data.included || [];
        const email = included.find((i: any) => i.type === 'Email')?.attributes?.address || null;
        const phone = included.find((i: any) => i.type === 'PhoneNumber')?.attributes?.national || null;

        return {
          id: member.id,
          name: profile.attributes.name,
          avatar: profile.attributes.avatar,
          status: profile.attributes.status,
          email,
          phone,
          servingThisSunday: serving930.length > 0 || serving1130.length > 0,
          roles: [
            ...serving930.map((s: any) => ({
              position: s.attributes.team_position_name,
              service: '9:30am',
              status: s.attributes.status === 'C' ? 'Confirmed' :
                      s.attributes.status === 'D' ? 'Declined' : 'Unconfirmed',
            })),
            ...serving1130.map((s: any) => ({
              position: s.attributes.team_position_name,
              service: '11:30am',
              status: s.attributes.status === 'C' ? 'Confirmed' :
                      s.attributes.status === 'D' ? 'Declined' : 'Unconfirmed',
            })),
          ],
        };
      } catch {
        return {
          id: member.id,
          name: member.attributes.full_name,
          avatar: member.attributes.photo_thumbnail_url,
          status: member.attributes.status,
          email: null,
          phone: null,
          servingThisSunday: serving930.length > 0 || serving1130.length > 0,
          roles: [
            ...serving930.map((s: any) => ({
              position: s.attributes.team_position_name,
              service: '9:30am',
              status: s.attributes.status === 'C' ? 'Confirmed' :
                      s.attributes.status === 'D' ? 'Declined' : 'Unconfirmed',
            })),
            ...serving1130.map((s: any) => ({
              position: s.attributes.team_position_name,
              service: '11:30am',
              status: s.attributes.status === 'C' ? 'Confirmed' :
                      s.attributes.status === 'D' ? 'Declined' : 'Unconfirmed',
            })),
          ],
        };
      }
    }),
  );

  return enriched;
}

async getPlanTimes() {
  const response = await firstValueFrom(
    this.httpService.get(
      `${this.baseUrl}/services/v2/service_types/726211/plans/88802622/plan_times`,
      { headers: this.getAuthHeader() },
    ),
  );
  return response.data;
}

async getSundayPlans() {
  const response = await firstValueFrom(
    this.httpService.get(
      `${this.baseUrl}/services/v2/service_types/726211/plans?filter=future&per_page=20`,
      { headers: this.getAuthHeader() },
    ),
  );
  return response.data.data.map((p: any) => ({
    id: p.id,
    date: p.attributes.dates,
    title: p.attributes.title,
    peopleCount: p.attributes.plan_people_count,
  }));
}
async getUpcomingEvents() {
  const response = await firstValueFrom(
    this.httpService.get(
      `${this.baseUrl}/services/v2/service_types/726211/plans?filter=future&per_page=20`,
      { headers: this.getAuthHeader() },
    ),
  );

  const plans = response.data.data.map((p: any) => ({
    id: p.id,
    date: p.attributes.dates,
    shortDate: p.attributes.short_dates,
    sortDate: p.attributes.sort_date,
    title: p.attributes.title,
    peopleCount: p.attributes.plan_people_count,
  }));

  // Group by date
  const grouped: Record<string, any[]> = {};
  for (const plan of plans) {
    if (!grouped[plan.date]) grouped[plan.date] = [];
    grouped[plan.date].push(plan);
  }

  // Return as array sorted by date
  return Object.entries(grouped).map(([date, services]) => ({
    date,
    services: services.sort((a, b) => b.title.localeCompare(a.title)),
  })).slice(0, 4); // next 4 Sundays
}
}

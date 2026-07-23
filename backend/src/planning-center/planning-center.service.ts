import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PlanningCenterService {
  private readonly baseUrl = 'https://api.planningcenteronline.com';
  private readonly appId = process.env.PLANNING_CENTER_APP_ID;
  private readonly secret = process.env.PLANNING_CENTER_SECRET;

  // Tag IDs for YA3 and YA4 connect groups
  private readonly YA3_TAG_ID = '13786588';
  private readonly YA4_TAG_ID = '13786589';

  // Service type IDs
  private readonly SUNDAY_SERVICE_ID = '726211';
  private readonly NORTH_SUNDAY_SERVICE_ID = '1793098';

  // This Sunday's plan IDs (9:30am and 11:30am)
  // TODO: make dynamic by fetching the next upcoming plan
  private readonly PLAN_930_ID = '88802622';
  private readonly PLAN_1130_ID = '88802662';

  constructor(private readonly httpService: HttpService) {}

  private getAuthHeader() {
    const token = Buffer.from(`${this.appId}:${this.secret}`).toString('base64');
    return {
      Authorization: `Basic ${token}`,
      'User-Agent': 'YA34 App (ya34@church.com)',
    };
  }

  async getMembersWithServiceStatus() {
    // Step 1: Get all YA3/YA4 tagged members from Services
    const membersResponse = await firstValueFrom(
      this.httpService.get(
        `${this.baseUrl}/services/v2/people?where[tag_ids][]=${this.YA3_TAG_ID}&where[tag_ids][]=${this.YA4_TAG_ID}&per_page=100`,
        { headers: this.getAuthHeader() },
      ),
    );
    const members = membersResponse.data.data;

    // Step 2: Get team members for both Sunday services
    const [plan930Response, plan1130Response] = await Promise.all([
      firstValueFrom(
        this.httpService.get(
          `${this.baseUrl}/services/v2/service_types/${this.SUNDAY_SERVICE_ID}/plans/${this.PLAN_930_ID}/team_members?per_page=100`,
          { headers: this.getAuthHeader() },
        ),
      ),
      firstValueFrom(
        this.httpService.get(
          `${this.baseUrl}/services/v2/service_types/${this.SUNDAY_SERVICE_ID}/plans/${this.PLAN_1130_ID}/team_members?per_page=100`,
          { headers: this.getAuthHeader() },
        ),
      ),
    ]);

    const teamMembers930 = plan930Response.data.data;
    const teamMembers1130 = plan1130Response.data.data;
    // Fetch team names
    const teamsResponse = await firstValueFrom(
      this.httpService.get(
        `${this.baseUrl}/services/v2/service_types/${this.SUNDAY_SERVICE_ID}/teams`,
        { headers: this.getAuthHeader() },
      ),
    );
    const teamMap = new Map(
      teamsResponse.data.data.map((t: any) => [t.id, t.attributes.name])
    );
    // Step 3: Enrich each member with their People profile and service status
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
            servingThisSunday: serving930.some((s: any) => s.attributes.status !== 'D') || serving1130.some((s: any) => s.attributes.status !== 'D'),
            roles: [
              ...serving930.map((s: any) => ({
                position: s.attributes.team_position_name,
                department: teamMap.get(s.relationships.team.data.id) || 'Unknown',
                service: '9:30am',
                status: s.attributes.status === 'C' ? 'Confirmed' :
                        s.attributes.status === 'D' ? 'Declined' : 'Unconfirmed',
              })),
              ...serving1130.map((s: any) => ({
                position: s.attributes.team_position_name,
                department: teamMap.get(s.relationships.team.data.id) || 'Unknown',
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
            servingThisSunday: serving930.some((s: any) => s.attributes.status !== 'D') || serving1130.some((s: any) => s.attributes.status !== 'D'),
            roles: [
              ...serving930.map((s: any) => ({
                position: s.attributes.team_position_name,
                department: teamMap.get(s.relationships.team.data.id) || 'Unknown',
                service: '9:30am',
                status: s.attributes.status === 'C' ? 'Confirmed' :
                        s.attributes.status === 'D' ? 'Declined' : 'Unconfirmed',
              })),
              ...serving1130.map((s: any) => ({
                position: s.attributes.team_position_name,
                department: teamMap.get(s.relationships.team.data.id) || 'Unknown',
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

  async getUpcomingEvents() {
  // Get YA34 members first
  const membersResponse = await firstValueFrom(
    this.httpService.get(
      `${this.baseUrl}/services/v2/people?where[tag_ids][]=${this.YA3_TAG_ID}&where[tag_ids][]=${this.YA4_TAG_ID}&per_page=100`,
      { headers: this.getAuthHeader() },
    ),
  );
  const ya34MemberIds = new Set(membersResponse.data.data.map((m: any) => m.id));

  const [mainResponse, northResponse] = await Promise.all([
    firstValueFrom(
      this.httpService.get(
        `${this.baseUrl}/services/v2/service_types/${this.SUNDAY_SERVICE_ID}/plans?filter=future&per_page=20`,
        { headers: this.getAuthHeader() },
      ),
    ),
    firstValueFrom(
      this.httpService.get(
        `${this.baseUrl}/services/v2/service_types/${this.NORTH_SUNDAY_SERVICE_ID}/plans?filter=future&per_page=20`,
        { headers: this.getAuthHeader() },
      ),
    ),
  ]);

  // For each plan, fetch team members and count YA34 members
  const processPlan = async (p: any, serviceType: string) => {
  const serviceTypeId = serviceType === 'Sunday Service' ? this.SUNDAY_SERVICE_ID : this.NORTH_SUNDAY_SERVICE_ID;
  try {
    const teamResponse = await firstValueFrom(
      this.httpService.get(
        `${this.baseUrl}/services/v2/service_types/${serviceTypeId}/plans/${p.id}/team_members?per_page=100`,
        { headers: this.getAuthHeader() },
      ),
    );
    const ya34Members = teamResponse.data.data.filter(
      (tm: any) => ya34MemberIds.has(tm.relationships.person.data.id),
    );
    return {
      id: p.id,
      date: p.attributes.dates,
      sortDate: p.attributes.sort_date,
      title: p.attributes.title,
      serviceType,
      peopleCount: ya34Members.length,
      members: ya34Members.map((tm: any) => ({
        name: tm.attributes.name,
        position: tm.attributes.team_position_name,
        status: tm.attributes.status === 'C' ? 'Confirmed' :
                tm.attributes.status === 'D' ? 'Declined' : 'Unconfirmed',
        photo: tm.attributes.photo_thumbnail,
      })),
    };
  } catch {
    return {
      id: p.id,
      date: p.attributes.dates,
      sortDate: p.attributes.sort_date,
      title: p.attributes.title,
      serviceType,
      peopleCount: 0,
      members: [],
    };
  }
};

  const allPlans = await Promise.all([
    ...mainResponse.data.data.map((p: any) => processPlan(p, 'Sunday Service')),
    ...northResponse.data.data.map((p: any) => processPlan(p, 'North Sunday Service')),
  ]);

  // Group by date
  const grouped: Record<string, any[]> = {};
  for (const plan of allPlans) {
    if (!grouped[plan.date]) grouped[plan.date] = [];
    grouped[plan.date].push(plan);
  }

  return Object.entries(grouped)
    .sort(([, a], [, b]) => new Date(a[0].sortDate).getTime() - new Date(b[0].sortDate).getTime())
    .slice(0, 4)
    .map(([date, services]) => ({
      date,
      services: services.sort((a, b) => b.title.localeCompare(a.title)),
    }));
}

  async getPersonDetails(personId: string) {
    const response = await firstValueFrom(
      this.httpService.get(
        `${this.baseUrl}/people/v2/people/${personId}?include=emails,phone_numbers,addresses`,
        { headers: this.getAuthHeader() },
      ),
    );
    return response.data;
  }

  async getAllServicePlans() {
  const membersResponse = await firstValueFrom(
    this.httpService.get(
      `${this.baseUrl}/services/v2/people?where[tag_ids][]=${this.YA3_TAG_ID}&where[tag_ids][]=${this.YA4_TAG_ID}&per_page=100`,
      { headers: this.getAuthHeader() },
    ),
  );
  const ya34MemberIds = new Set(membersResponse.data.data.map((m: any) => m.id));

  const serviceTypes = [
    { id: this.SUNDAY_SERVICE_ID, name: 'Sunday Service' },
    { id: this.NORTH_SUNDAY_SERVICE_ID, name: 'North Sunday Service' },
    { id: '1781223', name: 'Discipleship' },
    { id: '1781224', name: 'Monday Leaders Discipleship' },
  ];

  const responses = await Promise.all(
    serviceTypes.map(async type => {
      const [futureRes, pastRes] = await Promise.all([
        firstValueFrom(
          this.httpService.get(
            `${this.baseUrl}/services/v2/service_types/${type.id}/plans?filter=future&per_page=25`,
            { headers: this.getAuthHeader() },
          ),
        ),
        firstValueFrom(
          this.httpService.get(
            `${this.baseUrl}/services/v2/service_types/${type.id}/plans?filter=past&per_page=100&order=-sort_date`,
            { headers: this.getAuthHeader() },
          ),
        ),
      ]);

      // Fetch team members only for future plans
      const futurePlans = await Promise.all(futureRes.data.data.map(async (p: any) => {
        try {
          const teamRes = await firstValueFrom(
            this.httpService.get(
              `${this.baseUrl}/services/v2/service_types/${type.id}/plans/${p.id}/team_members?per_page=100`,
              { headers: this.getAuthHeader() },
            ),
          );
          const ya34Members = teamRes.data.data.filter(
            (tm: any) => ya34MemberIds.has(tm.relationships.person.data.id),
          );
          return {
            id: p.id,
            date: p.attributes.sort_date,
            title: p.attributes.title || type.name,
            serviceType: type.name,
            members: ya34Members.map((tm: any) => ({
              name: tm.attributes.name,
              position: tm.attributes.team_position_name,
              status: tm.attributes.status === 'C' ? 'Confirmed' :
                      tm.attributes.status === 'D' ? 'Declined' : 'Unconfirmed',
              photo: tm.attributes.photo_thumbnail,
            })),
          };
        } catch {
          return {
            id: p.id,
            date: p.attributes.sort_date,
            title: p.attributes.title || type.name,
            serviceType: type.name,
            members: [],
          };
        }
      }));

      // Past plans — no team member fetch needed
      const pastPlans = pastRes.data.data.map((p: any) => ({
        id: p.id,
        date: p.attributes.sort_date,
        title: p.attributes.title || type.name,
        serviceType: type.name,
        members: [],
      }));

      return [...futurePlans, ...pastPlans];
    })
  );

  return responses.flat();
}
}
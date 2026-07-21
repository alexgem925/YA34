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
}

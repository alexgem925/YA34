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
  const response = await firstValueFrom(
    this.httpService.get(
      `${this.baseUrl}/services/v2/people?where[tag_ids][]=13786588&where[tag_ids][]=13786589`,
      {
        headers: this.getAuthHeader(),
      },
    ),
  );
  return response.data;
}
}

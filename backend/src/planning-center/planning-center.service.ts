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
}
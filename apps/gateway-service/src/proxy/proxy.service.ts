import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class ProxyService {
  private readonly identityServiceUrl: string;
  private readonly academicServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const identityHost = this.configService.get<string>('IDENTITY_SERVICE_HOST', 'localhost');
    const identityPort = this.configService.get<number>('IDENTITY_SERVICE_PORT', 3001);
    const academicHost = this.configService.get<string>('ACADEMIC_SERVICE_HOST', 'localhost');
    const academicPort = this.configService.get<number>('ACADEMIC_SERVICE_PORT', 3002);
    this.identityServiceUrl = `http://${identityHost}:${identityPort}`;
    this.academicServiceUrl = `http://${academicHost}:${academicPort}`;
  }

  async forwardToIdentity(req: Request, path: string) {
    return this.forward(this.identityServiceUrl, req, path);
  }

  async forwardToAcademic(req: Request, path: string) {
    return this.forward(this.academicServiceUrl, req, path);
  }

  private async forward(baseUrl: string, req: Request, path: string) {
    const url = `${baseUrl}/${path}`;
    const method = req.method.toLowerCase() as 'get' | 'post' | 'put' | 'patch' | 'delete';

    const headers: Record<string, string> = {};
    if (req.headers.authorization) {
      headers['Authorization'] = req.headers.authorization;
    }
    headers['Content-Type'] = 'application/json';

    try {
      const response = await firstValueFrom(
        this.httpService.request({
          method,
          url,
          data: req.body as Record<string, unknown>,
          headers,
          params: req.query as Record<string, string>,
        }),
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new HttpException(
          error.response.data as Record<string, unknown>,
          error.response.status,
        );
      }
      throw new HttpException(
        'Service unavailable',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}

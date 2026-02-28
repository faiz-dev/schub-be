import { Controller, All, Get, Req, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProxyService } from './proxy.service';
import { Request } from 'express';

@ApiTags('Gateway Proxy')
@Controller()
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) { }

  @Get('identity/docs-json')
  async proxyIdentityDocs(@Req() req: Request) {
    return this.proxyService.forwardToIdentity(req, 'docs-json');
  }

  @Get('academic/docs-json')
  async proxyAcademicDocs(@Req() req: Request) {
    return this.proxyService.forwardToAcademic(req, 'docs-json');
  }

  @All('auth/*path')
  async proxyAuth(@Req() req: Request, @Param('path') path: string) {
    return this.proxyService.forwardToIdentity(req, `auth/${path}`);
  }

  @All('users/*path')
  async proxyUsers(@Req() req: Request, @Param('path') path: string) {
    console.log('forward users requests')
    return this.proxyService.forwardToIdentity(req, `users/${path}`);
  }

  @All('users')
  async proxyUsersRoot(@Req() req: Request) {
    return this.proxyService.forwardToIdentity(req, 'users');
  }

  @All('academic-years/*path')
  async proxyAcademicYears(@Req() req: Request, @Param('path') path: string) {
    return this.proxyService.forwardToAcademic(req, `academic-years/${path}`);
  }

  @All('academic-years')
  async proxyAcademicYearsRoot(@Req() req: Request) {
    return this.proxyService.forwardToAcademic(req, 'academic-years');
  }

  @All('departments/*path')
  async proxyDepartments(@Req() req: Request, @Param('path') path: string) {
    return this.proxyService.forwardToAcademic(req, `departments/${path}`);
  }

  @All('departments')
  async proxyDepartmentsRoot(@Req() req: Request) {
    return this.proxyService.forwardToAcademic(req, 'departments');
  }

  @All('classes/*path')
  async proxyClasses(@Req() req: Request, @Param('path') path: string) {
    return this.proxyService.forwardToAcademic(req, `classes/${path}`);
  }

  @All('classes')
  async proxyClassesRoot(@Req() req: Request) {
    return this.proxyService.forwardToAcademic(req, 'classes');
  }

  @All('enrollments/*path')
  async proxyEnrollments(@Req() req: Request, @Param('path') path: string) {
    return this.proxyService.forwardToAcademic(req, `enrollments/${path}`);
  }

  @All('enrollments')
  async proxyEnrollmentsRoot(@Req() req: Request) {
    return this.proxyService.forwardToAcademic(req, 'enrollments');
  }

  @All('subjects/*path')
  async proxySubjects(@Req() req: Request, @Param('path') path: string) {
    return this.proxyService.forwardToAcademic(req, `subjects/${path}`);
  }

  @All('subjects')
  async proxySubjectsRoot(@Req() req: Request) {
    return this.proxyService.forwardToAcademic(req, 'subjects');
  }

  @All('teaching-assignments/*path')
  async proxyTeachingAssignments(@Req() req: Request, @Param('path') path: string) {
    return this.proxyService.forwardToAcademic(req, `teaching-assignments/${path}`);
  }

  @All('teaching-assignments')
  async proxyTeachingAssignmentsRoot(@Req() req: Request) {
    return this.proxyService.forwardToAcademic(req, 'teaching-assignments');
  }
}

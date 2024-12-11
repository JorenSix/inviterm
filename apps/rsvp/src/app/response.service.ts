import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Response, Prisma } from '@prisma/client';

@Injectable()
export class ResponseService {
  constructor(private prisma: PrismaService) {}


  async createResponse(data: Prisma.ResponseCreateInput): Promise<Response> {
    return this.prisma.response.create({
      data,
    });
  }

  async responses(): Promise<Response[]> {
    return this.prisma.response.findMany();
  }
  
  async deleteUser(where: Prisma.ResponseWhereUniqueInput): Promise<Response> {
    return this.prisma.response.delete({
      where,
    });
  }
}
import { Controller, Get, Post, Body } from '@nestjs/common';
import { ResponseService } from './response.service';
import { Response as ResponseModel } from '@prisma/client'

@Controller()
export class AppController {
  constructor(private readonly responseService: ResponseService) {
  }

  @Get('/list')
  async getResponses(): Promise<ResponseModel[]> {
    return this.responseService.responses();
  }

  @Post('/register')
  async register( 
    @Body() createResponse: { name: string; attend: boolean; message?: string },
  ): Promise<ResponseModel> {
    return this.responseService.createResponse(createResponse);
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { ResponseService } from './response.service';
import { PrismaService } from './prisma.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [PrismaService, ResponseService],
    }).compile();
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.getResponses()).toEqual({ message: 'Hello API' });
    });
  });
});

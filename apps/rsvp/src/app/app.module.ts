import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ResponseService } from './response.service';
import { PrismaService } from './prisma.service';


@Module({
  imports: [],
  controllers: [AppController],
  providers: [PrismaService, ResponseService],
})
export class AppModule {}

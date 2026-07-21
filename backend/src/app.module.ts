import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlanningCenterModule } from './planning-center/planning-center.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PlanningCenterModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
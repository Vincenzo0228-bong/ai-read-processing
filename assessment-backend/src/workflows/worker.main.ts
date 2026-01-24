import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { WorkflowProcessor } from './workflow.processor';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  // The processor will be registered and start processing jobs automatically
  // when the NestJS context is created.
  // No need to call anything else.
}

bootstrap();

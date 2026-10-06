import { NestFactory } from '@nestjs/core';
import { SeedModule } from './database/seeds/seed.module';
import { SeedService } from './database/seeds/seed.service';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(SeedModule);
  const seeder = appContext.get(SeedService);
  try {
    await seeder.seed();
    console.log('Seeding complete!');
  } catch (error) {
    console.error('Seeding failed', error);
  } finally {
    await appContext.close();
  }
}
bootstrap();

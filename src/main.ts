// 1. On force l'utilisation de l'IPv4 pour éviter l'erreur ENETUNREACH avec Supabase
import { setDefaultResultOrder } from 'dns';
setDefaultResultOrder('ipv4first');
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // CONFIGURATION CORS ROBUSTE
  app.enableCors({
    origin: true, // Autorise toutes les origines (Front Vercel, Localhost, Mobile...)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  
  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
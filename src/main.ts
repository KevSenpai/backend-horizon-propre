// 1. On force l'utilisation de l'IPv4 pour éviter l'erreur ENETUNREACH avec Supabase
import { setDefaultResultOrder } from 'dns';
setDefaultResultOrder('ipv4first');
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Active les requêtes venant d'ailleurs (CORS)
  app.enableCors(); 
  
  // ⚠️ MODIFICATION ICI : On ajoute '0.0.0.0' pour écouter sur le réseau Wi-Fi
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
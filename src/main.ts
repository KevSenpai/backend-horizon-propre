import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// Force IPv4 pour Supabase
import { setDefaultResultOrder } from 'dns';
setDefaultResultOrder('ipv4first');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Retire les champs qui ne sont pas dans le DTO (Sécurité)
    forbidNonWhitelisted: true, // Renvoie une erreur si on envoie des champs inconnus
    transform: true, // Convertit automatiquement les types
  }));
  // --- CONFIGURATION CORS "NUCLÉAIRE" ---
  // On autorise tout, sans credentials (cookies), c'est le plus sûr pour éviter les erreurs.
  app.enableCors({
    origin: '*', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  // ---------------------------------------

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  
  console.log(`🚀 Application is running on: ${await app.getUrl()}`);
}
bootstrap();
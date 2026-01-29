import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // <--- IMPORT CRUCIAL
import { setDefaultResultOrder } from 'dns';

setDefaultResultOrder('ipv4first');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validation Globale
  // ...
  // ...
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Garde les champs déclarés
    forbidNonWhitelisted: false, // <--- IMPORTANT : Ne pas planter si un champ inconnu est envoyé
    transform: true, // Convertir les types (string -> number, etc.)
    transformOptions: {
      enableImplicitConversion: true, // <--- IMPORTANT : Aider à la conversion
    },
    disableErrorMessages: false, // On veut voir les erreurs
  }));
// ...

  // CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
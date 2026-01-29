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
    whitelist: true, // Garde les champs déclarés dans le DTO...
    forbidNonWhitelisted: false, // <--- METTRE A FALSE (C'est la clé !)
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
    // Ajoutons ceci pour voir les erreurs de validation dans la réponse HTTP si ça plante encore
    exceptionFactory: (errors) => {
        console.error("Validation Errors:", errors);
        return new Error("Validation failed"); // ou laissez le défaut
    }
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
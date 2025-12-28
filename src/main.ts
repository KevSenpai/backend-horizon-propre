import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// Correction IPv6 pour Supabase (on garde ça)
import { setDefaultResultOrder } from 'dns';
setDefaultResultOrder('ipv4first');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // --- CONFIGURATION CORS "OPEN BAR" ---
  app.enableCors({
    origin: '*', // Autorise toutes les origines (Vercel, Localhost, Mobile, etc.)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });
  // -------------------------------------
  
  // Écoute sur le port défini par Render ou 3000 par défaut
  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
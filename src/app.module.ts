import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TeamsModule } from './teams/teams.module'; // Import du module
import { VehiclesModule } from './vehicles/vehicles.module';
import { ClientsModule } from './clients/clients.module';
import { ToursModule } from './tours/tours.module';
import { TourClientsModule } from './tour-clients/tour-clients.module';
import { TrackingModule } from './tracking/tracking.module';
import { CollectionsModule } from './collections/collections.module';
import { InvoicesModule } from './invoices/invoices.module';
import { PaymentsModule } from './payments/payments.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
@Module({
  imports: [
    
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true, // <--- La méthode magique
        synchronize: configService.get<boolean>('DB_SYNC'),
      }),
      inject: [ConfigService],
    }),
    TeamsModule,
    VehiclesModule,
    ClientsModule,
    ToursModule,
    TourClientsModule, 
    TrackingModule, CollectionsModule, InvoicesModule, PaymentsModule, AuthModule, UsersModule,// <--- Le module est bien là
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
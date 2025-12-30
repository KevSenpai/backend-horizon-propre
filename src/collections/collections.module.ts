import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionsService } from './collections.service';
import { CollectionsController } from './collections.controller';
import { Collection } from './entities/collection.entity';

@Module({
  // C'est cette ligne qui manquait pour que le Service puisse accéder à la Base de données :
  imports: [TypeOrmModule.forFeature([Collection])], 
  controllers: [CollectionsController],
  providers: [CollectionsService],
})
export class CollectionsModule {}
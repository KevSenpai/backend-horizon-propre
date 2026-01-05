import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // <--- Import nécessaire
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity'; // <--- Import de l'entité

@Module({
  // 1. ON ENREGISTRE L'ENTITÉ USER ICI
  imports: [TypeOrmModule.forFeature([User])], 
  
  controllers: [UsersController],
  providers: [UsersService],
  
  // 2. ON EXPORTE LE SERVICE (Important pour que AuthModule puisse l'utiliser)
  exports: [UsersService], 
})
export class UsersModule {}
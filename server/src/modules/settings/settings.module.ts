import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { SettingsRepository } from './settings.repository';
import { SystemSettings } from './entities/system-settings.model';
import { AccessControlModule } from '../ac/ac.module';

@Module({
    imports: [TypeOrmModule.forFeature([SystemSettings]), AccessControlModule],
    controllers: [SettingsController],
    providers: [SettingsService, SettingsRepository],
    exports: [SettingsService, SettingsRepository],
})
export class SettingsModule {}

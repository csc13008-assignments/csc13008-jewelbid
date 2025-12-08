import {
    Injectable,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { SettingsRepository } from './settings.repository';
import { SystemSettings } from './entities/system-settings.model';
import { CreateSettingDto, UpdateSettingDto } from './dtos/settings.dto';

// Default settings for auto-renewal
export const DEFAULT_AUTO_RENEWAL_TRIGGER_MINUTES = 5;
export const DEFAULT_AUTO_RENEWAL_EXTENSION_MINUTES = 10;

@Injectable()
export class SettingsService {
    constructor(private readonly settingsRepository: SettingsRepository) {}

    async findAll(): Promise<SystemSettings[]> {
        return await this.settingsRepository.find({
            order: { key: 'ASC' },
        });
    }

    async findByKey(key: string): Promise<SystemSettings> {
        const setting = await this.settingsRepository.findByKey(key);
        if (!setting) {
            throw new NotFoundException(`Setting with key '${key}' not found`);
        }
        return setting;
    }

    async create(dto: CreateSettingDto): Promise<SystemSettings> {
        const existing = await this.settingsRepository.findByKey(dto.key);
        if (existing) {
            throw new ConflictException(
                `Setting with key '${dto.key}' already exists`,
            );
        }

        const setting = this.settingsRepository.create(dto);
        return await this.settingsRepository.save(setting);
    }

    async update(key: string, dto: UpdateSettingDto): Promise<SystemSettings> {
        const setting = await this.findByKey(key);
        Object.assign(setting, dto);
        return await this.settingsRepository.save(setting);
    }

    async delete(key: string): Promise<void> {
        const setting = await this.findByKey(key);
        await this.settingsRepository.remove(setting);
    }

    // Helper methods for auto-renewal settings
    async getAutoRenewalTriggerMinutes(): Promise<number> {
        return await this.settingsRepository.getNumberValue(
            'auto_renewal_trigger_minutes',
            DEFAULT_AUTO_RENEWAL_TRIGGER_MINUTES,
        );
    }

    async getAutoRenewalExtensionMinutes(): Promise<number> {
        return await this.settingsRepository.getNumberValue(
            'auto_renewal_extension_minutes',
            DEFAULT_AUTO_RENEWAL_EXTENSION_MINUTES,
        );
    }
}

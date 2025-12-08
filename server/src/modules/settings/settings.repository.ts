import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { SystemSettings } from './entities/system-settings.model';

@Injectable()
export class SettingsRepository extends Repository<SystemSettings> {
    constructor(private dataSource: DataSource) {
        super(SystemSettings, dataSource.createEntityManager());
    }

    async findByKey(key: string): Promise<SystemSettings | null> {
        return this.findOne({ where: { key } });
    }

    async getValue(key: string, defaultValue?: string): Promise<string | null> {
        const setting = await this.findByKey(key);
        return setting ? setting.value : defaultValue || null;
    }

    async getNumberValue(key: string, defaultValue: number): Promise<number> {
        const value = await this.getValue(key);
        return value ? parseFloat(value) : defaultValue;
    }

    async getBooleanValue(
        key: string,
        defaultValue: boolean,
    ): Promise<boolean> {
        const value = await this.getValue(key);
        return value ? value === 'true' : defaultValue;
    }
}

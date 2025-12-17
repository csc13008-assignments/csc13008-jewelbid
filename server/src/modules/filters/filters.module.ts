import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FiltersController } from './filters.controller';
import { FiltersService } from './filters.service';
import { FiltersRepository } from './filters.repository';
import { FilterOption } from './entities/filter-option.model';

@Module({
    imports: [TypeOrmModule.forFeature([FilterOption])],
    controllers: [FiltersController],
    providers: [FiltersService, FiltersRepository],
    exports: [FiltersService, FiltersRepository],
})
export class FiltersModule {}

import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Role } from '../../auth/enums/roles.enum';

export class UpdateRoleDto {
    @ApiProperty({
        description: 'New role for the user',
        enum: Role,
        example: Role.SELLER,
    })
    @IsEnum(Role)
    role: Role;
}

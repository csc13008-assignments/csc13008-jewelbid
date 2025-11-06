import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UserRepository {
    private readonly logger = new Logger(UserRepository.name);
    private readonly userServiceUrl: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        this.userServiceUrl =
            this.configService.get<string>('USER_SERVICE_URL');
    }

    async createUser(createUserDto: CreateUserDto): Promise<any> {
        try {
            this.logger.log(
                `Creating user in user-service: ${createUserDto.id}`,
            );

            const response = await firstValueFrom(
                this.httpService.post(
                    `${this.userServiceUrl}/api/v1/users`,
                    createUserDto,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        timeout: 10000, // 10 seconds timeout
                    },
                ),
            );

            this.logger.log(
                `User created successfully in user-service: ${createUserDto.id}`,
            );
            return response.data;
        } catch (error) {
            this.logger.error(
                `Failed to create user in user-service: ${createUserDto.id}`,
                error,
            );

            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                const status = error.response.status;
                const message =
                    error.response.data?.message ||
                    'Failed to create user in user-service';

                throw new HttpException(
                    {
                        message,
                        error: 'User Service Error',
                        statusCode: status,
                        userServiceResponse: error.response.data,
                    },
                    status,
                );
            } else if (error.request) {
                // The request was made but no response was received
                this.logger.error(
                    'No response received from user-service',
                    error.request,
                );
                throw new HttpException(
                    {
                        message: 'User service is not responding',
                        error: 'Service Unavailable',
                        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
                    },
                    HttpStatus.SERVICE_UNAVAILABLE,
                );
            } else {
                // Something happened in setting up the request that triggered an Error
                this.logger.error(
                    'Error setting up request to user-service',
                    error.message,
                );
                throw new HttpException(
                    {
                        message:
                            'Internal server error while communicating with user-service',
                        error: 'Internal Server Error',
                        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    },
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
        }
    }

    async getUserById(id: string): Promise<any> {
        try {
            this.logger.log(`Getting user from user-service: ${id}`);

            const response = await firstValueFrom(
                this.httpService.get(
                    `${this.userServiceUrl}/api/v1/users/${id}`,
                    {
                        timeout: 5000, // 5 seconds timeout
                    },
                ),
            );

            return response.data;
        } catch (error) {
            this.logger.error(
                `Failed to get user from user-service: ${id}`,
                error,
            );

            if (error.response?.status === 404) {
                return null; // User not found
            }

            throw new HttpException(
                {
                    message: 'Failed to retrieve user from user-service',
                    error: 'User Service Error',
                    statusCode:
                        error.response?.status ||
                        HttpStatus.INTERNAL_SERVER_ERROR,
                },
                error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async updateUser(
        id: string,
        updateData: Partial<CreateUserDto>,
    ): Promise<any> {
        try {
            this.logger.log(`Updating user in user-service: ${id}`);

            const response = await firstValueFrom(
                this.httpService.put(
                    `${this.userServiceUrl}/api/v1/users/${id}`,
                    updateData,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        timeout: 10000, // 10 seconds timeout
                    },
                ),
            );

            this.logger.log(`User updated successfully in user-service: ${id}`);
            return response.data;
        } catch (error) {
            this.logger.error(
                `Failed to update user in user-service: ${id}`,
                error,
            );

            throw new HttpException(
                {
                    message: 'Failed to update user in user-service',
                    error: 'User Service Error',
                    statusCode:
                        error.response?.status ||
                        HttpStatus.INTERNAL_SERVER_ERROR,
                },
                error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async deleteUser(id: string): Promise<void> {
        try {
            this.logger.log(`Deleting user from user-service: ${id}`);

            await firstValueFrom(
                this.httpService.delete(
                    `${this.userServiceUrl}/api/v1/users/${id}`,
                    {
                        timeout: 10000, // 10 seconds timeout
                    },
                ),
            );

            this.logger.log(
                `User deleted successfully from user-service: ${id}`,
            );
        } catch (error) {
            this.logger.error(
                `Failed to delete user from user-service: ${id}`,
                error,
            );

            throw new HttpException(
                {
                    message: 'Failed to delete user from user-service',
                    error: 'User Service Error',
                    statusCode:
                        error.response?.status ||
                        HttpStatus.INTERNAL_SERVER_ERROR,
                },
                error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}

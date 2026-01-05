import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: '*',
    });

    // Increase body parser limit for large requests (e.g., base64 images)
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

    // Global validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
        }),
    );

    app.useGlobalInterceptors(
        new ClassSerializerInterceptor(app.get(Reflector)),
    );

    // Swagger configuration
    const config = new DocumentBuilder()
        .setTitle('Jewelbid Server')
        .setDescription('Server API for Jewelbid application')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
    console.log(
        `Swagger documentation available at: http://localhost:${port}/docs`,
    );
}
void bootstrap();

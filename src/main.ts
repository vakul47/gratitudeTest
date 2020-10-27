import './bootstrap';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import {
    NestExpressApplication,
    ExpressAdapter,
} from '@nestjs/platform-express';
import compression from 'compression';
import helmet from 'helmet';
import {
    initializeTransactionalContext,
    patchTypeORMRepositoryWithBaseRepository,
} from 'typeorm-transactional-cls-hooked';
import { AppModule } from '@app/app.module';
import { setupSwagger } from '@app/swagger';
import { exceptionFactory } from '@app/exceptionFactory';
import { ConfigService } from "@nestjs/config";
import morgan from 'morgan';

async function bootstrap() {
    initializeTransactionalContext();
    patchTypeORMRepositoryWithBaseRepository();
    const app = await NestFactory.create<NestExpressApplication>(
      AppModule,
      new ExpressAdapter(),
    {
        cors: true,
      },
    );
    app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)

    app.use(helmet());
    app.use(compression());
    app.use(morgan('combined'));

    const reflector = app.get(Reflector);

    app.useGlobalFilters();
    app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
    app.useGlobalPipes(
      new ValidationPipe({
        exceptionFactory: exceptionFactory,
        whitelist: true,
        transform: true,
        validationError: {
            target: false,
        },
      }),
    );

    const configService: ConfigService = app.select(AppModule).get(ConfigService);

    app.setGlobalPrefix('api');

    if (['development', 'staging'].includes(configService.get<string>('NODE_ENV', 'development'))) {
      setupSwagger(app);
    }

    const port = configService.get<number>('PORT', 3000);
    await app.listen(port);

    console.info(`server running on port ${port}`);
}

bootstrap();

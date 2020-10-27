import {
    initializeTransactionalContext,
    patchTypeORMRepositoryWithBaseRepository,
} from 'typeorm-transactional-cls-hooked';
import {
    ClassSerializerInterceptor,
    INestApplication,
    ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { exceptionFactory } from "@app/exceptionFactory";

export async function configApp(app: INestApplication) {
    initializeTransactionalContext();
    patchTypeORMRepositoryWithBaseRepository();

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

    return app;
}

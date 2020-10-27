import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { contextMiddleware } from '@app/common/middlewares';
import { ConfigModule, ConfigService } from "@nestjs/config";
import mainConfig from '@app/config/main.config'
import typeormConfig from '@app/config/typeorm.config'
import { ApiVersionMiddleware } from "@app/common/middlewares/apiVersion.middleware";
import { GratitudeModule } from '@app/modules/gratitude/gratitude.module';


@Module({
    imports: [
        GratitudeModule,
        ConfigModule.forRoot({
            isGlobal: true,
            load: [mainConfig, typeormConfig]
        }),
        TypeOrmModule.forRootAsync({
            useFactory: (configService: ConfigService) => configService.get('typeormConfig', {}),
            inject: [ConfigService],
        })
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
        consumer.apply(contextMiddleware).forRoutes('*');
        consumer.apply(ApiVersionMiddleware).forRoutes('*');
    }
}

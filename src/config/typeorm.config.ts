import { SnakeNamingStrategy } from '../snakeNaming.strategy';
import { registerAs } from "@nestjs/config";

const config = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT ? +process.env.POSTGRES_PORT : 3000,
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    ssl: process.env.POSTGRES_SSL === 'true' ? {rejectUnauthorized: false} : false,
    namingStrategy: new SnakeNamingStrategy(),
    entities: [__dirname + '/../modules/**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    cli: {
        migrationsDir: 'src/migrations'
    },
    migrationsRun: true,
    dropSchema: process.env.NODE_ENV === 'test',
    logging: process.env.POSTGRES_QUERY_LOGGING === 'true'
};

export default registerAs('typeormConfig',() => ( config ));

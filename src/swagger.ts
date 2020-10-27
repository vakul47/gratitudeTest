import fs from 'fs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { OpenAPIObject } from '@nestjs/swagger/dist/interfaces';
import { version } from '@app/apiVersion.json'


function saveAPIDocumentationToJson(document: OpenAPIObject) {
    fs.writeFileSync('swagger.json', JSON.stringify(document, undefined, 2));
}

export function setupSwagger(app: INestApplication) {
    const options = new DocumentBuilder()
        .setTitle('TEST API')
        .setDescription('TEST API Documentation')
        .setVersion(version)
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api/doc', app, document);
    saveAPIDocumentationToJson(document);
}

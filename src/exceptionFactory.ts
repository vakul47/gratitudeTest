import _ from 'lodash';
import {
  HttpStatus,
  UnprocessableEntityException,
  ValidationError,
} from '@nestjs/common';

function errorMapper(error: ValidationError, path?: string): any {
  const dataPath = [path || '', error.property].join('.');

  const dataMessage = Object.values(error.constraints || {}).shift();

  if (error.children.length !== 0) {
    return _.flatMap(error.children, children =>
      errorMapper(children, dataPath),
    );
  }

  return {
    dataPath: dataPath,
    message: dataMessage,
  };
}

export function exceptionFactory(errors: ValidationError[]) {
  const details = _.flatMap(errors, error => errorMapper(error, '.body'));

  return new UnprocessableEntityException({
    message: 'Validation error',
    statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    details: details,
  });
}

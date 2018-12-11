import { UnprocessableEntityException } from '@nestjs/common';

interface BadInputData {
  field: string;
  message: string;
  input?: any;
}

export class BadDataException extends UnprocessableEntityException {

  constructor(data: BadInputData) {
    super(data);
  }

}
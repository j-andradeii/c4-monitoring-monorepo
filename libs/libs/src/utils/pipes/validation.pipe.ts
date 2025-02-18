import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value; // If no metatype (class type), skip validation
    }

    const object = plainToInstance(metatype, value); // Convert the plain object to a class instance
    const errors = await validate(object); // Validate the object
    
    if (errors.length > 0) {
      const messages = this.formatErrors(errors);
      throw new BadRequestException(`Validation failed: ${messages}`);
    }

    return value;
  }

  // Format validation errors, including nested object errors
  private formatErrors(errors: ValidationError[]): string {
    return errors
      .map(err => {
        if (err.children && err.children.length > 0) {
          // Recursively format errors for nested objects
          return `${err.property}: { ${this.formatErrors(err.children)} }`;
        }
        return Object.values(err.constraints || {}).join(', '); // Join all constraints for a field
      })
      .join(', ');
  }

  // Check if the object has a type that should be validated
  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype); // Skip validation for built-in types
  }
}
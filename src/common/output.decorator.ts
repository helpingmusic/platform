/**
 * Cast a response to the given viewmodel
 *  This will remove unnecessary properties
 */
import { plainToClass } from 'class-transformer';

export const Output = (vm) => {
  return (target: object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
    const handler = descriptor.value;

    descriptor.value = async function(...args: any[]) {
      let result = await Promise.resolve(handler.apply(this, args));

      let ViewModel = vm;

      if (Array.isArray(vm)) {

        if (result.length === 0) return [];

        ViewModel = vm[0];

        if (result[0] && result[0].toObject) {
          result = result.map(r => r.toObject());
        }

      } else if (result && result.toObject) {
        result = result.toObject();
      }

      return plainToClass(ViewModel, result, { strategy: 'excludeAll' });
    };

    return descriptor;
  };
};

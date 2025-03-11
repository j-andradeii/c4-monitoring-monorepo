import {lastValueFrom, Observable} from 'rxjs';

/* eslint-disable valid-jsdoc */
/**
 * Converts an observable to promise, the implementation is straightforward - just member 'toPromise' invoked.
 *
 * The motivation to move that in the separate free function is to encapsulate the conversion and move it into single
 * place.
 *
 * Worth mentioning: at the time of writing, the observable 'toPromise' method is going to be deprecated in the rxjs v7.
 *
 * @param source the observable to convert to a promise
 */
export function toPromise<T>(source: Observable<T>): Promise<T> {
  return lastValueFrom(source);
}
/* eslint-enable valid-jsdoc */

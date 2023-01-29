import {get, isUndefined} from 'lodash';
import {EqualDesc} from './EqualDesc';
import {ILookupFn} from '../../walker/lookup/ILookupFn';
import {Value} from '../../ast/Value';

// TODO lookup interface

export class EqualDescLookup implements ILookupFn {


  lookup(ast: EqualDesc, source: any): (target: any) => boolean {
    const key = ast.getKeyString();
    const value = ast.getValue();
    let v: any = null;
    if (value instanceof Value) {
      v = value.getValue();
    } else {
      const ref = value.getValue();
      if (!isUndefined(source)) {
        v = get(source, ref);
      } else {
        return function (target: any, source?: any) {
          if (isUndefined(source)) {
            throw new Error('Need second argument for getting referenced value to compare.');
          }
          return target[key] && target[key] === get(source, ref);
        };
      }
    }
    // const value = this.value instanceof KeyDesc ? source[this.value.key] : _.clone((<ValueDesc>this.value).value);
    return function (target: any) {
      return target[key] && target[key] === v;
    };
  };


}


import {PValue} from './PValue';

export class ValueRef extends PValue {
  toJson(): any {
    return '$' + this.value;
  }

}

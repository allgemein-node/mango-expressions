import * as _ from 'lodash';
import {AbstractOperator} from '../AbstractOperator';
import {PAst} from '../../ast/PAst';
import {Context} from '../../ast/Context';

export class First extends AbstractOperator {

  static NAME = 'first';

  name = First.NAME;

  value: PAst;

  validate(def: any): boolean {
    if (_.isString(def)) {
      this.value = this.base.interprete(def, this, new Context(this.key));
      return true;
    }
    return false;
  }

}

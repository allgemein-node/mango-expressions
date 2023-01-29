import * as _ from 'lodash';
import {AbstractOperator} from '../AbstractOperator';
import {Context} from '../../ast/Context';

export class ToInt extends AbstractOperator<any> {

  static NAME = 'toInt';

  name = ToInt.NAME;

  validate(def: any): boolean {
    if (_.isString(def)) {
      this.value = this.getRootExpression().interprete(def, this, new Context(this.getKeyString()));
      return true;
    }
    return false;
  }

}

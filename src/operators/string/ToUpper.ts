import * as _ from 'lodash';
import {AbstractOperator} from '../AbstractOperator';
import {PAst} from '../../ast/PAst';
import {Context} from '../../ast/Context';

export class ToUpper extends AbstractOperator<PAst<any>> {
  static NAME = 'toUpper';

  name = ToUpper.NAME;

  validate(def: any): boolean {
    if (_.isString(def)) {
      this.value = this.getRootExpression().interprete(def, this, new Context(this.getKeyString()));
      return true;
    }
    return false;
  }

}

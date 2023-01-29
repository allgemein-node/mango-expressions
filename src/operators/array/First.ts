import * as _ from 'lodash';
import {AbstractOperator} from '../AbstractOperator';
import {PAst} from '../../ast/PAst';
import {Context} from '../../ast/Context';

export class First extends AbstractOperator<PAst<any>> {

  static NAME = 'first';

  name = First.NAME;

  validate(def: any): boolean {
    if (_.isString(def)) {
      this.setValue(this.getRootExpression().interprete(def, this, new Context(this.getKeyString())));
      return true;
    }
    return false;
  }

}

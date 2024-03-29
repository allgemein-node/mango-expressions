import * as _ from 'lodash';
import {AbstractOperator} from '../AbstractOperator';
import {PAst} from '../../ast/PAst';
import {Context} from '../../ast/Context';

export class Substr extends AbstractOperator<PAst<any>> {

  static NAME = 'substr';

  name = Substr.NAME;

  args: any[] = [];


  validate(def: any): boolean {
    if (_.isArray(def) && def.length > 0 && def.length <= 3) {

      const v = def.shift();
      if (_.isString(v)) {
        this.value = this.getRootExpression().interprete(v, this, new Context(this.getKeyString()));
      }

      if (!this.value) {
        return false;
      }

      this.args = def;
      return true;
    }
    return false;
  }

}

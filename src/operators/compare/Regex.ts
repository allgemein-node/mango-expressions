import * as _ from 'lodash';
import {PAst} from '../../ast/PAst';
import {AbstractCompare} from './AbstractCompare';
import {IMangoWalker} from '../../IMangoWalker';
import {MultiArgs} from '../../ast/MultiArgs';

export class Regex extends AbstractCompare<PAst<any>> {

  static NAME = 'regex';

  name = Regex.NAME;

  regexp: string;

  options: string;

  validate(def: any, full?: any): boolean {
    if (_.isString(def)) {
      this.op = 'regexp';
      this.regexp = def;
      if (_.has(full, '$options')) {
        this.options = full['$options'];
      }
      return true;
    } else if (def instanceof RegExp) {
      this.regexp = def.source;
      this.options = def.flags;
      return true;
    }
    return false;
  }


  visit(o: IMangoWalker): any {
    if (this.regexp) {
      if (this.options) {
        return o.onOperator(this, new MultiArgs(this.regexp, this.options));
      }
      return o.onOperator(this,  new MultiArgs(this.regexp));
    }
    return o.onOperator(this, null);
  }


}

import {AbstractOperator} from '../AbstractOperator';
import {Context, IMangoWalker, MultiArgs, PAst} from '../..';
import * as _ from 'lodash';

/**
 *
 *
 * {
 *   $dateToString: {
 *     date: $fieldName,
 *     format: 'Y-m-d',
 *     // timezone?:
 *     // onNull?
 *   }
 * }
 */
export class DateToString extends AbstractOperator<any> {

  static NAME = 'dateToString';

  name = DateToString.NAME;

  format: string;

  timezone: string;

  onNull: string;


  validate(def: any, full?: any): boolean {
    if (_.has(def, 'date')) {
      const ctxt = new Context(this.getKeyString());
      this.value = this.getRootExpression().interprete(def['date'], this, ctxt);
      this.format = _.get(def, 'format', null);
      this.timezone = _.get(def, 'timezone', null);
      this.onNull = _.get(def, 'onNull', null);
      return true;
    }
    return false;
  }


  visit(o: IMangoWalker): any {
    if (this.value) {
      return o.onOperator(this,
        new MultiArgs(
          o.onValue(this.value),
          this.format,
          this.timezone,
          this.onNull
        )
      );
    }
    return o.onOperator(this, null);
  }


}

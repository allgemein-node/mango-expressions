import * as _ from 'lodash';
import {AbstractOperator} from '../AbstractOperator';
import {PAst} from '../../ast/PAst';
import {Context} from '../../ast/Context';

/**
 * @see https://docs.mongodb.com/manual/reference/operator/aggregation/map/#exp._S_map
 *
 * Example:
 * {  _id: 0,
 *    date: "$date",
 *    tempsStep1:
 *              { $map:
 *                 {
 *                   input: "$temps",
 *                   as: "tempInCelsius",
 *                   in: { $multiply: [ "$$tempInCelsius", 9/5 ] }
 *                }
 *             }
 * }
 */
export class Map extends AbstractOperator<null> {

  static NAME = 'map';

  name = Map.NAME;

  input: PAst<any>;

  as: string;

  in: PAst<any>;

  validate(def: any): boolean {
    if (_.isObjectLike(def) &&
      _.has(def, 'input') &&
      _.has(def, 'as') &&
      _.has(def, 'in')) {
      this.input = this.getRootExpression().interprete(def.input, this, new Context(this.getKeyString()));
      this.as = def.as;
      this.in = this.getRootExpression().interprete(def.in, this, new Context(this.getKeyString()));
      return true;
    }
    return false;
  }

}

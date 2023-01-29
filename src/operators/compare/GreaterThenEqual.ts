import {PValue} from '../../ast/PValue';
import {AbstractCompare} from './AbstractCompare';

export class GreaterThenEqual extends AbstractCompare<PValue> {

  static NAME = 'ge';

  name = GreaterThenEqual.NAME;

  op: string = '>=';


}

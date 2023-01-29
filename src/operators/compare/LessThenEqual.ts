import {PValue} from '../../ast/PValue';
import {AbstractCompare} from './AbstractCompare';

export class LessThenEqual extends AbstractCompare<PValue> {

  static NAME = 'le';

  name = LessThenEqual.NAME;

  op: string = '<=';

}

import {PValue} from '../../ast/PValue';
import {AbstractCompare} from './AbstractCompare';

export class LessThen extends AbstractCompare<PValue> {

  static NAME = 'lt';

  name = LessThen.NAME;

  op: string = '<';

}

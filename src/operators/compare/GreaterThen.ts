import {PValue} from '../../ast/PValue';
import {AbstractCompare} from './AbstractCompare';

export class GreaterThen extends AbstractCompare<PValue> {

  static NAME = 'gt';

  name = GreaterThen.NAME;

  op: string = '>';

}

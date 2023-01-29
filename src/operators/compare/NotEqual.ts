import {PValue} from '../../ast/PValue';
import {AbstractCompare} from './AbstractCompare';

export class NotEqual extends AbstractCompare<PValue> {

  static NAME = 'ne';

  name = NotEqual.NAME;

  op: string = '<>';


}

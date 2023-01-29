import {PValue} from '../../ast/PValue';
import {AbstractCompare} from './AbstractCompare';

export class In extends AbstractCompare<PValue> {

  static NAME = 'in';

  name = In.NAME;

  op: string = 'IN';

}

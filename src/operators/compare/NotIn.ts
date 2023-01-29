import {PValue} from '../../ast/PValue';
import {AbstractCompare} from './AbstractCompare';

export class NotIn extends AbstractCompare<PValue> {

  static NAME = 'nin';

  name = NotIn.NAME;

  op: string = 'NOT IN';


}

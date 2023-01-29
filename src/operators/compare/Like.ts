import {PValue} from '../../ast/PValue';
import {AbstractCompare} from './AbstractCompare';

export class Like extends AbstractCompare<PValue> {

  static NAME = 'like';

  name = Like.NAME;

  op: string = 'LIKE';

}

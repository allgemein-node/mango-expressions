import {AbstractCompare} from './AbstractCompare';

export class IsNotNull extends AbstractCompare<null> {

  static NAME = 'isNotNull';

  name = IsNotNull.NAME;

  op: string = 'IS NOT NULL';


}

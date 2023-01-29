import {AbstractCompare} from './AbstractCompare';

export class IsNull extends AbstractCompare<null> {

  static NAME = 'isNull';

  name = IsNull.NAME;

  op: string = 'IS NULL';


}

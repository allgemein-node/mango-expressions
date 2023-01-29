import {PValue} from '../../ast/PValue';
import {AbstractCompare} from './AbstractCompare';
import {PAst} from '../../ast/PAst';
import {Selector} from '../../ast/Selector';

export class EqualDesc extends AbstractCompare<PValue> {

  static NAME = 'eq';

  name = EqualDesc.NAME;

  op: string = '=';


}


export function Eq(arg1: string | Selector, arg2: PAst<any>) {
  const desc = new EqualDesc();
  desc.setKey(arg1);
  desc.setValue(arg2);
  return desc;
}

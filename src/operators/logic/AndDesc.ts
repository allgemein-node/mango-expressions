import {IMangoWalker, IMangoWalkerControl} from '../../IMangoWalker';
import {AbstractLogic} from './AbstractLogic';
import {PAst} from '../../ast/PAst';
import {PArray} from '../../ast/PArray';

export class AndDesc extends AbstractLogic<PArray> {

  static NAME = 'and';

  name = AndDesc.NAME;


  visit(o: IMangoWalker): any {
    const state: IMangoWalkerControl = {};
    const r = o.visitOperator(this, state);
    if (state && state.abort) {
      return r;
    }
    const relts = this.getValue().visit(o);
    return o.leaveOperator(relts, this);
  }

}


export function And(...values: PAst<any>[]) {
  const desc = new AndDesc();
  let arr = new PArray();
  arr.setValue(values);
  desc.setValue(arr);
  return desc;
}

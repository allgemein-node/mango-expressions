import {IMangoWalker, IMangoWalkerControl} from '../../IMangoWalker';
import {AbstractLogic} from './AbstractLogic';
import {PArray} from '../../ast/PArray';
import {PAst} from '../../ast/PAst';
import {AndDesc} from './AndDesc';

export class OrDesc extends AbstractLogic<PArray> {

  static NAME = 'or';

  name = OrDesc.NAME;


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

export function Or(...values: PAst<any>[]) {
  const desc = new OrDesc();
  let arr = new PArray();
  arr.setValue(values);
  desc.setValue(arr);
  return desc;
}

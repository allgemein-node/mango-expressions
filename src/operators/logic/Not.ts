import {PAst} from '../../ast/PAst';
import {IMangoWalker, IMangoWalkerControl} from '../../IMangoWalker';
import {AbstractLogic} from './AbstractLogic';

export class Not extends AbstractLogic<PAst<any>> {

  static NAME = 'not';

  name = Not.NAME;


  visit(o: IMangoWalker): any {
    const state: IMangoWalkerControl = {};
    const r = o.visitOperator(this, state);
    if (state && state.abort) {
      return r;
    }
    const relts = this.value.visit(o);
    return o.leaveOperator(relts, this);
  }


}

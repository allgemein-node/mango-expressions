import {AbstractOperator} from '../AbstractOperator';
import {IMangoWalker, IMangoWalkerControl} from '../../IMangoWalker';
import {MangoExpression} from '../../MangoExpression';
import {PAst} from '../../ast/PAst';
import {Context} from '../../ast/Context';
import {AUTO_EQUAL_CONV_SUPPORT} from '../../Constants';

export class Match extends AbstractOperator<PAst<any>> {

  static NAME = 'match';

  name = Match.NAME;


  interprete(e: MangoExpression, value: PAst<any>, p: PAst<any>, ctxt?: Context) {
    this.getContext().set(AUTO_EQUAL_CONV_SUPPORT, true);
    super.interprete(e, value, p, ctxt);
  }


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

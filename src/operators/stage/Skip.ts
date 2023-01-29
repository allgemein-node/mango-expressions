import {AbstractOperator} from '../AbstractOperator';
import {PAst} from '../../ast/PAst';
import {IMangoWalker, IMangoWalkerControl} from '../../IMangoWalker';
import {MangoExpression} from '../../MangoExpression';
import {Context} from '../../ast/Context';
import {AUTO_EQUAL_CONV_SUPPORT} from '../../Constants';

export class Skip extends AbstractOperator<number> {

  static NAME = 'skip';

  name = Skip.NAME;


  interprete(e: MangoExpression, value: number, p?: PAst<any>, ctxt?: Context) {
    this.getContext().set(AUTO_EQUAL_CONV_SUPPORT, false);
    super.interprete(e, value, p, ctxt);
  }
}

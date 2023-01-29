import {AbstractOperator} from '../AbstractOperator';
import {PAst} from '../../ast/PAst';
import {MangoExpression} from '../../MangoExpression';
import {Context} from '../../ast/Context';
import {AUTO_EQUAL_CONV_SUPPORT} from '../../Constants';

export class Sort extends AbstractOperator<any> {

  static NAME = 'sort';

  name = Sort.NAME;

  interprete(e: MangoExpression, value: any, p?: PAst<any>, ctxt?: Context) {
    this.getContext().set(AUTO_EQUAL_CONV_SUPPORT, false);
    super.interprete(e, value, p, ctxt);
  }


}

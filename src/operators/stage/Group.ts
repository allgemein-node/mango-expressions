import {AbstractOperator} from '../AbstractOperator';
import {IMangoWalker, IMangoWalkerControl} from '../../IMangoWalker';
import {MangoExpression} from '../../MangoExpression';
import {PAst} from '../../ast/PAst';
import {Context} from '../../ast/Context';
import {AUTO_EQUAL_CONV_SUPPORT} from '../../Constants';
import * as _ from 'lodash';

export const GROUP_ID = 'GROUP_ID';

export class Group extends AbstractOperator<PAst<any>> {

  static NAME = 'group';

  name = Group.NAME;

  _id: PAst<any>;

  // constructor(e: MangoExpression, p?: PAst, ctxt?: Context) {
  //   super(e, p, ctxt);
  //   this.getContext().set(AUTO_EQUAL_CONV_SUPPORT, false);
  // }


  interprete(e: MangoExpression, value: PAst<any>, p: PAst<any>, ctxt?: Context) {
    this.getContext().set(AUTO_EQUAL_CONV_SUPPORT, false);
    super.interprete(e, value, p, ctxt);
  }

  visit(o: IMangoWalker): any {
    const state: IMangoWalkerControl = {};
    const r = o.visitOperator(this, state);
    if (state && state.abort) {
      return r;
    }
    const _id = this._id.visit(o);
    const relts = this.getValue().visit(o);
    relts['_id'] = _id;
    return o.leaveOperator(relts, this);
  }


  validate(def: any): boolean {
    let ctxt = new Context('_id');
    ctxt.set(GROUP_ID, true);
    this._id = this.getRootExpression().interprete(def['_id'], this, ctxt);
    const defClone = _.cloneDeep(def);
    delete defClone['_id'];
    ctxt = new Context(this.getKeyString());
    this.value = this.getRootExpression().interprete(defClone, this, ctxt);
    return true;
  }
}

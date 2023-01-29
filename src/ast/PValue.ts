import {PAst} from './PAst';
import {MangoExpression} from '../MangoExpression';
import {IMangoWalker} from '../IMangoWalker';
import {NotYetImplementedError} from '@allgemein/base/browser';
import {Context} from './Context';

export abstract class PValue extends PAst<any> {

  interprete(e: MangoExpression, value: any, p?: PAst<any>, ctxt?: Context) {
    this.enviroment(e, p, ctxt);
    this.value = value;
  }

  getByKey(key: string): PAst<any> {
    throw new NotYetImplementedError();
  }

  visit(o: IMangoWalker): any {
    return o.onValue(this);
  }

  toJson(): any {
    return this.value;
  }
}

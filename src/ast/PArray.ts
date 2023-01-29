import {PAst} from './PAst';
import {MangoExpression} from '../MangoExpression';
import {IMangoWalker, IMangoWalkerControl} from '../IMangoWalker';
import {Context} from './Context';

export class PArray extends PAst<PAst<any>[]> {


  getByKey(key: string): PAst<any> {
    for (const item of this.getValue()) {
      const found = item.getByKey(key);
      if (found) {
        return found;
      }
    }
    return null;
  }

  keys() {
    const keys: string[] = [];
    for (const item of this.getValue()) {
      const subkey = item.keys();
      subkey.forEach((x: string) => {
        keys.push(x);
      });
    }
    return keys;
  }

  interprete(e: MangoExpression, kv: any[], p?: PAst<any>, ctxt?: Context) {
    super.enviroment(e, p, ctxt);
    this.value = [];
    for (let i = 0; i < kv.length; i++) {
      const ctxt = new Context();
      ctxt.key = i;
      this.value[i] = this.getRootExpression().interprete(kv[i], this, ctxt);
    }
  }

  visit(o: IMangoWalker): any {
    const state: IMangoWalkerControl = {};
    let res: any[] = [];
    if(o.visitArray){
      res = o.visitArray(this, state);
    }

    if (state && state.abort) {
      return res;
    }

    for (let i = 0; i < this.getValue().length; i++) {
      res.push(this.getValue()[i].visit(o));
    }

    if(o.leaveArray){
      return o.leaveArray(res, this);
    }
    return res;


  }


}



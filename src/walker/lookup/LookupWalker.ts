import {isUndefined, values} from 'lodash';
import {ClassUtils, NotSupportedError} from '@allgemein/base';
import {IMangoWalker, IMangoWalkerControl} from '../../IMangoWalker';
import {Bindings} from '../../ast/Bindings';
import {EqualDesc} from '../../operators/compare/EqualDesc';
import {EqualDescLookup} from '../../operators/compare/EqualDescLookup';
import {PAst} from '../../ast/PAst';
import {AndDesc} from '../../operators/logic/AndDesc';
import {AndDescLookup} from '../../operators/logic/AndDescLookup';

const bindings = new Bindings('lookup');
bindings.list.push({
  on: EqualDesc,
  use: EqualDescLookup
});
bindings.list.push({
  on: AndDesc,
  use: AndDescLookup
});

export class LookupWalker implements IMangoWalker {


  source: any;

  constructor(source?: any) {
    this.source = source;
  }

  visitArray(ast: PAst<any>, ctrl?: IMangoWalkerControl): any[] {
    return [];
  }

  leaveArray(res: any[], ast: PAst<any>): any {
    const _values = values(res) as any[];
    if(_values.length > 1){
      return this.combineFunction(_values);
    }else{
      return _values.shift();
    }
  }


  visitObject(ast: PAst<any>, ctrl?: IMangoWalkerControl): any {
    return {};
  }

  leaveObject(res: any, ast: PAst<any>): any {
    const _values = values(res) as any[];
    if(_values.length > 1){
      return this.combineFunction(_values);
    }else{
      return _values.shift();
    }
  }

  visitOperator(ast: PAst<any>, ctrl?: IMangoWalkerControl): any {
  }

  leaveOperator(res: any, ast: PAst<any>): any {
    return res;
  }

  onOperator(ast: PAst<any>, valueRes: any, ctrl?: IMangoWalkerControl): any {
    const cls = ClassUtils.getFunction(ast as any);
    const overlay = bindings.list.find(x => x.on === cls);
    if (overlay) {
      const i = Reflect.construct(overlay.use, []) as any;
      if (isUndefined(this.source)) {
        return i.lookup(ast);
      } else {
        return i.lookup(ast, this.source);
      }
    } else {
      throw new NotSupportedError('');
    }
  }

  onValue(ast: PAst<any>, ctrl?: IMangoWalkerControl): any {
  }



  combineFunction(_values: Function[]): any {
    let fn: Function = null;
    if (isUndefined(this.source)) {
      fn = (function (values: any[]) {
        return function (target: any, source?: any) {
          let x = true && values.length > 0;
          for (const v of values) {
            x = x && v(target, source);
          }
          return x;
        };
      })(_values);
    } else {
      fn = (function (values: any[], source: any) {
        return function (target: any) {
          let x = true && values.length > 0;
          for (const v of values) {
            x = x && v(target, source);
          }
          return x;
        };
      })(_values, this.source);
    }
    return fn;
  }

}

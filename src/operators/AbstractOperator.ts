import {PAst} from '../ast/PAst';
import {MangoExpression} from '../MangoExpression';
import {IMangoWalker} from '../IMangoWalker';
import {Context} from '../ast/Context';

export abstract class AbstractOperator<X> extends PAst<X> {

  readonly name: string;

  getByKey(key: string): PAst<any> {
    if (key === this.name || key.replace(/^\$/, '') === this.name || this.getKeyString() === key) {
      return this;
    }
    return null;
  }


  // validate(def: any, full?: any): boolean {
  //   // const ctxt = new Context(this.getKeyString());
  //   // this.setValue(this.getRootExpression().interprete(def, this, ctxt) as any as X);
  //   return true;
  // }

  visit(o: IMangoWalker): any {
    if (this.getValue()) {
      return o.onOperator(this, (this.getValue() as any).visit(o));
    }
    return o.onOperator(this, null);
  }


  toJson(): any {
    const v = this.getValue();
    if(v instanceof PAst){
      const res = v.toJson();
      return {
        ['$' + this.name]: res
      }
    }else{
      return {
        ['$' + this.name]: v
      }
    }
  }

}

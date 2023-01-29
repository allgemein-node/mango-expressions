import {AbstractOperator} from '../AbstractOperator';
import {Context} from '../../ast/Context';

export abstract class AbstractCompare<X> extends AbstractOperator<X> {

  op: string;


  validate(rightSide: any): boolean {
    const value = this.getRootExpression().interprete(rightSide, this, new Context(this.getKeyString()));
    this.setValue(value as any);
    return true;
  }


}

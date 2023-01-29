import {AbstractOperator} from '../AbstractOperator';

export class Max extends AbstractOperator<any> {

  static NAME = 'max';

  name = Max.NAME;
  //
  //
  // validate(def: any): boolean {
  //   this.value = this.base.interprete(def, this, this.key);
  //   return true;
  // }

}

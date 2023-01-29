import {isArray, isBoolean, isDate, isNull, isNumber, isObjectLike, isString, values, keys} from 'lodash';
import {PAst} from './PAst';
import {ValueRef} from './ValueRef';
import {Unset} from './Unset';
import {IMangoWalker, IMangoWalkerControl} from '../IMangoWalker';
import {Context} from './Context';
import {AUTO_EQUAL_CONV_SUPPORT, NUMBER_PROJECT_SUPPORT} from '../Constants';
import {MangoExpression} from '../MangoExpression';

export class PObject extends PAst<{ [k: string]: PAst<any> }> {
  //
  // children: { [k: string]: PAst } = {};

  _keys: string[];


  // constructor(e: MangoExpression, kv: any, p?: PAst, ctxt?: Context) {
  //   super(e, p, ctxt);
  //   this.interprete(kv);
  // }

  // create(){
  //
  // }

  getByKey(key: string): PAst<any> {
    if (this.getValue()[key]) {
      return this.getValue()[key];
    }
    return null;
    // throw new NotYetImplementedError();
  }

  keys() {
    const prefix = (this.getKeyString() && isString(this.getKeyString()) ? this.getKeyString() + '.' : '');
    const keys: string[] = [];
    for (const k of this._keys) {
      const subkey = this.getValues()[k].keys();
      subkey.forEach((x: string) => {
        keys.push(prefix + x);
      });
    }
    return keys;
  }


  visit(o: IMangoWalker): any {
    const state: IMangoWalkerControl = {};
    let r: any = {};

    if (o.visitObject) {
      r = o.visitObject(this, state);
    }

    if (state && state.abort) {
      return r;
    }

    for (const k of this._keys) {
      r[k] = this.value[k].visit(o);
    }

    if(o.leaveObject){
      return o.leaveObject(r, this);
    }
    return r;
  }


  getValues() {
    return values(this.value);
  }


  interprete(e: MangoExpression, value: { [k: string]: any }, p?: PAst<any>, ctxt?: Context) {
    // do not pass and interprete value
    this.enviroment(e, p, ctxt);
    this.value = {};
    this._keys = keys(value);

    const autoEqualSupport = !!this.getContext().get(AUTO_EQUAL_CONV_SUPPORT);
    const numberProjectSupport = !!this.getContext().get(NUMBER_PROJECT_SUPPORT);

    for (const k of this._keys) {
      const ctxt = new Context(k);
      const v = value[k];
      if (!autoEqualSupport) {
        if (numberProjectSupport && isNumber(v) && (v === 1 || v === 0)) {
          if (v === 1) {
            this.value[k] = this.getRootExpression().create(ValueRef, k, this, ctxt);
          } else {
            this.value[k] = this.getRootExpression().create(Unset, k, this, ctxt);
          }
        } else {
          this.value[k] = this.getRootExpression().interprete(v, this, ctxt);
        }
      } else {
        const isPrimative = isDate(v) || isNumber(v) || isString(v) || isBoolean() || isNull(v);
        if (!isPrimative && (isObjectLike(v) || isArray(v))) {
          this.value[k] = this.getRootExpression().interprete(v, this, ctxt);
        } else {
          const eq = this.getRootExpression().getOperator('$eq', v, value, this, ctxt);
          this.value[k] = eq;
          // eq.validate(v);
        }
      }
    }
  }


  toJson(): any {
    let obj = {};
    for (const k of this._keys) {
      if (this.value[k] instanceof PAst) {
        obj[k] = this.value[k].toJson();
      } else {
        obj[k] = this.value[k];
      }
    }
    return obj;
  }


}

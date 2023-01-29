import {PAst} from './ast/PAst';
import * as _ from 'lodash';
import {ValueRef} from './ast/ValueRef';
import {Value} from './ast/Value';
import {PArray} from './ast/PArray';
import {PObject} from './ast/PObject';
import {Operators} from './operators/Operators';
import {IMangoWalker} from './IMangoWalker';
import {Context} from './ast/Context';
import {AUTO_EQUAL_CONV_SUPPORT} from './Constants';
import {ClassType} from '@allgemein/schema-api';

export class MangoExpression {

  readonly root: PAst<any> = null;

  constructor(def: any) {
    // default change object assignment to value
    const ctxt = new Context();
    ctxt.set(AUTO_EQUAL_CONV_SUPPORT, true);
    this.root = this.interprete(def, null, ctxt);
  }

  getByKey(key: string) {
    return this.root.getByKey(key);
  }

  getRoot() {
    return this.root;
  }


  interprete(def: any, p?: PAst<any>, ctxt?: Context) {
    const context = ctxt ? ctxt : new Context();
    if (p) {
      context.key = ctxt.key;
      context.merge(p.getContext());
    }
    let result: PAst<any> = null;
    if (_.isString(def) ||
      _.isNumber(def) ||
      _.isDate(def) ||
      _.isNull(def) ||
      _.isBoolean(def)) {
      const isRef = _.isString(def) && def.match(/^\$(.+)/);
      if (isRef) {
        result = this.create(ValueRef, isRef[1], p, context);
      } else {
        result = this.create(Value, def, p, context);
      }
    } else if (_.isArray(def)) {
      result = this.create(PArray, def, p, context);
    } else if (_.isObjectLike(def)) {
      const k = _.keys(def);
      // TODO make multiple $registry work
      const operators = k.filter(x => /^\$/.test(x) && Operators.has(x.substr(1)));
      if (operators.length === 1) {
        const operatorKey = operators[0];
        const follow = def[operatorKey];
        result = this.getOperator(operatorKey, follow, def, p, context);
      } else {
        result = this.create(PObject, def, p, context);
      }
    }

    if (!result) {
      throw new Error(`not yet implemented for ${def}`);
    }

    return result;

  }


  getOperator(operatorKey: string, operatorValue: any, def: any, parent: PAst<any>, context: Context) {
    const operator = Operators.create(operatorKey, this, parent, context);
    operator.interprete(this, operatorValue, parent, context);
    // if (!operator.validate(operatorValue, def)) {
    //   throw new Error(`operator ${operatorKey} has no valid definition ${JSON.stringify(def)}`);
    // }
    return operator;
  }


  create<X extends PAst<any>>(root: ClassType<X>, def: any, p?: PAst<any>, ctxt?: Context) {
    const x = Reflect.construct(root, []) as X;
    x.interprete(this, def, p, ctxt);
    return x;
  }


  visit(o: IMangoWalker) {
    return this.root.visit(o);
  }



  toJson() {
    return this.root.toJson();
  }

}

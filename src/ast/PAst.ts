import {MangoExpression} from '../MangoExpression';
import {IMangoWalker} from '../IMangoWalker';
import {Context} from './Context';
import {isArray, isNumber, isObjectLike, isString, isUndefined, keys} from 'lodash';

export abstract class PAst<X> {

  private rootExpression: MangoExpression;

  private parent: PAst<any>;

  private key: string | number | PAst<string>;

  private context: Context;

  value: X;

  interprete(e: MangoExpression, value: X, p?: PAst<any>, ctxt?: Context) {
    this.enviroment(e, p, ctxt);

    if (!isUndefined(value)) {
      this.value = this.getRootExpression().interprete(value, this, this.getContext()) as any;
    }
  }

  enviroment(e: MangoExpression, p?: PAst<any>, ctxt?: Context) {
    this.setRootExpression(e);
    if (p) {
      this.setParentExpression(p);
    }
    if (ctxt) {
      this.mergeWith(ctxt);
    }
  }


  getKey() {
    return this.key;
  }

  setKey(key: string | PAst<string>) {
    this.key = key;
  }


  getKeyString(): string | number {
    if (this.key instanceof PAst) {
      return this.key.getValue();
    }
    return this.key;
  }

  getValue(): X {
    return this.value;
  }

  setValue(v: X) {
    this.value = v;
    this.applyParent(v);
  }

  applyParent(v: X) {
    if (v) {
      if (v instanceof PAst) {
        v.setParentExpression(this);
      } else if (isArray(v)) {
        for (const e of v) {
          if (e instanceof PAst) {
            e.setParentExpression(this);
          }
        }
      } else if (isObjectLike(v)) {
        for (const e of keys(v)) {
          if (v[e] instanceof PAst) {
            v[e].setParentExpression(this);
          }
        }
      }
    }
  }

  getRootExpression() {
    return this.rootExpression;
  }

  setRootExpression(base: MangoExpression) {
    this.rootExpression = base;
  }

  getParentExpression() {
    return this.parent;
  }

  setParentExpression(base: PAst<any>) {
    this.parent = base;
  }


  getContext() {
    if (!this.context) {
      this.context = new Context();
    }
    return this.context;
  }

  mergeWith(ctxt: Context) {
    if (ctxt) {
      this.key = ctxt.key;
      this.getContext().merge(ctxt);
    }
  }


  keys() {
    const keys = [this.getKeyString()];
    return keys;
  }


  /**
   * function execute on self and parents
   *
   * @param fn
   * @param self
   */
  backwardCall(fn: (x: PAst<any>) => boolean, self: boolean = true): any {
    if (self && fn(this)) {
      return true;
    }
    if (this.parent) {
      return this.parent.backwardCall(fn, true);
    }
    return null;
  }


  /**
   * check if the self or nodes branch is in some sublying context
   *
   * @param ctxt
   * @param selfCheck
   */
  isInContext(ctxt: string, selfCheck: boolean = true): boolean {
    if (this.context.has(ctxt) && selfCheck) {
      return true;
    }
    if (this.parent) {
      return this.parent.isInContext(ctxt, true);
    }
    return false;
  }

  abstract getByKey(key: string): PAst<any>;


  abstract visit(o: IMangoWalker): any;


  toJson(): any {
    let obj = null;
    let key = this.getKey();
    const value = this.getValue();
    if (isNumber(key)) {
      // is possibly part of an array, so return only the value
      if (value instanceof PAst) {
        obj = value.toJson();
      } else {
        obj = value;
      }
    } else if (isString(key)) {
      // is an object, so return an object with key
      if (value instanceof PAst) {
        obj = {[key]: value.toJson()};
      } else {
        obj = {[key]: value};
      }
    } else if (key instanceof PAst) {
      const _key = key.getValue();
      // is an object, so return an object with key
      if (value instanceof PAst) {
        obj = {[_key]: value.toJson()};
      } else {
        obj = {[_key]: value};
      }
    }

    return obj;
  }

}

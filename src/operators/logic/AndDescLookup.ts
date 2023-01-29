import {IMangoWalker, IMangoWalkerControl} from '../../IMangoWalker';
import {AbstractLogic} from './AbstractLogic';
import {PAst} from '../../ast/PAst';
import {PArray} from '../../ast/PArray';
import {ILookupFn} from '../../walker/lookup/ILookupFn';
import {AndDesc} from './AndDesc';

export class AndDescLookup implements ILookupFn {
  lookup(ast: AndDesc, source?: any): (target: any, source?: any) => boolean {
    return function (p1: any, p2: any) {
      return false;
    };
  }

}

import {PAst} from '../../ast/PAst';

export interface ILookupFn {

  lookup(ast: PAst<any>, source?: any): (target: any, source?: any) => boolean;

}

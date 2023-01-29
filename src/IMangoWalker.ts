import {PAst} from './ast/PAst';

export interface IMangoWalkerControl {
  abort?: boolean;
}

export interface IMangoWalker {

  // on(entry: any): any;

  /**
   * return the array
   *
   * @param ast
   */
  visitArray(ast: PAst<any>, ctrl?: IMangoWalkerControl): any[];

  leaveArray(res: any[], ast: PAst<any>): any;

  visitObject(ast: PAst<any>, ctrl?: IMangoWalkerControl): any;

  leaveObject(res: any, ast: PAst<any>): any;

  onValue(ast: PAst<any>, ctrl?: IMangoWalkerControl): any;

  onOperator(ast: PAst<any>, valueRes: any, ctrl?: IMangoWalkerControl): any;

  visitOperator(ast: PAst<any>, ctrl?: IMangoWalkerControl): any;

  leaveOperator(res: any, ast: PAst<any>): any;

}

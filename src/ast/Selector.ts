import {PAst} from './PAst';
import {IMangoWalker} from '../IMangoWalker';

export class Selector extends PAst<string> {

  getByKey(key: string): PAst<any> {
    return undefined;
  }

  visit(o: IMangoWalker): any {
  }


}

import {PAst} from './PAst';
import {ClassType} from '@allgemein/schema-api';

export interface IBinding<X> {
  on: ClassType<PAst<any>>;
  use: ClassType<X>;
}

export class Bindings<X> {

  name: string;

  list: IBinding<X>[] = [];

  constructor(name: string) {
    this.name = name;
  }

}

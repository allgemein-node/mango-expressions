import {Selector} from "./Selector";


export class KeyDesc extends Selector {

  toJson() {
    return {$key: this.getValue()};
  }

}

/**
 * Key
 */
export function Key(k: string) {
  const desc = new KeyDesc();
  desc.setValue(k);
  return desc;
}

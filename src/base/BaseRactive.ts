import Ractive, { BaseParseOpts, ComputationDescriptor, ExtendOpts, PropertyOpts, ValueMap, InitOpts, AdaptorHandle } from "ractive";
import { Router } from "routerjs";
import GetDate from "./GetDate";
import NewRactive, { RactiveExtendInterface, RactiveStaticInterface } from './NewRactive';

export interface BaseRactiveInterface extends RactiveExtendInterface {
  router?: Router
  handleClick?: { (action: string, props: any, e: any): void }
  handleChange?: { (action: string, props: any, e: any): void }
  req?: any
  reInitializeObserve?: { (): void }
  getLang?: any
  parseQuery?: { (queryString: string) }
  getDate?: { (date?: string, timezone?: string): string }
}

export interface BaseRactiveStaticInterface extends Omit<RactiveStaticInterface, 'extend'> {
  extend?: { <I extends BaseRactiveInterface>(i?: I): BaseRactiveStaticInterface }
  new(props?: BaseRactiveInterface): typeof NewRactive
}

const BaseRactive: BaseRactiveStaticInterface = NewRactive as any;

export default BaseRactive.extend<BaseRactiveInterface>({
  req: null,
  onconstruct() {
    this.reInitializeObserve();
  },
  router: null,
  getLang: null,
  reInitializeObserve() {
    let self = this;
    for (var key in self.newOn) {
      self.off(key);
      self.on(key, self.newOn[key]);
    }
  },
  parseQuery(queryString) {
    var query = {};
    var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i].split('=');
      query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
  },
  getDate(date,timezone){
    return GetDate(date,timezone);
  },
  newOn: {},
})

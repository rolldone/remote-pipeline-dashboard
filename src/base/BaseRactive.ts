import Ractive, { BaseParseOpts, ComputationDescriptor, ExtendOpts, PropertyOpts, ValueMap, InitOpts, AdaptorHandle } from "ractive";
import { Router } from "routerjs";
import NewRactive, { RactiveExtendInterface, RactiveStaticInterface } from './NewRactive';

export interface BaseRactiveInterface extends RactiveExtendInterface {
  router?: Router
  handleClick?: { (action: string, props: any, e: any): void }
  handleChange?: { (action: string, props: any, e: any): void }
  req?: any
  reInitializeObserve?: { (): void }
  getLang?: any
  parseQuery?: { (queryString: string) }
  safeJSON?: { (props: any, endpoint: string | Array<string>, defaultValue?: any, index?: number) }
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
  newOn: {},
  safeJSON: function (props, endpoint, defaultValue = null, index) {
    let _endpotingString = endpoint as string;
    endpoint = _endpotingString.split(".");
    if (endpoint.length == 0) {
      return defaultValue;
    }
    if (index == null) {
      index = 0;
    }
    if (props == null) {
      return defaultValue;
    }
    if (props[endpoint[index]] == null) {
      return defaultValue;
    }
    props = props[endpoint[index]];
    index += 1;
    if (index == endpoint.length) {
      return props;
    }
    return this.safeJSON(props, endpoint.join("."), defaultValue, index);
  }
})

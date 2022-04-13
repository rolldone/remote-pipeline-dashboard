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
}

export interface BaseRactiveStaticInterface extends Omit<RactiveStaticInterface, 'extend'> {
  extend?: { <I extends BaseRactiveInterface>(i?: I): BaseRactiveStaticInterface }
  new(props?: BaseRactiveInterface): typeof NewRactive
}

const BaseRactive: BaseRactiveStaticInterface = NewRactive as any;

const GG = BaseRactive.extend<BaseRactiveInterface>({
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
  newOn: {},
})

export default GG;
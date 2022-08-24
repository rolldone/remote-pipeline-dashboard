import TsRactive, { ExtendOpts, InitOpts, Ractive, Static } from "ractive";

interface OriginRactiveExtendListener<T extends OriginRactiveExtendListener<T>> { }

export interface RactiveExtendInterface extends OriginRactiveExtendListener<RactiveExtendInterface> {
  _super?: { (...props: any): any }
  components?: Object
  isolated?: boolean
  data?: { (): void }
  target?: string
  partials?: any
  observe?: any
  resetPartial?: { (key: string, obj: any): Promise<any> }
  testing?: string
  oninit?: { (): void }
  onconstruct?: { (): void }
  oncomplete?: { (): void }
  onconfig?: { (): void }
  onrender?: { (): void }
  template?: string
  set?: { (key: string, val: any): any }
  get?: { (key: string): any }
  newOn?: any
  on?: any
  css?: string
  off?: any
  fire?: { (action: string, ...props: any): void }
  parent?: any
  findComponent?: { (component: string): any }
}

export interface RactiveStaticInterface extends Omit<Static, 'extend'> {
  extend?: { <I extends RactiveExtendInterface>(i?: I): RactiveStaticInterface }// Static<Merge<any,ExtendOpts, RactiveExtendInterface>> }
  new(props?: RactiveExtendInterface): Ractive;
  on?: { (key: string, handler?: Function): void }
  off?: { (key: string, handler?: Function): void }
  toHTML?: any
  toCSS?: any
}

const NewRactive: RactiveStaticInterface = TsRactive as any;

export default NewRactive;
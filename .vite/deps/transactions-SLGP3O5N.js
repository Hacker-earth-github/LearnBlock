import "./chunk-4QYSLOYY.js";
import "./chunk-KF232AT6.js";
import "./chunk-R4CG7E35.js";
import "./chunk-HXBP473Q.js";
import "./chunk-PYLTRPOL.js";
import "./chunk-XVYAQD5I.js";
import {
  customElement
} from "./chunk-OBE2ALF7.js";
import "./chunk-QKZ7MSQ6.js";
import "./chunk-3NR3QRNO.js";
import "./chunk-XUIS2GDK.js";
import "./chunk-U7LFSL2C.js";
import "./chunk-EBXN6FQY.js";
import "./chunk-NP3NSDF5.js";
import "./chunk-OZTVGCGN.js";
import "./chunk-NA2M4VGA.js";
import {
  LitElement,
  css,
  html
} from "./chunk-3KI7T55T.js";
import "./chunk-YMAUWVAA.js";
import "./chunk-OMO2FGGE.js";
import "./chunk-2XWXXSG6.js";
import "./chunk-OFXHVVVC.js";
import "./chunk-4W5RYG2X.js";
import "./chunk-Y5VHFJ5N.js";
import "./chunk-DI52DQAC.js";

// node_modules/@reown/appkit-scaffold-ui/dist/esm/src/views/w3m-transactions-view/styles.js
var styles_default = css`
  :host > wui-flex:first-child {
    height: 500px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
  }

  :host > wui-flex:first-child::-webkit-scrollbar {
    display: none;
  }
`;

// node_modules/@reown/appkit-scaffold-ui/dist/esm/src/views/w3m-transactions-view/index.js
var __decorate = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var W3mTransactionsView = class W3mTransactionsView2 extends LitElement {
  render() {
    return html`
      <wui-flex flexDirection="column" .padding=${["0", "m", "m", "m"]} gap="s">
        <w3m-activity-list page="activity"></w3m-activity-list>
      </wui-flex>
    `;
  }
};
W3mTransactionsView.styles = styles_default;
W3mTransactionsView = __decorate([
  customElement("w3m-transactions-view")
], W3mTransactionsView);
export {
  W3mTransactionsView
};
//# sourceMappingURL=transactions-SLGP3O5N.js.map

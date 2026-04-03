import { a as attr_class, s as stringify } from "../../chunks/index4.js";
import "../../chunks/stores.js";
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { children } = $$props;
    $$renderer2.push(`<div${attr_class(`min-h-screen transition-colors duration-300 ${stringify(
      "bg-[#0f172a] text-[#f1f5f9]"
    )}`)}>`);
    children($$renderer2);
    $$renderer2.push(`<!----></div>`);
  });
}
export {
  _layout as default
};

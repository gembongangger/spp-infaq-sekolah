import { a as attr_class, F as FILENAME, s as stringify } from "../../chunks/index4.js";
import "../../chunks/stores.js";
import { p as push_element, a as pop_element } from "../../chunks/dev.js";
_layout[FILENAME] = "src/routes/+layout.svelte";
function _layout($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { children } = $$props;
      $$renderer2.push(`<div${attr_class(`min-h-screen transition-colors duration-300 ${stringify(
        "bg-[#0f172a] text-[#f1f5f9]"
      )}`)}>`);
      push_element($$renderer2, "div", 33, 0);
      children($$renderer2);
      $$renderer2.push(`<!----></div>`);
      pop_element();
    },
    _layout
  );
}
_layout.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
export {
  _layout as default
};

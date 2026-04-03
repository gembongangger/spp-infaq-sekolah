import { F as FILENAME, n as head, e as escape_html, i as store_get, a as attr_class, u as unsubscribe_stores, s as stringify } from "../../../../chunks/index4.js";
import { a as authStore } from "../../../../chunks/Icon.js";
import "../../../../chunks/client.js";
import { p as push_element, a as pop_element } from "../../../../chunks/dev.js";
import "clsx";
import { P as Plus, a as Chevron_down, S as School, U as Users, C as Chart_column } from "../../../../chunks/users.js";
import { S as Shield } from "../../../../chunks/shield.js";
SekolahTab[FILENAME] = "src/routes/superadmin/dashboard/tabs/SekolahTab.svelte";
function SekolahTab($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 169, 0);
      $$renderer2.push(`<div class="flex justify-between items-center mb-6">`);
      push_element($$renderer2, "div", 171, 1);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 172, 2);
      $$renderer2.push(`<h2 class="text-2xl font-bold text-[#f1f5f9]">`);
      push_element($$renderer2, "h2", 173, 3);
      $$renderer2.push(`Kelola Sekolah</h2>`);
      pop_element();
      $$renderer2.push(` <p class="text-sm text-[#64748b] mt-1">`);
      push_element($$renderer2, "p", 174, 3);
      $$renderer2.push(`Tambah, edit, dan nonaktifkan sekolah</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <button class="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white font-medium hover:from-[#2563eb] hover:to-[#1d4ed8] transition-all">`);
      push_element($$renderer2, "button", 176, 2);
      Plus($$renderer2, { size: 18 });
      $$renderer2.push(`<!----> Tambah Sekolah</button>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="text-center py-12">`);
        push_element($$renderer2, "div", 192, 2);
        $$renderer2.push(`<div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#3b82f6]">`);
        push_element($$renderer2, "div", 193, 3);
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <p class="mt-4 text-[#64748b]">`);
        push_element($$renderer2, "p", 194, 3);
        $$renderer2.push(`Memuat data sekolah...</p>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--> `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
    },
    SekolahTab
  );
}
SekolahTab.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
_page[FILENAME] = "src/routes/superadmin/dashboard/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      var $$store_subs;
      head("z4yp62", $$renderer2, ($$renderer3) => {
        $$renderer3.title(($$renderer4) => {
          $$renderer4.push(`<title>Superadmin Dashboard - Sistem Informasi Infaq &amp; Jariyah</title>`);
        });
      });
      $$renderer2.push(`<div class="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]">`);
      push_element($$renderer2, "div", 42, 0);
      $$renderer2.push(`<header class="bg-[#1e293b] border-b border-[#334155] shadow-lg">`);
      push_element($$renderer2, "header", 44, 1);
      $$renderer2.push(`<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">`);
      push_element($$renderer2, "div", 45, 2);
      $$renderer2.push(`<div class="flex justify-between items-center h-16">`);
      push_element($$renderer2, "div", 46, 3);
      $$renderer2.push(`<div class="flex items-center gap-3">`);
      push_element($$renderer2, "div", 48, 4);
      $$renderer2.push(`<div class="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] shadow-lg shadow-blue-500/20">`);
      push_element($$renderer2, "div", 49, 5);
      Shield($$renderer2, { size: 20, color: "#fff" });
      $$renderer2.push(`<!----></div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 52, 5);
      $$renderer2.push(`<h1 class="text-lg font-bold text-[#f1f5f9]">`);
      push_element($$renderer2, "h1", 53, 6);
      $$renderer2.push(`Superadmin Dashboard</h1>`);
      pop_element();
      $$renderer2.push(` <p class="text-xs text-[#64748b]">`);
      push_element($$renderer2, "p", 56, 6);
      $$renderer2.push(`Kelola Sekolah dan Admin</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="relative">`);
      push_element($$renderer2, "div", 63, 4);
      $$renderer2.push(`<button class="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-[#f1f5f9] hover:bg-[#334155] transition-colors">`);
      push_element($$renderer2, "button", 64, 5);
      $$renderer2.push(`<div class="w-8 h-8 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] flex items-center justify-center text-white font-semibold text-sm">`);
      push_element($$renderer2, "div", 68, 6);
      $$renderer2.push(`${escape_html((store_get($$store_subs ??= {}, "$authStore", authStore).user?.email || "S")[0].toUpperCase())}</div>`);
      pop_element();
      $$renderer2.push(` <span class="text-sm font-medium">`);
      push_element($$renderer2, "span", 71, 6);
      $$renderer2.push(`${escape_html(store_get($$store_subs ??= {}, "$authStore", authStore).user?.email || "Superadmin")}</span>`);
      pop_element();
      $$renderer2.push(` `);
      Chevron_down($$renderer2, { size: 16, class: "text-[#64748b]" });
      $$renderer2.push(`<!----></button>`);
      pop_element();
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</header>`);
      pop_element();
      $$renderer2.push(` <div class="bg-[#1e293b] border-b border-[#334155]">`);
      push_element($$renderer2, "div", 98, 1);
      $$renderer2.push(`<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">`);
      push_element($$renderer2, "div", 99, 2);
      $$renderer2.push(`<div class="flex gap-2 py-3">`);
      push_element($$renderer2, "div", 100, 3);
      $$renderer2.push(`<button${attr_class(`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${stringify(
        "bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white"
      )}`)}>`);
      push_element($$renderer2, "button", 101, 4);
      School($$renderer2, { size: 18 });
      $$renderer2.push(`<!----> Kelola Sekolah</button>`);
      pop_element();
      $$renderer2.push(` <button${attr_class(`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${stringify("text-[#64748b] hover:bg-[#334155] hover:text-[#94a3b8]")}`)}>`);
      push_element($$renderer2, "button", 108, 4);
      Users($$renderer2, { size: 18 });
      $$renderer2.push(`<!----> Kelola Admin</button>`);
      pop_element();
      $$renderer2.push(` <button${attr_class(`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${stringify("text-[#64748b] hover:bg-[#334155] hover:text-[#94a3b8]")}`)}>`);
      push_element($$renderer2, "button", 115, 4);
      Chart_column($$renderer2, { size: 18 });
      $$renderer2.push(`<!----> Statistik</button>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">`);
      push_element($$renderer2, "main", 127, 1);
      {
        $$renderer2.push("<!--[0-->");
        SekolahTab($$renderer2);
      }
      $$renderer2.push(`<!--]--></main>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      if ($$store_subs) unsubscribe_stores($$store_subs);
    },
    _page
  );
}
_page.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
export {
  _page as default
};

import { b as sanitize_props, c as spread_props, p as prevent_snippet_stringification, F as FILENAME, d as slot, h as head, a as attr_class, e as escape_html, f as store_get, u as unsubscribe_stores, s as stringify } from "../../../../chunks/index4.js";
import { a as authStore } from "../../../../chunks/auth-store.js";
import "../../../../chunks/client.js";
import { p as push_element, a as pop_element } from "../../../../chunks/dev.js";
import "../../../../chunks/stores.js";
import "clsx";
import { S as Spinner } from "../../../../chunks/Spinner.js";
import { P as Plus } from "../../../../chunks/plus.js";
import { S as Shield } from "../../../../chunks/shield.js";
import { S as Sun } from "../../../../chunks/sun.js";
import { C as Chevron_down } from "../../../../chunks/chevron-down.js";
import { I as Icon } from "../../../../chunks/Icon.js";
import { U as Users, C as Chart_column } from "../../../../chunks/users.js";
School[FILENAME] = "node_modules/lucide-svelte/dist/icons/school.svelte";
function School($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  $$renderer.component(
    ($$renderer2) => {
      /**
       * @license lucide-svelte v0.475.0 - ISC
       *
       * ISC License
       *
       * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
       *
       * Permission to use, copy, modify, and/or distribute this software for any
       * purpose with or without fee is hereby granted, provided that the above
       * copyright notice and this permission notice appear in all copies.
       *
       * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
       * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
       * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
       * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
       * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
       * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
       * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
       *
       */
      const iconNode = [
        ["path", { "d": "M14 22v-4a2 2 0 1 0-4 0v4" }],
        [
          "path",
          {
            "d": "m18 10 3.447 1.724a1 1 0 0 1 .553.894V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7.382a1 1 0 0 1 .553-.894L6 10"
          }
        ],
        ["path", { "d": "M18 5v17" }],
        ["path", { "d": "m4 6 7.106-3.553a2 2 0 0 1 1.788 0L20 6" }],
        ["path", { "d": "M6 5v17" }],
        ["circle", { "cx": "12", "cy": "9", "r": "2" }]
      ];
      Icon($$renderer2, spread_props([
        { name: "school" },
        $$sanitized_props,
        {
          /**
           * @component @name School
           * @description Lucide SVG icon component, renders SVG Element with children.
           *
           * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTQgMjJ2LTRhMiAyIDAgMSAwLTQgMHY0IiAvPgogIDxwYXRoIGQ9Im0xOCAxMCAzLjQ0NyAxLjcyNGExIDEgMCAwIDEgLjU1My44OTRWMjBhMiAyIDAgMCAxLTIgMkg0YTIgMiAwIDAgMS0yLTJ2LTcuMzgyYTEgMSAwIDAgMSAuNTUzLS44OTRMNiAxMCIgLz4KICA8cGF0aCBkPSJNMTggNXYxNyIgLz4KICA8cGF0aCBkPSJtNCA2IDcuMTA2LTMuNTUzYTIgMiAwIDAgMSAxLjc4OCAwTDIwIDYiIC8+CiAgPHBhdGggZD0iTTYgNXYxNyIgLz4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjkiIHI9IjIiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/school
           * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
           *
           * @param {Object} props - Lucide icons props and any valid SVG attribute
           * @returns {FunctionalComponent} Svelte component
           *
           */
          iconNode,
          children: prevent_snippet_stringification(($$renderer3) => {
            $$renderer3.push(`<!--[-->`);
            slot($$renderer3, $$props, "default", {});
            $$renderer3.push(`<!--]-->`);
          }),
          $$slots: { default: true }
        }
      ]));
    },
    School
  );
}
School.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
SekolahTab[FILENAME] = "src/routes/superadmin/dashboard/tabs/SekolahTab.svelte";
function SekolahTab($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 170, 0);
      $$renderer2.push(`<div class="flex justify-between items-center mb-6">`);
      push_element($$renderer2, "div", 172, 1);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 173, 2);
      $$renderer2.push(`<h2 class="text-2xl font-bold text-[#f1f5f9]">`);
      push_element($$renderer2, "h2", 174, 3);
      $$renderer2.push(`Kelola Sekolah</h2>`);
      pop_element();
      $$renderer2.push(` <p class="text-sm text-[#64748b] mt-1">`);
      push_element($$renderer2, "p", 175, 3);
      $$renderer2.push(`Tambah, edit, dan nonaktifkan sekolah</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <button class="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white font-medium hover:from-[#2563eb] hover:to-[#1d4ed8] transition-all">`);
      push_element($$renderer2, "button", 177, 2);
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
        push_element($$renderer2, "div", 193, 2);
        Spinner($$renderer2, { size: "lg", color: "blue" });
        $$renderer2.push(`<!----> <p class="mt-4 text-[#64748b]">`);
        push_element($$renderer2, "p", 195, 3);
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
      $$renderer2.push(`<div${attr_class(`min-h-screen ${stringify(
        "bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]"
      )} transition-colors duration-300`)}>`);
      push_element($$renderer2, "div", 70, 0);
      $$renderer2.push(`<header${attr_class(`${stringify(
        "bg-[#1e293b] border-[#334155]"
      )} border-b shadow-lg transition-colors duration-300`)}>`);
      push_element($$renderer2, "header", 72, 1);
      $$renderer2.push(`<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">`);
      push_element($$renderer2, "div", 73, 2);
      $$renderer2.push(`<div class="flex justify-between items-center h-16">`);
      push_element($$renderer2, "div", 74, 3);
      $$renderer2.push(`<div class="flex items-center gap-3">`);
      push_element($$renderer2, "div", 76, 4);
      $$renderer2.push(`<div class="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] shadow-lg shadow-blue-500/20">`);
      push_element($$renderer2, "div", 77, 5);
      Shield($$renderer2, { size: 20, color: "#fff" });
      $$renderer2.push(`<!----></div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 80, 5);
      $$renderer2.push(`<h1${attr_class(`text-lg font-bold ${stringify("text-[#f1f5f9]")}`)}>`);
      push_element($$renderer2, "h1", 81, 6);
      $$renderer2.push(`Superadmin Dashboard</h1>`);
      pop_element();
      $$renderer2.push(` <p${attr_class(`text-xs ${stringify("text-[#64748b]")}`)}>`);
      push_element($$renderer2, "p", 84, 6);
      $$renderer2.push(`Kelola Sekolah dan Admin</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="flex items-center gap-3">`);
      push_element($$renderer2, "div", 91, 4);
      $$renderer2.push(`<button type="button"${attr_class(`p-2.5 rounded-xl ${stringify(
        "bg-[#0f172a] border border-[#334155] text-[#94a3b8] hover:bg-[#334155]"
      )} transition-all duration-300`)} aria-label="Toggle theme">`);
      push_element($$renderer2, "button", 93, 5);
      {
        $$renderer2.push("<!--[0-->");
        Sun($$renderer2, { size: 18 });
      }
      $$renderer2.push(`<!--]--></button>`);
      pop_element();
      $$renderer2.push(` <div class="relative">`);
      push_element($$renderer2, "div", 107, 5);
      $$renderer2.push(`<button${attr_class(`flex items-center gap-2 px-4 py-2 rounded-xl ${stringify(
        "bg-[#0f172a] border border-[#334155] text-[#f1f5f9] hover:bg-[#334155]"
      )} transition-colors`)}>`);
      push_element($$renderer2, "button", 108, 6);
      $$renderer2.push(`<div class="w-8 h-8 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] flex items-center justify-center text-white font-semibold text-sm">`);
      push_element($$renderer2, "div", 112, 7);
      $$renderer2.push(`${escape_html((store_get($$store_subs ??= {}, "$authStore", authStore).user?.email || "S")[0].toUpperCase())}</div>`);
      pop_element();
      $$renderer2.push(` <span class="text-sm font-medium">`);
      push_element($$renderer2, "span", 115, 7);
      $$renderer2.push(`${escape_html(store_get($$store_subs ??= {}, "$authStore", authStore).user?.email || "Superadmin")}</span>`);
      pop_element();
      $$renderer2.push(` `);
      Chevron_down($$renderer2, {
        size: 16,
        class: "text-[#64748b]"
      });
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
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</header>`);
      pop_element();
      $$renderer2.push(` <div${attr_class(`${stringify(
        "bg-[#1e293b] border-[#334155]"
      )} border-b transition-colors duration-300`)}>`);
      push_element($$renderer2, "div", 143, 1);
      $$renderer2.push(`<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">`);
      push_element($$renderer2, "div", 144, 2);
      $$renderer2.push(`<div class="flex gap-2 py-3">`);
      push_element($$renderer2, "div", 145, 3);
      $$renderer2.push(`<button${attr_class(`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${stringify(
        "bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white"
      )}`)}>`);
      push_element($$renderer2, "button", 146, 4);
      School($$renderer2, { size: 18 });
      $$renderer2.push(`<!----> Kelola Sekolah</button>`);
      pop_element();
      $$renderer2.push(` <button${attr_class(`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${stringify(
        "text-[#64748b] hover:bg-[#334155] hover:text-[#94a3b8]"
      )}`)}>`);
      push_element($$renderer2, "button", 153, 4);
      Users($$renderer2, { size: 18 });
      $$renderer2.push(`<!----> Kelola Admin</button>`);
      pop_element();
      $$renderer2.push(` <button${attr_class(`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${stringify(
        "text-[#64748b] hover:bg-[#334155] hover:text-[#94a3b8]"
      )}`)}>`);
      push_element($$renderer2, "button", 160, 4);
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
      push_element($$renderer2, "main", 172, 1);
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

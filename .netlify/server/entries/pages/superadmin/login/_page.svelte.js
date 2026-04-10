import { f as store_get, h as head, a as attr_class, k as attr, u as unsubscribe_stores, F as FILENAME, s as stringify } from "../../../../chunks/index4.js";
import { a as authStore } from "../../../../chunks/auth-store.js";
import { g as goto } from "../../../../chunks/client.js";
import "../../../../chunks/stores.js";
import { p as push_element, a as pop_element } from "../../../../chunks/dev.js";
import "../../../../chunks/Spinner.js";
import { S as Sun } from "../../../../chunks/sun.js";
import { S as Shield } from "../../../../chunks/shield.js";
import { M as Mail } from "../../../../chunks/mail.js";
import { L as Lock } from "../../../../chunks/lock.js";
import { E as Eye } from "../../../../chunks/eye.js";
_page[FILENAME] = "src/routes/superadmin/login/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      var $$store_subs;
      let username = "";
      let password = "";
      let isLoading = false;
      if (store_get($$store_subs ??= {}, "$authStore", authStore).isAuthenticated && store_get($$store_subs ??= {}, "$authStore", authStore).user?.role === "superadmin") {
        goto();
      }
      head("1j9slgt", $$renderer2, ($$renderer3) => {
        $$renderer3.title(($$renderer4) => {
          $$renderer4.push(`<title>Superadmin Login - Sistem Informasi Infaq &amp; Jariyah</title>`);
        });
      });
      $$renderer2.push(`<div${attr_class(`min-h-screen flex items-center justify-center ${stringify(
        "bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]"
      )} py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300`)}>`);
      push_element($$renderer2, "div", 84, 0);
      $$renderer2.push(`<button type="button"${attr_class(`fixed top-4 right-4 p-3 rounded-xl ${stringify(
        "bg-[#1e293b] border border-[#334155] text-[#94a3b8] hover:bg-[#334155]"
      )} transition-all duration-300 shadow-lg`)} aria-label="Toggle theme">`);
      push_element($$renderer2, "button", 86, 1);
      {
        $$renderer2.push("<!--[0-->");
        Sun($$renderer2, { size: 20 });
      }
      $$renderer2.push(`<!--]--></button>`);
      pop_element();
      $$renderer2.push(` <div class="w-full max-w-md">`);
      push_element($$renderer2, "div", 99, 1);
      $$renderer2.push(`<div class="text-center mb-8">`);
      push_element($$renderer2, "div", 101, 2);
      $$renderer2.push(`<div class="flex justify-center items-center gap-3 mb-4">`);
      push_element($$renderer2, "div", 102, 3);
      $$renderer2.push(`<div class="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] shadow-lg shadow-blue-500/20">`);
      push_element($$renderer2, "div", 103, 4);
      Shield($$renderer2, { size: 32, color: "#fff" });
      $$renderer2.push(`<!----></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <h1${attr_class(`text-3xl font-extrabold ${stringify("text-[#f1f5f9]")}`)}>`);
      push_element($$renderer2, "h1", 107, 3);
      $$renderer2.push(`Superadmin Login</h1>`);
      pop_element();
      $$renderer2.push(` <p${attr_class(`mt-2 text-sm ${stringify("text-[#94a3b8]")}`)}>`);
      push_element($$renderer2, "p", 110, 3);
      $$renderer2.push(`Masuk untuk mengelola sekolah dan admin</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div${attr_class(`rounded-2xl p-8 ${stringify(
        "bg-[#1e293b] border border-[#334155]"
      )} shadow-xl transition-colors duration-300`)}>`);
      push_element($$renderer2, "div", 116, 2);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <form class="space-y-6">`);
      push_element($$renderer2, "form", 124, 3);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 125, 4);
      $$renderer2.push(`<label for="username"${attr_class(`block text-xs font-medium mb-2 ${stringify("text-[#64748b]")} uppercase tracking-wider`)}>`);
      push_element($$renderer2, "label", 126, 5);
      $$renderer2.push(`Username</label>`);
      pop_element();
      $$renderer2.push(` <div class="relative">`);
      push_element($$renderer2, "div", 129, 5);
      $$renderer2.push(`<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">`);
      push_element($$renderer2, "div", 130, 6);
      Mail($$renderer2, {
        size: 18,
        class: "text-[#64748b]"
      });
      $$renderer2.push(`<!----></div>`);
      pop_element();
      $$renderer2.push(` <input id="username" type="text"${attr("value", username)} placeholder="superadmin" required=""${attr_class(`w-full pl-11 pr-4 py-3 rounded-xl text-sm ${stringify(
        "bg-[#0f172a] border border-[#334155] text-[#f1f5f9] placeholder-[#475569]"
      )} focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all`)} autocomplete="username"/>`);
      push_element($$renderer2, "input", 133, 6);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 145, 4);
      $$renderer2.push(`<label for="password"${attr_class(`block text-xs font-medium mb-2 ${stringify("text-[#64748b]")} uppercase tracking-wider`)}>`);
      push_element($$renderer2, "label", 146, 5);
      $$renderer2.push(`Password</label>`);
      pop_element();
      $$renderer2.push(` <div class="relative">`);
      push_element($$renderer2, "div", 149, 5);
      $$renderer2.push(`<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">`);
      push_element($$renderer2, "div", 150, 6);
      Lock($$renderer2, {
        size: 18,
        class: "text-[#64748b]"
      });
      $$renderer2.push(`<!----></div>`);
      pop_element();
      $$renderer2.push(` <input id="password"${attr("type", "password")}${attr("value", password)} placeholder="••••••••" required=""${attr_class(`w-full pl-11 pr-12 py-3 rounded-xl text-sm ${stringify(
        "bg-[#0f172a] border border-[#334155] text-[#f1f5f9] placeholder-[#475569]"
      )} focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all`)} autocomplete="current-password"/>`);
      push_element($$renderer2, "input", 153, 6);
      pop_element();
      $$renderer2.push(` <button type="button"${attr_class(`absolute inset-y-0 right-0 pr-4 flex items-center ${stringify(
        "text-[#64748b] hover:text-[#94a3b8]"
      )} transition-colors`)}>`);
      push_element($$renderer2, "button", 162, 6);
      {
        $$renderer2.push("<!--[-1-->");
        Eye($$renderer2, { size: 18 });
      }
      $$renderer2.push(`<!--]--></button>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <button type="submit"${attr("disabled", isLoading, true)}${attr_class(`w-full py-3 px-4 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white hover:from-[#2563eb] hover:to-[#1d4ed8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3b82f6] ${stringify(
        "focus:ring-offset-[#1e293b]"
      )} transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`)}>`);
      push_element($$renderer2, "button", 176, 4);
      {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<span>`);
        push_element($$renderer2, "span", 185, 6);
        $$renderer2.push(`Masuk sebagai Superadmin</span>`);
        pop_element();
        $$renderer2.push(` <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">`);
        push_element($$renderer2, "svg", 186, 6);
        $$renderer2.push(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3">`);
        push_element($$renderer2, "path", 187, 7);
        $$renderer2.push(`</path>`);
        pop_element();
        $$renderer2.push(`</svg>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></button>`);
      pop_element();
      $$renderer2.push(`</form>`);
      pop_element();
      $$renderer2.push(` <div${attr_class(`mt-6 pt-6 ${stringify(
        "border-t border-[#334155]"
      )} space-y-4`)}>`);
      push_element($$renderer2, "div", 193, 3);
      $$renderer2.push(`<div${attr_class(`p-4 rounded-xl ${stringify(
        "bg-emerald-500/10 border border-emerald-500/20"
      )} text-center`)}>`);
      push_element($$renderer2, "div", 194, 4);
      $$renderer2.push(`<p${attr_class(`text-xs ${stringify("text-[#64748b]")} mb-2 font-medium uppercase tracking-wider`)}>`);
      push_element($$renderer2, "p", 195, 5);
      $$renderer2.push(`Akses Sekolah</p>`);
      pop_element();
      $$renderer2.push(` <a href="/login" class="inline-flex items-center gap-2 text-sm font-semibold text-[#10b981] hover:text-[#34d399] transition-colors">`);
      push_element($$renderer2, "a", 196, 5);
      $$renderer2.push(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">`);
      push_element($$renderer2, "svg", 197, 6);
      $$renderer2.push(`<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z">`);
      push_element($$renderer2, "path", 197, 187);
      $$renderer2.push(`</path>`);
      pop_element();
      $$renderer2.push(`<polyline points="9 22 9 12 15 12 15 22">`);
      push_element($$renderer2, "polyline", 197, 245);
      $$renderer2.push(`</polyline>`);
      pop_element();
      $$renderer2.push(`</svg>`);
      pop_element();
      $$renderer2.push(` Kembali ke Login Sekolah</a>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <p${attr_class(`text-center text-xs ${stringify("text-[#64748b]")}`)}>`);
      push_element($$renderer2, "p", 201, 4);
      $$renderer2.push(`Default superadmin: <strong${attr_class("text-[#94a3b8]")}>`);
      push_element($$renderer2, "strong", 202, 25);
      $$renderer2.push(`superadmin</strong>`);
      pop_element();
      $$renderer2.push(` / <strong${attr_class("text-[#94a3b8]")}>`);
      push_element($$renderer2, "strong", 202, 127);
      $$renderer2.push(`superadmin</strong>`);
      pop_element();
      $$renderer2.push(`</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
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

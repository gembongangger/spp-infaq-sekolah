import { i as store_get, n as head, j as attr, u as unsubscribe_stores, F as FILENAME } from "../../../chunks/index4.js";
import { a as authStore } from "../../../chunks/Icon.js";
import { g as goto } from "../../../chunks/client.js";
import { H as Heart_handshake } from "../../../chunks/heart-handshake.js";
import { M as Mail } from "../../../chunks/mail.js";
import { L as Lock, E as Eye } from "../../../chunks/lock.js";
import { p as push_element, a as pop_element } from "../../../chunks/dev.js";
_page[FILENAME] = "src/routes/login/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      var $$store_subs;
      let email = "";
      let password = "";
      let isLoading = false;
      if (store_get($$store_subs ??= {}, "$authStore", authStore).isAuthenticated) {
        if (store_get($$store_subs ??= {}, "$authStore", authStore).user?.role === "superadmin") {
          goto();
        } else {
          goto();
        }
      }
      head("1x05zx6", $$renderer2, ($$renderer3) => {
        $$renderer3.title(($$renderer4) => {
          $$renderer4.push(`<title>Login - Sistem Informasi Infaq &amp; Jariyah</title>`);
        });
      });
      $$renderer2.push(`<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] py-12 px-4 sm:px-6 lg:px-8">`);
      push_element($$renderer2, "div", 56, 0);
      $$renderer2.push(`<div class="w-full max-w-md">`);
      push_element($$renderer2, "div", 57, 1);
      $$renderer2.push(`<div class="text-center mb-8">`);
      push_element($$renderer2, "div", 59, 2);
      $$renderer2.push(`<div class="flex justify-center items-center gap-3 mb-4">`);
      push_element($$renderer2, "div", 60, 3);
      $$renderer2.push(`<div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#10b981] to-[#a855f7] shadow-lg shadow-emerald-500/20">`);
      push_element($$renderer2, "div", 61, 4);
      Heart_handshake($$renderer2, { size: 28, color: "#fff" });
      $$renderer2.push(`<!----></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <h1 class="text-3xl font-extrabold text-[#f1f5f9]">`);
      push_element($$renderer2, "h1", 65, 3);
      $$renderer2.push(`Sistem Informasi Infaq &amp; Jariyah</h1>`);
      pop_element();
      $$renderer2.push(` <p class="mt-2 text-sm text-[#94a3b8]">`);
      push_element($$renderer2, "p", 68, 3);
      $$renderer2.push(`Silakan login untuk melanjutkan</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="rounded-2xl p-8 bg-[#1e293b] border border-[#334155] shadow-xl">`);
      push_element($$renderer2, "div", 74, 2);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <form class="space-y-6">`);
      push_element($$renderer2, "form", 82, 3);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 83, 4);
      $$renderer2.push(`<label for="email" class="block text-xs font-medium mb-2 text-[#64748b] uppercase tracking-wider">`);
      push_element($$renderer2, "label", 84, 5);
      $$renderer2.push(`Email</label>`);
      pop_element();
      $$renderer2.push(` <div class="relative">`);
      push_element($$renderer2, "div", 87, 5);
      $$renderer2.push(`<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">`);
      push_element($$renderer2, "div", 88, 6);
      Mail($$renderer2, { size: 18, class: "text-[#64748b]" });
      $$renderer2.push(`<!----></div>`);
      pop_element();
      $$renderer2.push(` <input id="email" type="email"${attr("value", email)} placeholder="nama@email.com" required="" class="w-full pl-11 pr-4 py-3 rounded-xl text-sm bg-[#0f172a] border border-[#334155] text-[#f1f5f9] placeholder-[#475569] focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-transparent transition-all" autocomplete="email"/>`);
      push_element($$renderer2, "input", 91, 6);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 103, 4);
      $$renderer2.push(`<label for="password" class="block text-xs font-medium mb-2 text-[#64748b] uppercase tracking-wider">`);
      push_element($$renderer2, "label", 104, 5);
      $$renderer2.push(`Password</label>`);
      pop_element();
      $$renderer2.push(` <div class="relative">`);
      push_element($$renderer2, "div", 107, 5);
      $$renderer2.push(`<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">`);
      push_element($$renderer2, "div", 108, 6);
      Lock($$renderer2, { size: 18, class: "text-[#64748b]" });
      $$renderer2.push(`<!----></div>`);
      pop_element();
      $$renderer2.push(` <input id="password"${attr("type", "password")}${attr("value", password)} placeholder="••••••••" required="" class="w-full pl-11 pr-12 py-3 rounded-xl text-sm bg-[#0f172a] border border-[#334155] text-[#f1f5f9] placeholder-[#475569] focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-transparent transition-all" autocomplete="current-password"/>`);
      push_element($$renderer2, "input", 111, 6);
      pop_element();
      $$renderer2.push(` <button type="button" class="absolute inset-y-0 right-0 pr-4 flex items-center text-[#64748b] hover:text-[#94a3b8] transition-colors">`);
      push_element($$renderer2, "button", 120, 6);
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
      $$renderer2.push(` <div class="flex items-center justify-between">`);
      push_element($$renderer2, "div", 134, 4);
      $$renderer2.push(`<div class="flex items-center">`);
      push_element($$renderer2, "div", 135, 5);
      $$renderer2.push(`<input id="remember-me" type="checkbox" class="h-4 w-4 rounded border-[#334155] bg-[#0f172a] text-[#10b981] focus:ring-[#10b981] focus:ring-offset-0"/>`);
      push_element($$renderer2, "input", 136, 6);
      pop_element();
      $$renderer2.push(` <label for="remember-me" class="ml-2 block text-xs text-[#64748b]">`);
      push_element($$renderer2, "label", 141, 6);
      $$renderer2.push(`Ingat saya</label>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <a href="/reset-password" class="text-xs text-[#10b981] hover:text-[#059669] transition-colors">`);
      push_element($$renderer2, "a", 145, 5);
      $$renderer2.push(`Lupa password?</a>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <button type="submit"${attr("disabled", isLoading, true)} class="w-full py-3 px-4 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#10b981] to-[#059669] text-white hover:from-[#059669] hover:to-[#047857] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#10b981] focus:ring-offset-[#1e293b] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">`);
      push_element($$renderer2, "button", 153, 4);
      {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<span>`);
        push_element($$renderer2, "span", 162, 6);
        $$renderer2.push(`Masuk</span>`);
        pop_element();
        $$renderer2.push(` <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">`);
        push_element($$renderer2, "svg", 163, 6);
        $$renderer2.push(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3">`);
        push_element($$renderer2, "path", 164, 7);
        $$renderer2.push(`</path>`);
        pop_element();
        $$renderer2.push(`</svg>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></button>`);
      pop_element();
      $$renderer2.push(`</form>`);
      pop_element();
      $$renderer2.push(` <div class="mt-6 pt-6 border-t border-[#334155] space-y-4">`);
      push_element($$renderer2, "div", 170, 3);
      $$renderer2.push(`<div class="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">`);
      push_element($$renderer2, "div", 171, 4);
      $$renderer2.push(`<p class="text-xs text-[#64748b] mb-2 font-medium uppercase tracking-wider">`);
      push_element($$renderer2, "p", 172, 5);
      $$renderer2.push(`Akses Khusus</p>`);
      pop_element();
      $$renderer2.push(` <a href="/superadmin/login" class="inline-flex items-center gap-2 text-sm font-semibold text-[#3b82f6] hover:text-[#60a5fa] transition-colors">`);
      push_element($$renderer2, "a", 173, 5);
      $$renderer2.push(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">`);
      push_element($$renderer2, "svg", 174, 6);
      $$renderer2.push(`<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10">`);
      push_element($$renderer2, "path", 174, 187);
      $$renderer2.push(`</path>`);
      pop_element();
      $$renderer2.push(`</svg>`);
      pop_element();
      $$renderer2.push(` Login sebagai Superadmin</a>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <p class="text-center text-xs text-[#64748b]">`);
      push_element($$renderer2, "p", 178, 4);
      $$renderer2.push(`Default login: <strong class="text-[#94a3b8]">`);
      push_element($$renderer2, "strong", 179, 20);
      $$renderer2.push(`admininfaqmajesa@gmail.com</strong>`);
      pop_element();
      $$renderer2.push(` / <strong class="text-[#94a3b8]">`);
      push_element($$renderer2, "strong", 179, 89);
      $$renderer2.push(`admin123</strong>`);
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

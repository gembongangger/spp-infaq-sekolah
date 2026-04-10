import { h as head, k as attr, F as FILENAME } from "../../../chunks/index4.js";
import "../../../chunks/auth-store.js";
import "../../../chunks/client.js";
import "../../../chunks/Spinner.js";
import { A as Arrow_left } from "../../../chunks/arrow-left.js";
import { M as Mail } from "../../../chunks/mail.js";
import { p as push_element, a as pop_element } from "../../../chunks/dev.js";
_page[FILENAME] = "src/routes/reset-password/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let email = "";
      let isLoading = false;
      head("gimkg8", $$renderer2, ($$renderer3) => {
        $$renderer3.title(($$renderer4) => {
          $$renderer4.push(`<title>Reset Password - Sistem Informasi Infaq &amp; Jariyah</title>`);
        });
      });
      $$renderer2.push(`<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] py-12 px-4 sm:px-6 lg:px-8">`);
      push_element($$renderer2, "div", 39, 0);
      $$renderer2.push(`<div class="w-full max-w-md">`);
      push_element($$renderer2, "div", 40, 1);
      $$renderer2.push(`<button class="mb-6 flex items-center gap-2 text-sm text-[#94a3b8] hover:text-[#f1f5f9] transition-colors">`);
      push_element($$renderer2, "button", 42, 2);
      Arrow_left($$renderer2, { size: 16 });
      $$renderer2.push(`<!----> <span>`);
      push_element($$renderer2, "span", 47, 3);
      $$renderer2.push(`Kembali ke Login</span>`);
      pop_element();
      $$renderer2.push(`</button>`);
      pop_element();
      $$renderer2.push(` <div class="rounded-2xl p-8 bg-[#1e293b] border border-[#334155] shadow-xl">`);
      push_element($$renderer2, "div", 51, 2);
      $$renderer2.push(`<div class="text-center mb-6">`);
      push_element($$renderer2, "div", 53, 3);
      $$renderer2.push(`<div class="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#10b981] to-[#059669] shadow-lg shadow-emerald-500/20 mx-auto mb-4">`);
      push_element($$renderer2, "div", 54, 4);
      Mail($$renderer2, { size: 32, color: "#fff" });
      $$renderer2.push(`<!----></div>`);
      pop_element();
      $$renderer2.push(` <h1 class="text-2xl font-bold text-[#f1f5f9]">`);
      push_element($$renderer2, "h1", 57, 4);
      $$renderer2.push(`Reset Password</h1>`);
      pop_element();
      $$renderer2.push(` <p class="mt-2 text-sm text-[#94a3b8]">`);
      push_element($$renderer2, "p", 60, 4);
      $$renderer2.push(`Masukkan email admin yang terdaftar untuk reset password</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<form class="space-y-6">`);
        push_element($$renderer2, "form", 119, 4);
        $$renderer2.push(`<div>`);
        push_element($$renderer2, "div", 120, 5);
        $$renderer2.push(`<label for="email" class="block text-xs font-medium mb-2 text-[#64748b] uppercase tracking-wider">`);
        push_element($$renderer2, "label", 121, 6);
        $$renderer2.push(`Email Admin</label>`);
        pop_element();
        $$renderer2.push(` <div class="relative">`);
        push_element($$renderer2, "div", 124, 6);
        $$renderer2.push(`<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">`);
        push_element($$renderer2, "div", 125, 7);
        Mail($$renderer2, { size: 18, class: "text-[#64748b]" });
        $$renderer2.push(`<!----></div>`);
        pop_element();
        $$renderer2.push(` <input id="email" type="email"${attr("value", email)} placeholder="admin@contoh.com" required="" class="w-full pl-11 pr-4 py-3 rounded-xl text-sm bg-[#0f172a] border border-[#334155] text-[#f1f5f9] placeholder-[#475569] focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-transparent transition-all" autocomplete="email"/>`);
        push_element($$renderer2, "input", 128, 7);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <p class="mt-2 text-xs text-[#64748b]">`);
        push_element($$renderer2, "p", 138, 6);
        $$renderer2.push(`💡 Email admin yang terdaftar: <strong class="text-[#94a3b8]">`);
        push_element($$renderer2, "strong", 139, 38);
        $$renderer2.push(`admininfaqmajesa@gmail.com</strong>`);
        pop_element();
        $$renderer2.push(`</p>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <button type="submit"${attr("disabled", isLoading, true)} class="w-full py-3 px-4 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#10b981] to-[#059669] text-white hover:from-[#059669] hover:to-[#047857] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#10b981] focus:ring-offset-[#1e293b] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">`);
        push_element($$renderer2, "button", 143, 5);
        {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<span>`);
          push_element($$renderer2, "span", 152, 7);
          $$renderer2.push(`Reset Password</span>`);
          pop_element();
          $$renderer2.push(` <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">`);
          push_element($$renderer2, "svg", 153, 7);
          $$renderer2.push(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3">`);
          push_element($$renderer2, "path", 154, 8);
          $$renderer2.push(`</path>`);
          pop_element();
          $$renderer2.push(`</svg>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--></button>`);
        pop_element();
        $$renderer2.push(`</form>`);
        pop_element();
        $$renderer2.push(` <div class="mt-6 pt-6 border-t border-[#334155]">`);
        push_element($$renderer2, "div", 160, 4);
        $$renderer2.push(`<div class="p-4 rounded-xl bg-[#0f172a] border border-[#334155]">`);
        push_element($$renderer2, "div", 161, 5);
        $$renderer2.push(`<h3 class="text-xs font-semibold text-[#94a3b8] mb-2">`);
        push_element($$renderer2, "h3", 162, 6);
        $$renderer2.push(`📝 Cara Reset Password:</h3>`);
        pop_element();
        $$renderer2.push(` <ol class="text-xs text-[#64748b] space-y-1.5 list-decimal list-inside">`);
        push_element($$renderer2, "ol", 163, 6);
        $$renderer2.push(`<li>`);
        push_element($$renderer2, "li", 164, 7);
        $$renderer2.push(`Masukkan email admin yang terdaftar</li>`);
        pop_element();
        $$renderer2.push(` <li>`);
        push_element($$renderer2, "li", 165, 7);
        $$renderer2.push(`Klik tombol "Reset Password"</li>`);
        pop_element();
        $$renderer2.push(` <li>`);
        push_element($$renderer2, "li", 166, 7);
        $$renderer2.push(`Salin password sementara yang ditampilkan</li>`);
        pop_element();
        $$renderer2.push(` <li>`);
        push_element($$renderer2, "li", 167, 7);
        $$renderer2.push(`Login dengan password sementara tersebut</li>`);
        pop_element();
        $$renderer2.push(` <li>`);
        push_element($$renderer2, "li", 168, 7);
        $$renderer2.push(`Segera ubah password setelah login</li>`);
        pop_element();
        $$renderer2.push(`</ol>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
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

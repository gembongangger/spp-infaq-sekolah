import { i as store_get, n as head, j as attr, u as unsubscribe_stores } from "../../../chunks/index4.js";
import { a as authStore } from "../../../chunks/Icon.js";
import { g as goto } from "../../../chunks/client.js";
import { H as Heart_handshake, L as Lock, E as Eye } from "../../../chunks/lock.js";
import { M as Mail } from "../../../chunks/mail.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let email = "";
    let password = "";
    let isLoading = false;
    if (store_get($$store_subs ??= {}, "$authStore", authStore).isAuthenticated) {
      goto();
    }
    head("1x05zx6", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Login - Sistem Informasi Infaq &amp; Jariyah</title>`);
      });
    });
    $$renderer2.push(`<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] py-12 px-4 sm:px-6 lg:px-8"><div class="w-full max-w-md"><div class="text-center mb-8"><div class="flex justify-center items-center gap-3 mb-4"><div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#10b981] to-[#a855f7] shadow-lg shadow-emerald-500/20">`);
    Heart_handshake($$renderer2, { size: 28, color: "#fff" });
    $$renderer2.push(`<!----></div></div> <h1 class="text-3xl font-extrabold text-[#f1f5f9]">Sistem Informasi Infaq &amp; Jariyah</h1> <p class="mt-2 text-sm text-[#94a3b8]">Silakan login untuk melanjutkan</p></div> <div class="rounded-2xl p-8 bg-[#1e293b] border border-[#334155] shadow-xl">`);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <form class="space-y-6"><div><label for="email" class="block text-xs font-medium mb-2 text-[#64748b] uppercase tracking-wider">Email</label> <div class="relative"><div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">`);
    Mail($$renderer2, { size: 18, class: "text-[#64748b]" });
    $$renderer2.push(`<!----></div> <input id="email" type="email"${attr("value", email)} placeholder="nama@email.com" required="" class="w-full pl-11 pr-4 py-3 rounded-xl text-sm bg-[#0f172a] border border-[#334155] text-[#f1f5f9] placeholder-[#475569] focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-transparent transition-all" autocomplete="email"/></div></div> <div><label for="password" class="block text-xs font-medium mb-2 text-[#64748b] uppercase tracking-wider">Password</label> <div class="relative"><div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">`);
    Lock($$renderer2, { size: 18, class: "text-[#64748b]" });
    $$renderer2.push(`<!----></div> <input id="password"${attr("type", "password")}${attr("value", password)} placeholder="••••••••" required="" class="w-full pl-11 pr-12 py-3 rounded-xl text-sm bg-[#0f172a] border border-[#334155] text-[#f1f5f9] placeholder-[#475569] focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-transparent transition-all" autocomplete="current-password"/> <button type="button" class="absolute inset-y-0 right-0 pr-4 flex items-center text-[#64748b] hover:text-[#94a3b8] transition-colors">`);
    {
      $$renderer2.push("<!--[-1-->");
      Eye($$renderer2, { size: 18 });
    }
    $$renderer2.push(`<!--]--></button></div></div> <div class="flex items-center justify-between"><div class="flex items-center"><input id="remember-me" type="checkbox" class="h-4 w-4 rounded border-[#334155] bg-[#0f172a] text-[#10b981] focus:ring-[#10b981] focus:ring-offset-0"/> <label for="remember-me" class="ml-2 block text-xs text-[#64748b]">Ingat saya</label></div> <a href="/reset-password" class="text-xs text-[#10b981] hover:text-[#059669] transition-colors">Lupa password?</a></div> <button type="submit"${attr("disabled", isLoading, true)} class="w-full py-3 px-4 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#10b981] to-[#059669] text-white hover:from-[#059669] hover:to-[#047857] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#10b981] focus:ring-offset-[#1e293b] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">`);
    {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<span>Masuk</span> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>`);
    }
    $$renderer2.push(`<!--]--></button></form> <div class="mt-6 pt-6 border-t border-[#334155]"><p class="text-center text-xs text-[#64748b]">Default login: <strong class="text-[#94a3b8]">gembongangger@gmail.com</strong> / <strong class="text-[#94a3b8]">admin123</strong></p></div></div></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};

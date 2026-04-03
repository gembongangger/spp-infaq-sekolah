import { n as head, j as attr } from "../../../chunks/index4.js";
import "../../../chunks/Icon.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/root.js";
import "../../../chunks/state.svelte.js";
import { A as Arrow_left } from "../../../chunks/arrow-left.js";
import { M as Mail } from "../../../chunks/mail.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let email = "";
    let isLoading = false;
    head("gimkg8", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Reset Password - Sistem Informasi Infaq &amp; Jariyah</title>`);
      });
    });
    $$renderer2.push(`<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] py-12 px-4 sm:px-6 lg:px-8"><div class="w-full max-w-md"><button class="mb-6 flex items-center gap-2 text-sm text-[#94a3b8] hover:text-[#f1f5f9] transition-colors">`);
    Arrow_left($$renderer2, { size: 16 });
    $$renderer2.push(`<!----> <span>Kembali ke Login</span></button> <div class="rounded-2xl p-8 bg-[#1e293b] border border-[#334155] shadow-xl"><div class="text-center mb-6"><div class="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#10b981] to-[#059669] shadow-lg shadow-emerald-500/20 mx-auto mb-4">`);
    Mail($$renderer2, { size: 32, color: "#fff" });
    $$renderer2.push(`<!----></div> <h1 class="text-2xl font-bold text-[#f1f5f9]">Reset Password</h1> <p class="mt-2 text-sm text-[#94a3b8]">Masukkan email admin yang terdaftar untuk reset password</p></div> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<form class="space-y-6"><div><label for="email" class="block text-xs font-medium mb-2 text-[#64748b] uppercase tracking-wider">Email Admin</label> <div class="relative"><div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">`);
      Mail($$renderer2, { size: 18, class: "text-[#64748b]" });
      $$renderer2.push(`<!----></div> <input id="email" type="email"${attr("value", email)} placeholder="admin@contoh.com" required="" class="w-full pl-11 pr-4 py-3 rounded-xl text-sm bg-[#0f172a] border border-[#334155] text-[#f1f5f9] placeholder-[#475569] focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-transparent transition-all" autocomplete="email"/></div> <p class="mt-2 text-xs text-[#64748b]">💡 Email admin yang terdaftar: <strong class="text-[#94a3b8]">gembongangger@gmail.com</strong></p></div> <button type="submit"${attr("disabled", isLoading, true)} class="w-full py-3 px-4 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#10b981] to-[#059669] text-white hover:from-[#059669] hover:to-[#047857] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#10b981] focus:ring-offset-[#1e293b] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">`);
      {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<span>Reset Password</span> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>`);
      }
      $$renderer2.push(`<!--]--></button></form> <div class="mt-6 pt-6 border-t border-[#334155]"><div class="p-4 rounded-xl bg-[#0f172a] border border-[#334155]"><h3 class="text-xs font-semibold text-[#94a3b8] mb-2">📝 Cara Reset Password:</h3> <ol class="text-xs text-[#64748b] space-y-1.5 list-decimal list-inside"><li>Masukkan email admin yang terdaftar</li> <li>Klik tombol "Reset Password"</li> <li>Salin password sementara yang ditampilkan</li> <li>Login dengan password sementara tersebut</li> <li>Segera ubah password setelah login</li></ol></div></div>`);
    }
    $$renderer2.push(`<!--]--></div></div></div>`);
  });
}
export {
  _page as default
};

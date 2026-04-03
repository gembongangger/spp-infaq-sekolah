import { n as head, a as attr_class, s as stringify, j as attr, e as escape_html, f as ensure_array_like, h as derived } from "../../../chunks/index4.js";
import "../../../chunks/Icon.js";
import "../../../chunks/stores.js";
import { S as Search, f as formatRupiah, H as History, U as User } from "../../../chunks/user2.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/root.js";
import "../../../chunks/state.svelte.js";
import { A as Arrow_left } from "../../../chunks/arrow-left.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let searchQuery = "";
    let pagination = { total: 0 };
    let studentsWithStats = [];
    const cardBg = derived(() => "bg-[#1e293b]");
    const cardBorder = derived(() => "border-[#334155]");
    const inputBg = derived(() => "bg-[#0f172a]");
    const inputBorder = derived(() => "border-[#334155]");
    const inputText = derived(() => "text-[#f1f5f9]");
    const inputPlaceholder = derived(
      () => "placeholder:text-[#475569]"
    );
    const textMuted = derived(() => "text-[#94a3b8]");
    const textSecondary = derived(() => "text-[#cbd5e1]");
    const tableHeaderBg = derived(() => "bg-[#0f172a]");
    const tableRowBorder = derived(() => "border-[#1e293b]");
    const tableRowHover = derived(() => "hover:bg-[#334155]/30");
    head("1dbxbgy", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Cetak Riwayat Transaksi - Infaq &amp; Jariyah</title>`);
      });
    });
    $$renderer2.push(`<div${attr_class(`min-h-screen ${stringify(
      "bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]"
    )}`)}><div class="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8"><div class="mb-8"><button${attr_class(`text-sm ${stringify(textMuted())} hover:${stringify("text-[#f1f5f9]")} transition-colors flex items-center gap-2 mb-4`, "svelte-1dbxbgy")}>`);
    Arrow_left($$renderer2, { size: 16 });
    $$renderer2.push(`<!----> <span>Kembali ke Dashboard</span></button> <h1${attr_class(`text-2xl font-bold ${stringify("text-[#f1f5f9]")}`)}>📋 Cetak Riwayat Transaksi Siswa</h1> <p${attr_class(`text-sm ${stringify(textMuted())} mt-1`, "svelte-1dbxbgy")}>Cari nama siswa untuk melihat dan mencetak riwayat transaksi</p></div> `);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="fade-in svelte-1dbxbgy"><div${attr_class(`rounded-2xl overflow-hidden ${stringify(cardBg())} ${stringify(cardBorder())} mb-6`, "svelte-1dbxbgy")}><div class="p-6"><div class="relative">`);
      Search($$renderer2, {
        size: 20,
        class: `absolute left-4 top-1/2 -translate-y-1/2 ${stringify(textMuted())}`
      });
      $$renderer2.push(`<!----> <input type="text"${attr("value", searchQuery)} placeholder="Cari nama siswa, nomor akun, atau kelas..."${attr_class(`w-full pl-12 pr-12 py-3.5 rounded-xl text-base ${stringify(inputBg())} ${stringify(inputBorder())} ${stringify(inputText())} ${stringify(inputPlaceholder())} focus:outline-none focus:ring-2 focus:ring-[#10b988] transition-all`, "svelte-1dbxbgy")} autofocus=""/> `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div></div></div> <div${attr_class(`rounded-2xl overflow-hidden ${stringify(cardBg())} ${stringify(cardBorder())}`, "svelte-1dbxbgy")}><div${attr_class(`p-4 border-b ${stringify(cardBorder())} flex items-center justify-between`, "svelte-1dbxbgy")}><p${attr_class(`text-sm ${stringify(textMuted())}`, "svelte-1dbxbgy")}>`);
      {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`Total ${escape_html(pagination.total)} siswa`);
      }
      $$renderer2.push(`<!--]--></p> `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div> `);
      if (studentsWithStats.length > 0) {
        $$renderer2.push("<!--[1-->");
        $$renderer2.push(`<div class="overflow-x-auto"><table class="w-full text-sm"><thead><tr${attr_class(tableHeaderBg(), "svelte-1dbxbgy")}><th${attr_class(`text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider ${stringify(textMuted())}`, "svelte-1dbxbgy")}>No. Akun</th><th${attr_class(`text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider ${stringify(textMuted())}`, "svelte-1dbxbgy")}>Nama Siswa</th><th${attr_class(`text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider ${stringify(textMuted())}`, "svelte-1dbxbgy")}>Kelas</th><th class="text-right px-5 py-3 font-semibold text-xs uppercase tracking-wider text-[#10b981]">Total Infaq</th><th class="text-right px-5 py-3 font-semibold text-xs uppercase tracking-wider text-[#a855f7]">Total Jariyah</th><th${attr_class(`text-center px-5 py-3 font-semibold text-xs uppercase tracking-wider ${stringify(textMuted())}`, "svelte-1dbxbgy")}>Aksi</th></tr></thead><tbody><!--[-->`);
        const each_array = ensure_array_like(studentsWithStats);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let student = each_array[$$index];
          $$renderer2.push(`<tr${attr_class(`border-t ${stringify(tableRowBorder())} transition-all duration-150 ${stringify(tableRowHover())}`, "svelte-1dbxbgy")}><td class="px-5 py-3 text-sm font-semibold text-[#10b981]">#${escape_html(student.nomorAkun)}</td><td${attr_class(`px-5 py-3 text-sm ${stringify(textSecondary())}`, "svelte-1dbxbgy")}>${escape_html(student.nama)}</td><td${attr_class(`px-5 py-3 text-sm ${stringify(textSecondary())}`, "svelte-1dbxbgy")}>${escape_html(student.kelas)}</td><td class="px-5 py-3 text-sm text-right font-medium text-[#10b981]">${escape_html(formatRupiah(student.totalInfaq))}</td><td class="px-5 py-3 text-sm text-right font-medium text-[#a855f7]">${escape_html(formatRupiah(student.totalJariyah))}</td><td class="px-5 py-3 text-center"><button class="px-4 py-2 rounded-lg bg-[#10b981] hover:bg-[#059669] text-white text-sm font-medium transition-colors flex items-center gap-2 mx-auto">`);
          History($$renderer2, { size: 16 });
          $$renderer2.push(`<!----> <span>Lihat Riwayat</span></button></td></tr>`);
        }
        $$renderer2.push(`<!--]--></tbody></table></div> `);
        {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]-->`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<div class="py-12 text-center">`);
        User($$renderer2, { size: 48, class: `mx-auto mb-3 ${stringify(textMuted())}` });
        $$renderer2.push(`<!----> <p${attr_class(`text-sm ${stringify(textMuted())}`, "svelte-1dbxbgy")}>${escape_html("Belum ada data siswa")}</p></div>`);
      }
      $$renderer2.push(`<!--]--></div></div>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
  });
}
export {
  _page as default
};

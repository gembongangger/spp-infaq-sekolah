import { l as head, a as attr_class, s as stringify, j as attr, e as escape_html, f as ensure_array_like, h as derived, F as FILENAME } from "../../../chunks/index4.js";
import "../../../chunks/Icon.js";
import "../../../chunks/stores.js";
import { f as formatRupiah } from "../../../chunks/utils2.js";
import { p as push_element, a as pop_element } from "../../../chunks/dev.js";
import "../../../chunks/client.js";
import { A as Arrow_left } from "../../../chunks/arrow-left.js";
import { S as Search } from "../../../chunks/search.js";
import { H as History } from "../../../chunks/history.js";
import { U as User } from "../../../chunks/user2.js";
_page[FILENAME] = "src/routes/pengirim/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
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
      )}`)}>`);
      push_element($$renderer2, "div", 235, 0);
      $$renderer2.push(`<div class="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">`);
      push_element($$renderer2, "div", 236, 1);
      $$renderer2.push(`<div class="mb-8">`);
      push_element($$renderer2, "div", 238, 2);
      $$renderer2.push(`<button${attr_class(`text-sm ${stringify(textMuted())} hover:${stringify("text-[#f1f5f9]")} transition-colors flex items-center gap-2 mb-4`, "svelte-1dbxbgy")}>`);
      push_element($$renderer2, "button", 239, 3);
      Arrow_left($$renderer2, { size: 16 });
      $$renderer2.push(`<!----> <span>`);
      push_element($$renderer2, "span", 244, 4);
      $$renderer2.push(`Kembali ke Dashboard</span>`);
      pop_element();
      $$renderer2.push(`</button>`);
      pop_element();
      $$renderer2.push(` <h1${attr_class(`text-2xl font-bold ${stringify("text-[#f1f5f9]")}`)}>`);
      push_element($$renderer2, "h1", 246, 3);
      $$renderer2.push(`📋 Cetak Riwayat Transaksi Siswa</h1>`);
      pop_element();
      $$renderer2.push(` <p${attr_class(`text-sm ${stringify(textMuted())} mt-1`, "svelte-1dbxbgy")}>`);
      push_element($$renderer2, "p", 249, 3);
      $$renderer2.push(`Cari nama siswa untuk melihat dan mencetak riwayat transaksi</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="fade-in svelte-1dbxbgy">`);
        push_element($$renderer2, "div", 256, 3);
        $$renderer2.push(`<div${attr_class(`rounded-2xl overflow-hidden ${stringify(cardBg())} ${stringify(cardBorder())} mb-6`, "svelte-1dbxbgy")}>`);
        push_element($$renderer2, "div", 258, 4);
        $$renderer2.push(`<div class="p-6">`);
        push_element($$renderer2, "div", 259, 5);
        $$renderer2.push(`<div class="relative">`);
        push_element($$renderer2, "div", 260, 6);
        Search($$renderer2, {
          size: 20,
          class: `absolute left-4 top-1/2 -translate-y-1/2 ${stringify(textMuted())}`
        });
        $$renderer2.push(`<!----> <input type="text"${attr("value", searchQuery)} placeholder="Cari nama siswa, nomor akun, atau kelas..."${attr_class(`w-full pl-12 pr-12 py-3.5 rounded-xl text-base ${stringify(inputBg())} ${stringify(inputBorder())} ${stringify(inputText())} ${stringify(inputPlaceholder())} focus:outline-none focus:ring-2 focus:ring-[#10b988] transition-all`, "svelte-1dbxbgy")} autofocus=""/>`);
        push_element($$renderer2, "input", 265, 7);
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
        $$renderer2.push(` <div${attr_class(`rounded-2xl overflow-hidden ${stringify(cardBg())} ${stringify(cardBorder())}`, "svelte-1dbxbgy")}>`);
        push_element($$renderer2, "div", 287, 4);
        $$renderer2.push(`<div${attr_class(`p-4 border-b ${stringify(cardBorder())} flex items-center justify-between`, "svelte-1dbxbgy")}>`);
        push_element($$renderer2, "div", 288, 5);
        $$renderer2.push(`<p${attr_class(`text-sm ${stringify(textMuted())}`, "svelte-1dbxbgy")}>`);
        push_element($$renderer2, "p", 289, 6);
        {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`Total ${escape_html(pagination.total)} siswa`);
        }
        $$renderer2.push(`<!--]--></p>`);
        pop_element();
        $$renderer2.push(` `);
        {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
        $$renderer2.push(` `);
        if (studentsWithStats.length > 0) {
          $$renderer2.push("<!--[1-->");
          $$renderer2.push(`<div class="overflow-x-auto">`);
          push_element($$renderer2, "div", 309, 6);
          $$renderer2.push(`<table class="w-full text-sm">`);
          push_element($$renderer2, "table", 310, 7);
          $$renderer2.push(`<thead>`);
          push_element($$renderer2, "thead", 311, 8);
          $$renderer2.push(`<tr${attr_class(tableHeaderBg(), "svelte-1dbxbgy")}>`);
          push_element($$renderer2, "tr", 312, 9);
          $$renderer2.push(`<th${attr_class(`text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider ${stringify(textMuted())}`, "svelte-1dbxbgy")}>`);
          push_element($$renderer2, "th", 313, 10);
          $$renderer2.push(`No. Akun</th>`);
          pop_element();
          $$renderer2.push(`<th${attr_class(`text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider ${stringify(textMuted())}`, "svelte-1dbxbgy")}>`);
          push_element($$renderer2, "th", 314, 10);
          $$renderer2.push(`Nama Siswa</th>`);
          pop_element();
          $$renderer2.push(`<th${attr_class(`text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider ${stringify(textMuted())}`, "svelte-1dbxbgy")}>`);
          push_element($$renderer2, "th", 315, 10);
          $$renderer2.push(`Kelas</th>`);
          pop_element();
          $$renderer2.push(`<th class="text-right px-5 py-3 font-semibold text-xs uppercase tracking-wider text-[#10b981]">`);
          push_element($$renderer2, "th", 316, 10);
          $$renderer2.push(`Total Infaq</th>`);
          pop_element();
          $$renderer2.push(`<th class="text-right px-5 py-3 font-semibold text-xs uppercase tracking-wider text-[#a855f7]">`);
          push_element($$renderer2, "th", 317, 10);
          $$renderer2.push(`Total Jariyah</th>`);
          pop_element();
          $$renderer2.push(`<th${attr_class(`text-center px-5 py-3 font-semibold text-xs uppercase tracking-wider ${stringify(textMuted())}`, "svelte-1dbxbgy")}>`);
          push_element($$renderer2, "th", 318, 10);
          $$renderer2.push(`Aksi</th>`);
          pop_element();
          $$renderer2.push(`</tr>`);
          pop_element();
          $$renderer2.push(`</thead>`);
          pop_element();
          $$renderer2.push(`<tbody>`);
          push_element($$renderer2, "tbody", 321, 8);
          $$renderer2.push(`<!--[-->`);
          const each_array = ensure_array_like(studentsWithStats);
          for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
            let student = each_array[$$index];
            $$renderer2.push(`<tr${attr_class(`border-t ${stringify(tableRowBorder())} transition-all duration-150 ${stringify(tableRowHover())}`, "svelte-1dbxbgy")}>`);
            push_element($$renderer2, "tr", 323, 10);
            $$renderer2.push(`<td class="px-5 py-3 text-sm font-semibold text-[#10b981]">`);
            push_element($$renderer2, "td", 324, 11);
            $$renderer2.push(`#${escape_html(student.nomorAkun)}</td>`);
            pop_element();
            $$renderer2.push(`<td${attr_class(`px-5 py-3 text-sm ${stringify(textSecondary())}`, "svelte-1dbxbgy")}>`);
            push_element($$renderer2, "td", 325, 11);
            $$renderer2.push(`${escape_html(student.nama)}</td>`);
            pop_element();
            $$renderer2.push(`<td${attr_class(`px-5 py-3 text-sm ${stringify(textSecondary())}`, "svelte-1dbxbgy")}>`);
            push_element($$renderer2, "td", 326, 11);
            $$renderer2.push(`${escape_html(student.kelas)}</td>`);
            pop_element();
            $$renderer2.push(`<td class="px-5 py-3 text-sm text-right font-medium text-[#10b981]">`);
            push_element($$renderer2, "td", 327, 11);
            $$renderer2.push(`${escape_html(formatRupiah(student.totalInfaq))}</td>`);
            pop_element();
            $$renderer2.push(`<td class="px-5 py-3 text-sm text-right font-medium text-[#a855f7]">`);
            push_element($$renderer2, "td", 328, 11);
            $$renderer2.push(`${escape_html(formatRupiah(student.totalJariyah))}</td>`);
            pop_element();
            $$renderer2.push(`<td class="px-5 py-3 text-center">`);
            push_element($$renderer2, "td", 329, 11);
            $$renderer2.push(`<button class="px-4 py-2 rounded-lg bg-[#10b981] hover:bg-[#059669] text-white text-sm font-medium transition-colors flex items-center gap-2 mx-auto">`);
            push_element($$renderer2, "button", 330, 12);
            History($$renderer2, { size: 16 });
            $$renderer2.push(`<!----> <span>`);
            push_element($$renderer2, "span", 335, 13);
            $$renderer2.push(`Lihat Riwayat</span>`);
            pop_element();
            $$renderer2.push(`</button>`);
            pop_element();
            $$renderer2.push(`</td>`);
            pop_element();
            $$renderer2.push(`</tr>`);
            pop_element();
          }
          $$renderer2.push(`<!--]--></tbody>`);
          pop_element();
          $$renderer2.push(`</table>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(` `);
          {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]-->`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<div class="py-12 text-center">`);
          push_element($$renderer2, "div", 391, 6);
          User($$renderer2, { size: 48, class: `mx-auto mb-3 ${stringify(textMuted())}` });
          $$renderer2.push(`<!----> <p${attr_class(`text-sm ${stringify(textMuted())}`, "svelte-1dbxbgy")}>`);
          push_element($$renderer2, "p", 393, 7);
          $$renderer2.push(`${escape_html("Belum ada data siswa")}</p>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
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

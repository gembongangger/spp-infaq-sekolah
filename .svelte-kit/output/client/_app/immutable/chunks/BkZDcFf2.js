import{V as m,k as c,W as u,y as _,x as h,h as $,f as y}from"./B7coVsXN.js";import{c as b,a as k}from"./DlFoiPLv.js";import"./B7DtM-F5.js";import{I as x,s as E}from"./DCc966oT.js";import{l as S,s as M}from"./bUGJcB6p.js";function z(e,a,n=a){var t=new WeakSet;m(e,"input",async l=>{var r=l?e.defaultValue:e.value;if(r=f(e)?d(r):r,n(r),c!==null&&t.add(c),await u(),r!==(r=a())){var o=e.selectionStart,s=e.selectionEnd,i=e.value.length;if(e.value=r??"",s!==null){var v=e.value.length;o===s&&s===i&&v>i?(e.selectionStart=v,e.selectionEnd=v):(e.selectionStart=o,e.selectionEnd=Math.min(s,v))}}}),($&&e.defaultValue!==e.value||_(a)==null&&e.value)&&(n(f(e)?d(e.value):e.value),c!==null&&t.add(c)),h(()=>{var l=a();if(e===document.activeElement){var r=c;if(t.has(r))return}f(e)&&l===d(e.value)||e.type==="date"&&!l&&!e.value||l!==e.value&&(e.value=l??"")})}function f(e){var a=e.type;return a==="number"||a==="range"}function d(e){return e===""?null:+e}function L(e,a){const n=S(a,["children","$$slots","$$events","$$legacy"]);/**
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
 */const t=[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"}]];x(e,M({name:"mail"},()=>n,{get iconNode(){return t},children:(l,r)=>{var o=b(),s=y(o);E(s,a,"default",{}),k(l,o)},$$slots:{default:!0}}))}export{L as M,z as b};

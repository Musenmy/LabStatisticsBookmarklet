javascript: (async function () {
  var $ = (e) => document.getElementById(e);
  var $A = (q) => document.querySelectorAll(q);
  var $I = "innerHTML";
  var $R = "replace";
  var $C = "createElement";
  $AC = "appendChild";
  var escapeCSV = (v) => `"${(v + "")[$R](/\n/g, "")[$R](/"/g, `""`)}"`;

  let dt = "日時",
    ge = "ジャンル",
    co = "コメ",
    li = "リンク",
    ti = "タイトル",
    vi = "閲覧",
    rp = "リプ",
    ch = "チェーン",
    fv = "いいね",
    st = "スター",
    sh = "シェア",
    th = "</th><th>",
    td = "</td><td>",
    pr = "処理中…";

  let M;
  const u = new URL(window.location.href);
  if (u.hostname != "www.hoyolab.com") return alert`HoYoLABを開いてね`;
  if (u.pathname.startsWith`/accountCenter`) M = 1;
  else if (u.pathname.startsWith`/article`) M = 2;
  else return alert`プロフィールか投稿のページを開いてね`;

  if (M == 1) {
    const uid = window.location.href.match(/[?&]id=([^&]+)/)[1];
    if (!uid) return alert`IDが見つからないよ。URLを確認してね`;

    let d = mD();
    let C = !1;
    let DC = $("CT");
    let Cb = $("Cb");

    Cb.addEventListener("click", () => {
      C = true;
      d.close();
      document.body.removeChild(d);
    });

    aB("ポスト統計表出力", async () => {
      hB();
      DC[$I] = `${pr}<br><br>`;
      let [a, b, c, d, e, f] = await CPT(uid);
      DC[$I] =
        `合計ポスト数 ${a} / ${vi} ${b} / ${co} ${c} / ${fv} ${d} / ${st} ${e} / ${sh} ${f}` +
        DC[$I][$R](pr, "");
      sB();
    });

    aB("コメ統計表出力", async () => {
      hB();
      DC[$I] = `${pr}<br><br>`;
      let [a, b, c] = await CCT(uid);
      DC[$I] = `合計コメ数 ${a} / ${rp} ${b} / ${fv} ${c}` + DC[$I][$R](pr, "");
      sB();
    });

    async function CPT(uid) {
      let csvContent = "\uFEFF";
      let next_offset = 0;
      let [postCount, viewCount, comCount, favCount, bmCount, shareCount] = [
        0, 0, 0, 0, 0, 0,
      ];
      let is_last = false;
      const TB = document[$C]("table");
      DC[$AC](TB);
      const thead = document[$C]("tr");
      thead[$I] = `<th>${
        dt +
        th +
        ge +
        th +
        ti +
        li +
        th +
        vi +
        th +
        co +
        th +
        fv +
        th +
        st +
        th +
        sh
      }</th>`;
      TB[$AC](thead);
      csvContent +=
        [dt, ge, li, ti, vi, co, fv, st, sh].map(escapeCSV).join(",") + "\r\n";
      do {
        if (C) return;
        const url = `https://bbs-api-os.hoyolab.com/community/post/wapi/userPost?offset=${next_offset}&size=20&uid=${uid}`;
        try {
          const json = await (await fetch(url)).json();
          json.data.list.forEach((postInfo) => {
            const {
              post: { post_id, created_at, subject },
              stat: { view_num, reply_num, like_num, bookmark_num, share_num },
              game: { game_name },
            } = postInfo;
            const createdTime = JST(created_at);
            const postUrl = `https://www.hoyolab.com/article/${post_id}`;
            const tr = document[$C]("tr");
            tr[$I] = `<td>${
              createdTime + td + game_name + td
            }<a href="${postUrl}" target="_blank">${subject}</a>${
              td +
              view_num +
              td +
              reply_num +
              td +
              like_num +
              td +
              bookmark_num +
              td +
              share_num
            }</td>`;
            TB[$AC](tr);
            csvContent +=
              [
                createdTime,
                game_name,
                postUrl,
                subject,
                view_num,
                reply_num,
                like_num,
                bookmark_num,
                share_num,
              ]
                .map(escapeCSV)
                .join(",") + "\r\n";
            viewCount += view_num;
            comCount += reply_num;
            favCount += like_num;
            bmCount += bookmark_num;
            shareCount += share_num;
          });
          postCount += json.data.list.length;
          ({ is_last, next_offset } = json.data);
        } catch (error) {
          DC.textContent = "エラー: " + error.message;
          break;
        }
      } while (!is_last);

      if ($("cD")) $("cD").remove();
      let b = document[$C]("button");
      b.textContent = "CSV保存";
      b.id = "cD";
      b.addEventListener("click", async () => {
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document[$C]("a");
        a.href = url;
        a.download = `userPostSummary-${uid}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      });
      $("BN")[$AC](b);

      return [postCount, viewCount, comCount, favCount, bmCount, shareCount];
    }

    async function CCT(uid) {
      let csvContent = "\uFEFF"; // UTF-8 BOM付きで文字化け防止
      let [O, L, coC, rC, lC] = [0, 0, 0, 0, 0];
      const TB = document[$C]("table");
      DC[$AC](TB);
      const TH = document[$C]("tr");
      TH[$I] = `<th>${
        dt + th + ge + th + co + li + th + rp + th + ch + th + fv
      }</th>`;
      TB[$AC](TH);
      csvContent +=
        [dt, ge, co, li, rp, ch, fv].map(escapeCSV).join(",") + "\r\n";
      do {
        if (C) return;
        try {
          const json = await (
            await fetch(
              `https://bbs-api-os.hoyolab.com/community/post/wapi/userReply?offset=${O}&size=20&uid=${uid}`
            )
          ).json();
          json.data.list.forEach((P) => {
            let {
              reply: { post_id, created_at: cr, content: co, game_name: g },
              stat: { reply_num: r, like_num: l, sub_num: s },
            } = P;
            const createdTime = JST(cr);
            let substr = co.substring(0, 50);
            if (substr.length == 50) substr += "...";
            if (r && !s) s = "--";
            const postUrl = `https://www.hoyolab.com/article/${post_id}`;
            const tr = document[$C]("tr");
            tr[$I] = `<td>${
              createdTime + td + g + td
            }<a href="${postUrl}" target="_blank">${substr}</a>${
              td + r + td + s + td + l
            }</td>`;
            TB[$AC](tr);
            csvContent +=
              [createdTime, g, substr, postUrl, r, s, l]
                .map(escapeCSV)
                .join(",") + "\r\n";
            rC += r;
            lC += l;
          });
          coC += json.data.list.length;
          ({ is_last: L, next_offset: O } = json.data);
        } catch (error) {
          DC.textContent = "エラー: " + error.message;
          break;
        }
      } while (!L);

      if ($("cD")) $("cD").remove();
      let b = document[$C]("button");
      b.textContent = "CSV保存";
      b.id = "cD";
      b.addEventListener("click", async () => {
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document[$C]("a");
        a.href = url;
        a.download = `userReplySummary-${uid}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      });
      $("BN")[$AC](b);

      return [coC, rC, lC];
    }
  }
  if (M == 2) {
    const postId = window.location.href[$R](
      "https://www.hoyolab.com/article/",
      ""
    );
    if (!postId) return alert("投稿が見つからないよ。URLを確認してね");
    await load(
      "https://cdn.jsdelivr.net/npm/dompurify@2.3.10/dist/purify.min.js"
    );
    let dialog = mD();
    let DC = $("CT");
    let Cb = $("Cb");

    Cb.addEventListener("click", () => {
      dialog.close();
      document.body.removeChild(dialog);
    });

    aB("統計カウント", async () => {
      hB();
      DC[$I] = `${pr}<br><br>`;
      const url = `https://bbs-api-os.hoyolab.com/community/post/wapi/getPostFull?post_id=${postId}`;
      try {
        const json = await (await fetch(url)).json();
        let {
          post: { subject, content },
          stat: { view_num, reply_num, like_num, bookmark_num },
          classification: { name },
          game: { game_name },
          collection,
        } = json.data.post;
        const { title } = collection || {};
        const txt = DOMPurify.sanitize(content, {
          ALLOWED_TAGS: [],
          ALLOWED_ATTR: {},
        });
        const L = txt[$R](/\s+/g, "").length;
        DC[
          $I
        ] = `<br>${subject} (${L}文字)<br>閲覧 ${view_num} / コメ ${reply_num} / いいね ${like_num} / スター ${bookmark_num}<br>カテゴリ ${game_name} > ${
          name || "未分類"
        } / コレクション ${title || "なし"}`;
      } catch (error) {
        DC.textContent = "エラー: " + error.message;
      }
      sB();
    });
  }

  function mD() {
    let s = document[$C]("style");
    s.textContent = `html:has(dialog[open]){overflow:hidden}#D::backdrop{backdrop-filter:blur(5px);background:#5558}#D{border-radius:10px;height:80vh;left:10vw;padding:20px;text-align:center;top:10vh;width:80vw}table{border:2px solid #000;border-collapse:collapse;width:100%}th{background-color:#000;border:1px solid #fff;color:#fff}td,th{padding:3px 0}td{border:1px solid #000}td:first-child,td:nth-child(2){width:12%}td:nth-child(n+4){padding-right:3px;text-align:right;width:5%}button{border:none;border-radius:5px;cursor:pointer;margin:5px;padding:10px}#Cb{background:pink}`;
    document.head[$AC](s);
    let d = document[$C]("dialog");
    d.id = "D";
    d[
      $I
    ] = `<div><span id="BN"></span><button id="Cb">終了</button></div><p id="CT">Ver 1.3.0</p>`;
    document.body[$AC](d);
    d.showModal();
    return d;
  }
  function aB(l, a) {
    let b = document[$C]("button");
    b.textContent = l;
    b.addEventListener("click", a);
    $("BN")[$AC](b);
  }
  function hB() {
    $A(`table`).forEach((e) => e.remove());
    $A("#BN *").forEach((e) => (e.style.display = "none"));
  }
  function sB() {
    $A("#BN *").forEach((e) => (e.style.display = "inline-block"));
  }
  async function load(S) {
    return new Promise((p, n) => {
      const s = document[$C]`script`;
      s.src = S;
      s.onload = p;
      s.onerror = n;
      document.body[$AC](s);
    });
  }
  function JST(U) {
    const J = new Date(U * 1000);
    return `${J.getFullYear()}-${String(J.getMonth() + 1).padStart(
      2,
      0
    )}-${String(J.getDate()).padStart(2, 0)} ${String(J.getHours()).padStart(
      2,
      0
    )}:${String(J.getMinutes()).padStart(2, 0)}`;
  }
})();

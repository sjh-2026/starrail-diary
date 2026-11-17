/* ============================================================
   星穹日志 · 交互脚本
   原生 JavaScript，无任何外部依赖，可直接双击打开
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. 导航 ---------- */
  var nav = document.querySelector(".nav");
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.querySelector(".nav__menu");

  function onScroll() {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      menu.classList.toggle("is-open", !open);
    });

    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        toggle.setAttribute("aria-expanded", "false");
        menu.classList.remove("is-open");
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("is-open")) {
        toggle.setAttribute("aria-expanded", "false");
        menu.classList.remove("is-open");
        toggle.focus();
      }
    });
  }

  // 根据当前文件名标记导航
  var current = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".nav__menu a[href]").forEach(function (link) {
    var href = (link.getAttribute("href") || "").toLowerCase();
    if (href === current || (current === "" && href === "index.html")) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
  });

  /* ---------- 2. 首屏星空 ---------- */
  var canvas = document.getElementById("stars");
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext("2d");
    var stars = [];
    var shooters = [];
    var dpr = 1;
    var W = 0;
    var H = 0;
    var rafId = null;
    var visible = true;
    var lastShot = 0;

    function buildStars() {
      var count = Math.max(60, Math.min(220, Math.round((W * H) / 8200)));
      stars = [];
      for (var i = 0; i < count; i++) {
        var warm = Math.random() > 0.82;
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: Math.random() * 1.5 + 0.3,
          a: Math.random() * 0.55 + 0.25,
          phase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.9 + 0.35,
          drift: Math.random() * 0.05 + 0.01,
          color: warm ? "255,227,163" : (Math.random() > 0.8 ? "160,220,255" : "255,255,255")
        });
      }
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildStars();
    }

    function draw(t) {
      ctx.clearRect(0, 0, W, H);

      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        var twinkle = reduceMotion ? 1 : 0.55 + Math.sin(t * 0.001 * s.speed + s.phase) * 0.45;
        ctx.beginPath();
        ctx.fillStyle = "rgba(" + s.color + "," + (s.a * twinkle).toFixed(3) + ")";
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();

        if (!reduceMotion) {
          s.y += s.drift;
          if (s.y > H + 2) { s.y = -2; s.x = Math.random() * W; }
        }
      }

      if (!reduceMotion) {
        // 偶发流星
        if (t - lastShot > 5200 && Math.random() < 0.006) {
          lastShot = t;
          shooters.push({
            x: Math.random() * W * 0.7 + W * 0.15,
            y: Math.random() * H * 0.4,
            vx: -(2.6 + Math.random() * 1.6),
            vy: 1.3 + Math.random() * 0.8,
            life: 1
          });
        }
        for (var k = shooters.length - 1; k >= 0; k--) {
          var sh = shooters[k];
          sh.x += sh.vx;
          sh.y += sh.vy;
          sh.life -= 0.012;
          if (sh.life <= 0) { shooters.splice(k, 1); continue; }
          var grad = ctx.createLinearGradient(sh.x, sh.y, sh.x - sh.vx * 26, sh.y - sh.vy * 26);
          grad.addColorStop(0, "rgba(255,244,208," + (sh.life * 0.9).toFixed(3) + ")");
          grad.addColorStop(1, "rgba(255,244,208,0)");
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(sh.x, sh.y);
          ctx.lineTo(sh.x - sh.vx * 26, sh.y - sh.vy * 26);
          ctx.stroke();
        }
      }

      rafId = requestAnimationFrame(draw);
    }

    function start() {
      if (rafId === null) rafId = requestAnimationFrame(draw);
    }
    function stop() {
      if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
    }

    resize();
    start();

    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 180);
    });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) start(); else stop();
      }, { threshold: 0 }).observe(canvas);
    }

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop();
      else if (visible) start();
    });
  }

  /* ---------- 3. 首屏轻微视差 ---------- */
  var train = document.querySelector(".hero__train");
  if (train && !reduceMotion && window.matchMedia("(pointer:fine)").matches) {
    var hero = document.querySelector(".hero");
    hero.addEventListener("mousemove", function (e) {
      var rx = (e.clientX / window.innerWidth - 0.5) * 14;
      var ry = (e.clientY / window.innerHeight - 0.5) * 8;
      train.style.transform = "translate3d(" + rx.toFixed(2) + "px," + ry.toFixed(2) + "px,0)";
    });
    hero.addEventListener("mouseleave", function () {
      train.style.transform = "";
    });
  }

  /* ---------- 4. 滚动入场 ---------- */
  var revealItems = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    revealItems.forEach(function (el) { io.observe(el); });
  } else {
    revealItems.forEach(function (el) { el.classList.add("is-in"); });
  }

  // 技能条：进入视口后再生长
  var barGroups = document.querySelectorAll(".bars");
  if ("IntersectionObserver" in window) {
    var barObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          barObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });
    barGroups.forEach(function (el) { barObserver.observe(el); });
  } else {
    barGroups.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- 5. 图鉴筛选 ---------- */
  var chips = document.querySelectorAll(".chip[data-filter]");
  var cards = document.querySelectorAll(".char[data-path]");
  if (chips.length && cards.length) {
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) {
          c.classList.remove("is-active");
          c.setAttribute("aria-pressed", "false");
        });
        chip.classList.add("is-active");
        chip.setAttribute("aria-pressed", "true");

        var filter = chip.getAttribute("data-filter");
        cards.forEach(function (card) {
          var show = filter === "all" || card.getAttribute("data-path") === filter;
          card.hidden = !show;
        });
      });
    });
  }

  /* ---------- 6. 相册灯箱 ---------- */
  var shots = Array.prototype.slice.call(document.querySelectorAll(".shot"));
  var lightbox = document.getElementById("lightbox");
  if (shots.length && lightbox) {
    var lbImg = lightbox.querySelector("img");
    var lbCap = lightbox.querySelector(".lightbox__cap");
    var lbClose = lightbox.querySelector(".lb-close");
    var lbPrev = lightbox.querySelector(".lb-prev");
    var lbNext = lightbox.querySelector(".lb-next");
    var index = 0;
    var lastFocus = null;

    var data = shots.map(function (fig) {
      var img = fig.querySelector("img");
      var cap = fig.querySelector("figcaption");
      return {
        src: fig.getAttribute("data-full") || img.getAttribute("src"),
        alt: img.getAttribute("alt") || "",
        title: cap ? (cap.childNodes[0] ? cap.childNodes[0].textContent.trim() : cap.textContent.trim()) : "",
        meta: cap && cap.querySelector("span") ? cap.querySelector("span").textContent.trim() : ""
      };
    });

    function render(i) {
      index = (i + data.length) % data.length;
      var item = data[index];
      lbImg.setAttribute("src", item.src);
      lbImg.setAttribute("alt", item.alt);
      lbCap.innerHTML = "";
      lbCap.appendChild(document.createTextNode(item.title));
      if (item.meta) {
        var span = document.createElement("span");
        span.textContent = item.meta;
        lbCap.appendChild(span);
      }
    }

    function open(i) {
      lastFocus = document.activeElement;
      render(i);
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      lbClose.focus();
    }

    function close() {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    }

    shots.forEach(function (fig, i) {
      fig.setAttribute("tabindex", "0");
      fig.setAttribute("role", "button");
      fig.addEventListener("click", function () { open(i); });
      fig.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open(i);
        }
      });
    });

    lbClose.addEventListener("click", close);
    lbPrev.addEventListener("click", function () { render(index - 1); });
    lbNext.addEventListener("click", function () { render(index + 1); });
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) close();
    });
    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") render(index - 1);
      if (e.key === "ArrowRight") render(index + 1);
    });
  }

  /* ---------- 7. 计划页时钟 ---------- */
  var clockTime = document.getElementById("clockTime");
  var clockDate = document.getElementById("clockDate");
  var clockCd = document.getElementById("clockCd");
  var WEEK = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

  if (clockTime && clockDate) {
    var deadline = new Date("2027-01-15T00:00:00");
    var pad = function (n) { return n < 10 ? "0" + n : String(n); };

    var tick = function () {
      var now = new Date();
      clockTime.textContent = pad(now.getHours()) + ":" + pad(now.getMinutes()) + ":" + pad(now.getSeconds());
      clockDate.textContent = now.getFullYear() + " 年 " + (now.getMonth() + 1) + " 月 " + now.getDate() + " 日 · " + WEEK[now.getDay()];

      if (clockCd) {
        var diff = deadline.getTime() - now.getTime();
        if (diff <= 0) {
          clockCd.textContent = "期末周已抵达，继续开拓";
        } else {
          var d = Math.floor(diff / 86400000);
          var h = Math.floor((diff % 86400000) / 3600000);
          var m = Math.floor((diff % 3600000) / 60000);
          var s = Math.floor((diff % 60000) / 1000);
          clockCd.textContent = d + " 天 " + pad(h) + " : " + pad(m) + " : " + pad(s);
        }
      }
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- 8. 任务清单 ---------- */
  var taskBoxes = Array.prototype.slice.call(document.querySelectorAll(".task input[data-task]"));
  var taskBar = document.getElementById("taskBar");
  var taskCount = document.getElementById("taskCount");
  var STORE_TASKS = "sr_tasks_v1";

  if (taskBoxes.length) {
    var saved = {};
    try { saved = JSON.parse(localStorage.getItem(STORE_TASKS) || "{}") || {}; } catch (err) { saved = {}; }

    var refreshTasks = function () {
      var done = 0;
      taskBoxes.forEach(function (box) {
        var label = box.closest(".task");
        if (box.checked) { done++; if (label) label.classList.add("is-done"); }
        else if (label) label.classList.remove("is-done");
      });
      if (taskBar) taskBar.style.width = Math.round((done / taskBoxes.length) * 100) + "%";
      if (taskCount) taskCount.textContent = done + " / " + taskBoxes.length;
      var wrap = taskBar ? taskBar.closest(".progress") : null;
      if (wrap) wrap.setAttribute("aria-valuenow", String(Math.round((done / taskBoxes.length) * 100)));
    };

    taskBoxes.forEach(function (box) {
      var key = box.getAttribute("data-task");
      if (Object.prototype.hasOwnProperty.call(saved, key)) box.checked = !!saved[key];
      box.addEventListener("change", function () {
        saved[key] = box.checked;
        try { localStorage.setItem(STORE_TASKS, JSON.stringify(saved)); } catch (err) { /* 忽略隐私模式限制 */ }
        refreshTasks();
      });
    });
    refreshTasks();
  }

  /* ---------- 9. 留言板 ---------- */
  var guestForm = document.getElementById("guestForm");
  var guestList = document.getElementById("guestList");
  var STORE_GUEST = "sr_guestbook_v1";

  if (guestForm && guestList) {
    var load = function () {
      try { return JSON.parse(localStorage.getItem(STORE_GUEST) || "[]") || []; }
      catch (err) { return []; }
    };

    var formatDate = function (iso) {
      var d = new Date(iso);
      if (isNaN(d.getTime())) return "";
      var p = function (n) { return n < 10 ? "0" + n : String(n); };
      return d.getFullYear() + "." + p(d.getMonth() + 1) + "." + p(d.getDate()) + " " + p(d.getHours()) + ":" + p(d.getMinutes());
    };

    var render = function () {
      var list = load();
      guestList.innerHTML = "";
      if (!list.length) {
        var empty = document.createElement("li");
        empty.className = "empty";
        empty.textContent = "留言板还是空的 —— 写下第一句星穹寄语吧。";
        guestList.appendChild(empty);
        return;
      }
      list.forEach(function (item) {
        var li = document.createElement("li");
        li.className = "guest";

        var meta = document.createElement("p");
        meta.className = "guest__meta";
        var name = document.createElement("b");
        name.textContent = item.name || "匿名开拓者";
        var time = document.createElement("span");
        time.textContent = formatDate(item.time);
        meta.appendChild(name);
        meta.appendChild(time);

        var text = document.createElement("p");
        text.className = "guest__text";
        text.textContent = item.text || "";

        li.appendChild(meta);
        li.appendChild(text);
        guestList.appendChild(li);
      });
    };

    guestForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var nameInput = document.getElementById("guestName");
      var msgInput = document.getElementById("guestMsg");
      var name = (nameInput.value || "").trim().slice(0, 18) || "匿名开拓者";
      var text = (msgInput.value || "").trim().slice(0, 200);
      if (!text) { msgInput.focus(); return; }

      var list = load();
      list.unshift({ name: name, text: text, time: new Date().toISOString() });
      list = list.slice(0, 40);
      try { localStorage.setItem(STORE_GUEST, JSON.stringify(list)); } catch (err) { /* 忽略 */ }
      guestForm.reset();
      render();
      msgInput.focus();
    });

    render();
  }

  /* ---------- 10. 页脚年份 ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();

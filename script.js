const questions = [
  {
    title: "你喜欢我吗",
    answers: ["喜欢", "很喜欢"]
  },
  {
    title: "你想我吗",
    answers: ["想", "非常想"]
  }
];

const heartPhrases = [
  "天天开心",
  "保存好心情",
  "我喜欢你",
  "我想你了",
  "好事慢慢发生",
  "记得好好休息",
  "愿你每天轻松",
  "要一直平安顺遂",
  "你值得很多温柔",
  "希望你一直明朗",
  "愿你被生活偏爱",
  "见你就会开心",
  "想把晚风送给你",
  "愿你一天比一天甜",
  "希望你少一点烦恼",
  "想和你分享日常",
  "愿你眼里总有光",
  "今天也为你心动",
  "愿你被温柔对待",
  "记得按时吃饭",
  "今天也要顺顺利利",
  "你笑起来很好看",
  "希望你睡个好觉",
  "我会一直惦记你",
  "愿你心里亮亮的",
  "想把好心情给你",
  "你值得被偏爱",
  "每天都平安顺意",
  "见到你就很开心",
  "希望你事事有回应",
  "愿你一直发光",
  "小日子要甜一点",
  "想把小确幸给你",
  "你要一直闪闪的",
  "希望你所愿成真",
  "想把温柔都留给你",
  "愿你忙里也有甜",
  "今天要比昨天更开心",
  "你在我这里很特别",
  "想见你的念头很轻很长",
  "愿你抬头就有好天气",
  "谢谢你出现在我心里",
  "想把最好的祝福给你",
  "希望今天也很顺利",
  "你要一直好好的",
  "想把偏爱慢慢给你",
  "愿你每一步都轻松",
  "愿你的努力有回响",
  "今天也会有小惊喜",
  "愿你一直被好事围住",
  "希望你的心情很晴朗",
  "想把温暖悄悄递给你",
  "你在我眼里很特别",
  "愿你每天都被温柔接住"
];

const bloomPalette = [
  { bg: "rgba(255, 225, 231, 0.95)", border: "rgba(238, 173, 190, 0.76)", shadow: "rgba(241, 179, 197, 0.34)" },
  { bg: "rgba(255, 237, 221, 0.95)", border: "rgba(239, 191, 153, 0.74)", shadow: "rgba(240, 197, 164, 0.32)" },
  { bg: "rgba(255, 246, 202, 0.96)", border: "rgba(231, 208, 124, 0.76)", shadow: "rgba(237, 214, 146, 0.32)" },
  { bg: "rgba(226, 248, 221, 0.95)", border: "rgba(164, 211, 150, 0.76)", shadow: "rgba(170, 219, 162, 0.3)" },
  { bg: "rgba(219, 246, 244, 0.95)", border: "rgba(141, 208, 202, 0.76)", shadow: "rgba(156, 216, 210, 0.3)" },
  { bg: "rgba(226, 236, 255, 0.96)", border: "rgba(156, 183, 239, 0.8)", shadow: "rgba(168, 192, 240, 0.34)" },
  { bg: "rgba(236, 229, 255, 0.95)", border: "rgba(183, 165, 234, 0.76)", shadow: "rgba(190, 174, 234, 0.32)" },
  { bg: "rgba(255, 226, 243, 0.95)", border: "rgba(236, 159, 206, 0.76)", shadow: "rgba(239, 176, 212, 0.32)" }
];

const questionStage = document.getElementById("questionStage");
const questionCard = document.getElementById("questionCard");
const questionTitle = document.getElementById("questionTitle");
const answerButtons = document.getElementById("answerButtons");
const messageBanner = document.getElementById("messageBanner");
const heartStage = document.getElementById("heartStage");
const heartWrap = document.getElementById("heartWrap");
const heartCloud = document.getElementById("heartCloud");
const heartToggle = document.getElementById("heartToggle");
const centerWish = document.getElementById("centerWish");

let currentQuestion = 0;
let isTransitioning = false;
let confessionStarted = false;
let heartBuilt = false;
let isBlooming = false;
let resizeTimer = 0;
const bloomTimers = new WeakMap();

function renderQuestion(index) {
  const question = questions[index];

  currentQuestion = index;
  questionTitle.textContent = question.title;
  answerButtons.innerHTML = "";

  question.answers.forEach((label, buttonIndex) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = buttonIndex === question.answers.length - 1
      ? "answer-btn answer-btn--strong"
      : "answer-btn";
    button.textContent = label;
    button.addEventListener("click", handleAnswer);
    answerButtons.appendChild(button);
  });
}

function handleAnswer() {
  if (isTransitioning || confessionStarted) {
    return;
  }

  if (currentQuestion < questions.length - 1) {
    switchQuestion(currentQuestion + 1);
    return;
  }

  showConfessionFlow();
}

function switchQuestion(nextQuestion) {
  isTransitioning = true;
  questionCard.classList.add("is-switching");

  window.setTimeout(() => {
    renderQuestion(nextQuestion);
    questionCard.classList.remove("is-switching");
    isTransitioning = false;
  }, 260);
}

function showConfessionFlow() {
  confessionStarted = true;
  questionCard.classList.add("is-finished");

  window.setTimeout(() => {
    questionStage.classList.add("is-collapsed");
  }, 220);

  messageBanner.hidden = false;
  requestAnimationFrame(() => {
    messageBanner.classList.add("is-visible");
  });

  window.setTimeout(() => {
    revealHeartStage();
  }, 950);
}

function revealHeartStage() {
  heartStage.hidden = false;

  if (!heartBuilt) {
    createHeartCards();
    heartBuilt = true;
  }

  requestAnimationFrame(() => {
    heartStage.classList.add("is-visible");

    window.setTimeout(() => {
      layoutCards();

      Array.from(heartCloud.children).forEach((card, index) => {
        window.setTimeout(() => {
          card.classList.add("is-placed");
        }, index * 24);
      });
    }, 120);
  });
}

function createHeartCards() {
  const edgeCount = Math.ceil(heartPhrases.length * 0.52);

  heartPhrases.forEach((text, index) => {
    const card = document.createElement("article");
    const inner = document.createElement("div");
    const palette = bloomPalette[index % bloomPalette.length];

    card.className = "heart-card";
    if (index < edgeCount) {
      card.classList.add("heart-card--edge");
    }

    card.style.setProperty("--delay", `${(index % 6) * 0.18}s`);
    card.style.setProperty("--card-bg", palette.bg);
    card.style.setProperty("--card-border", palette.border);
    card.style.setProperty("--card-shadow", palette.shadow);
    inner.className = "heart-card__inner";
    inner.textContent = text;

    card.appendChild(inner);
    heartCloud.appendChild(card);
  });
}

function layoutCards() {
  const cards = Array.from(heartCloud.querySelectorAll(".heart-card"));
  const bounds = heartCloud.getBoundingClientRect();

  if (!cards.length || !bounds.width || !bounds.height) {
    return;
  }

  const points = generateHeartPoints(cards.length, bounds.width, bounds.height);

  cards.forEach((card, index) => {
    const point = points[index];
    card.style.setProperty("--x", `${point.x}px`);
    card.style.setProperty("--y", `${point.y}px`);
    card.style.setProperty("--rotate", `${point.rotate}deg`);
  });
}

function generateHeartPoints(count, width, height) {
  const outerCount = Math.ceil(count * 0.52);
  const midCount = Math.ceil(count * 0.3);
  const innerCount = count - outerCount - midCount;
  const layers = [
    { count: outerCount, scale: 1.08, yOffset: 2 },
    { count: midCount, scale: 0.87, yOffset: 8 },
    { count: innerCount, scale: 0.72, yOffset: 12 }
  ];
  const points = [];

  layers.forEach((layer, layerIndex) => {
    for (let i = 0; i < layer.count; i += 1) {
      const t = Math.PI - (i / layer.count) * Math.PI * 2;
      const rawX = 16 * Math.pow(Math.sin(t), 3);
      const rawY = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      const x = rawX * (width / 47) * layer.scale;
      const y = -rawY * (height / 49) * layer.scale + layer.yOffset;
      const rotate = layerIndex === 0 ? x * 0.02 : x * 0.014;

      points.push({ x, y, rotate });
    }
  });

  return points.slice(0, count);
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function pickRandomPalette() {
  return bloomPalette[Math.floor(Math.random() * bloomPalette.length)];
}

function getVisibleBloomPoints(excludeCard) {
  return Array.from(heartCloud.querySelectorAll(".heart-card.is-bloom-visible"))
    .filter((card) => card !== excludeCard)
    .map((card) => ({
      x: Number(card.dataset.bloomX || 0),
      y: Number(card.dataset.bloomY || 0)
    }));
}

function getRandomBloomPoint(bounds, excludeCard) {
  const sidePadding = Math.min(46, bounds.width * 0.08);
  const topPadding = Math.min(52, bounds.height * 0.08);
  const bottomPadding = Math.min(42, bounds.height * 0.07);
  const avoidX = Math.min(126, bounds.width * 0.23);
  const avoidY = Math.min(92, bounds.height * 0.16);
  const minDistance = bounds.width < 440 ? 54 : 68;
  const visiblePoints = getVisibleBloomPoints(excludeCard);

  for (let attempt = 0; attempt < 40; attempt += 1) {
    const x = randomBetween((-bounds.width / 2) + sidePadding, (bounds.width / 2) - sidePadding);
    const y = randomBetween((-bounds.height / 2) + topPadding, (bounds.height / 2) - bottomPadding);
    const isCenterBlocked = Math.abs(x) < avoidX && Math.abs(y) < avoidY;
    const isTooClose = visiblePoints.some((point) => Math.hypot(point.x - x, point.y - y) < minDistance);

    if (!isCenterBlocked && !isTooClose) {
      return {
        x,
        y,
        rotate: randomBetween(-10, 10)
      };
    }
  }

  return {
    x: randomBetween((-bounds.width / 2) + sidePadding, (bounds.width / 2) - sidePadding),
    y: randomBetween((-bounds.height / 2) + topPadding, (bounds.height / 2) - bottomPadding),
    rotate: randomBetween(-10, 10)
  };
}

function applyBloomPosition(card) {
  const bounds = heartCloud.getBoundingClientRect();

  if (!bounds.width || !bounds.height) {
    return;
  }

  const point = getRandomBloomPoint(bounds, card);
  const palette = pickRandomPalette();

  card.dataset.bloomX = point.x.toFixed(1);
  card.dataset.bloomY = point.y.toFixed(1);
  card.style.setProperty("--x", `${point.x.toFixed(1)}px`);
  card.style.setProperty("--y", `${point.y.toFixed(1)}px`);
  card.style.setProperty("--rotate", `${point.rotate.toFixed(2)}deg`);
  card.style.setProperty("--card-bg", palette.bg);
  card.style.setProperty("--card-border", palette.border);
  card.style.setProperty("--card-shadow", palette.shadow);
}

function clearBloomTimers(card) {
  const timers = bloomTimers.get(card);

  if (!timers) {
    return;
  }

  window.clearTimeout(timers.show);
  window.clearTimeout(timers.hide);
}

function scheduleBloom(card, immediate = false) {
  if (!isBlooming) {
    return;
  }

  clearBloomTimers(card);

  const showDelay = immediate ? randomBetween(0, 900) : randomBetween(420, 1650);
  const showTimer = window.setTimeout(() => {
    if (!isBlooming) {
      return;
    }

    applyBloomPosition(card);
    card.classList.add("is-bloom-visible");

    const hideTimer = window.setTimeout(() => {
      card.classList.remove("is-bloom-visible");
      scheduleBloom(card, false);
    }, randomBetween(2200, 4300));

    bloomTimers.set(card, { show: showTimer, hide: hideTimer });
  }, showDelay);

  bloomTimers.set(card, { show: showTimer, hide: 0 });
}

function startBloomLoops() {
  const cards = Array.from(heartCloud.querySelectorAll(".heart-card"));

  cards.forEach((card, index) => {
    scheduleBloom(card, index < 20);
  });
}

function startBloomingMode() {
  if (!heartBuilt || isBlooming) {
    return;
  }

  isBlooming = true;
  heartStage.classList.add("is-blooming");
  heartWrap.classList.add("is-blooming");
  heartToggle.hidden = true;
  centerWish.hidden = false;

  requestAnimationFrame(() => {
    centerWish.classList.add("is-visible");
  });

  window.setTimeout(() => {
    startBloomLoops();
    heartStage.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 120);
}

function handleResize() {
  window.clearTimeout(resizeTimer);

  resizeTimer = window.setTimeout(() => {
    if (!heartBuilt) {
      return;
    }

    if (isBlooming) {
      Array.from(heartCloud.querySelectorAll(".heart-card.is-bloom-visible")).forEach((card) => {
        applyBloomPosition(card);
      });
      return;
    }

    layoutCards();
  }, 120);
}

heartToggle.addEventListener("click", startBloomingMode);
window.addEventListener("resize", handleResize);

if ("ResizeObserver" in window) {
  const wrapObserver = new ResizeObserver(() => {
    if (heartBuilt) {
      layoutCards();
    }
  });

  wrapObserver.observe(heartWrap);
}

renderQuestion(0);

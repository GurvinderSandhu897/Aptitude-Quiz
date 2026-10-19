const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = (arr) => arr[rand(0, arr.length - 1)];

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = rand(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 3 unique wrong numbers near the correct one
function nearby(correct, step) {
  const cands = shuffle([
    correct + step, correct - step,
    correct + 2 * step, correct - 2 * step,
    correct + 3 * step, correct - 3 * step,
  ]).filter((n) => n !== correct && n > 0);
  return cands.slice(0, 3);
}

function mcq(text, correct, step, fmt = (n) => String(n), category) {
  const wrong = nearby(correct, step);
  return {
    text,
    imageUrl: null,
    options: [correct, ...wrong].map(fmt), // correct is first here
    correctIndex: 0,                        // shuffled later
    category,
  };
}

const generators = [
  () => {
    const pct = pick([10, 15, 20, 25, 30, 40, 60, 75]);
    const base = rand(4, 40) * 20;
    return mcq(`What is ${pct}% of ${base}?`, (pct * base) / 100, 5, undefined, "Percentages");
  },
  () => {
    const a = rand(2, 15), d = rand(2, 9);
    const t = [0, 1, 2, 3, 4].map((i) => a + i * d);
    return mcq(`Find the next number: ${t.join(", ")}, ?`, a + 5 * d, d, undefined, "Series");
  },
  () => {
    const a = rand(1, 4), r = rand(2, 3);
    const t = [0, 1, 2, 3].map((i) => a * r ** i);
    return mcq(`Find the next number: ${t.join(", ")}, ?`, a * r ** 4, a * r, undefined, "Series");
  },
  () => {
    const cp = rand(10, 80) * 10, p = pick([10, 20, 25, 30, 40]);
    return mcq(
      `An item bought for ₹${cp} is sold at ${p}% profit. What is the selling price?`,
      cp + (cp * p) / 100, 10, (n) => `₹${n}`, "Profit & Loss"
    );
  },
  () => {
    const s = rand(4, 20) * 5, t = rand(2, 8);
    return mcq(`A car travels at ${s} km/h for ${t} hours. Distance covered?`, s * t, 10, (n) => `${n} km`, "Speed");
  },
  () => {
    const P = rand(5, 40) * 100, r = rand(4, 12), n = rand(2, 5);
    return mcq(
      `Simple interest on ₹${P} at ${r}% per annum for ${n} years?`,
      (P * r * n) / 100, 50, (x) => `₹${x}`, "Interest"
    );
  },
  () => {
    const nums = Array.from({ length: 5 }, () => rand(10, 50));
    const sum = nums.reduce((x, y) => x + y, 0);
    const adj = (5 - (sum % 5)) % 5;      // make sum divisible by 5
    nums[0] += adj;
    const avg = nums.reduce((x, y) => x + y, 0) / 5;
    return mcq(`Find the average of ${nums.join(", ")}.`, avg, 2, undefined, "Averages");
  },
  () => {
    const a = rand(1, 5), b = rand(a + 1, 8), k = rand(3, 12);
    const total = (a + b) * k;
    return mcq(
      `₹${total} is divided in the ratio ${a}:${b}. What is the larger share?`,
      b * k, k, (n) => `₹${n}`, "Ratio"
    );
  },
];

export function generateQuestions(count) {
  // pick different generator types where possible
  const order = shuffle(generators);
  return Array.from({ length: count }, (_, i) => order[i % order.length]());
}
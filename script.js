const questionBank = [
  { prompt: '如果所有 A 都是 B，所有 B 都是 C，那么以下哪个肯定成立？', options: ['所有 C 都是 A', '某些 A 不是 C', '所有 A 都是 C', '没有 B 是 C', 'C 是 A 的子集'], answer: 2 },
  { prompt: '哪一个图形最不符合其余四个？（想象四个图形，仅在图形结构上有差异）', options: ['圆形', '正方形', '三角形', '等边梯形', '六边形'], answer: 3 },
  { prompt: '观察下列数列：2, 6, 12, 20, ?，下一个数是多少？', options: ['30', '28', '26', '24', '22'], answer: 0 },
  { prompt: '哪个数字最能填补下列空白？1 4 9 16 25 ?', options: ['30', '35', '36', '49', '42'], answer: 2 },
  { prompt: '如果 5x = 75，则 x 等于多少？', options: ['10', '12', '14', '15', '17'], answer: 3 },
  { prompt: '一个角度是其补角的三倍，两个角分别是多少度？', options: ['18° 和 72°', '30° 和 60°', '45° 和 45°', '20° 和 70°', '15° 和 75°'], answer: 0 },
  { prompt: 'A、B、C 三个逻辑灯：A 亮 → B 亮；B 亮 → C 亮；C 不亮。以下哪个结论正确？', options: ['A 必亮', 'B 必亮', 'A 必不亮', 'C 必亮', 'A 与 B 可能都亮'], answer: 2 },
  { prompt: '哪组图形中，只有一个与其他不同（按旋转、镜像都可能）？', options: ['ABBB', 'BAAA', 'AAAB', 'BABA', 'ABAB'], answer: 4 },
  { prompt: '下列哪项与其他不同：猫、老虎、狮子、鲸鱼、豹子？', options: ['猫', '老虎', '狮子', '鲸鱼', '豹子'], answer: 3 },
  { prompt: '在一座桥上，每当一个人过去，三个人会回来。现在有 3 人过桥，6 人回来，桥上共有？', options: ['0', '1', '2', '3', '4'], answer: 0 },
  { prompt: '如果今天是星期二，63 天后是星期几？', options: ['星期一', '星期二', '星期三', '星期四', '星期五'], answer: 1 },
  { prompt: '24 本书按顺序排成 3 列，每列 8 本。换成 6 列后每列多少本？', options: ['3', '4', '5', '6', '7'], answer: 3 },
  { prompt: '时钟 3 点后再过 100 分钟，指针落在几时？', options: ['4:40', '4:20', '5:10', '5:00', '5:40'], answer: 0 },
  { prompt: '圆形、正方形、三角形、矩形、梯形，哪个图形可以没有斜边？', options: ['圆形', '正方形', '三角形', '矩形', '梯形'], answer: 0 },
  { prompt: '下列哪一个是最不可能同时为素数和偶数？', options: ['2', '3', '5', '7', '11'], answer: 1 },
  { prompt: 'A > B 且 B > C，以下哪一项不可能成立？', options: ['A > C', 'C < A', 'B > A', 'C < B', 'A = B'], answer: 2 },
  { prompt: '图案序列：●▲●▲●？下一项应该是？', options: ['●', '▲', '■', '★', '◇'], answer: 1 },
  { prompt: '哪个单词与其他四个不属于一个类别：苹果、桔子、香蕉、胡萝卜、西瓜？', options: ['苹果', '桔子', '香蕉', '胡萝卜', '西瓜'], answer: 3 },
  { prompt: '2⁴ × 2³ = ?', options: ['16', '24', '32', '64', '128'], answer: 3 },
  { prompt: '将 3636 划分为两个相等的正整数后再相加，结果是？', options: ['1818', '3636', '7272', '909', '1212'], answer: 0 },
  { prompt: '哪一个数字填空使得等式成立：9 × 4 = ?', options: ['36', '34', '39', '45', '32'], answer: 0 },
  { prompt: '一辆车每小时 60 公里，行驶 45 分钟后行驶了多少公里？', options: ['45', '40', '35', '50', '30'], answer: 0 },
  { prompt: '观察字符串：ABBA、BAAB、BABA、AABB、ABAB，哪一个与节奏不同？', options: ['ABBA', 'BAAB', 'BABA', 'AABB', 'ABAB'], answer: 4 },
  { prompt: '三个互不相交的集合，它们的并集大小是 12，若其中两个不重叠，则平均每个集合大小约为？', options: ['4', '6', '3', '5', '2'], answer: 0 },
  { prompt: '（图形题）在六边形中，哪条线是对角线？', options: ['连接相邻两点', '连接相对两点', '连接正中心与顶点', '穿过中心的任意线', '以上都不是'], answer: 1 },
  { prompt: '下列何者与其他四项的关联方式不同：红绿灯、指挥家、交通警察、AI 管家、门卫？', options: ['红绿灯', '指挥家', '交通警察', 'AI 管家', '门卫'], answer: 1 },
  { prompt: '如果数列是 1, 1, 2, 3, 5, ?, 下一个数字是？', options: ['6', '7', '8', '9', '11'], answer: 2 },
  { prompt: '哪个词是其他四个的反义词？快速、敏捷、急速、缓慢、迅捷', options: ['快速', '敏捷', '急速', '缓慢', '迅捷'], answer: 3 },
  { prompt: '多边形的内角和公式是 (n-2)×180°，当 n=8 时，和是多少？', options: ['1080°', '1260°', '1440°', '1620°', '1800°'], answer: 1 },
  { prompt: '如果光线在镜子里反射，入射角等于？', options: ['传播角', '反射角', '偏转角', '夹角 90°', '无法确定'], answer: 1 },
  { prompt: '将 100 分为 4 个相等部分，每部分是多少？', options: ['25', '20', '30', '15', '10'], answer: 0 },
  { prompt: '在下面五个词中，哪一个与其他不同：蓝色、绿色、黄色、汽车、红色？', options: ['蓝色', '绿色', '黄色', '汽车', '红色'], answer: 3 }
];

const TOTAL_QUESTIONS = 30;
const TIMER_DURATION = 15 * 60; // 15 minutes total
const QUESTION_TIME = 30; // 30 seconds per question

let currentIndex = 0;
let correctCount = 0;
let selectedOption = null;
let timer = TIMER_DURATION;
let timerInterval = null;
let questionTimer = QUESTION_TIME;
let questionTimerInterval = null;

// DOM 元素
const introPanel = document.getElementById('intro-panel');
const testPanel = document.getElementById('test-panel');
const resultPanel = document.getElementById('result-panel');
const startButton = document.getElementById('start-button');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options');
const progressLabel = document.getElementById('progress');
const scoreLabel = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const questionTimerDisplay = document.getElementById('question-timer');
const nextButton = document.getElementById('next-button');
const restartButton = document.getElementById('restart-button');
const correctCountElement = document.getElementById('correct-count');
const iqScoreElement = document.getElementById('iq-score');
const percentileElement = document.getElementById('percentile');
const percentileTextElement = document.getElementById('percentile-text');
const higherThanElement = document.getElementById('higher-than');
const userMarker = document.getElementById('user-marker');

// 标准正态分布 CDF 近似（来自 Abramowitz and Stegun）
function normCDF(x) {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp(-x * x / 2);
  let prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  if (x > 0) prob = 1 - prob;
  return prob;
}

// 计算 IQ 和百分比排名
function calculateIQStats(correct, total) {
  // 简单映射：正确率转换为 IQ（均值 100，标准差 15）
  // 假设正确率呈正态分布，均值 0.5（15/30），标准差 0.15
  const meanCorrect = total * 0.5;
  const stdCorrect = total * 0.15;
  const z = (correct - meanCorrect) / stdCorrect;
  const iq = 100 + z * 15;
  // 限制 IQ 范围在 55-145 之间（3个标准差）
  const clampedIQ = Math.max(55, Math.min(145, Math.round(iq)));
  
  // 计算百分比排名
  const percentile = normCDF(z) * 100;
  const clampedPercentile = Math.max(0.1, Math.min(99.9, percentile));
  
  return {
    iq: clampedIQ,
    percentile: clampedPercentile,
    higherThan: (100 - clampedPercentile).toFixed(1)
  };
}

// 更新钟形曲线上的用户标记
function updateBellCurve(iq) {
  // IQ 范围：55-145，对应曲线宽度 0%-100%
  const minIQ = 55;
  const maxIQ = 145;
  const percentage = (iq - minIQ) / (maxIQ - minIQ) * 100;
  userMarker.style.left = `${percentage}%`;
}

// 显示结果页面
function showResultPanel() {
  const stats = calculateIQStats(correctCount, TOTAL_QUESTIONS);
  
  correctCountElement.textContent = correctCount;
  iqScoreElement.textContent = stats.iq;
  percentileElement.textContent = stats.percentile.toFixed(1) + '%';
  percentileTextElement.textContent = stats.percentile.toFixed(1) + '%';
  higherThanElement.textContent = stats.higherThan + '%';
  
  updateBellCurve(stats.iq);
  
  testPanel.classList.add('hidden');
  resultPanel.classList.remove('hidden');
}

// 开始测试
function startTest() {
  introPanel.classList.add('hidden');
  testPanel.classList.remove('hidden');
  
  currentIndex = 0;
  correctCount = 0;
  selectedOption = null;
  
  startTimer();
  loadQuestion();
}

// 计时器函数
function startTimer() {
  timer = TIMER_DURATION;
  updateTimerDisplay();
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timer -= 1;
    updateTimerDisplay();
    if (timer <= 0) {
      clearInterval(timerInterval);
      finishTest();
    }
  }, 1000);
}

function startQuestionTimer() {
  questionTimer = QUESTION_TIME;
  updateQuestionTimer();
  clearInterval(questionTimerInterval);
  questionTimerInterval = setInterval(() => {
    questionTimer -= 1;
    updateQuestionTimer();
    if (questionTimer <= 0) {
      clearInterval(questionTimerInterval);
      nextQuestion();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const minutes = String(Math.floor(timer / 60)).padStart(2, '0');
  const seconds = String(timer % 60).padStart(2, '0');
  timerDisplay.textContent = `${minutes}:${seconds}`;
}

function updateQuestionTimer() {
  const seconds = String(questionTimer).padStart(2, '0');
  questionTimerDisplay.textContent = `${seconds}s`;
}

// 加载题目
function loadQuestion() {
  if (currentIndex >= TOTAL_QUESTIONS || currentIndex >= questionBank.length) {
    finishTest();
    return;
  }

  const question = questionBank[currentIndex];
  questionText.textContent = question.prompt;
  optionsContainer.innerHTML = '';
  selectedOption = null;
  nextButton.disabled = true;
  startQuestionTimer();

  question.options.forEach((option, idx) => {
    const button = document.createElement('button');
    button.className = 'option-btn';
    button.textContent = option;
    button.addEventListener('click', () => selectOption(button, idx));
    optionsContainer.appendChild(button);
  });

  progressLabel.textContent = `第 ${currentIndex + 1} / ${TOTAL_QUESTIONS} 题`;
  scoreLabel.textContent = `答对 ${correctCount} 题`;
}

function selectOption(button, idx) {
  if (selectedOption !== null) return;
  selectedOption = idx;
  document.querySelectorAll('.option-btn').forEach((btn) => btn.classList.remove('active'));
  button.classList.add('active');
  nextButton.disabled = false;
}

function nextQuestion() {
  if (selectedOption === null) return;
  clearInterval(questionTimerInterval);
  const question = questionBank[currentIndex];
  if (selectedOption === question.answer) {
    correctCount += 1;
  }
  currentIndex += 1;
  loadQuestion();
}

function finishTest() {
  clearInterval(timerInterval);
  clearInterval(questionTimerInterval);
  showResultPanel();
}

function restartTest() {
  currentIndex = 0;
  correctCount = 0;
  selectedOption = null;
  
  resultPanel.classList.add('hidden');
  introPanel.classList.remove('hidden');
}

// 事件监听
startButton.addEventListener('click', startTest);
nextButton.addEventListener('click', nextQuestion);
restartButton.addEventListener('click', restartTest);

// 初始化：显示介绍页面
introPanel.classList.remove('hidden');
testPanel.classList.add('hidden');
resultPanel.classList.add('hidden');

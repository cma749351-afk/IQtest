// 传统解谜题题库（不含数学题、不含分类题）带难度分级
const puzzleBank = [
  // 难度 1: 简单
  { prompt: '如果所有 A 都是 B，所有 B 都是 C，那么以下哪个肯定成立？', options: ['所有 C 都是 A', '某些 A 不是 C', '所有 A 都是 C', '没有 B 是 C', 'C 是 A 的子集'], answer: 2, difficulty: 1 },
  { prompt: '在一座桥上，每当一个人过去，三个人会回来。现在有 3 人过桥，6 人回来，桥上共有？', options: ['0', '1', '2', '3', '4'], answer: 0, difficulty: 1 },
  { prompt: 'A > B 且 B > C，以下哪一项不可能成立？', options: ['A > C', 'C < A', 'B > A', 'C < B', 'A = B'], answer: 2, difficulty: 1 },
  { prompt: '图案序列：●▲●▲●？下一项应该是？', options: ['●', '▲', '■', '★', '◇'], answer: 1, difficulty: 1 },
  { prompt: '有9个外观相同的球，其中一个略重。用天平最少称几次能找出重球？', options: ['2', '3', '4', '1', '5'], answer: 0, difficulty: 1 },
  { prompt: '一个房间有三个开关控制三盏灯（在另一房间），但所有灯泡都是坏的。你只能进房间一次。如何确定哪个开关控制哪盏灯？', options: ['无法确定', '打开开关后长时间等待', '打开所有开关', '听声音', '摸温度'], answer: 0, difficulty: 1 },
  { prompt: '一个数列：1, 2, 6, 24, 120, ? 下一个数是多少？', options: ['720', '840', '960', '1080', '1200'], answer: 0, difficulty: 1 },

  // 难度 2: 中等
  { prompt: 'A、B、C 三个逻辑灯：A 亮 → B 亮；B 亮 → C 亮；C 不亮。以下哪个结论正确？', options: ['A 必亮', 'B 必亮', 'A 必不亮', 'C 必亮', 'A 与 B 可能都亮'], answer: 2, difficulty: 2 },
  { prompt: '观察字符串：ABBA、BAAB、BABA、AABB、ABAB，哪一个与模式序列不同？', options: ['ABBA', 'BAAB', 'BABA', 'AABB', 'ABAB'], answer: 4, difficulty: 2 },
  { prompt: '五个盒子分别标有“苹果”“橘子”“苹果和橘子”“非苹果非橘子”“随机”。所有标签都是错的。你最少需要从几个盒子中取水果才能确定所有盒子的内容？', options: ['1', '2', '3', '4', '5'], answer: 1, difficulty: 2 },
  { prompt: '一个正方形被分成四个小正方形，左上角写A，右上角写B，左下角写C，右下角写D。如果沿对角线对折（A与D重合，B与C重合），展开后哪两个字母会重叠？', options: ['A和D', 'B和C', 'A和C', 'B和D', '无重叠'], answer: 3, difficulty: 2 },
  { prompt: '有三个开关对应三盏灯（在另一个房间）。你只能进房间一次。如何确定哪个开关控制哪盏灯？', options: ['打开第一个开关5分钟，关闭，打开第二个，进房间', '打开两个开关，进房间', '打开一个开关长时间，关闭，立即打开另一个，进房间', '无法确定', '打开所有开关，进房间'], answer: 0, difficulty: 2 },
  { prompt: '你面前有三扇门，一扇后有汽车，两扇后有山羊。你选了一扇，主持人打开另一扇有山羊的门。你是否该换选择？', options: ['换，概率变为2/3', '不换，概率1/2', '换不换都一样', '无法确定', '看主持人意图'], answer: 0, difficulty: 2 },
  { prompt: '一位逻辑学家去岛上，岛上有两种人：只说真话的骑士和只说假话的无赖。他遇到两个人A和B。A说："我们两个都是无赖。"B什么都没说。A和B分别是什么人？', options: ['A是无赖，B是骑士', 'A是骑士，B是无赖', '两人都是无赖', '两人都是骑士', '无法确定'], answer: 0, difficulty: 2 },
  { prompt: '有三个箱子，一个装两个红球，一个装两个蓝球，一个装一红一蓝。箱子标签都贴错了（如标"红红"的箱子不可能装两个红球）。你从其中一个箱子摸出一个球是红色，这个箱子最可能装什么？', options: ['两个红球', '两个蓝球', '一红一蓝', '无法确定', '看运气'], answer: 0, difficulty: 2 },
  { prompt: '一个圆形蛋糕，只允许垂直切刀。最少切几刀能把蛋糕分成8等份？', options: ['3', '4', '5', '6', '7'], answer: 0, difficulty: 2 },
  { prompt: '你面前有两条路，一条通向自由，一条通向监狱。两个守卫，一个永远说真话，一个永远说假话。你不知道谁是谁。你只能问一个问题，应该问什么？', options: ['"如果我问你这条路是否通向自由，你会说是吗？"', '"这条路通向自由吗？"', '"他（指另一个守卫）会说什么？"', '"你们谁是说实话的？"', '"我该怎么走？"'], answer: 0, difficulty: 2 },
  { prompt: '有4个人要在17分钟内过桥。过桥时间分别为1、2、5、10分钟。桥每次最多两人，必须有手电筒（只有一个）。如何安排使所有人过桥时间最短？', options: ['17分钟', '18分钟', '19分钟', '20分钟', '21分钟'], answer: 0, difficulty: 2 },
  { prompt: '一个正方形内切于一个圆，圆内切于一个更大的正方形。大正方形面积是小正方形的几倍？', options: ['2', '√2', '2√2', '4', 'π'], answer: 0, difficulty: 2 },

  // 难度 3: 困难
  { prompt: '一个密码锁有三位数，每位可以是0-9。已知：1) 682 中一个数字正确且位置正确；2) 614 中一个数字正确但位置错误；3) 206 中两个数字正确但位置都错误；4) 738 中没有数字正确；5) 870 中一个数字正确但位置错误。密码是多少？', options: ['042', '062', '052', '082', '012'], answer: 0, difficulty: 3 },
  { prompt: '一个天平有12个外观相同的球，其中一个重量不同（不知轻重）。最少称几次能找出该球并确定轻重？', options: ['2', '3', '4', '5', '6'], answer: 1, difficulty: 3 },
  { prompt: '5个人过桥，分别需要1、2、5、10、15分钟。桥每次最多两人，必须有手电筒（只有一个）。所有人过桥最少需要几分钟？', options: ['29', '32', '34', '37', '40'], answer: 0, difficulty: 3 },
  { prompt: '两个人轮流从一堆硬币中取1-5枚，取最后一枚者胜。初始有100枚，你先手。如何保证必胜？', options: ['第一次取4枚', '第一次取2枚', '第一次取1枚', '第一次取3枚', '无法保证'], answer: 0, difficulty: 3 },
  { prompt: '五个海盗分100枚金币，由最年长提出方案，所有人投票。如果半数或以上同意则通过，否则提出者被扔下海，由下一个年长者继续。海盗都极其聪明且贪婪。最年长者最多能保住多少金币？', options: ['98', '97', '96', '95', '94'], answer: 1, difficulty: 3 },
  { prompt: '有四个开关控制四盏灯（在另一个房间），你只能进房间一次。已知灯泡都是好的。如何确定哪个开关控制哪盏灯？', options: ['打开1、2号开关5分钟，关闭2号，打开3号，进房间', '打开所有开关，进房间', '打开1号10分钟，关闭，立即打开2、3号，进房间', '无法确定', '打开1、2号开关，进房间'], answer: 0, difficulty: 3 },
  { prompt: '五个不同颜色的房子住着五个不同国籍的人，抽不同品牌的烟，喝不同的饮料，养不同的宠物。已知：英国人住红房子，瑞典人养狗，丹麦人喝茶，绿房子在白房子左边，绿房子主人喝咖啡，抽Pall Mall烟的人养鸟，黄房子主人抽Dunhill烟，住中间房子的人喝牛奶，挪威人住第一间房子，抽Blends烟的人住养猫的人隔壁，养马的人住抽Dunhill烟的人隔壁，抽Blue Master烟的人喝啤酒，德国人抽Prince烟，挪威人住蓝房子隔壁，抽Blends烟的人有一个喝水的邻居。问：谁养鱼？', options: ['德国人', '瑞典人', '挪威人', '英国人', '丹麦人'], answer: 0, difficulty: 3 },
  { prompt: '一个监狱里有100个囚犯和100个盒子。每个盒子里有一张纸条，写着一个囚犯的编号（1-100）。囚犯依次进入房间，每人可以打开50个盒子查看。如果所有囚犯都找到自己的编号，所有人都释放；否则全部处决。囚犯们可以在进入前商议策略，但不能在进入后沟通。最佳策略的成功率是多少？', options: ['约31%', '约50%', '约75%', '约10%', '几乎0%'], answer: 0, difficulty: 3 },
  { prompt: '有三顶红帽子和两顶白帽子。三个人被蒙上眼睛，每人戴上一顶帽子，剩下的藏起来。摘下眼罩后，每个人能看到别人的帽子但看不到自己的。第一个人说："我不知道我帽子的颜色。"第二个人也说不知道。第三个人说："我知道我帽子的颜色了。"第三个人的帽子是什么颜色？', options: ['红色', '白色', '无法确定', '看情况', '以上都不是'], answer: 0, difficulty: 3 },
  { prompt: '一个村庄里，每个人都有一双不同颜色的眼睛（要么蓝要么棕）。没有人知道自己的眼睛颜色，也不能互相谈论。如果一个人确定自己的眼睛是蓝色的，他会在第二天中午离开村庄。已知至少有一个人眼睛是蓝色的。第一天没人离开，第二天也没人离开，第三天所有蓝眼睛的人同时离开了。村庄里有多少蓝眼睛的人？', options: ['3', '4', '5', '取决于总数', '无法确定'], answer: 0, difficulty: 3 },
  { prompt: '12个球中有一个重量不同（不知轻重），用天平最少称几次能找出该球并确定轻重？', options: ['3', '4', '5', '2', '6'], answer: 0, difficulty: 3 },
  { prompt: '一个正方形棋盘上有64个格子。去掉对角线的两个角，剩下62个格子。能否用31个2×1的多米诺骨牌完全覆盖？', options: ['不能', '能', '取决于摆放', '可能', '不确定'], answer: 0, difficulty: 3 },
  { prompt: '一个数字序列：1, 11, 21, 1211, 111221, 312211, ? 下一个数是多少？', options: ['13112221', '1113213211', '31131211131221', '132112213221', '以上都不是'], answer: 0, difficulty: 3 }
];

// 使用puzzleBank作为题库
const questionBank = puzzleBank;

const TOTAL_QUESTIONS = 30;
const TIMER_DURATION = 40 * 60; // 40 minutes total

let currentIndex = 0;
let correctCount = 0;
let selectedOption = null;
let timer = TIMER_DURATION;
let timerInterval = null;
let currentTestQuestions = []; // 当前测试的随机题目
let answerHistory = []; // 记录每题的答案选择和是否正确
let canGoBack = false; // 是否可以返回上一题

// DOM 元素
const introPanel = document.getElementById('intro-panel');
const testPanel = document.getElementById('test-panel');
const resultPanel = document.getElementById('result-panel');
const paymentPanel = document.getElementById('payment-panel');
const startButton = document.getElementById('start-button');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options');
const progressLabel = document.getElementById('progress');
const scoreLabel = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const prevButton = document.getElementById('prev-button');
const undoButton = document.getElementById('undo-button');
const nextButton = document.getElementById('next-button');
const restartButton = document.getElementById('restart-button');
const correctCountElement = document.getElementById('correct-count');
const accessCodeInput = document.getElementById('access-code');
const submitCodeButton = document.getElementById('submit-code');
const simulateAlipayButton = document.getElementById('simulate-alipay');
const iqScoreElement = document.getElementById('iq-score');
const percentileElement = document.getElementById('percentile');
const percentileTextElement = document.getElementById('percentile-text');
const higherThanElement = document.getElementById('higher-than');
const userMarker = document.getElementById('user-marker');
const categoryValueElement = document.getElementById('category-value');

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
  
  // 计算百分比排名：低於你的百分比
  const percentile = normCDF(z) * 100;
  const clampedPercentile = Math.max(0.1, Math.min(99.9, percentile));
  
  // 你超过了多少百分比的人
  const exceedsPercent = (100 - clampedPercentile).toFixed(1);
  
  return {
    iq: clampedIQ,
    percentile: clampedPercentile.toFixed(1), // 百分位數（低於你的百分比）
    exceedsPercent: exceedsPercent // 超过了多少百分比的人
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

// 获取 IQ 分类
function getIQCategory(iq) {
  if (iq >= 145) return '神';
  if (iq >= 130) return '天才';
  if (iq >= 110) return '高';
  if (iq >= 90) return '中';
  return '低';
}

// 存储测试结果数据
let testStats = null;

// 显示支付验证页面
function showPaymentPanel() {
  testStats = calculateIQStats(correctCount, TOTAL_QUESTIONS);
  
  testPanel.classList.add('hidden');
  paymentPanel.classList.remove('hidden');
  
  // 清空输入框
  if (accessCodeInput) {
    accessCodeInput.value = '';
  }
}

// 显示结果页面（在支付验证后调用）
function showResultPanel() {
  if (!testStats) {
    testStats = calculateIQStats(correctCount, TOTAL_QUESTIONS);
  }
  
  // 根据用户要求：百分比排名使用 100% - 当前值（即显示高于的百分比）
  // testStats.percentile 是低于你的百分比（如 0.4%）
  // testStats.exceedsPercent 是高于你的百分比（如 99.6%）
  
  // 百分比排名：显示高于的百分比（你超过了多少百分比的人）
  percentileElement.textContent = testStats.exceedsPercent + '%';
  
  // 曲线描述中的两个值：
  // - "低於 X% 的人"：显示高于的百分比（exceedsPercent）
  // - "位於全球人的 Y% 的位置"：显示低于的百分比（percentile）
  higherThanElement.textContent = testStats.exceedsPercent + '%';
  percentileTextElement.textContent = testStats.percentile + '%';
  
  correctCountElement.textContent = correctCount;
  iqScoreElement.textContent = testStats.iq;
  
  // 更新 IQ 分类
  if (categoryValueElement) {
    categoryValueElement.textContent = getIQCategory(testStats.iq);
  }
  
  updateBellCurve(testStats.iq);
  
  paymentPanel.classList.add('hidden');
  resultPanel.classList.remove('hidden');
}

// 开始测试
function startTest() {
  introPanel.classList.add('hidden');
  testPanel.classList.remove('hidden');
  
  currentIndex = 0;
  correctCount = 0;
  selectedOption = null;
  answerHistory = [];
  canGoBack = false;
  
  // 按难度分级排序（从简单到困难）
  // 首先按难度分组
  const easyQuestions = questionBank.filter(q => q.difficulty === 1);
  const mediumQuestions = questionBank.filter(q => q.difficulty === 2);
  const hardQuestions = questionBank.filter(q => q.difficulty === 3);
  
  // 在每个难度组内随机打乱顺序
  function shuffleArray(arr) {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
  
  const shuffledEasy = shuffleArray(easyQuestions);
  const shuffledMedium = shuffleArray(mediumQuestions);
  const shuffledHard = shuffleArray(hardQuestions);
  
  // 按难度顺序组合：先简单，再中等，最后困难
  const allSortedByDifficulty = [...shuffledEasy, ...shuffledMedium, ...shuffledHard];
  
  // 只取前 TOTAL_QUESTIONS 题（确保涵盖所有难度）
  currentTestQuestions = allSortedByDifficulty.slice(0, TOTAL_QUESTIONS);
  
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

function updateTimerDisplay() {
  const minutes = String(Math.floor(timer / 60)).padStart(2, '0');
  const seconds = String(timer % 60).padStart(2, '0');
  timerDisplay.textContent = `${minutes}:${seconds}`;
}

// 加载题目
function loadQuestion() {
  if (currentIndex >= currentTestQuestions.length) {
    finishTest();
    return;
  }

  const question = currentTestQuestions[currentIndex];
  questionText.textContent = question.prompt;
  optionsContainer.innerHTML = '';
  selectedOption = null;
  nextButton.disabled = true;
  undoButton.disabled = true;

  // 检查是否有历史记录
  const history = answerHistory[currentIndex];
  if (history) {
    selectedOption = history.selected;
  }

  question.options.forEach((option, idx) => {
    const button = document.createElement('button');
    button.className = 'option-btn';
    button.textContent = option;
    if (selectedOption === idx) {
      button.classList.add('active');
    }
    button.addEventListener('click', () => selectOption(button, idx));
    optionsContainer.appendChild(button);
  });

  progressLabel.textContent = `第 ${currentIndex + 1} / ${currentTestQuestions.length} 题`;
  scoreLabel.textContent = `答对 ${correctCount} 题`;
  
  // 更新按钮状态
  updateButtonStates();
}

function selectOption(button, idx) {
  if (selectedOption !== null) return;
  selectedOption = idx;
  document.querySelectorAll('.option-btn').forEach((btn) => btn.classList.remove('active'));
  button.classList.add('active');
  nextButton.disabled = false;
  undoButton.disabled = false;
}

// 更新按钮状态
function updateButtonStates() {
  // 上一题按钮：只有在不是第一题且有历史记录时才可用
  prevButton.disabled = currentIndex === 0;
  
  // 撤销选择按钮：只有在当前题目有选择时才可用
  undoButton.disabled = selectedOption === null;
  
  // 下一题按钮：只有在当前题目有选择时才可用
  nextButton.disabled = selectedOption === null;
}

function nextQuestion() {
  if (selectedOption === null) return;
  const question = currentTestQuestions[currentIndex];
  const wasCorrect = selectedOption === question.answer;
  
  // 保存当前题目的历史记录
  answerHistory[currentIndex] = {
    selected: selectedOption,
    correct: wasCorrect
  };
  
  if (wasCorrect) {
    correctCount += 1;
  }
  
  currentIndex += 1;
  canGoBack = true; // 允许返回上一题
  loadQuestion();
}

function finishTest() {
  clearInterval(timerInterval);
  showPaymentPanel();
}

// 撤销当前选择
function undoSelection() {
  if (selectedOption === null) return;
  
  // 重置选择状态
  selectedOption = null;
  document.querySelectorAll('.option-btn').forEach((btn) => btn.classList.remove('active'));
  
  // 更新按钮状态
  nextButton.disabled = true;
  undoButton.disabled = true;
}

// 返回上一题
function prevQuestion() {
  if (currentIndex === 0) return; // 已经是第一题
  
  // 减少索引
  currentIndex -= 1;
  
  // 获取上一题的历史记录
  const history = answerHistory[currentIndex];
  if (history) {
    selectedOption = history.selected;
    
    // 更新正确答案计数（需要重新计算，因为可能修改了选择）
    // 先重置当前题目的正确计数
    const wasCorrect = history.correct;
    if (wasCorrect && selectedOption !== currentTestQuestions[currentIndex].answer) {
      // 如果之前是正确的，但现在选择了不同答案，需要减1
      correctCount -= 1;
    } else if (!wasCorrect && selectedOption === currentTestQuestions[currentIndex].answer) {
      // 如果之前是错误的，但现在选择了正确答案，需要加1
      correctCount += 1;
    }
  } else {
    selectedOption = null;
  }
  
  // 加载题目
  loadQuestion();
}

function restartTest() {
  currentIndex = 0;
  correctCount = 0;
  selectedOption = null;
  testStats = null;
  answerHistory = [];
  canGoBack = false;
  
  resultPanel.classList.add('hidden');
  paymentPanel.classList.add('hidden');
  introPanel.classList.remove('hidden');
  
  // 重置分类显示
  if (categoryValueElement) {
    categoryValueElement.textContent = '中';
  }
}

// 支付验证函数
function verifyAccessCode() {
  const code = accessCodeInput.value.trim();
  if (code === 'Hi_NoahTsang') {
    showResultPanel();
    return true;
  } else {
    alert('验证码错误，请重试。测试验证码: Hi_NoahTsang');
    accessCodeInput.focus();
    accessCodeInput.select();
    return false;
  }
}

// 事件监听
startButton.addEventListener('click', startTest);
prevButton.addEventListener('click', prevQuestion);
undoButton.addEventListener('click', undoSelection);
nextButton.addEventListener('click', nextQuestion);
restartButton.addEventListener('click', restartTest);

// 支付宝模拟支付
function simulateAlipayPayment() {
  // 显示支付中状态
  const alipayButton = simulateAlipayButton;
  if (alipayButton) {
    const originalText = alipayButton.textContent;
    alipayButton.textContent = '支付中...';
    alipayButton.disabled = true;
    
    // 模拟支付处理时间
    setTimeout(() => {
      // 支付成功，显示结果
      alipayButton.textContent = '支付成功！跳转中...';
      setTimeout(() => {
        showResultPanel();
      }, 1000);
    }, 1500);
  }
}

// 支付验证事件
if (submitCodeButton && accessCodeInput) {
  submitCodeButton.addEventListener('click', verifyAccessCode);
  accessCodeInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      verifyAccessCode();
    }
  });
}

// 支付宝支付事件
if (simulateAlipayButton) {
  simulateAlipayButton.addEventListener('click', simulateAlipayPayment);
}

// 初始化：显示介绍页面
introPanel.classList.remove('hidden');
testPanel.classList.add('hidden');
resultPanel.classList.add('hidden');
paymentPanel.classList.add('hidden');

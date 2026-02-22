// 题库加载系统
let questionBank = []; // 从JSON文件加载的题库
const QUESTION_BANK_URL = 'questions.json';

// 加载题库的异步函数
async function loadQuestionBank() {
  try {
    const response = await fetch(QUESTION_BANK_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    questionBank = await response.json();
    console.log(`题库加载成功，共 ${questionBank.length} 道题`);
    
    // 启用开始按钮
    if (startButton) {
      startButton.disabled = false;
      startButton.textContent = '开始测试';
    }
    
    return questionBank;
  } catch (error) {
    console.error('加载题库失败:', error);
    // 显示错误信息
    if (introPanel) {
      const errorMsg = document.createElement('div');
      errorMsg.className = 'error-message';
      errorMsg.textContent = '题库加载失败，请刷新页面重试。';
      introPanel.appendChild(errorMsg);
    }
    
    // 禁用开始按钮
    if (startButton) {
      startButton.disabled = true;
      startButton.textContent = '题库加载中...';
    }
    
    return [];
  }
}

// 页面加载时初始化题库
document.addEventListener('DOMContentLoaded', () => {
  // 初始禁用开始按钮
  if (startButton) {
    startButton.disabled = true;
    startButton.textContent = '题库加载中...';
  }
  
  // 加载题库
  loadQuestionBank();
});

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
  // 检查题库是否已加载
  if (questionBank.length === 0) {
    alert('题库尚未加载完成，请稍后重试。');
    return;
  }
  
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
  // 直接切换选择：如果已经选择了当前选项，则取消选择；否则选择新选项
  if (selectedOption === idx) {
    // 取消选择当前选项
    selectedOption = null;
    button.classList.remove('active');
  } else {
    // 选择新选项
    selectedOption = idx;
    document.querySelectorAll('.option-btn').forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
  }
  
  nextButton.disabled = selectedOption === null;
}

// 更新按钮状态
function updateButtonStates() {
  // 上一题按钮：只有在不是第一题且有历史记录时才可用
  prevButton.disabled = currentIndex === 0;
  
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
  showResultPanel(); // 直接显示结果，跳过支付验证页面
}

// 撤销当前选择
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

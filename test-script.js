// 测试页面脚本 - 支持单选模式（单选按钮）

// 常量定义
const TOTAL_QUESTIONS = 30;
const TIMER_DURATION = 40 * 60; // 40 minutes total
const STORAGE_KEY = 'iqTestProgress'; // localStorage 进度存储键

// 状态变量
let currentIndex = 0;
let correctCount = 0;
let selectedOptions = null; // 单选模式：存储单个选项索引
let timer = TIMER_DURATION;
let timerInterval = null;
let currentTestQuestions = []; // 当前测试的随机题目
let answerHistory = []; // 记录每题的答案选择和是否正确
let canGoBack = false; // 是否可以返回上一题
let testSessionId = null; // 当前测试会话ID

// DOM 元素
const testPanel = document.getElementById('test-panel');
const paymentPanel = document.getElementById('payment-panel');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options');
const progressLabel = document.getElementById('progress');
const scoreLabel = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');

// 进度保存与恢复函数
function saveProgress() {
  if (!testSessionId) return; // 没有有效的会话ID时不保存
  
  const progress = {
    sessionId: testSessionId,
    timestamp: Date.now(),
    currentIndex,
    correctCount,
    selectedOptions: selectedOptions, // 单选模式：直接存储值
    timer,
    currentTestQuestions: currentTestQuestions.map(q => ({
      prompt: q.prompt,
      options: [...q.options],
      answer: q.answer,
      difficulty: q.difficulty
    })),
    answerHistory: [...answerHistory],
    canGoBack
  };
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    console.log('进度已保存');
  } catch (e) {
    console.error('保存进度失败:', e);
  }
}

function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    
    const progress = JSON.parse(saved);
    
    // 检查进度是否有效（有基本字段）
    if (!progress.sessionId || !progress.currentTestQuestions || !progress.answerHistory) {
      return null;
    }
    
    // 检查进度是否过期（超过24小时）
    const now = Date.now();
    const hoursElapsed = (now - progress.timestamp) / (1000 * 60 * 60);
    if (hoursElapsed > 24) {
      clearProgress(); // 清除过期进度
      return null;
    }
    
    return progress;
  } catch (e) {
    console.error('加载进度失败:', e);
    return null;
  }
}

function clearProgress() {
  localStorage.removeItem(STORAGE_KEY);
  console.log('进度已清除');
}

// 自动保存进度（每次用户操作后）
function autoSave() {
  if (testSessionId) {
    saveProgress();
  }
}

// 页面初始化
document.addEventListener('DOMContentLoaded', async () => {
  // 加载题库
  await loadQuestionBank();
  
  // 确保题库已加载
  if (window.questionBank && window.questionBank.length > 0) {
    // 检查是否有保存的进度
    const savedProgress = loadProgress();
    if (savedProgress) {
      // 询问用户是否恢复进度
      const shouldRestore = confirm(`发现未完成的测试（已答 ${savedProgress.currentIndex} 题，剩余时间 ${Math.floor(savedProgress.timer / 60)}:${String(savedProgress.timer % 60).padStart(2, '0')}）。是否恢复进度？\n\n点击"确定"恢复上次进度，点击"取消"开始新测试。`);
      if (shouldRestore) {
        restoreTest(savedProgress);
        return;
      } else {
        // 用户选择开始新测试，清除旧进度
        clearProgress();
      }
    }
    // 开始新测试
    startTest();
  } else {
    // 尝试重新加载
    const bank = await loadQuestionBank();
    if (bank.length > 0) {
      startTest();
    } else {
      alert('题库加载失败，请刷新页面重试。');
    }
  }
  
  // 事件监听
  if (prevButton) prevButton.addEventListener('click', prevQuestion);
  if (nextButton) nextButton.addEventListener('click', nextQuestion);
  
  // 页面关闭前自动保存进度
  window.addEventListener('beforeunload', () => {
    autoSave();
  });
});

// 恢复测试进度
function restoreTest(progress) {
  testSessionId = progress.sessionId;
  currentIndex = progress.currentIndex;
  correctCount = progress.correctCount;
  selectedOptions = [...progress.selectedOptions];
  timer = progress.timer;
  currentTestQuestions = progress.currentTestQuestions;
  answerHistory = [...progress.answerHistory];
  canGoBack = progress.canGoBack;
  
  // 重新启动计时器（从保存的时间继续）
  startTimer(progress.timer);
  loadQuestion();
  
  console.log(`测试进度已恢复：第 ${currentIndex + 1} 题，答对 ${correctCount} 题，剩余时间 ${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, '0')}`);
}

// 开始测试
function startTest() {
  if (!window.questionBank || window.questionBank.length === 0) {
    alert('题库尚未加载完成，请稍后重试。');
    return;
  }
  
  // 生成新的测试会话ID
  testSessionId = Date.now().toString();
  
  currentIndex = 0;
  correctCount = 0;
  selectedOptions = [];
  answerHistory = [];
  canGoBack = false;
  
  // 按难度梯度选择题目
  currentTestQuestions = selectQuestionsByDifficulty(window.questionBank, TOTAL_QUESTIONS);
  
  startTimer();
  loadQuestion();
  
  // 保存初始进度
  autoSave();
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
  selectedOptions = null; // 改为单选，存储单个值而不是数组
  nextButton.disabled = true;

  // 检查是否有历史记录
  const history = answerHistory[currentIndex];
  if (history && history.selected !== undefined) {
    selectedOptions = history.selected;
  }

  // 创建单选按钮选项（单选模式）
  question.options.forEach((option, idx) => {
    const optionItem = document.createElement('div');
    optionItem.className = 'option-item';
    
    // 创建单选按钮
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'question-option'; // 所有选项共享相同的name，确保单选
    radio.id = `option-${idx}`;
    radio.value = idx;
    radio.checked = selectedOptions === idx;
    radio.addEventListener('change', () => selectOption(idx));
    
    // 创建标签
    const label = document.createElement('label');
    label.htmlFor = `option-${idx}`;
    label.textContent = option;
    
    optionItem.appendChild(radio);
    optionItem.appendChild(label);
    optionsContainer.appendChild(optionItem);
  });

  progressLabel.textContent = `第 ${currentIndex + 1} / ${currentTestQuestions.length} 题`;
  scoreLabel.textContent = `答对 ${correctCount} 题`;
  
  // 更新按钮状态
  updateButtonStates();
}

// 选择选项（单选模式）
function selectOption(idx) {
  // 单选逻辑：直接设置当前选择，取消其他选项由浏览器radio组自动处理
  selectedOptions = idx;
  
  // 只要有选择就能进入下一题
  nextButton.disabled = false;
  
  // 自动保存进度
  autoSave();
}

// 更新按钮状态
function updateButtonStates() {
  // 上一题按钮：只有在不是第一题且有历史记录时才可用
  if (prevButton) prevButton.disabled = currentIndex === 0;
  
  // 下一题按钮：只有在当前题目有选择时才可用（单选模式）
  if (nextButton) nextButton.disabled = selectedOptions === null || selectedOptions === undefined;
}

// 下一题
function nextQuestion() {
  if (selectedOptions === null || selectedOptions === undefined) return;
  const question = currentTestQuestions[currentIndex];
  
  // 单选模式下的正确判断：选择的选项必须等于正确答案
  const wasCorrect = selectedOptions === question.answer;
  
  // 保存当前题目的历史记录
  answerHistory[currentIndex] = {
    selected: selectedOptions,
    correct: wasCorrect
  };
  
  if (wasCorrect) {
    correctCount += 1;
  }
  
  currentIndex += 1;
  canGoBack = true; // 允许返回上一题
  loadQuestion();
  
  // 自动保存进度
  autoSave();
}

// 返回上一题
function prevQuestion() {
  if (currentIndex === 0) return; // 已经是第一题
  
  // 减少索引
  currentIndex -= 1;
  
  // 获取上一题的历史记录
  const history = answerHistory[currentIndex];
  if (history) {
    selectedOptions = [...history.selected];
    
    // 更新正确答案计数（需要重新计算，因为可能修改了选择）
    const wasCorrect = history.correct;
    const question = currentTestQuestions[currentIndex];
    const hasCorrectAnswer = selectedOptions.includes(question.answer);
    
    if (wasCorrect && !hasCorrectAnswer) {
      // 如果之前是正确的，但现在没有选择正确答案，需要减1
      correctCount -= 1;
    } else if (!wasCorrect && hasCorrectAnswer) {
      // 如果之前是错误的，但现在选择了正确答案，需要加1
      correctCount += 1;
    }
  } else {
    selectedOptions = [];
  }
  
  // 加载题目
  loadQuestion();
  
  // 自动保存进度
  autoSave();
}

// 启动计时器
function startTimer(initialTime = null) {
  timer = initialTime !== null ? initialTime : TIMER_DURATION;
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

// 更新计时器显示
function updateTimerDisplay() {
  if (!timerDisplay) return;
  const minutes = String(Math.floor(timer / 60)).padStart(2, '0');
  const seconds = String(timer % 60).padStart(2, '0');
  timerDisplay.textContent = `${minutes}:${seconds}`;
}

// 完成测试
function finishTest() {
  clearInterval(timerInterval);
  showPaymentPanel();
}

// 显示支付页面
function showPaymentPanel() {
  // 计算测试统计
  const testStats = calculateIQStats(correctCount, TOTAL_QUESTIONS);
  
  // 保存到sessionStorage以便结果页面使用
  sessionStorage.setItem('iqTestResults', JSON.stringify({
    correctCount: correctCount,
    totalQuestions: TOTAL_QUESTIONS,
    stats: testStats
  }));
  
  // 显示支付页面
  if (testPanel) testPanel.classList.add('hidden');
  if (paymentPanel) paymentPanel.classList.remove('hidden');
}

// 添加单选模式的CSS样式
function addSingleSelectStyles() {
  if (!document.getElementById('single-select-styles')) {
    const style = document.createElement('style');
    style.id = 'single-select-styles';
    style.textContent = `
      .option-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 16px;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        transition: all 0.2s;
        cursor: pointer;
      }
      
      .option-item:hover {
        background: rgba(255, 255, 255, 0.06);
        border-color: var(--accent);
      }
      
      .option-item input[type="radio"] {
        width: 20px;
        height: 20px;
        cursor: pointer;
      }
      
      .option-item label {
        flex: 1;
        cursor: pointer;
        font-size: 1rem;
        line-height: 1.4;
      }
      
      .options-grid {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
    `;
    document.head.appendChild(style);
  }
}

// 初始化单选样式
addSingleSelectStyles();
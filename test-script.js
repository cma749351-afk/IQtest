// 测试页面脚本 - 支持多选模式（复选框）

// 常量定义
const TOTAL_QUESTIONS = 30;
const TIMER_DURATION = 40 * 60; // 40 minutes total

// 状态变量
let currentIndex = 0;
let correctCount = 0;
let selectedOptions = []; // 改为数组，支持多选
let timer = TIMER_DURATION;
let timerInterval = null;
let currentTestQuestions = []; // 当前测试的随机题目
let answerHistory = []; // 记录每题的答案选择和是否正确
let canGoBack = false; // 是否可以返回上一题

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
const accessCodeInput = document.getElementById('access-code');
const submitCodeButton = document.getElementById('submit-code');

// 页面初始化
document.addEventListener('DOMContentLoaded', async () => {
  // 加载题库
  await loadQuestionBank();
  
  // 确保题库已加载
  if (window.questionBank && window.questionBank.length > 0) {
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
  if (submitCodeButton && accessCodeInput) {
    submitCodeButton.addEventListener('click', verifyAccessCode);
    accessCodeInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        verifyAccessCode();
      }
    });
  }
});

// 开始测试
function startTest() {
  if (!window.questionBank || window.questionBank.length === 0) {
    alert('题库尚未加载完成，请稍后重试。');
    return;
  }
  
  currentIndex = 0;
  correctCount = 0;
  selectedOptions = [];
  answerHistory = [];
  canGoBack = false;
  
  // 按难度梯度选择题目
  currentTestQuestions = selectQuestionsByDifficulty(window.questionBank, TOTAL_QUESTIONS);
  
  startTimer();
  loadQuestion();
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
  selectedOptions = [];
  nextButton.disabled = true;

  // 检查是否有历史记录
  const history = answerHistory[currentIndex];
  if (history) {
    selectedOptions = [...history.selected];
  }

  // 创建多选复选框选项
  question.options.forEach((option, idx) => {
    const optionItem = document.createElement('div');
    optionItem.className = 'option-item';
    
    // 创建复选框
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `option-${idx}`;
    checkbox.value = idx;
    checkbox.checked = selectedOptions.includes(idx);
    checkbox.addEventListener('change', () => selectOption(idx));
    
    // 创建标签
    const label = document.createElement('label');
    label.htmlFor = `option-${idx}`;
    label.textContent = option;
    
    optionItem.appendChild(checkbox);
    optionItem.appendChild(label);
    optionsContainer.appendChild(optionItem);
  });

  progressLabel.textContent = `第 ${currentIndex + 1} / ${currentTestQuestions.length} 题`;
  scoreLabel.textContent = `答对 ${correctCount} 题`;
  
  // 更新按钮状态
  updateButtonStates();
}

// 选择/取消选择选项（多选模式）
function selectOption(idx) {
  const checkbox = document.getElementById(`option-${idx}`);
  
  if (checkbox.checked) {
    // 添加选项到选择列表
    if (!selectedOptions.includes(idx)) {
      selectedOptions.push(idx);
    }
  } else {
    // 从选择列表中移除选项
    selectedOptions = selectedOptions.filter(option => option !== idx);
  }
  
  // 至少选择一个选项才能进入下一题
  nextButton.disabled = selectedOptions.length === 0;
}

// 更新按钮状态
function updateButtonStates() {
  // 上一题按钮：只有在不是第一题且有历史记录时才可用
  if (prevButton) prevButton.disabled = currentIndex === 0;
  
  // 下一题按钮：只有在当前题目有选择时才可用
  if (nextButton) nextButton.disabled = selectedOptions.length === 0;
}

// 下一题
function nextQuestion() {
  if (selectedOptions.length === 0) return;
  const question = currentTestQuestions[currentIndex];
  
  // 多选模式下的正确判断：只要选择的选项中包含正确答案就算正确
  const hasCorrectAnswer = selectedOptions.includes(question.answer);
  const wasCorrect = hasCorrectAnswer;
  
  // 保存当前题目的历史记录
  answerHistory[currentIndex] = {
    selected: [...selectedOptions],
    correct: wasCorrect
  };
  
  if (wasCorrect) {
    correctCount += 1;
  }
  
  currentIndex += 1;
  canGoBack = true; // 允许返回上一题
  loadQuestion();
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
}

// 启动计时器
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

// 显示支付验证页面
function showPaymentPanel() {
  // 计算测试统计
  const testStats = calculateIQStats(correctCount, TOTAL_QUESTIONS);
  
  // 保存到sessionStorage以便结果页面使用
  sessionStorage.setItem('iqTestResults', JSON.stringify({
    correctCount: correctCount,
    totalQuestions: TOTAL_QUESTIONS,
    stats: testStats
  }));
  
  // 显示支付验证页面
  if (testPanel) testPanel.classList.add('hidden');
  if (paymentPanel) paymentPanel.classList.remove('hidden');
  
  // 清空输入框
  if (accessCodeInput) {
    accessCodeInput.value = '';
  }
}

// 支付验证函数
function verifyAccessCode() {
  const code = accessCodeInput.value.trim();
  if (code === 'Hi_NoahTsang') {
    // 跳转到结果页面
    window.location.href = `result.html?correct=${correctCount}&total=${TOTAL_QUESTIONS}`;
    return true;
  } else {
    alert('验证码错误，请重试。测试验证码: Hi_NoahTsang');
    if (accessCodeInput) {
      accessCodeInput.focus();
      accessCodeInput.select();
    }
    return false;
  }
}

// 添加多选模式的CSS样式
function addMultiSelectStyles() {
  if (!document.getElementById('multi-select-styles')) {
    const style = document.createElement('style');
    style.id = 'multi-select-styles';
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
      
      .option-item input[type="checkbox"] {
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

// 初始化多选样式
addMultiSelectStyles();
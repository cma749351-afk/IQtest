// 共享函数库 - 用于多页面IQ测试应用

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
    return questionBank;
  } catch (error) {
    console.error('加载题库失败:', error);
    return [];
  }
}

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
  
  // 计算 z-score
  let z = (correct - meanCorrect) / stdCorrect;
  // 限制 z 在合理范围内
  z = Math.max(-3, Math.min(3, z));
  
  // 转换为 IQ（均值 100，标准差 15）
  const iq = 100 + z * 15;
  
  // 计算百分比（基于 z-score 的正态分布）
  const percentile = normCDF(z) * 100;
  const exceedsPercent = 100 - percentile;
  
  // 计算钟形曲线上的位置（55-145 范围）
  const markerPosition = ((iq - 55) / (145 - 55)) * 100;
  
  // 确定 IQ 分类
  const category = getIQCategory(iq);
  
  return {
    iq: Math.round(iq * 10) / 10,
    percentile: Math.min(99.99, Math.max(0.01, percentile)),
    exceedsPercent: Math.min(99.99, Math.max(0.01, exceedsPercent)),
    markerPosition: Math.min(100, Math.max(0, markerPosition)),
    category: category
  };
}

// IQ 分类函数
function getIQCategory(iq) {
  if (iq < 70) return '低';
  if (iq < 85) return '中下';
  if (iq < 115) return '中等';
  if (iq < 130) return '高';
  if (iq < 145) return '天才';
  return '神';
}

// Fisher-Yates 洗牌算法
function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// 按难度梯度选择题目
function selectQuestionsByDifficulty(bank, totalQuestions = 30) {
  // 按难度分组
  const easyQuestions = bank.filter(q => q.difficulty === 1);
  const mediumQuestions = bank.filter(q => q.difficulty === 2);
  const hardQuestions = bank.filter(q => q.difficulty === 3);
  
  // 在每个难度组内随机打乱顺序
  const shuffledEasy = shuffleArray(easyQuestions);
  const shuffledMedium = shuffleArray(mediumQuestions);
  const shuffledHard = shuffleArray(hardQuestions);
  
  // 按难度顺序组合：先简单，再中等，最后困难
  const allSortedByDifficulty = [...shuffledEasy, ...shuffledMedium, ...shuffledHard];
  
  // 只取前 totalQuestions 题（确保涵盖所有难度）
  return allSortedByDifficulty.slice(0, totalQuestions);
}

// 导出函数供其他文件使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    loadQuestionBank,
    calculateIQStats,
    getIQCategory,
    shuffleArray,
    selectQuestionsByDifficulty,
    normCDF
  };
}
// 结果页面脚本

// DOM 元素
const correctCountElement = document.getElementById('correct-count');
const iqScoreElement = document.getElementById('iq-score');
const percentileElement = document.getElementById('percentile');
const percentileTextElement = document.getElementById('percentile-text');
const higherThanElement = document.getElementById('higher-than');
const userMarker = document.getElementById('user-marker');
const categoryValueElement = document.getElementById('category-value');
const restartButton = document.getElementById('restart-button');

// 页面初始化
document.addEventListener('DOMContentLoaded', () => {
  // 从URL参数获取结果数据
  const urlParams = new URLSearchParams(window.location.search);
  const correctCount = parseInt(urlParams.get('correct') || '0');
  const totalQuestions = parseInt(urlParams.get('total') || '30');
  
  // 加载并显示结果
  loadResultData(correctCount, totalQuestions);
  
  // 重新开始按钮事件
  if (restartButton) {
    restartButton.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }
});

// 加载并显示结果数据
function loadResultData(correctCount, totalQuestions) {
  // 更新答对题数
  if (correctCountElement) {
    correctCountElement.textContent = correctCount;
  }
  
  // 计算IQ统计
  const stats = calculateIQStats(correctCount, totalQuestions);
  
  // 更新IQ分数
  if (iqScoreElement) {
    iqScoreElement.textContent = stats.iq;
  }
  
  // 更新百分比排名
  if (percentileElement) {
    percentileElement.textContent = stats.exceedsPercent.toFixed(1) + '%';
  }
  
  // 更新曲线描述文本
  if (percentileTextElement && higherThanElement) {
    percentileTextElement.textContent = stats.percentile.toFixed(1) + '%';
    higherThanElement.textContent = stats.exceedsPercent.toFixed(1) + '%';
  }
  
  // 更新钟形曲线标记位置
  if (userMarker) {
    userMarker.style.left = stats.markerPosition + '%';
  }
  
  // 更新IQ分类
  if (categoryValueElement) {
    categoryValueElement.textContent = stats.category;
  }
  
  // 保存到sessionStorage（可选）
  sessionStorage.setItem('lastIQTestResult', JSON.stringify({
    correctCount: correctCount,
    totalQuestions: totalQuestions,
    iq: stats.iq,
    percentile: stats.percentile,
    category: stats.category,
    timestamp: new Date().toISOString()
  }));
}

// 页面加载完成后的初始化
window.loadResultData = loadResultData;
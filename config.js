// 📊 IQ Test 配置文件
// 版本: 1.0.0
// 最后更新: 2026-02-22

const CONFIG = {
  // 测试设置
  TEST_SETTINGS: {
    TOTAL_QUESTIONS: 30,           // 总题目数
    TIMER_DURATION: 40 * 60,       // 总测试时间（秒）- 40分钟
    QUESTION_TIME: 30,             // 每题时间限制（秒）
  },
  
  // IQ 计算设置
  IQ_SETTINGS: {
    MEAN_IQ: 100,                  // 平均 IQ
    STD_DEV: 15,                   // 标准差
    MIN_IQ: 55,                    // 最小 IQ 值
    MAX_IQ: 145,                   // 最大 IQ 值
    MEAN_CORRECT: 0.5,             // 平均正确率（30题中的15题）
    STD_CORRECT: 0.15,             // 正确率标准差
  },
  
  // 显示设置
  DISPLAY_SETTINGS: {
    BELL_CURVE_MIN: 55,            // 钟形曲线最小 IQ
    BELL_CURVE_MAX: 145,           // 钟形曲线最大 IQ
    DECIMAL_PLACES: 1,             // 百分比小数位数
    MIN_PERCENTILE: 0.1,           // 最小百分比（防止显示0%）
    MAX_PERCENTILE: 99.9,          // 最大百分比（防止显示100%）
  },
  
  // 页面文本
  TEXT: {
    INTRO_TITLE: "Mensa 风格 IQ 挑战",
    INTRO_SUBTITLE: "30 题逻辑推理 • 每題 5 选项 • 限时完成",
    INTRO_FEATURES: [
      { icon: "⏱️", text: "40 分钟限时测试" },
      { icon: "📊", text: "即时智商估值与百分比排名" },
      { icon: "🔔", text: "钟形曲线展示水平分布" }
    ],
    INTRO_DESCRIPTION: "本测试参考国际高智商组织 Mensa 的题型设计，涵盖逻辑推理、图形辨识、数列推算等类别。完成测试后，你将获得基于正态分布的 IQ 估值与全球百分比排名。",
    RESULT_TITLE: "测验完成 🎉",
    CURVE_TITLE: "IQ 分布钟形曲线",
    CURVE_DESCRIPTION: "你的 IQ 估值位于全球人口的 {percentile}% 位置，高于 {exceedsPercent}% 的人。"
  }
};

// 导出配置（用于 Node.js 环境）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
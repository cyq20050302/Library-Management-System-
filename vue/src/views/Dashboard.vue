<template>
  <div class="dashboard-root">
    <!-- <div class="dashboard-header">
      <h1 class="dashboard-title">图书管理系统仪表盘</h1>
      <p class="dashboard-subtitle">实时监控图书馆运营状况</p>
    </div> -->
    
    <!-- 统计卡片区域 -->
    <div class="stats-section">
      <div class="stat-card">
        <div class="stat-icon">📚</div>
        <div class="stat-content">
          <div class="stat-label">图书总数</div>
          <div class="stat-value">{{ stats.books }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📖</div>
        <div class="stat-content">
          <div class="stat-label">借出图书</div>
          <div class="stat-value">{{ stats.borrowed }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-content">
          <div class="stat-label">用户总数</div>
          <div class="stat-value">{{ stats.users }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🏛️</div>
        <div class="stat-content">
          <div class="stat-label">在馆图书</div>
          <div class="stat-value">{{ stats.inLibrary }}</div>
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="charts-section">
      <div class="section-title">数据分析</div>
      <div class="dashboard-charts">
        <div class="dashboard-chart-wrap">
          <div class="chart-header">
            <h3 class="chart-title">图书状态分布</h3>
            <span class="chart-desc">实时库存状态</span>
          </div>
          <div ref="pieRef" class="dashboard-chart"></div>
        </div>
        <div class="dashboard-chart-wrap">
          <div class="chart-header">
            <h3 class="chart-title">系统总览</h3>
            <span class="chart-desc">各项数据对比</span>
          </div>
          <div ref="barRef" class="dashboard-chart"></div>
        </div>
        <div class="dashboard-chart-wrap">
          <div class="chart-header">
            <h3 class="chart-title">近7天借阅趋势</h3>
            <span class="chart-desc">借阅活跃度变化</span>
          </div>
          <div ref="lineRef" class="dashboard-chart"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import * as echarts from 'echarts';

// 假数据
const stats = ref({ books: 120, borrowed: 35, users: 58, inLibrary: 85 });
const borrowTrend = ref([
  { date: '周一', count: 2 },
  { date: '周二', count: 5 },
  { date: '周三', count: 3 },
  { date: '周四', count: 6 },
  { date: '周五', count: 4 },
  { date: '周六', count: 7 },
  { date: '周日', count: 2 }
]);

const pieRef = ref(null);
const barRef = ref(null);
const lineRef = ref(null);
let pieChart = null;
let barChart = null;
let lineChart = null;

const renderPie = () => {
  if (!pieChart) pieChart = echarts.init(pieRef.value);
  const option = {
    backgroundColor: 'transparent',
    tooltip: { 
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: { 
      bottom: 20, 
      left: 'center', 
      textStyle: { color: '#666', fontSize: 12 }
    },
    series: [
      {
        name: '图书状态',
        type: 'pie',
        radius: ['45%', '75%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: false,
        label: { show: false },
        emphasis: { 
          label: { show: true, fontSize: 16, fontWeight: 'bold' },
          scale: true,
          scaleSize: 5
        },
        labelLine: { show: false },
        data: [
          { value: stats.value.inLibrary, name: '在馆图书' },
          { value: stats.value.borrowed, name: '借出图书' }
        ],
        color: ['#5470c6', '#91cc75']
      }
    ]
  };
  pieChart.setOption(option);
};

const renderBar = () => {
  if (!barChart) barChart = echarts.init(barRef.value);
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: { left: 60, right: 40, top: 40, bottom: 60 },
    xAxis: {
      type: 'category',
      data: ['图书总数', '借出图书', '用户总数'],
      axisLine: { lineStyle: { color: '#e0e0e0' } },
      axisLabel: { 
        color: '#666', 
        fontSize: 12,
        interval: 0,
        rotate: 0
      }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#f0f0f0' } },
      axisLabel: { color: '#666', fontSize: 12 }
    },
    series: [{
      name: '数量',
      type: 'bar',
      data: [stats.value.books, stats.value.borrowed, stats.value.users],
      itemStyle: {
        color: function(params) {
          const colors = ['#5470c6', '#91cc75', '#fac858'];
          return colors[params.dataIndex];
        },
        borderRadius: [6, 6, 0, 0]
      },
      barWidth: '60%',
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };
  barChart.setOption(option);
};

const renderLine = () => {
  if (!lineChart) lineChart = echarts.init(lineRef.value);
  const option = {
    backgroundColor: 'transparent',
    tooltip: { 
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.9)',
      borderColor: '#ccc',
      textStyle: { color: '#333' }
    },
    grid: { left: 60, right: 40, top: 40, bottom: 60 },
    xAxis: {
      type: 'category',
      data: borrowTrend.value.map(i => i.date),
      axisLine: { lineStyle: { color: '#e0e0e0' } },
      axisLabel: { color: '#666', fontSize: 12 }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#f0f0f0' } },
      axisLabel: { color: '#666', fontSize: 12 }
    },
    series: [{
      name: '借阅次数',
      type: 'line',
      data: borrowTrend.value.map(i => i.count),
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: { 
        color: '#5470c6', 
        width: 3,
        shadowColor: 'rgba(84, 112, 198, 0.3)',
        shadowBlur: 5
      },
      itemStyle: { 
        color: '#5470c6',
        borderColor: '#fff',
        borderWidth: 2
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(84, 112, 198, 0.3)' },
            { offset: 1, color: 'rgba(84, 112, 198, 0.05)' }
          ]
        }
      }
    }]
  };
  lineChart.setOption(option);
};

onMounted(() => {
  renderPie();
  renderBar();
  renderLine();
});

watch(stats, () => {
  renderPie();
  renderBar();
});
</script>

<style scoped>
.dashboard-root {
  width: 100%;
  max-width: 1400px;
  min-height: 100vh;
  margin: 0 auto;
  padding: 24px;
  background-attachment: fixed;
  box-sizing: border-box;
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  font-size: 48px;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(240, 147, 251, 0.3);
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
  font-weight: 500;
}

.stat-value {
  font-size: 36px;
  font-weight: 700;
  color: #333;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.charts-section {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 32px;
  text-align: center;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
}

.dashboard-charts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 32px;
}

.dashboard-chart-wrap {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.dashboard-chart-wrap:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.chart-header {
  margin-bottom: 20px;
  text-align: center;
}

.chart-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
}

.chart-desc {
  font-size: 12px;
  color: #999;
  font-weight: 400;
}

.dashboard-chart {
  width: 100%;
  height: 300px;
  border-radius: 12px;
}

@media (max-width: 768px) {
  .dashboard-root {
    padding: 16px;
  }
  
  .dashboard-title {
    font-size: 24px;
  }
  
  .stats-section {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 32px;
  }
  
  .stat-card {
    padding: 20px;
  }
  
  .stat-icon {
    font-size: 36px;
    width: 48px;
    height: 48px;
  }
  
  .stat-value {
    font-size: 28px;
  }
  
  .charts-section {
    padding: 24px 16px;
  }
  
  .dashboard-charts {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .dashboard-chart-wrap {
    padding: 20px;
  }
  
  .dashboard-chart {
    height: 250px;
  }
}

@media (max-width: 480px) {
  .stat-card {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
  
  .dashboard-chart {
    height: 220px;
  }
}
</style>
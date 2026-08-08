<template>
  <v-app :theme="currentTheme">
    <v-main :class="isDark ? 'main-dark' : 'main-light'">
      <v-container fluid class="pa-5 pa-md-7">

        <!-- ══════════════════════════════
             HEADER
        ══════════════════════════════ -->
        <v-row class="mb-6" align="center">
          <v-col cols="12" md="7">
            <div class="d-flex align-center gap-3">
              <div class="header-icon-wrap" :class="isDark ? 'header-icon-dark' : 'header-icon-light'">
                <v-icon size="28" color="primary">mdi-chart-line-variant</v-icon>
              </div>
              <div>
                <h1 class="page-title" :class="isDark ? 'text-white' : 'text-grey-darken-4'">
                  รายงานรายได้
                </h1>
                <p class="page-subtitle mb-0" :class="isDark ? 'text-grey-lighten-1' : 'text-grey-darken-1'">
                  สรุปรายได้ · อัตราการเติบโต · รายการธุรกรรม
                </p>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="5">
            <div class="d-flex align-center justify-md-end gap-3 flex-wrap">
              <!-- Period Selector -->
              <v-btn-toggle v-model="selectedPeriod" mandatory density="comfortable"
                :class="isDark ? 'period-toggle-dark' : 'period-toggle-light'">
                <v-btn value="monthly" size="small">รายเดือน</v-btn>
                <v-btn value="quarterly" size="small">รายไตรมาส</v-btn>
                <v-btn value="yearly" size="small">รายปี</v-btn>
              </v-btn-toggle>
              <!-- Year Selector -->
              <v-select v-model="selectedYear" :items="yearOptions" density="compact"
                variant="outlined" hide-details style="max-width:110px"
                :bg-color="isDark ? '#1e2235' : '#f1f4fb'" />
              <!-- Theme Toggle -->
              <v-tooltip :text="isDark ? 'ธีมสว่าง' : 'ธีมมืด'" location="bottom">
                <template #activator="{ props }">
                  <v-btn v-bind="props" :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
                    :color="isDark ? 'yellow-darken-2' : 'blue-darken-3'"
                    variant="tonal" size="large" @click="toggleTheme" />
                </template>
              </v-tooltip>
              <!-- Export -->
              <v-btn color="primary" variant="tonal" size="large" prepend-icon="mdi-download-outline">
                ส่งออก
              </v-btn>
            </div>
          </v-col>
        </v-row>

        <!-- ══════════════════════════════
             KPI CARDS
        ══════════════════════════════ -->
        <v-row class="mb-6">
          <v-col v-for="(kpi, i) in kpiCards" :key="i" cols="12" sm="6" md="3">
            <v-card :class="['kpi-card', isDark ? 'kpi-card-dark' : 'kpi-card-light']"
              rounded="xl" elevation="2" :style="{ animationDelay: `${i * 80}ms` }">
              <v-card-text class="pa-5">
                <div class="d-flex align-center justify-space-between mb-3">
                  <div class="kpi-icon-wrap" :style="{ background: kpi.bg }">
                    <v-icon :color="kpi.iconColor" size="22">{{ kpi.icon }}</v-icon>
                  </div>
                  <div class="d-flex align-center gap-1" :class="kpi.trend > 0 ? 'text-success' : 'text-error'">
                    <v-icon size="16">{{ kpi.trend > 0 ? 'mdi-trending-up' : 'mdi-trending-down' }}</v-icon>
                    <span class="text-caption font-weight-bold">{{ Math.abs(kpi.trend) }}%</span>
                  </div>
                </div>
                <div class="kpi-value mb-1" :class="isDark ? 'text-white' : 'text-grey-darken-4'">
                  {{ kpi.value }}
                </div>
                <div class="kpi-label" :class="isDark ? 'text-grey-lighten-2' : 'text-grey-darken-2'">
                  {{ kpi.label }}
                </div>
                <!-- Mini sparkline -->
                <div class="mt-3">
                  <svg :viewBox="`0 0 120 32`" width="100%" height="32" style="overflow:visible">
                    <defs>
                      <linearGradient :id="`spark-${i}`" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" :stop-color="kpi.sparkColor" stop-opacity="0.5" />
                        <stop offset="100%" :stop-color="kpi.sparkColor" stop-opacity="0" />
                      </linearGradient>
                    </defs>
                    <path :d="buildSparkArea(kpi.spark, 120, 32)" :fill="`url(#spark-${i})`" />
                    <path :d="buildSparkLine(kpi.spark, 120, 32)" :stroke="kpi.sparkColor"
                      stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>
                <div class="text-caption mt-1" :class="isDark ? 'text-grey-darken-1' : 'text-grey'">
                  เทียบกับช่วงก่อนหน้า
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- ══════════════════════════════
             CHARTS ROW
        ══════════════════════════════ -->
        <v-row class="mb-6">
          <!-- Revenue Trend Chart -->
          <v-col cols="12" md="8">
            <v-card :class="['chart-card', isDark ? 'chart-card-dark' : 'chart-card-light']"
              rounded="xl" elevation="2" height="100%">
              <v-card-text class="pa-5">
                <div class="d-flex align-center justify-space-between mb-4">
                  <div>
                    <div class="chart-title" :class="isDark ? 'text-white' : 'text-grey-darken-4'">
                      แนวโน้มรายได้
                    </div>
                    <div class="chart-subtitle" :class="isDark ? 'text-grey-lighten-2' : 'text-grey-darken-1'">
                      รายได้ · ค่าใช้จ่าย · กำไรสุทธิ (ล้านบาท)
                    </div>
                  </div>
                  <div class="d-flex gap-4 flex-wrap">
                    <div v-for="leg in chartLegend" :key="leg.label" class="d-flex align-center gap-1">
                      <div class="legend-dot" :style="{ background: leg.color }" />
                      <span class="text-caption" :class="isDark ? 'text-grey-lighten-2' : 'text-grey-darken-2'">
                        {{ leg.label }}
                      </span>
                    </div>
                  </div>
                </div>
                <!-- SVG Area Chart -->
                <div style="position:relative; width:100%; overflow:hidden">
                  <svg :viewBox="`0 0 ${chartW} ${chartH}`" width="100%" :height="chartH"
                    style="overflow:visible" class="revenue-chart">
                    <defs>
                      <linearGradient id="grad-revenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#5b8dee" stop-opacity="0.35" />
                        <stop offset="100%" stop-color="#5b8dee" stop-opacity="0" />
                      </linearGradient>
                      <linearGradient id="grad-profit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#10b981" stop-opacity="0.3" />
                        <stop offset="100%" stop-color="#10b981" stop-opacity="0" />
                      </linearGradient>
                      <linearGradient id="grad-expense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#f87171" stop-opacity="0.25" />
                        <stop offset="100%" stop-color="#f87171" stop-opacity="0" />
                      </linearGradient>
                    </defs>
                    <!-- Grid lines -->
                    <g>
                      <line v-for="(v, gi) in gridValues" :key="gi"
                        x1="48" :x2="chartW - 12"
                        :y1="chartPad + (chartH - chartPad * 2) * (1 - (v - chartMin) / (chartMax - chartMin))"
                        :y2="chartPad + (chartH - chartPad * 2) * (1 - (v - chartMin) / (chartMax - chartMin))"
                        :stroke="isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'"
                        stroke-width="1" stroke-dasharray="4,4" />
                      <!-- Y labels -->
                      <text v-for="(v, gi) in gridValues" :key="`y${gi}`"
                        x="42"
                        :y="chartPad + (chartH - chartPad * 2) * (1 - (v - chartMin) / (chartMax - chartMin)) + 4"
                        text-anchor="end" font-size="10"
                        :fill="isDark ? '#6b7280' : '#9ca3af'">
                        {{ v }}M
                      </text>
                    </g>
                    <!-- Areas -->
                    <path :d="buildArea(revenueData, chartW, chartH)" fill="url(#grad-revenue)" />
                    <path :d="buildArea(expenseData, chartW, chartH)" fill="url(#grad-expense)" />
                    <path :d="buildArea(profitData, chartW, chartH)" fill="url(#grad-profit)" />
                    <!-- Lines -->
                    <path :d="buildLine(revenueData, chartW, chartH)"
                      stroke="#5b8dee" stroke-width="2.5" fill="none"
                      stroke-linecap="round" stroke-linejoin="round" />
                    <path :d="buildLine(expenseData, chartW, chartH)"
                      stroke="#f87171" stroke-width="2" fill="none"
                      stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="5,3" />
                    <path :d="buildLine(profitData, chartW, chartH)"
                      stroke="#10b981" stroke-width="2.5" fill="none"
                      stroke-linecap="round" stroke-linejoin="round" />
                    <!-- Data points (revenue) -->
                    <circle v-for="(pt, pi) in chartPoints(revenueData, chartW, chartH)" :key="`rp${pi}`"
                      :cx="pt.x" :cy="pt.y" r="3.5"
                      fill="#5b8dee" :stroke="isDark ? '#1e2235' : '#ffffff'" stroke-width="2" />
                    <!-- X labels -->
                    <text v-for="(m, mi) in monthLabels" :key="`x${mi}`"
                      :x="48 + mi * ((chartW - 60) / (monthLabels.length - 1))"
                      :y="chartH - 4" text-anchor="middle" font-size="10"
                      :fill="isDark ? '#6b7280' : '#9ca3af'">
                      {{ m }}
                    </text>
                  </svg>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Revenue Breakdown Donut -->
          <v-col cols="12" md="4">
            <v-card :class="['chart-card', isDark ? 'chart-card-dark' : 'chart-card-light']"
              rounded="xl" elevation="2" height="100%">
              <v-card-text class="pa-5">
                <div class="chart-title mb-1" :class="isDark ? 'text-white' : 'text-grey-darken-4'">
                  แหล่งรายได้
                </div>
                <div class="chart-subtitle mb-4" :class="isDark ? 'text-grey-lighten-2' : 'text-grey-darken-1'">
                  สัดส่วนรายได้แต่ละประเภท
                </div>
                <!-- Donut SVG -->
                <div class="d-flex justify-center mb-4">
                  <svg viewBox="0 0 180 180" width="170" height="170">
                    <g transform="translate(90,90)">
                      <circle cx="0" cy="0" r="54"
                        :fill="isDark ? '#1e2235' : '#f8faff'" />
                      <path v-for="(seg, si) in donutSegments" :key="si"
                        :d="seg.path" :fill="seg.color"
                        class="donut-seg" @mouseenter="hoveredSeg = si" @mouseleave="hoveredSeg = null"
                        :style="{ opacity: hoveredSeg === null || hoveredSeg === si ? 1 : 0.5,
                                  transform: hoveredSeg === si ? `scale(1.05)` : 'scale(1)',
                                  transformOrigin: 'center', transition: 'all 0.2s' }" />
                      <!-- Center text -->
                      <text y="-8" text-anchor="middle" font-size="11"
                        :fill="isDark ? '#9ca3af' : '#6b7280'">รายได้รวม</text>
                      <text y="10" text-anchor="middle" font-size="15" font-weight="700"
                        :fill="isDark ? '#fff' : '#1f2937'">฿84.2M</text>
                    </g>
                  </svg>
                </div>
                <!-- Legend -->
                <div class="d-flex flex-column gap-2">
                  <div v-for="(seg, si) in revenueBreakdown" :key="si"
                    class="d-flex align-center justify-space-between px-1 py-1 rounded-lg breakdown-row"
                    :class="isDark ? 'breakdown-row-dark' : 'breakdown-row-light'">
                    <div class="d-flex align-center gap-2">
                      <div class="breakdown-dot" :style="{ background: seg.color }" />
                      <span class="text-body-2" :class="isDark ? 'text-grey-lighten-2' : 'text-grey-darken-2'">
                        {{ seg.label }}
                      </span>
                    </div>
                    <div class="text-right">
                      <div class="text-body-2 font-weight-bold" :class="isDark ? 'text-white' : 'text-grey-darken-4'">
                        {{ seg.value }}%
                      </div>
                      <div class="text-caption" :class="isDark ? 'text-grey-darken-1' : 'text-grey'">
                        {{ seg.amount }}
                      </div>
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- ══════════════════════════════
             GROWTH METRICS ROW
        ══════════════════════════════ -->
        <v-row class="mb-6">
          <v-col v-for="(gm, gi) in growthMetrics" :key="gi" cols="12" sm="6" md="3">
            <v-card :class="['growth-card', isDark ? 'growth-card-dark' : 'growth-card-light']"
              rounded="xl" elevation="1">
              <v-card-text class="pa-4">
                <div class="d-flex align-center gap-2 mb-2">
                  <v-icon :color="gm.color" size="18">{{ gm.icon }}</v-icon>
                  <span class="text-caption font-weight-medium text-uppercase"
                    :class="isDark ? 'text-grey-lighten-2' : 'text-grey-darken-2'">
                    {{ gm.label }}
                  </span>
                </div>
                <div class="d-flex align-end gap-2">
                  <span class="growth-value" :class="isDark ? 'text-white' : 'text-grey-darken-4'">
                    {{ gm.value }}
                  </span>
                  <span class="text-caption mb-1" :class="gm.positive ? 'text-success' : 'text-error'">
                    {{ gm.positive ? '▲' : '▼' }} {{ gm.change }}
                  </span>
                </div>
                <v-progress-linear :model-value="gm.progress" :color="gm.color"
                  bg-color="transparent" height="4" rounded class="mt-3"
                  :style="{ opacity: 0.85 }" />
                <div class="text-caption mt-1" :class="isDark ? 'text-grey-darken-1' : 'text-grey'">
                  {{ gm.sub }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- ══════════════════════════════
             BANK STATEMENT TABLE
        ══════════════════════════════ -->
        <v-card :class="['statement-card', isDark ? 'statement-card-dark' : 'statement-card-light']"
          rounded="xl" elevation="2">

          <!-- Statement Header -->
          <v-card-text class="pa-5 pb-0">
            <div class="d-flex align-center justify-space-between flex-wrap gap-3 mb-4">
              <div class="d-flex align-center gap-3">
                <div class="statement-icon-wrap" :class="isDark ? 'statement-icon-dark' : 'statement-icon-light'">
                  <v-icon color="primary" size="20">mdi-bank-outline</v-icon>
                </div>
                <div>
                  <div class="statement-title" :class="isDark ? 'text-white' : 'text-grey-darken-4'">
                    รายการธุรกรรม
                  </div>
                  <div class="statement-sub" :class="isDark ? 'text-grey-lighten-2' : 'text-grey-darken-1'">
                    Statement ประจำงวด {{ selectedYear }}
                  </div>
                </div>
              </div>
              <div class="d-flex align-center gap-2 flex-wrap">
                <!-- Search -->
                <v-text-field v-model="stSearch" placeholder="ค้นหารายการ..."
                  prepend-inner-icon="mdi-magnify" variant="outlined" density="compact"
                  hide-details clearable style="min-width:200px"
                  :bg-color="isDark ? '#1e2235' : '#f1f4fb'" />
                <!-- Type Filter -->
                <v-select v-model="stTypeFilter" :items="typeFilterOptions"
                  variant="outlined" density="compact" hide-details style="min-width:140px"
                  :bg-color="isDark ? '#1e2235' : '#f1f4fb'" />
                <!-- Month Filter -->
                <v-select v-model="stMonthFilter" :items="monthFilterOptions"
                  variant="outlined" density="compact" hide-details style="min-width:130px"
                  :bg-color="isDark ? '#1e2235' : '#f1f4fb'" />
              </div>
            </div>

            <!-- Summary strip -->
            <div class="d-flex gap-4 mb-4 flex-wrap">
              <div v-for="(s, si) in statementSummary" :key="si"
                class="summary-chip" :class="isDark ? 'summary-chip-dark' : 'summary-chip-light'">
                <v-icon :color="s.color" size="14" class="mr-1">{{ s.icon }}</v-icon>
                <span class="text-caption" :class="isDark ? 'text-grey-lighten-2' : 'text-grey-darken-2'">
                  {{ s.label }}:
                </span>
                <span class="text-caption font-weight-bold ml-1" :class="`text-${s.color}`">
                  {{ s.value }}
                </span>
              </div>
            </div>
          </v-card-text>

          <v-divider :color="isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'" />

          <!-- Table -->
          <v-data-table :headers="stHeaders" :items="filteredStatements"
            :class="['statement-table', isDark ? 'st-dark' : 'st-light']"
            :items-per-page="12"
            :items-per-page-options="[8, 12, 25, 50]"
            hover>

            <template #item.date="{ item }">
              <div class="py-1">
                <div class="text-body-2 font-weight-medium" :class="isDark ? 'text-white' : 'text-grey-darken-4'">
                  {{ formatDate(item.date) }}
                </div>
                <div class="text-caption" :class="isDark ? 'text-grey-darken-1' : 'text-grey'">
                  {{ formatTime(item.date) }}
                </div>
              </div>
            </template>

            <template #item.description="{ item }">
              <div class="d-flex align-center gap-3 py-1">
                <div class="tx-icon-wrap" :style="{ background: txIconBg(item.type, isDark) }">
                  <v-icon :color="txIconColor(item.type)" size="16">{{ txIcon(item.type) }}</v-icon>
                </div>
                <div>
                  <div class="text-body-2 font-weight-medium" :class="isDark ? 'text-white' : 'text-grey-darken-4'">
                    {{ item.description }}
                  </div>
                  <div class="text-caption" :class="isDark ? 'text-grey-darken-1' : 'text-grey'">
                    {{ item.ref }}
                  </div>
                </div>
              </div>
            </template>

            <template #item.type="{ item }">
              <v-chip :color="typeChipColor(item.type)" size="x-small" variant="tonal" class="font-weight-medium">
                {{ typeLabel(item.type) }}
              </v-chip>
            </template>

            <template #item.amount="{ item }">
              <div :class="['text-body-2 font-weight-bold', item.flow === 'in' ? 'text-success' : 'text-error']">
                {{ item.flow === 'in' ? '+' : '-' }}{{ formatAmount(item.amount) }}
              </div>
            </template>

            <template #item.balance="{ item }">
              <div class="text-body-2 font-weight-medium" :class="isDark ? 'text-white' : 'text-grey-darken-4'">
                {{ formatAmount(item.balance) }}
              </div>
            </template>

            <template #item.status="{ item }">
              <div class="d-flex align-center gap-1">
                <div class="status-dot" :class="`status-${item.status}`" />
                <span class="text-caption" :class="isDark ? 'text-grey-lighten-2' : 'text-grey-darken-2'">
                  {{ statusLabel(item.status) }}
                </span>
              </div>
            </template>

            <template #no-data>
              <div class="text-center py-10">
                <v-icon icon="mdi-receipt-text-outline" size="52"
                  :color="isDark ? 'grey-darken-2' : 'grey-lighten-2'" />
                <div class="text-body-1 mt-3" :class="isDark ? 'text-grey-lighten-1' : 'text-grey-darken-2'">
                  ไม่พบรายการธุรกรรม
                </div>
              </div>
            </template>
          </v-data-table>

          <v-divider :color="isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'" />
          <v-card-text class="pa-4">
            <div class="d-flex justify-space-between align-center">
              <span class="text-caption" :class="isDark ? 'text-grey-darken-1' : 'text-grey'">
                แสดง {{ filteredStatements.length }} รายการ จาก {{ statements.length }} รายการ
              </span>
              <v-btn size="small" variant="text" color="primary" prepend-icon="mdi-download">
                ดาวน์โหลด Statement
              </v-btn>
            </div>
          </v-card-text>
        </v-card>

      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTheme } from 'vuetify'

// ══════════ Theme ══════════
const theme = useTheme()
const currentTheme = ref('dark')
const isDark = computed(() => currentTheme.value === 'dark')

const toggleTheme = () => {
  currentTheme.value = currentTheme.value === 'dark' ? 'light' : 'dark'
  theme.global.name.value = currentTheme.value
  localStorage.setItem('app-theme', currentTheme.value)
}

onMounted(() => {
  const saved = localStorage.getItem('app-theme')
  if (saved) { currentTheme.value = saved; theme.global.name.value = saved }
})

// ══════════ Period / Year ══════════
const selectedPeriod = ref('monthly')
const selectedYear = ref(2025)
const yearOptions = [2023, 2024, 2025]

// ══════════ KPI Cards ══════════
const kpiCards = ref([
  {
    label: 'รายได้รวม', value: '฿84.2M', trend: 12.4, icon: 'mdi-cash-multiple',
    bg: 'rgba(91,141,238,0.15)', iconColor: '#5b8dee', sparkColor: '#5b8dee',
    spark: [42, 48, 44, 55, 58, 62, 59, 67, 72, 69, 78, 84]
  },
  {
    label: 'กำไรสุทธิ', value: '฿31.5M', trend: 8.7, icon: 'mdi-trending-up',
    bg: 'rgba(16,185,129,0.15)', iconColor: '#10b981', sparkColor: '#10b981',
    spark: [18, 20, 19, 23, 25, 27, 24, 28, 30, 29, 33, 31]
  },
  {
    label: 'ค่าใช้จ่าย', value: '฿52.7M', trend: -3.2, icon: 'mdi-credit-card-outline',
    bg: 'rgba(248,113,113,0.15)', iconColor: '#f87171', sparkColor: '#f87171',
    spark: [30, 32, 28, 34, 35, 37, 36, 40, 43, 41, 45, 52]
  },
  {
    label: 'อัตราการเติบโต', value: '+12.4%', trend: 4.1, icon: 'mdi-chart-bell-curve',
    bg: 'rgba(251,191,36,0.15)', iconColor: '#fbbf24', sparkColor: '#fbbf24',
    spark: [6, 7, 5, 8, 9, 10, 8, 11, 12, 10, 13, 12]
  }
])

// ══════════ Chart Data ══════════
const chartW = 560
const chartH = 220
const chartPad = 28
const chartMin = 0
const chartMax = 100

const monthLabels = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
const revenueData = [42, 48, 44, 55, 58, 62, 59, 67, 72, 69, 78, 84]
const expenseData = [30, 32, 28, 34, 35, 37, 36, 40, 43, 41, 45, 52]
const profitData  = [12, 16, 16, 21, 23, 25, 23, 27, 29, 28, 33, 32]
const gridValues  = [0, 25, 50, 75, 100]

const chartLegend = [
  { label: 'รายได้', color: '#5b8dee' },
  { label: 'ค่าใช้จ่าย', color: '#f87171' },
  { label: 'กำไร', color: '#10b981' }
]

const scaleY = (v) => chartPad + (chartH - chartPad * 2) * (1 - (v - chartMin) / (chartMax - chartMin))
const scaleX = (i, len) => 48 + i * ((chartW - 60) / (len - 1))

const buildLine = (data, w, h) => {
  return data.map((v, i) => `${i === 0 ? 'M' : 'L'}${scaleX(i, data.length)},${scaleY(v)}`).join(' ')
}
const buildArea = (data, w, h) => {
  const line = buildLine(data, w, h)
  const last = scaleX(data.length - 1, data.length)
  const first = scaleX(0, data.length)
  const bot = scaleY(chartMin)
  return `${line} L${last},${bot} L${first},${bot} Z`
}
const chartPoints = (data, w, h) => data.map((v, i) => ({ x: scaleX(i, data.length), y: scaleY(v) }))

// Sparkline helpers
const buildSparkLine = (data, w, h) => {
  const min = Math.min(...data), max = Math.max(...data)
  return data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - 4 - ((v - min) / (max - min || 1)) * (h - 8)
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
}
const buildSparkArea = (data, w, h) => {
  const min = Math.min(...data), max = Math.max(...data)
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - 4 - ((v - min) / (max - min || 1)) * (h - 8)
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })
  return `M${pts[0]} L${pts.join(' L')} L${w},${h} L0,${h} Z`
}

// ══════════ Donut Chart ══════════
const revenueBreakdown = ref([
  { label: 'บริการซอฟต์แวร์', value: 38, amount: '฿31.9M', color: '#5b8dee' },
  { label: 'ใบอนุญาต', value: 27, amount: '฿22.7M', color: '#10b981' },
  { label: 'ที่ปรึกษา', value: 20, amount: '฿16.8M', color: '#fbbf24' },
  { label: 'ฝึกอบรม', value: 15, amount: '฿12.6M', color: '#f87171' }
])
const hoveredSeg = ref(null)

const donutSegments = computed(() => {
  const r = 72, ri = 52
  let startAngle = -90
  return revenueBreakdown.value.map(seg => {
    const angle = (seg.value / 100) * 360
    const endAngle = startAngle + angle
    const toRad = d => (d * Math.PI) / 180
    const x1 = r * Math.cos(toRad(startAngle))
    const y1 = r * Math.sin(toRad(startAngle))
    const x2 = r * Math.cos(toRad(endAngle))
    const y2 = r * Math.sin(toRad(endAngle))
    const ix1 = ri * Math.cos(toRad(startAngle))
    const iy1 = ri * Math.sin(toRad(startAngle))
    const ix2 = ri * Math.cos(toRad(endAngle))
    const iy2 = ri * Math.sin(toRad(endAngle))
    const large = angle > 180 ? 1 : 0
    const path = `M${ix1.toFixed(2)},${iy1.toFixed(2)} L${x1.toFixed(2)},${y1.toFixed(2)} A${r},${r} 0 ${large},1 ${x2.toFixed(2)},${y2.toFixed(2)} L${ix2.toFixed(2)},${iy2.toFixed(2)} A${ri},${ri} 0 ${large},0 ${ix1.toFixed(2)},${iy1.toFixed(2)} Z`
    startAngle = endAngle
    return { path, color: seg.color }
  })
})

// ══════════ Growth Metrics ══════════
const growthMetrics = ref([
  { label: 'YoY Growth', value: '+12.4%', change: '↑ จากปีก่อน', icon: 'mdi-chart-line', color: 'primary', progress: 72, positive: true, sub: 'เติบโตสูงกว่าเป้าหมาย 4%' },
  { label: 'MoM Growth', value: '+7.7%', change: '↑ จากเดือนก่อน', icon: 'mdi-calendar-month', color: 'success', progress: 58, positive: true, sub: 'ธ.ค. สูงสุดในปี' },
  { label: 'Profit Margin', value: '37.4%', change: '↑ 2.1pp', icon: 'mdi-percent', color: 'warning', progress: 37, positive: true, sub: 'อยู่ในเป้า 35–40%' },
  { label: 'Burn Rate', value: '฿4.4M', change: '↓ 3.2%', icon: 'mdi-fire', color: 'error', progress: 44, positive: false, sub: 'ต่ำกว่าเพดาน 15%' }
])

// ══════════ Statement Table ══════════
const stSearch = ref('')
const stTypeFilter = ref('ทั้งหมด')
const stMonthFilter = ref('ทั้งหมด')

const typeFilterOptions = ['ทั้งหมด', 'รายได้', 'ค่าใช้จ่าย', 'โอนเงิน', 'ภาษี']
const monthFilterOptions = ['ทั้งหมด', ...['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']]

const stHeaders = [
  { title: 'วันที่', key: 'date', sortable: true, width: '140px' },
  { title: 'รายการ', key: 'description', sortable: false },
  { title: 'ประเภท', key: 'type', align: 'center', sortable: true, width: '110px' },
  { title: 'จำนวนเงิน', key: 'amount', align: 'end', sortable: true, width: '130px' },
  { title: 'ยอดคงเหลือ', key: 'balance', align: 'end', sortable: false, width: '130px' },
  { title: 'สถานะ', key: 'status', align: 'center', sortable: true, width: '110px' }
]

const monthNames = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']

const statements = ref([
  { date: '2025-12-28T10:30', description: 'รายได้ค่าบริการซอฟต์แวร์ Q4', ref: 'TXN-2512-0891', type: 'รายได้', flow: 'in', amount: 8400000, balance: 84200000, status: 'completed' },
  { date: '2025-12-25T14:15', description: 'ค่าเช่าเซิร์ฟเวอร์ AWS', ref: 'TXN-2512-0876', type: 'ค่าใช้จ่าย', flow: 'out', amount: 480000, balance: 75800000, status: 'completed' },
  { date: '2025-12-22T09:00', description: 'รายได้ใบอนุญาตซอฟต์แวร์', ref: 'TXN-2512-0854', type: 'รายได้', flow: 'in', amount: 3200000, balance: 76280000, status: 'completed' },
  { date: '2025-12-20T16:45', description: 'ชำระภาษีมูลค่าเพิ่ม', ref: 'TXN-2512-0840', type: 'ภาษี', flow: 'out', amount: 1190000, balance: 73080000, status: 'completed' },
  { date: '2025-12-18T11:30', description: 'ค่าที่ปรึกษาโครงการ ABC', ref: 'TXN-2512-0822', type: 'รายได้', flow: 'in', amount: 2500000, balance: 74270000, status: 'completed' },
  { date: '2025-12-15T08:00', description: 'เงินเดือนพนักงาน ธ.ค.', ref: 'TXN-2512-0810', type: 'ค่าใช้จ่าย', flow: 'out', amount: 6800000, balance: 71770000, status: 'completed' },
  { date: '2025-12-12T13:20', description: 'รายได้ค่าฝึกอบรม', ref: 'TXN-2512-0798', type: 'รายได้', flow: 'in', amount: 1800000, balance: 78570000, status: 'completed' },
  { date: '2025-12-10T10:00', description: 'ค่าการตลาดและโฆษณา', ref: 'TXN-2512-0785', type: 'ค่าใช้จ่าย', flow: 'out', amount: 920000, balance: 76770000, status: 'completed' },
  { date: '2025-12-08T15:30', description: 'โอนเงินสำรองบัญชี', ref: 'TXN-2512-0771', type: 'โอนเงิน', flow: 'out', amount: 5000000, balance: 77690000, status: 'completed' },
  { date: '2025-12-05T09:45', description: 'รายได้ค่าบริการรายเดือน', ref: 'TXN-2512-0758', type: 'รายได้', flow: 'in', amount: 4600000, balance: 82690000, status: 'completed' },
  { date: '2025-11-30T14:00', description: 'ชำระภาษีเงินได้นิติบุคคล', ref: 'TXN-2511-0910', type: 'ภาษี', flow: 'out', amount: 2100000, balance: 78090000, status: 'completed' },
  { date: '2025-11-28T10:30', description: 'รายได้โครงการ XYZ Ltd.', ref: 'TXN-2511-0895', type: 'รายได้', flow: 'in', amount: 7200000, balance: 80190000, status: 'completed' },
  { date: '2025-11-25T11:00', description: 'ค่าสาธารณูปโภค', ref: 'TXN-2511-0882', type: 'ค่าใช้จ่าย', flow: 'out', amount: 145000, balance: 72990000, status: 'completed' },
  { date: '2025-11-20T09:15', description: 'รายได้ค่าใบอนุญาตรายปี', ref: 'TXN-2511-0867', type: 'รายได้', flow: 'in', amount: 4800000, balance: 73135000, status: 'pending' },
  { date: '2025-11-15T08:00', description: 'เงินเดือนพนักงาน พ.ย.', ref: 'TXN-2511-0850', type: 'ค่าใช้จ่าย', flow: 'out', amount: 6800000, balance: 68335000, status: 'completed' },
  { date: '2025-11-10T13:30', description: 'รายได้ค่าปรึกษาพิเศษ', ref: 'TXN-2511-0838', type: 'รายได้', flow: 'in', amount: 3500000, balance: 75135000, status: 'completed' },
  { date: '2025-11-05T16:00', description: 'ค่าซอฟต์แวร์ใบอนุญาต', ref: 'TXN-2511-0820', type: 'ค่าใช้จ่าย', flow: 'out', amount: 380000, balance: 71635000, status: 'failed' },
  { date: '2025-10-31T14:30', description: 'รายได้ Q3 รวม', ref: 'TXN-2510-0780', type: 'รายได้', flow: 'in', amount: 9100000, balance: 72015000, status: 'completed' },
  { date: '2025-10-25T09:00', description: 'ค่าใช้จ่ายดำเนินงาน', ref: 'TXN-2510-0765', type: 'ค่าใช้จ่าย', flow: 'out', amount: 2400000, balance: 62915000, status: 'completed' },
  { date: '2025-10-15T08:00', description: 'เงินเดือนพนักงาน ต.ค.', ref: 'TXN-2510-0750', type: 'ค่าใช้จ่าย', flow: 'out', amount: 6800000, balance: 65315000, status: 'completed' },
])

const filteredStatements = computed(() => {
  return statements.value.filter(tx => {
    const matchSearch = !stSearch.value ||
      tx.description.includes(stSearch.value) ||
      tx.ref.includes(stSearch.value)
    const matchType = stTypeFilter.value === 'ทั้งหมด' || tx.type === stTypeFilter.value
    const matchMonth = stMonthFilter.value === 'ทั้งหมด' ||
      monthNames[new Date(tx.date).getMonth()] === stMonthFilter.value
    return matchSearch && matchType && matchMonth
  })
})

const statementSummary = computed(() => {
  const data = filteredStatements.value
  const totalIn = data.filter(t => t.flow === 'in').reduce((s, t) => s + t.amount, 0)
  const totalOut = data.filter(t => t.flow === 'out').reduce((s, t) => s + t.amount, 0)
  return [
    { label: 'รายรับ', value: formatAmount(totalIn), color: 'success', icon: 'mdi-arrow-down-circle' },
    { label: 'รายจ่าย', value: formatAmount(totalOut), color: 'error', icon: 'mdi-arrow-up-circle' },
    { label: 'สุทธิ', value: formatAmount(totalIn - totalOut), color: 'primary', icon: 'mdi-scale-balance' },
    { label: 'รายการ', value: `${data.length} รายการ`, color: 'info', icon: 'mdi-format-list-bulleted' }
  ]
})

// ══════════ Helpers ══════════
const formatAmount = (n) => {
  if (!n && n !== 0) return '-'
  return '฿' + n.toLocaleString('th-TH')
}

const formatDate = (d) => {
  const dt = new Date(d)
  return dt.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })
}

const formatTime = (d) => {
  return new Date(d).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
}

const txIcon = (type) => ({
  'รายได้': 'mdi-cash-plus',
  'ค่าใช้จ่าย': 'mdi-cash-minus',
  'โอนเงิน': 'mdi-bank-transfer',
  'ภาษี': 'mdi-file-document-outline'
}[type] || 'mdi-circle')

const txIconColor = (type) => ({
  'รายได้': '#10b981',
  'ค่าใช้จ่าย': '#f87171',
  'โอนเงิน': '#5b8dee',
  'ภาษี': '#fbbf24'
}[type] || '#9ca3af')

const txIconBg = (type, dark) => ({
  'รายได้': dark ? 'rgba(16,185,129,0.15)' : 'rgba(16,185,129,0.1)',
  'ค่าใช้จ่าย': dark ? 'rgba(248,113,113,0.15)' : 'rgba(248,113,113,0.1)',
  'โอนเงิน': dark ? 'rgba(91,141,238,0.15)' : 'rgba(91,141,238,0.1)',
  'ภาษี': dark ? 'rgba(251,191,36,0.15)' : 'rgba(251,191,36,0.1)'
}[type] || 'transparent')

const typeChipColor = (type) => ({
  'รายได้': 'success', 'ค่าใช้จ่าย': 'error', 'โอนเงิน': 'primary', 'ภาษี': 'warning'
}[type] || 'default')

const typeLabel = (type) => type

const statusLabel = (s) => ({ completed: 'สำเร็จ', pending: 'รอดำเนินการ', failed: 'ล้มเหลว' }[s] || s)
</script>

<style scoped>
/* ═══════════════════════════════════
   BACKGROUNDS
═══════════════════════════════════ */
.main-dark {
  background: linear-gradient(160deg, #0d1117 0%, #131929 50%, #0f1a2e 100%);
  min-height: 100vh;
}
.main-light {
  background: linear-gradient(160deg, #eef2fb 0%, #f5f7ff 50%, #edf1f9 100%);
  min-height: 100vh;
}

/* ═══════════════════════════════════
   TYPOGRAPHY
═══════════════════════════════════ */
.page-title {
  font-size: 1.65rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.2;
}
.page-subtitle { font-size: 0.82rem; }
.chart-title { font-size: 1rem; font-weight: 700; letter-spacing: -0.01em; }
.chart-subtitle { font-size: 0.75rem; }
.statement-title { font-size: 1rem; font-weight: 700; }
.statement-sub { font-size: 0.75rem; }
.kpi-value { font-size: 1.65rem; font-weight: 800; letter-spacing: -0.03em; line-height: 1; }
.kpi-label { font-size: 0.78rem; }
.growth-value { font-size: 1.4rem; font-weight: 800; letter-spacing: -0.03em; line-height: 1; }

/* ═══════════════════════════════════
   HEADER ICON
═══════════════════════════════════ */
.header-icon-wrap {
  width: 52px; height: 52px; border-radius: 14px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.header-icon-dark { background: rgba(91,141,238,0.15); }
.header-icon-light { background: rgba(91,141,238,0.1); }

/* ═══════════════════════════════════
   PERIOD TOGGLE
═══════════════════════════════════ */
.period-toggle-dark { background: rgba(255,255,255,0.07) !important; border-radius: 10px; }
.period-toggle-light { background: rgba(0,0,0,0.06) !important; border-radius: 10px; }
.period-toggle-dark :deep(.v-btn--selected),
.period-toggle-light :deep(.v-btn--selected) {
  background: #5b8dee !important; color: #fff !important;
}

/* ═══════════════════════════════════
   KPI CARDS
═══════════════════════════════════ */
.kpi-card {
  transition: transform 0.25s cubic-bezier(.22,.68,0,1.2), box-shadow 0.25s;
  animation: fadeUp 0.45s ease both;
}
.kpi-card:hover { transform: translateY(-5px); }
.kpi-card-dark {
  background: linear-gradient(145deg, #161d2e 0%, #1c2540 100%) !important;
  border: 1px solid rgba(255,255,255,0.06);
}
.kpi-card-light {
  background: linear-gradient(145deg, #ffffff 0%, #f6f9ff 100%) !important;
  border: 1px solid rgba(91,141,238,0.12);
}
.kpi-icon-wrap {
  width: 40px; height: 40px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
}

/* ═══════════════════════════════════
   CHART CARDS
═══════════════════════════════════ */
.chart-card-dark {
  background: linear-gradient(145deg, #161d2e 0%, #1c2540 100%) !important;
  border: 1px solid rgba(255,255,255,0.06);
}
.chart-card-light {
  background: #ffffff !important;
  border: 1px solid rgba(91,141,238,0.1);
}
.legend-dot {
  width: 10px; height: 10px; border-radius: 50%;
}
.revenue-chart { display: block; }

/* ═══════════════════════════════════
   DONUT
═══════════════════════════════════ */
.donut-seg { cursor: pointer; }
.breakdown-row { transition: background 0.15s; cursor: default; }
.breakdown-row-dark:hover { background: rgba(255,255,255,0.04) !important; }
.breakdown-row-light:hover { background: rgba(91,141,238,0.04) !important; }
.breakdown-dot { width: 10px; height: 10px; border-radius: 3px; flex-shrink: 0; }

/* ═══════════════════════════════════
   GROWTH CARDS
═══════════════════════════════════ */
.growth-card { transition: transform 0.2s; }
.growth-card:hover { transform: translateY(-3px); }
.growth-card-dark {
  background: rgba(22,29,46,0.9) !important;
  border: 1px solid rgba(255,255,255,0.06);
}
.growth-card-light {
  background: #ffffff !important;
  border: 1px solid rgba(91,141,238,0.1);
}

/* ═══════════════════════════════════
   STATEMENT CARD
═══════════════════════════════════ */
.statement-card-dark {
  background: #161d2e !important;
  border: 1px solid rgba(255,255,255,0.06);
}
.statement-card-light {
  background: #ffffff !important;
  border: 1px solid rgba(91,141,238,0.1);
}
.statement-icon-wrap {
  width: 38px; height: 38px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
}
.statement-icon-dark { background: rgba(91,141,238,0.15); }
.statement-icon-light { background: rgba(91,141,238,0.1); }

/* Summary chips */
.summary-chip {
  display: inline-flex; align-items: center;
  padding: 4px 10px; border-radius: 20px;
}
.summary-chip-dark { background: rgba(255,255,255,0.06); }
.summary-chip-light { background: rgba(91,141,238,0.07); }

/* ═══════════════════════════════════
   STATEMENT TABLE — DARK
═══════════════════════════════════ */
.st-dark :deep(.v-table) { background: transparent !important; }
.st-dark :deep(.v-table thead th) {
  background: rgba(255,255,255,0.03) !important;
  color: #6b7280 !important;
  font-size: 0.72rem !important; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.06em;
  border-bottom: 1px solid rgba(255,255,255,0.07) !important;
}
.st-dark :deep(.v-table tbody tr) {
  border-bottom: 1px solid rgba(255,255,255,0.04) !important;
  transition: background 0.15s;
}
.st-dark :deep(.v-table tbody tr:hover) {
  background: rgba(91,141,238,0.06) !important;
}
.st-dark :deep(.v-table td) { padding: 8px 16px !important; }
.st-dark :deep(.v-data-table-footer) { background: transparent !important; }

/* ═══════════════════════════════════
   STATEMENT TABLE — LIGHT
═══════════════════════════════════ */
.st-light :deep(.v-table) { background: transparent !important; }
.st-light :deep(.v-table thead th) {
  background: #f8faff !important;
  color: #9ca3af !important;
  font-size: 0.72rem !important; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.06em;
  border-bottom: 1px solid rgba(0,0,0,0.07) !important;
}
.st-light :deep(.v-table tbody tr) {
  border-bottom: 1px solid rgba(0,0,0,0.05) !important;
  transition: background 0.15s;
}
.st-light :deep(.v-table tbody tr:hover) {
  background: rgba(91,141,238,0.04) !important;
}
.st-light :deep(.v-table td) { padding: 8px 16px !important; }
.st-light :deep(.v-data-table-footer) { background: transparent !important; }

/* ═══════════════════════════════════
   TX ICON
═══════════════════════════════════ */
.tx-icon-wrap {
  width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}

/* ═══════════════════════════════════
   STATUS DOT
═══════════════════════════════════ */
.status-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.status-completed { background: #10b981; }
.status-pending {
  background: #fbbf24;
  box-shadow: 0 0 0 3px rgba(251,191,36,0.2);
  animation: pulse 1.8s infinite;
}
.status-failed { background: #f87171; }

/* ═══════════════════════════════════
   ANIMATIONS
═══════════════════════════════════ */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(251,191,36,0.4); }
  50% { box-shadow: 0 0 0 5px rgba(251,191,36,0); }
}

/* ═══════════════════════════════════
   GAP UTILITIES
═══════════════════════════════════ */
.gap-1 { gap: 4px; } .gap-2 { gap: 8px; }
.gap-3 { gap: 12px; } .gap-4 { gap: 16px; }

/* ═══════════════════════════════════
   SCROLLBAR
═══════════════════════════════════ */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #5b8dee; border-radius: 4px; }
</style>
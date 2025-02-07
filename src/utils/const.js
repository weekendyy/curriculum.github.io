import { scheduleConfig } from '../config/schedule.js'

// 计算指定周数的日期范围
const getWeekDates = (startDate = scheduleConfig.startDate, weeks = scheduleConfig.totalWeeks) => {
  const result = []
  const start = new Date(startDate)
  
  for (let i = 0; i < weeks; i++) {
    const weekStart = new Date(start)
    weekStart.setDate(start.getDate() + i * 7)
    
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    
    const formatDate = (date) => {
      const month = date.getMonth() + 1
      const day = date.getDate()
      return `${month}月${day}日`
    }
    
    result.push({
      title: `第${i + 1}周`,
      date: `${formatDate(weekStart)} 至 ${formatDate(weekEnd)}`,
      startDate: `${weekStart.getFullYear()}-${String(weekStart.getMonth() + 1).padStart(2, '0')}-${String(weekStart.getDate()).padStart(2, '0')}`,
      course: []
    })
  }
  return result
}

export const weekOption = getWeekDates()  // 下拉菜单

export const tableConfig = {  // 主表格配置
  weekDay: ["周一","周二","周三","周四","周五","周六","周天"],
  weekDate: [],
  dayTime: [
    {
      name: "第一节",
      duration: "08:00~08:45"
    },
    {
      name: "第二节",
      duration: "08:55~09:40"
    },
    {
      name: "第三节",
      duration: "10:10~10:55"
    },
    {
      name: "第四节",
      duration: "11:05~11:50"
    },
    {
      name: "中午",
      duration: "12:00~14:00"
    },
    {
      name: "第五节",
      duration: "14:30~15:15"
    },
    {
      name: "第六节",
      duration: "15:25~16:10"
    },
    {
      name: "第七节",
      duration: "16:40~17:25"
    },
    {
      name: "第八节",
      duration: "17:35~18:20"
    },
    {
      name: "第九节",
      duration: "19:10~19:55"
    },
    {
      name: "第十节",
      duration: "20:05~20:50"
    },
    {
      name: "第十一节",
      duration: "21:00~21:45"
    },
  ]
}

export const importantEvent = [
  
]

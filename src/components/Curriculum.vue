<template>
  <div class="SchoolTable">
    <div class="week-select">
      <div class="title-top">2024-2025学年  秋季学期</div>
      <van-dropdown-menu active-color="#e69a04">
        <van-dropdown-item :title="title" ref="weekRef">
          <van-cell v-for="(item, index) in weekOption" :class="index === weekIndex ? 'active-color': ''" :key="index" @click="()=>handleDropdownItem(item,index)" :title="item.title" :value="item.date" />
        </van-dropdown-item>
      </van-dropdown-menu>
      <!-- 课程日历 -->
      <div class="table-box">
        <div class="week-day" v-for="(week, index) in tableConfig.weekDay" :key="week" :style="{'height': currentWeekIndex.includes(index) ? '120px': '60px'}">
          <div class="row-line-one" :style="{'line-height': currentWeekIndex.includes(index) ? '120px': '60px'}">{{ week }}</div>
          <template v-if="currentWeekInfo.course">
            <template v-for="(item,idx) in currentWeekInfo.course">
              <div class="weekday-row" :key="idx" v-if="item.dayIndex === index">
                <div v-if="item.dayIndex === index" class="class-card">
                  <div class="info-item">
                    <van-icon name="notes" />
                    <p>课程：{{ item.courseName }}</p>
                  </div>
                  <div class="info-item">
                    <van-icon name="location" />
                    <p>地点：{{ item.address }}</p>
                  </div>
                  <div class="info-item">
                    <van-icon name="manager" />
                    <p>老师：{{ item.teacher }}</p>
                  </div>
                  <div class="info-item" style="align-items: flex-start;">
                    <van-icon name="clock" style="margin-top: 3px;" />
                    <div class="clock-item"><p>时间：</p>
                      <div >
                        <p style="text-align: left;" v-for="time in item.time" :key="time">{{time}}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'SchoolTable',
  props: {
  },
  data(){
    return {
      weekIndex: 1,
      title: "第1周",
      weekOption: [
        { title: '第1周', date: "9月01日 至 9月07日" },
        { 
          title: '第2周',
          date: "9月08日 至 9月14日",
          course: [
            {
              dayIndex: 0,
              address: "庄汉水楼（南强二）401",
              courseName: "工程信息管理",
              teacher: "彭丽芳",
              time: ["上午：08:55 - 11:50 三节课","下午：14:30 - 17:25  三节课"]
            }
          ]
        },
        { 
          title: '第3周',
          date: "9月15日 至 9月21日",
          course: [
            {
              dayIndex: 0,
              address: "庄汉水楼（南强二）401",
              courseName: "工程信息管理",
              teacher: "彭丽芳",
              time: ["上午：08:55 - 11:50 三节课","下午：14:30 - 17:25  三节课"]
            },
            {
              dayIndex: 1,
              address: "学生公寓教学楼204",
              courseName: "工程信息管理",
              teacher: "彭丽芳",
              time: ["上午：08:55 - 11:50 三节课","下午：14:30 - 17:25  三节课"]
            }
          ]
        },
        { 
          title: '第4周',
          date: "9月22日 至 9月28日",
          course: [
            {
              dayIndex: 0,
              address: "祖营楼（嘉庚四）103",
              courseName: "工程经济学",
              teacher: "杨光勇",
              time: ["上午：08:55 - 11:50 三节课","下午：14:30 - 17:25  三节课"]
            },
            {
              dayIndex: 6,
              address: "庄汉水楼（南强二）401",
              courseName: "工程数学",
              teacher: "缪朝炜",
              time: ["上午：08:55 - 11:50 三节课","下午：14:30 - 17:25  三节课"]
            }
          ]
        },
        { 
          title: '第5周',
          date: "9月29日 至 10月05日",
          course: [
            {
              dayIndex: 6,
              address: "庄汉水楼（南强二）401",
              courseName: "工程数学",
              teacher: "缪朝炜",
              time: ["上午：08:55 - 11:50 三节课","下午：14:30 - 17:25  三节课"]
            }
          ]
        },
        { title: '第6周', date: "10月06日 至 10月12日" },
        { 
          title: '第7周',
          date: "10月13日 至 10月19日",
          course: [
            {
              dayIndex: 0,
              address: "庄汉水楼（南强二）401",
              courseName: "工程信息管理",
              teacher: "彭丽芳",
              time: ["上午：08:55 - 11:50 三节课","下午：14:30 - 17:25  三节课"]
            },
            {
              dayIndex: 6,
              address: "庄汉水楼（南强二）401",
              courseName: "工程数学",
              teacher: "缪朝炜",
              time: ["上午：08:55 - 11:50 三节课","下午：14:30 - 17:25  三节课"]
            }
          ]
        },
        { 
          title: '第8周',
          date: "10月20日 至 10月26日",
          course: [
            {
              dayIndex: 0,
              address: "庄汉水楼（南强二）401",
              courseName: "工程信息管理",
              teacher: "彭丽芳",
              time: ["上午：08:55 - 11:50 三节课","下午：14:30 - 17:25  三节课"]
            },
            {
              dayIndex: 6,
              address: "庄汉水楼（南强二）503",
              courseName: "研究生英语(管科系)",
              teacher: "林丽芳",
              time: ["上午：08:55 - 11:50 三节课","下午：14:30 - 17:25  三节课"]
            }
          ]
        },
        { 
          title: '第9周',
          date: "10月27日 至 11月02日",
          course: [
            {
              dayIndex: 0,
              address: "祖营楼（嘉庚四）103",
              courseName: "工程经济学",
              teacher: "杨光勇",
              time: ["上午：08:55 - 11:50 三节课","下午：14:30 - 17:25  三节课"]
            },
            {
              dayIndex: 6,
              address: "庄汉水楼（南强二）503",
              courseName: "研究生英语(管科系)",
              teacher: "林丽芳",
              time: ["上午：08:55 - 11:50 三节课","下午：14:30 - 17:25  三节课"]
            }
          ]
        },
        {
          title: '第10周',
          date: "11月03日 至 11月09日",
          course: [
            {
              dayIndex: 0,
              address: "祖营楼（嘉庚四）103",
              courseName: "工程经济学",
              teacher: "杨光勇",
              time: ["上午：08:55 - 11:50 三节课","下午：14:30 - 17:25  三节课"]
            },
            {
              dayIndex: 6,
              address: "庄汉水楼（南强二）503",
              courseName: "研究生英语(管科系)",
              teacher: "林丽芳",
              time: ["上午：08:55 - 11:50 三节课","下午：14:30 - 17:25  三节课"]
            }
          ]
        },
        { 
          title: '第11周',
          date: "11月10日 至 11月16日",
          course: [
            {
              dayIndex: 0,
              address: "庄汉水楼（南强二）401",
              courseName: "工程数学",
              teacher: "缪朝炜",
              time: ["上午：08:55 - 11:50 三节课","下午：14:30 - 17:25  三节课"]
            },
            {
              dayIndex: 6,
              address: "庄汉水楼（南强二）503",
              courseName: "研究生英语(管科系)",
              teacher: "林丽芳",
              time: ["上午：08:55 - 11:50 三节课","下午：14:30 - 17:25  三节课"]
            }
          ]
        },
        {
          title: '第12周',
          date: "11月17日 至 11月23日",
          course: [
            {
              dayIndex: 0,
              address: "庄汉水楼（南强二）401",
              courseName: "工程数学",
              teacher: "缪朝炜",
              time: ["上午：08:55 - 11:50 三节课","下午：14:30 - 17:25  三节课"]
            },
            {
              dayIndex: 6,
              address: "庄汉水楼（南强二）503",
              courseName: "研究生英语(管科系)",
              teacher: "林丽芳",
              time: ["上午：08:55 - 11:50 三节课","下午：14:30 - 17:25  三节课"]
            }
          ]
        },
        {
          title: '第13周',
          date: "11月24日 至 11月30日",
          course: [
            {
              dayIndex: 0,
              address: "祖营楼（嘉庚四）103",
              courseName: "工程经济学",
              teacher: "杨光勇",
              time: ["上午：08:55 - 11:50 三节课","下午：14:30 - 17:25  三节课"]
            }
          ]
        },
        {
          title: '第14周',
          date: "12月01日 至 12月07日",
          course: [
            {
              dayIndex: 0,
              address: "祖营楼（嘉庚四）103",
              courseName: "工程经济学",
              teacher: "杨光勇",
              time: ["上午：08:55 - 11:50 三节课","下午：14:30 - 17:25  三节课"]
            }
          ]
        },
        { title: '第15周', date: "12月08日 至 12月14日" },
        {
          title: '第16周',
          date: "12月15日 至 12月21日",
          course: [
            {
              dayIndex: 0,
              address: "庄汉水楼（南强二）302",
              courseName: "项目管理概论(ME)(01)",
              teacher: "许征学(因考试周原因，还有一天课程未上系统，后续通知)",
              time: ["上午：08:55 - 11:50 三节课","下午：14:30 - 17:25  三节课"]
            },
            {
              dayIndex: 6,
              address: "庄汉水楼（南强二）302",
              courseName: "项目管理概论(ME)(01)",
              teacher: "许征学(因考试周原因，还有一天课程未上系统，后续通知)",
              time: ["上午：08:55 - 11:50 三节课","下午：14:30 - 17:25  三节课"]
            }
          ]
        },
        {
          title: '第17周',
          date: "12月22日 至 12月28日",
          course: [
            {
              dayIndex: 0,
              address: "庄汉水楼（南强二）302",
              courseName: "项目管理概论(ME)(01)",
              teacher: "许征学(因考试周原因，还有一天课程未上系统，后续通知)",
              time: ["上午：08:55 - 11:50 三节课","下午：14:30 - 17:25  三节课"]
            },
            {
              dayIndex: 6,
              address: "庄汉水楼（南强二）302",
              courseName: "项目管理概论(ME)(01)",
              teacher: "许征学(因考试周原因，还有一天课程未上系统，后续通知)",
              time: ["上午：08:55 - 11:50 三节课","下午：14:30 - 17:25  三节课"]
            }
          ]
        },
      ],
      tableConfig: {
        weekDay: ["周天","周一","周二","周三","周四","周五","周六"],
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
        ]
      }
    }
  },
  computed: {
    currentWeekInfo(){
      return this.weekOption[this.weekIndex]
    },
    currentWeekIndex(){
      if(this.currentWeekInfo.course){
        return this.currentWeekInfo.course.map(v=>v.dayIndex)
      }else{
        return []
      }
    }
  },
  methods: {
    handleDropdownItem(item,index){
      this.title = item.title
      this.weekIndex = index
      this.$refs.weekRef.toggle();
    }
  }
}
</script>

<style scoped lang="less">

.SchoolTable {

  .week-select {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    position: relative;
    /deep/.van-dropdown-item  {
      .van-popup {
        .active-color {
          .van-cell__value,.van-cell__title{
            color: rgb(230, 154, 4);
          }
        }
      }
    }
    .van-dropdown-menu {
      width: 100%;
      border-top: 1px solid #fac863;
      .dropdown-item {
        line-height: 1.5;
      }
      .van-cell__title {
        text-align: left;
      }
    }
    .title-top {
      line-height: 35px;
      font-size: 14px;
      color: #888;
      width: 100%;
      background: #fff;
    }
    .table-box {
      width: 100%;
      background: #fff;
      display: flex;
      flex-direction: column;
      border-top: 1px solid #f5f3f3;
      border-bottom: 1px solid #f5f3f3;
      box-sizing: border-box;
      border-top: 1px solid #fac863;
      .week-day {
        height: 120px;
        width: 100%;
        font-size: 14px;
        display: flex;
        overflow-x: scroll;
        position: relative;
        box-sizing: content-box;
        border-bottom: 1px solid #ddd;
        .row-line-one {
          position: sticky;
          left: 0;
          top: 0;
          height: 100%;
          flex: 0 0 50px;
          font-size: 14px;
          border-right: 1px solid #ddd;
          z-index: 1;
          background: #fff;
          line-height: 120px;
          box-sizing: border-box;
        }
        .weekday-row {
          display: flex;
          align-items: center;
          box-sizing: border-box;
          padding: 0 10px;
          flex-shrink: 0;
          .class-card {
            background: linear-gradient(to left top, #fac863,#f3d28f);
            padding: 7px;
            border-radius: 8px;
            box-shadow: 0 0 30px #d6d3cd;
            margin-right: 20px;
            .info-item {
              display: flex;
              align-items: center;
              .van-icon {
                width: 12px;
                height: 12px;
                font-size: 12px;
                margin-right: 4px;
              }
              p{
                margin: 0;
                font-size: 13px;
                line-height: 18px;
              }
              .clock-item {
                display: flex;
              }
            }
          }
        }
      }
    }
  }
}
</style>./curriculum.vue./Curriculum.vue

<template>
  <div class="SchoolTable">
    <div class="week-select">
      <van-dropdown-menu active-color="#e69a04">
        <van-dropdown-item :title="title" ref="weekRef">
          <van-cell v-for="(item, index) in weekOption" :class="index === weekIndex ? 'active-color': ''" :key="index" @click="()=>handleDropdownItem(index,true)" :title="item.title" :value="item.date" />
        </van-dropdown-item>
      </van-dropdown-menu>
      <!-- 今天 -->
      <div class="today" v-if="showToday" @click="handleToday">今天</div>
      <img src="/curriculum.github.io/xiada.png" class="logo" />
      <van-icon :class="`next ${weekIndex <= 0 ? 'disabled':''}`" @click="()=> weekIndex > 0 && handleDropdownItem(weekIndex - 1)" name="arrow-left" />
      <van-icon :class="`prev ${weekIndex >= 16 ? 'disabled':''}`" @click="()=>weekIndex < 16 && handleDropdownItem(weekIndex + 1)" name="arrow" />
      <!-- 课程日历 -->
      <div class="table-box">
        <div class="depart-line"></div>
        <div class="week-day" v-for="(week, index) in tableConfig.weekDay" :key="week" :style="{'background-color': weekDayIndex === index ? 'rgb(255 249 237)':''}">
          <div class="row-line-one" :style="{'line-height': currentWeekIndex.includes(index) ? '120px': '60px'}" @click="openAddDialog(index)">
            <span class="week-text">{{ week }}</span>
            <span class="week-text date">{{ tableConfig.weekDate[index] }}</span>
          </div>
          <div class="row-line-two">
            <template v-if="currentWeekInfo.course">
              <template v-for="(item,idx) in currentWeekInfo.course">
                <div class="weekday-row" :key="idx" v-if="item.dayIndex === index">
                  <div v-if="item.dayIndex === index" :class="`class-card ${item.other ? 'other-bg':''}`">
                    <van-icon name="clear" class="closeIcon" v-if="item.local" @click="closeLocalCourse(item)" />
                    <div class="info-item" v-if="item.other">
                      <van-icon :name="item.icon || 'good-job'" />
                      <p>{{ item.other }}</p>
                    </div>
                    <div class="info-item" v-if="item.courseName">
                      <van-icon name="notes" />
                      <p>课程：{{ item.courseName }}</p>
                    </div>
                    <div class="info-item" v-if="item.address">
                      <van-icon name="location" />
                      <p>地点：{{ item.address }}</p>
                    </div>
                    <div class="info-item" v-if="item.teacher">
                      <van-icon name="manager" />
                      <p>老师：{{ item.teacher }}</p>
                    </div>
                    <div class="info-item" style="align-items: flex-start;" v-if="item.time">
                      <van-icon name="clock" style="margin-top: 3px;" />
                      <div class="clock-item"><p>时间：</p>
                        <div >
                          <p style="text-align: left;" v-for="time in item.time" :key="time">{{time}}</p>
                        </div>
                      </div>
                    </div>
                    <div class="info-item" v-if="item.remark">
                      <van-icon name="manager" />
                      <p>备注：{{ item.remark }}</p>
                    </div>
                    
                  </div>
                </div>
              </template>
            </template>
          </div>
        </div>
      </div>
    </div>
    <!-- 添加日历 -->
    <van-dialog v-model="showAddDialog" title="添加日历" show-cancel-button @closed="closeAddDialog" @confirm="addConfirm" :beforeClose="beforeClose">
      <van-form @submit="onSubmit" class="addform">
        <van-field
          v-model="addParams.other"
          name="主题"
          label="主题"
          placeholder="主题"
          :rules="[{ required: true, message: '请填写主题' }]"
        />
        <van-field
          v-model="addParams.courseName"
          name="课程"
          label="课程"
          placeholder="课程(非必填)"
        />
        <van-field
          v-model="addParams.address"
          name="地点"
          label="地点"
          placeholder="地点(非必填)"
        />
        <van-field
          v-model="addParams.teacher"
          name="老师"
          label="老师"
          placeholder="老师(非必填)"
        />
        <van-field
          v-model="addParams.time"
          name="时间"
          label="时间"
          placeholder="时间(非必填)"
        />
      </van-form>
    </van-dialog>
  </div>
</template>

<script>
import moment from "moment"
import remoteData from "../utils/user_table_data"

export default {
  name: 'SchoolTable',
  props: {
  },
  data(){
    return {
      showAddDialog: false,
      showToday: false,
      weekIndex: 0,
      weekDayIndex: null,
      title: "第1周",
      weekOption: [
        { 
          title: '第1周',
          date: "9月01日 至 9月07日",
          startDate: "09-01",
          course: [
            {
              dayIndex: 6,
              other: "素质拓展",
              address: "环岛路offwork",
              time: ["暂定13:30至21:00"]
            }
          ]
        },
        { 
          title: '第2周',
          date: "9月08日 至 9月14日",
          startDate: "09-08",
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
          startDate: "09-15",
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
            },
            {
              dayIndex: 6,
              other: "喜乐会 · ME&WE",
              address: "厦门思明区 金山路与吕岭路交汇处宝龙一城B1",
              time: ["17:30"]
            },
            {
              dayIndex: 2,
              other: "中秋节",
              icon: ""
            }
          ]
        },
        { 
          title: '第4周',
          date: "9月22日 至 9月28日",
          startDate: "09-22",
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
          startDate: "09-29",
          course: [
            {
              dayIndex: 6,
              address: "庄汉水楼（南强二）401",
              courseName: "工程数学",
              teacher: "缪朝炜",
              time: ["上午：08:55 - 11:50 三节课","下午：14:30 - 17:25  三节课"]
            },
            {
              dayIndex: 5,
              other: "国庆放假【法定】"
            },
            {
              dayIndex: 4,
              other: "国庆放假【法定】"
            },
            {
              dayIndex: 3,
              other: "国庆放假【法定】"
            },
            {
              dayIndex: 2,
              other: "国庆放假【法定】"
            }
          ]
        },
        { 
          title: '第6周',
          date: "10月06日 至 10月12日",
          startDate: "10-06",
          course: [
            {
              dayIndex: 0,
              other: "国庆放假【法定】"
            },
            {
              dayIndex: 1,
              other: "国庆放假【法定】"
            },
            {
              dayIndex: 6,
              other: "补班"
            },
            {
              dayIndex: 5,
              other: "重阳节"
            }
          ]
        },
        { 
          title: '第7周',
          date: "10月13日 至 10月19日",
          startDate: "10-13",
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
          startDate: "10-20",
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
          startDate: "10-27",
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
            },
            {
              dayIndex: 5,
              other: "万圣节"
            }
          ]
        },
        {
          title: '第10周',
          date: "11月03日 至 11月09日",
          startDate: "11-03",
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
          startDate: "11-10",
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
          startDate: "11-17",
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
          startDate: "11-24",
          course: [
            {
              dayIndex: 0,
              address: "祖营楼（嘉庚四）103",
              courseName: "工程经济学",
              teacher: "杨光勇",
              time: ["上午：08:55 - 11:50 三节课","下午：14:30 - 17:25  三节课"]
            },
            {
              dayIndex: 4,
              other: "感恩节"
            }
          ]
        },
        {
          title: '第14周',
          date: "12月01日 至 12月07日",
          startDate: "12-01",
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
        { title: '第15周', date: "12月08日 至 12月14日",startDate: "12-08", },
        {
          title: '第16周',
          date: "12月15日 至 12月21日",
          startDate: "12-15",
          course: [
            {
              dayIndex: 0,
              address: "庄汉水楼（南强二）302",
              courseName: "项目管理概论(ME)(01)",
              teacher: "许征学",
              remark: "因考试周原因，还有一天课程未上系统，后续通知",
              time: ["上午：08:55 - 11:50 三节课","下午：14:30 - 17:25  三节课"]
            },
            {
              dayIndex: 6,
              address: "庄汉水楼（南强二）302",
              courseName: "项目管理概论(ME)(01)",
              teacher: "许征学",
              remark: "因考试周原因，还有一天课程未上系统，后续通知",
              time: ["上午：08:55 - 11:50 三节课","下午：14:30 - 17:25  三节课"]
            }
          ]
        },
        {
          title: '第17周',
          date: "12月22日 至 12月28日",
          startDate: "12-22",
          course: [
            {
              dayIndex: 0,
              address: "庄汉水楼（南强二）302",
              courseName: "项目管理概论(ME)(01)",
              teacher: "许征学",
              remark: "因考试周原因，还有一天课程未上系统，后续通知",
              time: ["上午：08:55 - 11:50 三节课","下午：14:30 - 17:25  三节课"]
            },
            {
              dayIndex: 6,
              address: "庄汉水楼（南强二）302",
              courseName: "项目管理概论(ME)(01)",
              teacher: "许征学",
              remark: "因考试周原因，还有一天课程未上系统，后续通知",
              time: ["上午：08:55 - 11:50 三节课","下午：14:30 - 17:25  三节课"]
            },
            {
              dayIndex: 2,
              other: "平安夜"
            },
            {
              dayIndex: 3,
              other: "圣诞节"
            }
          ]
        },
      ],
      tableConfig: {
        weekDay: ["周天","周一","周二","周三","周四","周五","周六"],
        weekDate: ["09-01","09-02","09-03","09-04","09-05","09-06","09-07"],
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
      },
      addParams: {
        dayIndex: 0,
        address: "",
        courseName: "",
        teacher: "",
        time: "",
        other: ""
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
    onSubmit(){

    },
    initWeekDate(){
      this.tableConfig.weekDate = []
      const startDate = this.currentWeekInfo.startDate
      for(let i = 0; i < 7; i++){
        this.tableConfig.weekDate.push(moment("2024-"+startDate).add(i, 'days').format("MM-DD"))
      }
    },
    handleDropdownItem(index, toggle){
      const item = this.weekOption[index]
      this.title = item.title
      this.weekIndex = index
      toggle && this.$refs.weekRef.toggle();
      this.weekDayIndex = null
      this.initWeekDate()
    },
    handleToday(){
      const weekIndex = moment().week() - 36
      this.weekIndex = weekIndex
      const item = this.weekOption[weekIndex]
      this.title = item.title
      this.weekDayIndex = moment().weekday()
      this.initWeekDate()
      
    },
    getWeeks(data){
      let weeks = data.replace(/[^\d-,]/g,"").split(",")
      weeks = weeks.map(v=>{
        if(v.includes("-")){
          let start = v.split("-")[0]
          let end = v.split("-")[1]
          let numbers = [];  
          for (let i = Number(start); i <= end; i++) {  
              numbers.push(i);  
          } 
          return numbers
        }else{
          return Number(v)
        }
      })
      return weeks.flat()
    },
    theSameCourse(course1,course2){
      if(course1.dayIndex !== course2.dayIndex) return false
      if(course1.address !== course2.address) return false
      if(course1.courseName !== course2.courseName) return false
      if(course1.teacher !== course2.teacher) return false
      if(course1.KCDM !== course2.KCDM) return false
      return true
    },
    parseTime(str){
      str = String(str)
      let newStr = str.slice(0, length - 2) + ':' + str.slice(length - 2); 
      return newStr
    },
    mergeTime(timeList){
      const simpleForm = {
        "上午：08:55 - 11:50 三节课": ["第2节 8:55 - 9:40", "第3节 10:10 - 10:55","第4节 11:05 - 11:50"],
        "下午：14:30 - 17:25  三节课": ["第5节 14:30 - 15:15", "第6节 15:25 - 16:10","第7节 16:40 - 17:25"],
      }
      for(let key in simpleForm){
        const toCheck = simpleForm[key]
        if (toCheck.every(item => timeList.includes(item))) {  
          timeList = timeList.filter(item => !toCheck.includes(item));
          timeList.push(key)
        }
      }
      return timeList
    },
    initData(){
      // 清除weekOption数据
      this.weekOption.forEach(v=>{
        if(v.course) {
          v.course = v.course.filter(v=> !!v.other)
        }else{
          v.course = []
        }
      })
      remoteData.map(v=>{
        const weeks = this.getWeeks(v.ZCMC)
        const duration = `${this.parseTime(v.KSSJ)} - ${this.parseTime(v.JSSJ)}`
        const item = {
          dayIndex: v.XQ === 7 ? 0 : v.XQ,
          address: v.JASMC,
          courseName: v.KCMC,
          teacher: v.JSXM,
          remark: v.KBBZ,
          time: [`第${v.KSJCDM}节 ${duration}`],
          duration,
          weeks,
          courseIndex: v.KSJCDM,
          KCDM: v.KCDM
        }
        weeks.forEach(w=>{
          this.weekOption[w-1].course.push(JSON.parse(JSON.stringify(item)))
        })
      })
      // 合并课程
      this.weekOption.forEach((v,idx)=>{
        const courses = []
        v.course.forEach(c=>{
          if(courses.length === 0) {
            courses.push(c)
          }else{
            let theSameIndex = -1
            courses.forEach((item,index)=>{
              if(this.theSameCourse(item,c)){
                theSameIndex = index
              }
            })
            if(theSameIndex === -1) {
              courses.push(c)
            }else{
              courses[theSameIndex].time.push(`第${c.courseIndex}节 ${c.duration}`)
            }
          }
        })
        this.weekOption[idx].course = courses
      })
      // 简化课程时间
      this.weekOption.forEach(v=>{
        v.course.forEach(c=>{
          if(c.time) c.time = this.mergeTime(c.time)
        })
      })
      // 合并本地的日历
      let addedCourses = localStorage.getItem('localCourses');
      if(addedCourses){
        addedCourses = JSON.parse(addedCourses)
        addedCourses.forEach(v=>{
          this.weekOption[v.weekIndex].course.push(v)
        })
      }
    },
    closeAddDialog(){
      this.addParams = {}
    },
    openAddDialog(index){
      this.addParams.dayIndex = index
      this.showAddDialog = true
    },
    beforeClose(action, done){
      if (action === 'confirm') {
        done(false)
      } else {
        done();
      }
    },
    addConfirm(){
      if(!this.addParams.other || !this.addParams.other.trim()){
        this.$toast('主题不能为空');
        return
      }
      const item = JSON.parse(JSON.stringify(this.addParams))
      if(item.time) item.time = [item.time]
      item.weekIndex = this.weekIndex
      item.local = true
      item.id = new Date().getTime()
      this.weekOption[this.weekIndex].course.push(item)
      this.showAddDialog = false

      let addedCourses = localStorage.getItem('localCourses');
      if(addedCourses) {
        addedCourses = JSON.parse(addedCourses)
      }else {
        addedCourses = []
      }
      addedCourses.push(item)

      localStorage.setItem('localCourses', JSON.stringify(addedCourses));
    },
    closeLocalCourse(item){
      this.$dialog.confirm({
        title: '删除',
        message: '确认删除吗？',
      })
      .then(() => {
        // 删除视图中的日历
        const idx = this.weekOption[this.weekIndex].course.findIndex(v=>v.id && v.id === item.id)
        this.weekOption[this.weekIndex].course.splice(idx,1)
        this.$forceUpdate()
        // 删除缓存中的日历
        let addedCourses = localStorage.getItem('localCourses');
        addedCourses = JSON.parse(addedCourses)
        const localIdx = addedCourses.findIndex(v=>v.id && v.id === item.id)
        addedCourses.splice(localIdx,1)
        localStorage.setItem('localCourses', JSON.stringify(addedCourses));
      })
      .catch(() => {
        // on cancel
      });
      
    }
  },
  created(){
    this.initData()
    this.showToday = (moment().week() - 35) > 0
    if(this.showToday){
      this.handleToday()
      this.weekOption[this.weekIndex].course.push({
        dayIndex: this.weekDayIndex,
        other: "今天"
      },)
    }
  }
}
</script>

<style scoped lang="less">

.SchoolTable {
  /deep/.van-dropdown-menu__title {
    font-size: 17px;
    font-weight: 600;
    color: #f8a603;
  }
  .week-select {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    position: relative;
    .today {
      line-height: 2;
      font-size: 14px;
      padding: 0 15px;
      border-radius: 5px;
      background-color: #fac863;
      color: #fff;
      position: absolute;
      right: 20px;
      top: 9px;
      box-shadow: 0 0 5px #d6d3cd;
      z-index: 10;
    }
    .logo {
      position: absolute;
      left: 20px;
      top: 10px;
      width: 90px;
      z-index: 100;
    }
    .next{
      line-height: 2;
      font-size: 25px;
      padding: 0 15px;
      border-radius: 5px;
      background-color: #fac863;
      color: #fff;
      position: fixed;
      left: 20px;
      bottom: 30px;
      box-shadow: 0 0 5px #d6d3cd;
      z-index: 10;
    }
    .prev {
      line-height: 2;
      font-size: 25px;
      padding: 0 15px;
      border-radius: 5px;
      background-color: #fac863;
      color: #fff;
      position: fixed;
      bottom: 30px;
      box-shadow: 0 0 5px #d6d3cd;
      z-index: 10;
      right: 20px;
    }
    .disabled {
      filter: grayscale(100%);
    }
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
      .depart-line{
        width: 1px;
        height: 100%;
        background: #000;
      }
      .week-day {
        width: 100%;
        font-size: 14px;
        display: flex;
        align-items: center;
        position: relative;
        box-sizing: content-box;
        border-bottom: 1px solid #ddd;
        min-height: 50px;
        .row-line-one {
          position: sticky;
          left: 0;
          top: 0;
          height: 100%;
          flex: 0 0 50px;
          font-size: 14px;
          z-index: 1;
          line-height: 120px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          .week-text {
            line-height: 1;
            font-weight: 600;
          }
          .date {
            font-size: 11px;
            margin-top: 5px;
            color: #f8a603;
          }
        }
        .row-line-two {
          flex: 1;
          border-left: 1px solid #ddd;
          min-height: 50px;
        }
        .weekday-row {
          display: flex;
          align-items: center;
          box-sizing: border-box;
          padding: 10px;
          flex-shrink: 0;
          overflow-x: scroll;
          .class-card {
            background: linear-gradient(to left top, #fac863,#f3d28f);
            padding: 7px;
            border-radius: 8px;
            box-shadow: 0 0 5px #d6d3cd;
            margin-right: 20px;
            flex-shrink: 0;
            position: relative;
            .closeIcon {
              position: absolute;
              right: -8px;
              top: -8px;
              font-size: 16px;
              color: rgba(0,0,0,0.6);
            }
            &:last-child{
              margin-right: 0;
            }
            .info-item {
              display: flex;
              align-items: center;
              .van-icon {
                width: 12px;
                height: 12px;
                font-size: 12px;
                margin-right: 4px;
                color: #fff;
                font-weight: lighter;
              }
              p{
                margin: 0;
                font-size: 12px;
                line-height: 18px;
                color: #fff;
              }
              .clock-item {
                display: flex;
              }
            }
          }
          .other-bg {
            background: linear-gradient(to left top, #FF626E, #FFBE71)
          }
        }
      }
    }
  }
  .addform {
    margin: 30px 0;
  }
}
</style>./curriculum.vue./Curriculum.vue

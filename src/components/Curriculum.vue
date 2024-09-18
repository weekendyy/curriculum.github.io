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
      <div class="notice" @click="handleNotice">公告</div>
      <img src="/curriculum.github.io/xiada.png" class="logo" />
    </div>
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
                <div v-if="item.dayIndex === index" :class="`class-card ${item.other ? 'other-bg':''}`" @click="cardDetail(item)">
                  <van-icon name="clear" class="closeIcon" v-if="item.local" @click="closeLocalCourse(item)" />
                  <div class="info-item" v-if="item.other">
                    <van-icon :name="item.icon || 'star'" />
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
                  <div class="info-item" style="align-items: flex-start;" v-if="item.content">
                    <van-icon name="description" style="margin-top: 3px;" />
                    <div class="clock-item"><p class="clock-item-title">内容：</p>
                      <div >
                        <p class="clock-item-content" style="text-align: left;" v-for="content in item.content" :key="content">{{content}}</p>
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
    <!-- 添加日历 -->
    <van-dialog v-model="showAddDialog" title="添加日历" show-cancel-button @closed="closeAddDialog" @confirm="addConfirm" :beforeClose="beforeClose">
      <van-form class="addform">
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
    <!-- 其他 -->
     <van-dialog v-model="showInfo" title="其他信息" class="other-info-dialog">
      <div v-for="(item,index) in tableConfig.dayTime" :key="index" class="other-info-item">
        <span>{{ item.name }}</span>
        <span>{{ item.duration }}</span>
      </div>
    </van-dialog>
    <!-- 底部按钮 -->
    <div class="buttom-buttons">
      <van-icon :class="`next ${weekIndex <= 0 ? 'disabled':''}`" @click="()=> weekIndex > 0 && handleDropdownItem(weekIndex - 1)" name="arrow-left" />
        <van-icon class="info-button" @click="showInfo = true" name="info" />
      <van-icon :class="`prev ${weekIndex >= 16 ? 'disabled':''}`" @click="()=>weekIndex < 16 && handleDropdownItem(weekIndex + 1)" name="arrow" />
    </div>
    <!-- 公告内容 -->
    <div>
      <div :class="`masking ${showNotice ? 'show-masking':''}`" @click="showNotice = false"></div>
      <div :class="`notice-content ${showNotice?'show-notice-content':''}`" >
        <div class="header">近期重要事项</div>
        <div class="notice-item" v-for="(item,index) in importantEvent" :key="item.title">
          <div class="title">{{index+1}}、{{ item.title }}</div>
          <div class="content" v-for="info in item.content || []" :key="info">{{ info }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment"
import remoteData from "../utils/user_table_data"
import { weekOption, tableConfig, importantEvent } from "../utils/const"
// import PdfViewer from "./pdfViewer.vue"

export default {
  name: 'SchoolTable',
  components: {
    // PdfViewer
  },
  props: {
  },
  data(){
    return {
      showQD: false,
      showAddDialog: false,
      showInfo: false,
      showToday: false,
      showNotice: false,
      weekIndex: 0,
      weekDayIndex: null,
      title: "第1周",
      weekOption: weekOption,
      tableConfig: tableConfig,
      importantEvent: importantEvent,
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
    handleNotice(){
      this.showNotice = !this.showNotice
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
      
    },
    cardDetail(item){
      if(!item.click) return
      const { type } = item
      switch (type) {
        case "qualityDevelopment":
          this.showQD = true
          break;
      
        default:
          break;
      }
    },
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
  },
  
}
</script>

<style scoped lang="less">

.SchoolTable {
  padding-top: 48px;
  padding-bottom: 90px;
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
    position: fixed;
    top: 0;
    left: 0;
    background: #fff;
    z-index: 100;
    .today {
      line-height: 2;
      font-size: 14px;
      padding: 0 15px;
      border-radius: 5px;
      background-color: #fac863;
      color: #fff;
      position: absolute;
      right: 70px;
      top: 9px;
      box-shadow: 0 0 5px #d6d3cd;
      z-index: 10;
    }
    .notice {
      line-height: 2;
      font-size: 14px;
      padding: 0 5px;
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
        .class-card {
          background: linear-gradient(to left top, #fac863,#f3d28f);
          padding: 7px;
          border-radius: 8px;
          box-shadow: 0 0 5px #d6d3cd;
          margin-right: 20px;
          flex-shrink: 0;
          position: relative;
          max-width: 100%;
          box-sizing: border-box;
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
              .clock-item-title {
                flex-shrink: 0;
              }
              .clock-item-content {
                margin-bottom: 10px;
                &::before{
                  content: "";
                  width: 8px;
                  height: 8px;
                  border-radius: 100%;
                  background-color: #eee3cefb;
                  display: inline-block;
                  margin-right: 7px;
                }
              }
            }
          }
        }
        .other-bg {
          background: linear-gradient(to left top, #FF626E, #FFBE71)
        }
      }
    }
  }
  .addform {
    margin: 30px 0;
  }
  
  .other-info-dialog {
    /deep/.van-dialog__content {
      padding: 20px 0;
    }
    .other-info-item {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
      box-sizing: border-box;
      padding: 0 20px;
    }

  }

  .buttom-buttons {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 20px 30px;
    z-index: 100;
    background: #fff;
    box-sizing: border-box;
    .info-button{
      width: 30px;
      height: 30px;
      font-size: 30px;
      box-shadow: 0 0 5px #d6d3cd;
      border-radius: 100%;
      color: #f8a603;
    }
    .next{
      line-height: 2;
      font-size: 20px;
      padding: 0 10px;
      border-radius: 5px;
      background-color: #fac863;
      color: #fff;
      box-shadow: 0 0 5px #d6d3cd;
      z-index: 10;
    }
    .prev {
      line-height: 2;
      font-size: 20px;
      padding: 0 10px;
      border-radius: 5px;
      background-color: #fac863;
      color: #fff;
      box-shadow: 0 0 5px #d6d3cd;
      z-index: 10;
    }
    .disabled {
      filter: grayscale(100%);
    }
  }
  .notice-content {
    position: fixed;
    right: 50px;
    top: 9px;
    width: 0;
    height: 0;
    opacity: 0.2;
    pointer-events: none;
    transition: 0.3s;
    transform-origin: right top;
    background-color: #fac863;
    border-radius: 5px;
    z-index: 111;
    box-sizing: border-box;
    padding: 20px;
    font-size: 14px;
    color: #fff;
    transform: scale(0);
    .header {
      font-size: 17px;
      font-weight: 600;
      margin-bottom: 10px;
      text-align: center;
    }
    .notice-item {
      width: 100%;
      .title {
        font-weight: 600;
        line-height: 2;
        text-align: left;
      }
      .content {
        line-height: 1.5;
        font-size: 13px;
        box-sizing: border-box;
        padding-left: 20px;
        text-align: left;
      }
    }
  }
  .masking {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 110;
    background: rgba(0,0,0,0.3);
    opacity: 0;
    pointer-events: none;
    transition: 0.3s;
  }
  .show-masking {
    opacity: 1;
    pointer-events: auto;
    backdrop-filter: blur(10px);
  }
  .show-notice-content {
    right: 20px;
    top: 50px;
    opacity: 1;
    width: calc(100% - 40px);
    height: 200px;
    transform: scale(1);
  }
}
</style>

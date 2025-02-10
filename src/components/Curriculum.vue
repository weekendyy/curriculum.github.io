<template>
  <div class="SchoolTable">
    <div class="week-select">
      <van-dropdown-menu active-color="#e69a04">
        <van-dropdown-item :title="title" ref="weekRef">
          <van-cell v-for="(item, index) in weekOption" :class="index === weekIndex ? 'active-color': ''" :key="index" @click="()=>handleDropdownItem(index,true)" :title="item.title" :value="item.date" />
        </van-dropdown-item>
      </van-dropdown-menu>
      <!-- 今天 -->
      <!-- <div class="today"  @click="handleToday">今天</div> -->
      <!-- <div class="notice" @click="handleNotice">公告</div> -->
      <!-- <div class="update" @click="()=>$refs.loginRef.showDialog()">更新</div> -->
      <van-dropdown-menu class="course-select-css">
        <van-dropdown-item ref="dropdownItem" title="课程">
          <van-checkbox-group v-model="selectedValues">
            <van-cell-group>
              <van-cell
                v-for="(option, index) in courseOptions"
                :key="index"
                :title="option.text"
                clickable
                @click="toggleCheckbox(option.value)"
              >
                <template #right-icon>
                  <van-checkbox :name="option.value" ref="checkboxes" />
                </template>
              </van-cell>
            </van-cell-group>
          </van-checkbox-group>
        </van-dropdown-item>
      </van-dropdown-menu>
      <img src="../images/xiada.png" class="logo" />
    </div>
    <!-- 课程日历 -->
    <div :class="`table-box ${pageChangeLoading?'animation-table':''}`">
      <div :class="`week-day`" v-for="(week, index) in tableConfig.weekDay" :key="week" :style="{'background-color': weekDayIndex === index ? 'rgb(255 249 237)':''}">
        <div :class="
          `row-line-one 
          ${holidays[tableConfig.weekDate[index]] && holidays[tableConfig.weekDate[index]].includes('休')?'holidays-day':''}
          ${holidays[tableConfig.weekDate[index]] && holidays[tableConfig.weekDate[index]].includes('班')?'work-day':''}
          `" :style="{'line-height': currentWeekIndex.includes(index) ? '120px': '60px'}" @click="openAddDialog(index)">
          <span class="week-text">{{ week }}</span>
          <span class="week-text date">{{ tableConfig.weekDate[index] }}</span>
          <span class="week-text holidays">{{ holidays[tableConfig.weekDate[index]] ? holidays[tableConfig.weekDate[index]] : '' }}</span>
        </div>
        <div :class="
          `row-line-two
          ${holidays[tableConfig.weekDate[index]] && holidays[tableConfig.weekDate[index]].includes('休')?'holidays-day':''}
          ${holidays[tableConfig.weekDate[index]] && holidays[tableConfig.weekDate[index]].includes('班')?'work-day':''}
          `">
          <template v-if="currentWeekInfo.course">
            <template v-for="(item,idx) in currentWeekInfo.course">
              <div class="weekday-row" :key="idx" v-if="item.dayIndex === index">
                <div v-if="item.dayIndex === index && !item.hidden" :class="`class-card ${item.other ? 'other-bg':''}`" @click="cardDetail(item)">
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
     <!-- <van-dialog v-model="showInfo" title="其他信息" class="other-info-dialog">
      <div v-for="(item,index) in tableConfig.dayTime" :key="index" class="other-info-item">
        <span>{{ item.name }}</span>
        <span>{{ item.duration }}</span>
      </div>
    </van-dialog> -->
    <!-- 底部按钮 -->
    <div class="buttom-buttons">
      <van-icon :class="`next ${weekIndex <= 0 ? 'disabled':''}`" @click="()=> weekIndex > 0 && handleDropdownItem(weekIndex - 1)" name="arrow-left" />
        <!-- <dogRollover @change="handleToday" /> -->
        <div class="today" v-if="showToday"  @click="handleToday">今天</div>
      <van-icon :class="`prev ${weekIndex >= scheduleConfig.totalWeeks-1 ? 'disabled':''}`" @click="()=>weekIndex < scheduleConfig.totalWeeks-1 && handleDropdownItem(weekIndex + 1)" name="arrow" />
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
    <div :class="`card-detail ${showDetail?'show-card-detail':''}`" @click="showDetail = false">
      <div :class="`class-card detail-card ${showDetail ? 'show-class-card-detail':''}`" @click.stop="()=>{}">
        <div class="info-item" v-if="detailCardInfo.other">
          <van-icon :name="detailCardInfo.icon || 'star'" />
          <p>{{ detailCardInfo.other }}</p>
        </div>
        <div class="info-item" v-if="detailCardInfo.courseName">
          <van-icon name="notes" />
          <p>课程：{{ detailCardInfo.courseName }}</p>
        </div>
        <div class="info-item" v-if="detailCardInfo.address">
          <van-icon name="location" />
          <p>地点：{{ detailCardInfo.address }}</p>
        </div>
        <div class="info-item" v-if="detailCardInfo.teacher">
          <van-icon name="manager" />
          <p>老师：{{ detailCardInfo.teacher }}</p>
        </div>
        <div class="info-item" style="align-items: flex-start;" v-if="detailCardInfo.time">
          <van-icon name="clock" style="margin-top: 9px;" />
          <div class="clock-item"><p>时间：</p>
            <div >
              <p style="text-align: left;" v-for="time in detailCardInfo.time" :key="time">{{time}}</p>
            </div>
          </div>
        </div>
        <div class="info-item" style="align-items: flex-start;" v-if="detailCardInfo.content">
          <van-icon name="description" style="margin-top: 3px;" />
          <div class="clock-item"><p class="clock-item-title">内容：</p>
            <div >
              <p class="clock-item-content" style="text-align: left;" v-for="content in detailCardInfo.content" :key="content">{{content}}</p>
            </div>
          </div>
        </div>
        <div class="info-item" v-if="detailCardInfo.remark">
          <van-icon name="manager" />
          <p>备注：{{ detailCardInfo.remark }}</p>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment"
import { tableConfig, importantEvent, holidays } from "../utils/const"
import { scheduleConfig } from '../config/schedule.js' 
// import dogRollover from "./dog-rollover.vue"
import { formatDate } from "../utils/tableDataUtils"
import tableData from "../config/user_table_data"

export default {
  name: 'SchoolTable',
  components: {
    // dogRollover
  },
  props: {
  },
  data(){
    return {
      pageChangeLoading: false,
      scheduleConfig,
      loading: false,
      showQD: false,
      showAddDialog: false,
      showInfo: false,
      showToday: false,
      showNotice: false,
      weekIndex: 0,
      weekDayIndex: null,
      title: "第1周",
      weekOption: [],
      tableConfig: tableConfig,
      importantEvent: importantEvent,
      addParams: {
        dayIndex: 0,
        address: "",
        courseName: "",
        teacher: "",
        time: "",
        other: ""
      },
      selectedValues: [],
      holidays: holidays,
      courseOptions: [
        { text: '自然辩证法(18学时1学分,公共)---曹志平', value: '14005' },
        { text: '采购管理(36学时2学分,选修)---缪朝炜', value: '14973' },
        { text: '项目风险管理(36学时2学分,选修)---林清恋', value: '14982' },
        { text: '互联网与新媒体营销(36学时2学分,选修)---袁喜娜', value: '16608' },
        { text: '项目管理信息系统(18学时1学分,选修)---曹慕昆', value: '17537' },
        { text: '工程管理导论(36学时2学分,选修)---张存禄', value: 'G10300700400004' },
        { text: '系统运作管理(36学时2学分,选修)---刘震宇', value: '14020' },
      ],
      detailCardInfo: {},
      showDetail: false
    }
  },
  computed: {
    currentWeekInfo(){
      const cur = this.weekOption[this.weekIndex]
      return cur ? cur : {}
    },
    currentWeekIndex(){
      if(this.currentWeekInfo.course){
        return this.currentWeekInfo.course.map(v=>v.dayIndex)
      }else{
        return []
      }
    }
  },
  watch: {
    weekIndex(newVal){
      if(this.weekOption[newVal])
      this.initWeekDate()
    }
  },
  methods: {
    initSelectedValues(){
      const selectedValues = localStorage.getItem("selected_courses")
      if(selectedValues){
        this.selectedValues = JSON.parse(selectedValues)
      }else{
        this.selectedValues = this.courseOptions.map(v=>v.value)
      }
    },
    toggleCheckbox(value){
      // 切换选中状态
      const index = this.selectedValues.indexOf(value);
      if (index === -1) {
        this.selectedValues.push(value);
      } else {
        this.selectedValues.splice(index, 1);
      }
      this.updateTabledata()
    },
    updateTabledata(){  // 根据选中的课程展示
      localStorage.setItem("selected_courses",JSON.stringify(this.selectedValues))
      this.weekOption.forEach(week=>{
        week.course.forEach(course=>{
          if(!this.selectedValues.includes(course.KCDM)){
            course.hidden = true
          }else{
            course.hidden = false 
          }
        })
      })
    },
    initWeekDate(){
      this.tableConfig.weekDate = []
      const startDate = this.currentWeekInfo.startDate
      if(startDate){
        for(let i = 0; i < 7; i++){
          this.tableConfig.weekDate.push(moment(startDate).add(i, 'days').format("MM-DD"))
        }
      }
    },
    handleDropdownItem(index, toggle){
      // 添加动画
      this.pageChangeLoading = true
      
      // 动画结束后移除类
      setTimeout(() => {
        this.pageChangeLoading = false
      }, 100)

      const item = this.weekOption[index]
      this.title = item.title
      this.weekIndex = index
      toggle && this.$refs.weekRef.toggle();
      this.weekDayIndex = null
    },
    handleToday(){
      // 计算当前周数
      const today = moment()
      const startDate = moment(scheduleConfig.startDate)
      const weekIndex = Math.floor(today.diff(startDate, 'days') / 7)
      this.weekIndex = Math.min(Math.max(weekIndex, 0), scheduleConfig.totalWeeks - 1)
      const item = this.weekOption[this.weekIndex]
      this.title = item.title
      this.weekDayIndex = moment().weekday()
    },
    handleNotice(){
      return
      // this.showNotice = !this.showNotice
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
    // 确定添加本地日历
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
    // 删除本地日历
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
        this.showDetail = false
      })
      .catch(() => {
        // on cancel
      });
      
    },
    // 查看详情
    cardDetail(item){
      this.detailCardInfo = item
      this.showDetail = true
    },
  },
  async created(){
    // 初始化课程内容
    this.weekOption = formatDate(tableData)
    // 初始化课程选项
    this.initSelectedValues() 
    this.initWeekDate()
    // 判断是否显示今天按钮
    const today = moment()
    const startDate = moment(scheduleConfig.startDate)
    const endDate = moment(scheduleConfig.startDate).add(scheduleConfig.totalWeeks, 'weeks')
    this.showToday = today.isBetween(startDate, endDate, null, '[]')
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
.today {
  line-height: 2;
  font-size: 14px;
  padding: 2px 10px;
  border-radius: 5px;
  background-color: #fac863;
  color: #fff;
  box-shadow: 0 0 5px #d6d3cd;
  z-index: 10;
}
.SchoolTable {
  padding-top: 48px;
  padding-bottom: 90px;
  box-sizing: border-box;
  height: 100%;
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
      filter: grayscale(100%);
    }
    .update {
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
    .course-select-css {
      width: 80px;
      position: fixed;
      right: 11px;
      top: 0;
      /deep/.van-dropdown-menu__bar {
        box-shadow: none;
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
    height: 100%;
    background: #fff;
    display: flex;
    flex-direction: column;
    border-top: 1px solid #f5f3f3;
    border-bottom: 1px solid #f5f3f3;
    box-sizing: border-box;
    border-top: 1px solid #fac863;
    transition: 0.3s;
    overflow-y: scroll;
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
      .row-line-one {
        position: sticky;
        left: 0;
        top: 0;
        height: 100%;
        flex: 0 0 60px;
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
          margin-top: 4px;
          color: #f8a603;
        }
        .holidays {
          font-size: 9px;
          margin-top: 4px;
          color: #f8a603;
          opacity: 0.5;
        }
      }
      .row-line-two {
        flex: 1;
        border-left: 1px solid #ddd;
        min-height: 57px;
      }
      .holidays-day {
        background-color: #fdf7f4;
      }
      .work-day {
        background-color: rgba(255,164,164,0.4);
      }
      .weekday-row {
        display: flex;
        align-items: center;
        box-sizing: border-box;
        padding: 10px;
        flex-shrink: 0;
        
      }
    }
    
  }
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
      align-items: baseline;
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
        text-align: left;
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
  .detail-card {
    width: 90%;
    margin-bottom: 20%;
    padding: 15px;
    transition: 0.3s;
    transform: translateY(-20px) scale(1);
    .info-item p{
      font-size: 16px;
      line-height: 2;
    }
  }
  .show-class-card-detail {
    transform: translateY(0) scale(1);
    box-shadow: none;
    .info-item {

      /deep/.van-icon {
        font-size: 15px;
        margin-right: 6px;
      }
    }
  }
  .animation-table {
    animation: pageturning 0.3s ease;
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
    height: 90px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 20px 30px;
    z-index: 100;
    background: #fff;
    box-sizing: border-box;
    background: linear-gradient(to left top, rgba(243, 210, 143,0.2),rgba(243, 210, 143,0.5));
    .info-button{
      width: 30px;
      height: 30px;
      font-size: 30px;
      box-shadow: 0 0 5px #d6d3cd;
      border-radius: 100%;
      color: #f8a603;
    }
    .next{
      line-height: 1.7;
      font-size: 20px;
      padding: 0 10px;
      border-radius: 5px;
      background-color: #fac863;
      color: #fff;
      box-shadow: 0 0 5px #d6d3cd;
      z-index: 10;
    }
    .prev {
      line-height: 1.7;
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
    right: 20px;
    top: 50px;
    opacity: 0;
    pointer-events: none;
    transition: 0.3s;
    background-color: #fac863;
    border-radius: 5px;
    z-index: 111;
    box-sizing: border-box;
    padding: 20px;
    font-size: 14px;
    color: #fff;
    transform: scale(0.8);
    width: calc(100% - 40px);
    height: 200px;
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
  .show-notice-content {
    opacity: 1;
    transform: scale(1);
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
  
}

@keyframes pageturning {
  0% {
    background: #fff;
  }
  50% {
    background: rgba(238, 237, 163, 0.1);
  }
  100% {
    background: #fff;
  }
}


.card-detail {
  position: fixed;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.3);
  transition: 0.3s;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: 0.3s;
  pointer-events: none;
  z-index: 111;
}
.show-card-detail {
  opacity: 1;
  pointer-events: auto;
  backdrop-filter: blur(2px);
}
</style>

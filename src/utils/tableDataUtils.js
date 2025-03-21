import { weekOption } from "./const"

export const formatDate = (source_data)=>{
  let _weekOption = weekOption
  source_data.map(v=>{
    const weeks = getWeeks(v)
    const duration = `${parseTime(v.KSSJ)} - ${parseTime(v.JSSJ)}`
    const item = {
      dayIndex: v.XQ - 1,
      address: v.JASMC,
      courseName: v.KCMC,
      teacher: v.JSXM,
      remark: v.KBBZ,
      duration,
      weeks,
      courseIndex: v.KSJCDM,
      KCDM: v.KCDM,
      hidden: false
    }
    if(v.KSJCDM) item.time = [`第${v.KSJCDM}节 ${duration}`]
    weeks.forEach(w=>{
      _weekOption[w-1].course.unshift(JSON.parse(JSON.stringify(item)))
    })
  })
  // 合并课程
  _weekOption.forEach((v,idx)=>{
    const courses = []
    v.course.forEach(c=>{
      if(courses.length === 0) {
        courses.push(c)
      }else{
        let theSameIndex = -1
        courses.forEach((item,index)=>{
          if(theSameCourse(item,c)){
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
    _weekOption[idx].course = courses
  })

  // 简化课程时间
  _weekOption.forEach(v=>{
    v.course.forEach(c=>{
      if(c.time) c.time = mergeTime(c.time)
    })
  })
  // 合并本地的日历
  let addedCourses = localStorage.getItem('localCourses');
  if(addedCourses){
    addedCourses = JSON.parse(addedCourses)
    addedCourses.forEach(v=>{
      _weekOption[v.weekIndex].course.push(v)
    })
  }
  return _weekOption
}

const getWeeks = (data)=>{
  const { ZCMC, XQ } = data
  let weeks = ZCMC.replace(/[^\d-,]/g,"").split(",")
  weeks = weeks.map(v=>{
    if(v.includes("-")){
      let start = v.split("-")[0]
      let end = v.split("-")[1]
      let numbers = [];  
      for (let i = Number(start); i <= end; i++) { 
        if(XQ === 7) numbers.push(i - 1)
        else numbers.push(i)
            
      } 
      return numbers
    }else{
      if(XQ === 7) return Number(v - 1)
      else return Number(v)
      
    }
  })
  return weeks.flat()
}
const parseTime = (str)=>{
  str = String(str)
  let newStr = str.slice(0, length - 2) + ':' + str.slice(length - 2); 
  return newStr
}
const mergeTime = (timeList)=>{
  const simpleForm = {
    "上午：08:00 - 11:50  四节课": ["第1节 8:00 - 8:45", "第2节 8:55 - 9:40", "第3节 10:10 - 10:55","第4节 11:05 - 11:50"],
    "上午：08:55 - 11:50 三节课": ["第2节 8:55 - 9:40", "第3节 10:10 - 10:55","第4节 11:05 - 11:50"],
    "下午：14:30 - 17:25  三节课": ["第5节 14:30 - 15:15", "第6节 15:25 - 16:10","第7节 16:40 - 17:25"],
    "晚上：19:10 - 21:45  三节课": ["第9节 19:10 - 19:55", "第10节 20:05 - 20:50","第11节 21:00 - 21:45"],
    "下午：14:30 - 16:10  两节课": ["第5节 14:30 - 15:15", "第6节 15:25 - 16:10"],
  }
  for(let key in simpleForm){
    const toCheck = simpleForm[key]
    if (toCheck.every(item => timeList.includes(item))) {  
      timeList = timeList.filter(item => !toCheck.includes(item));
      timeList.push(key)
    }
  }
  return timeList
}
const theSameCourse = (course1,course2)=>{
  if(course1.dayIndex !== course2.dayIndex) return false
  if(course1.address !== course2.address) return false
  if(course1.courseName !== course2.courseName) return false
  if(course1.teacher !== course2.teacher) return false
  if(course1.KCDM !== course2.KCDM) return false
  return true
}
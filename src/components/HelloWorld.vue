<template>
  <div class="SchoolTable">
    <div class="week-select">
      <Button></Button>
    </div>
  </div>
</template>

<script>
import { Button } from 'vant';

export default {
  name: 'SchoolTable',
  components: {
    Button
  },
  props: {
  },
  data(){
    return {
      weekIndex: 1
    }
  }
}
</script>

<style scoped>

</style>

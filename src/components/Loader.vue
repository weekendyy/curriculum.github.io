<template>
  <div :class="`loader-overlay ${visible?'':'hideLoading'}`">
    <div class="loader">
      <section><span class="loader-112">L &nbsp; ading      </span></section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppLoader',
  data() {
    return {
      visible: false
    }
  },
  methods: {
    show() {
      this.visible = true
    },
    hide() {
      this.visible = false
    }
  }
}
</script>

<style scoped>
.loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}
.hideLoading {
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.loader {
  text-align: center;
}

.loader-112 {
  font-size: 30px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold;
  color: #FFF;
  position: relative;
}
.loader-112::before {
  content: "";
  position: absolute;
  left: 19px;
  bottom: 4px;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  border: 5px solid #FFF;
  border-bottom-color: #f8a603;
  -webkit-animation: rotation 0.6s linear infinite;
          animation: rotation 0.6s linear infinite;
}
@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loader__spinner {
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loader__text {
  margin-top: 10px;
  color: #3498db;
  font-size: 14px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>

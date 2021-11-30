<script setup lang="ts">
import 'vue-slider-component/theme/antd.css';
import VueSlider from 'vue-slider-component'
import { defineComponent, reactive, toRefs, onMounted, watch, ref} from 'vue'
import tada from '../assets/images/tada.png'
import account from '../assets/images/account.png'
import gsap from 'gsap'


const score = ref<Number>(24000000)
let isShowInfo = ref<Boolean>(false)

onMounted(() => {
  // Vue3 GSAP.to score to animate roundProps: 'score'
  gsap.to(score.value, {
    score: 50000000,
    duration: 1,
    delay: 0.5,
    roundProps: 'score',
    ease: 'power3.inOut',
    onUpdate: () => {
      console.log(score.value)
      score.value += 1000000
    }
  })

  // gsap.to(score.value, {
  //   duration: 1,
  //   roundProps: 'score',
  //   ease: 'none',
  //   score: 100000000000
  // });
});
// Vue3 setup watch
watch(score, () => {
  if (isShowInfo) isShowInfo.value = false
})
const option = reactive<{ [key: string]: string }>({
  dotSize: 0,
  width: window.innerWidth,
  height: window.innerHeight - 64,
  contained: false,
  direction: 'btt',
  data: null,
  min: 24000000,
  max: 100000000,
  interval: 500000,
  disabled: false,
  clickable: true,
  duration: 0.3,
  tooltip: 'always',
  tooltipFormatter: '',
  useKeyboard: false,
  keydownHook: null,
  dragOnClick: true,
  enableCross: true,
  order: false,
  marks: false,
  dotOptions: true,
  process: true,
  dotStyle: 10,
})

</script>

<template>
  <VueSlider
      v-model="score"
      class="salary"
      v-bind="option"
  />
  <div
    class="info-card"
    :class="{'active': isShowInfo}"
  >
    <div class="header">
      <div class="num-box">
        <img
            style="display: inline-block"
            width="28"
            height="28"
            :src="tada"
        />
        <span class="num">{{ score.toLocaleString()}}</span>
      </div>
      <div class="setting-box">
        <button
          @click="isShowInfo = !isShowInfo"
        >
          <img
              width="20"
              height="20"
              :src="account"
          />
        </button>
      </div>
    </div>
    <div class="info-content">

    </div>
  </div>
</template>

<style lang="scss">

/* Card */
.info-card {
  position: fixed;
  bottom: -250px;
  left: 0;
  width: 100%;
  background-color: #f7cb71;
  z-index: 1;
  transition: 0.25s bottom ease-out;
  &.active {
    bottom: 0;
  }
  .header {
    display: flex;
    padding: 0 20px;
    justify-content: space-between;
    line-height: 75px;
    background-color: #fff;
    border-top-left-radius: 25px;
    border-top-right-radius: 25px;
    .num-box {
      .num {
        padding-left: 10px;
        font-size: 30px;
        font-weight: bold;
        color: #000;
      }
    }
    .setting-box {
      button {
        display: inline-block;
        width: 40px;
        height: 40px;
        cursor: pointer;
        background-color: #f7cb71;
        border-radius: 50%;
        line-height:1;
        img {
          background-color: #fff;
          border-radius: 50%;
        }
      }
    }
  }
  .info-content {
    padding: 20px;
    height: 200px;
    background-color: #fff;
  }
}

/* Slider */
.vue-slider-rail {
  border-radius: 0;
}
.vue-slider-process {
  border-radius: 0;
}
.vue-slider:hover .vue-slider-process, .vue-slider-process {
  background-color: #f7cb71;
}
.vue-slider-btt .vue-slider-mark-label {
  left: 0;
}
.vue-slider-dot-tooltip {
  margin-top: 30px;
  left: 20px;
  z-index: 9;
  .vue-slider-dot-tooltip-text {
    font-size: 30px;
    font-weight: bold;
    text-align: left;
  }
}
.vue-slider-dot-tooltip-inner-left::after {
  display: none;
}
</style>

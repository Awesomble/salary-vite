<script setup lang="ts">
import 'vue-slider-component/theme/antd.css';
import VueSlider from 'vue-slider-component'
import { defineComponent, reactive, toRefs, onMounted, onBeforeMount,watch, ref} from 'vue'
import tada from '../assets/images/tada.png'
import account from '../assets/images/account.png'
import gsap from 'gsap'

const HEIGHT = window.innerHeight
const score = ref<Number>(24000000)
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
  duration: 0,
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
const isShowInfo = ref<Boolean>(false)
const koreaAvg = ref<Number>(3090000 * 12)
let avg = ref<Number>(koreaAvg)
console.log(HEIGHT)
const avgMotion = () : void => {
  const avgInterval = setInterval(() => {
    const random = Math.floor(Math.random() * 10) + 1
    if ( random ) {
      if ( random % 2 === 0) {
        avg.value += 500000
      } else {
        avg.value -= 500000
      }
      if (avg > koreaAvg + koreaAvg * 0.1 || avg < koreaAvg - koreaAvg * 0.1) avg.value = koreaAvg
      console.log(`${(HEIGHT - 75) * (avg.value / 1000000000)}%`)
      gsap.to('.avgLine', 0.5, {
        bottom: `${(HEIGHT - 75) * (avg.value / 1000000000)}%`
      })
    }
  }, 3000)
}



watch(score, () => {
  if (isShowInfo) isShowInfo.value = false
})

onBeforeMount(() => {
  // Vue3 Typescript GSAP.to score count up
  gsap.to(score, 0.5, {
    value: 80000000,
    delay: 1,
    roundProps: 'value',
    ease: 'power3.inOut',
    onUpdate: () => {
    },
    onComplete: () => {
      setTimeout(() => {
        option.tooltip = 'active'
        avgMotion()
      }, 1000);
    },
  })
})

</script>

<template>
  <VueSlider
      v-model="score"
      class="salary"
      v-bind="option"
      :tooltip-formatter="v => v.toLocaleString()"
  />
  <div class="avgLine" />
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
  z-index: 2;
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
        outline: none;
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
/* Avg Line */
.avgLine {
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: red;
  z-index: 1;
  &:after {
    content: '대한민국 평균';
    position: absolute;
    padding: 3px 5px 1px 5px;
    font-size: 12px;
    color: #fff;
    top: -11px;
    right: 0;
    background-color: red;
    z-index: 1;
  }
  &:before {
    content: '';
    position: absolute;
    top: -10px;
    right: 75px;
    width: 0;
    height: 0;
    border-top: 10px solid transparent;
    border-right: 10px solid red;
    border-bottom: 10px solid transparent;
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

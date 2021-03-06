<script setup lang="ts">
import 'vue-slider-component/theme/antd.css';
import VueSlider from 'vue-slider-component'
import { defineComponent, reactive, toRefs, onMounted, onBeforeMount,watch, ref, computed, nextTick} from 'vue'
import tada from '../assets/images/tada.png'
import account from '../assets/images/account.png'
// import account from '../assets/images/ico_santa.png'
import gabgeunse2021 from '../assets/json/gabgeunse2021.json'
import gsap from 'gsap'
import EndingCredit from "./EndingCredit.vue"
import { useRoute } from 'vue-router'

declare global {
  interface Window {
    Kakao: any
  }
}

const route = useRoute()
const queryScore = computed(() => route.query.score)
const queryH = computed(() => route.query.h)
const queryF = computed(() => route.query.f)
let WIDTH: number = window.innerWidth
let HEIGHT:number = window.innerHeight
const score = ref<number>(24000000)
const option = reactive<{ [key: string]: any }>({
  dotSize: 0,
  width: WIDTH,
  height: HEIGHT - 70,
  contained: false,
  direction: 'btt',
  data: null,
  min: 24000000,
  max: 100000000,
  interval: 500000,
  disabled: false,
  clickable: true,
  duration: 0,
  tooltip: 'none',
  tooltipFormatter: '',
  useKeyboard: false,
  keydownHook: null,
  dragOnClick: true,
  enableCross: true,
  order: false,
  marks: false,
})
const isShowEndingCredit = ref<Boolean>(false)
const isShowInfo = ref<Boolean>(true)
const koreaAvg = ref<number>(3090000 * 12)
const iptH = ref<number>(1)
const iptF = ref<number>(100000)
let avg: number = koreaAvg.value
let avgInterval: number = 0

// 대한민국 평균연봉 인터렉션
const avgMotion = () : void => {
  if (avgInterval) clearInterval(avgInterval)
  avgInterval = setInterval(() => {
    const random = Math.floor(Math.random() * 10) + 1
    if ( random < 5) {
      if ( random % 2 === 0) {
        avg += 500000
      } else {
        avg -= 500000
      }
      if (avg > koreaAvg.value + koreaAvg.value * 0.05 || avg < koreaAvg.value - koreaAvg.value * 0.05) avg = koreaAvg.value
      gsap.to('.avgLine', 1, {
        bottom: `${(avg * 100 / 100000000) - 20}%`,
        ease: 'power3.inOut',
        autoAlpha: 1
      })
    }
  }, 3000)
}

// 4대보험 계산
const MC = computed(() : number => {
  return (score.value / 12) - iptF.value
})
// 국민연금
const nationalPension = computed(() : number => {
  return zeroCut((MC.value > 5240000 ? 5240000 : MC.value) * 0.045)
})
// 의료보험
const nationalHealth = computed(() : number => {
  return zeroCut(MC.value * 0.0343)
})
// 장기요양보험
const longtermCareInsurance = computed(() : number => {
  return zeroCut(nationalHealth.value * 0.1152)
})
// 고용보험
const employmentInsurance = computed(() : number => {
  return zeroCut(MC.value * 0.008)
})
// 소득세
const incomeTax = computed((): number => {
  const d = gabgeunse2021.tax
  const l = d.length
  const s = MC.value / 1000
  for (let i = 0; i < l; i += 1) {
    if (s >= parseFloat(d[i][0]) && s < parseFloat(d[i][1])) {
      return parseFloat(d[i][1 + iptH.value])
    }
  }
  return 0
})
// 지방소득세
const localIncomeTax = computed(() : number => {
  return zeroCut(incomeTax.value * 0.1)
})
const realAmount = computed((): number => {
  return Math.floor((MC.value + iptF.value) - (nationalPension.value + nationalHealth.value + longtermCareInsurance.value + employmentInsurance.value + incomeTax.value + localIncomeTax.value))
})

// zero cut function
const zeroCut = (num: number) : number => {
  return Math.floor(num / 10) * 10
}

const handleResize = () : void => {
  WIDTH = window.innerWidth
  HEIGHT = window.innerHeight
  option.width = WIDTH
  option.height = HEIGHT - 70
}
const kakaoLink = () : void => {
  // Kakao.Link.sendDefault
  window.Kakao.Link.sendDefault({
    objectType: 'feed',
    content: {
      title: '초간단 월급 계산기',
      description: '터치만으로 쉽게 월급을 계산해보세요.',
      imageUrl: 'https://salary.awesomble.com/thumb_seo.png',
      link: {
        mobileWebUrl: `https://salary.awesomble.com?score=${score.value}&h=${iptH.value}&f=${iptF.value}`,
        androidExecutionParams: `https://salary.awesomble.com?score=${score.value}&h=${iptH.value}&f=${iptF.value}`
      },
    },
  })
}

watch(score, () => {
  if (isShowInfo) isShowInfo.value = false
  localStorage.score = score.value
})
watch(iptH, () => {
  localStorage.iptH = iptH.value
})
watch(iptF, () => {
  localStorage.iptF = iptF.value
})
watch(isShowEndingCredit, () => {
  if (isShowEndingCredit) setTimeout(() => {
    isShowEndingCredit.value = false
  }, 30000)
})

onBeforeMount(() => {
  // delay
  setTimeout(() => {
    window.addEventListener('resize', handleResize)
    const s = localStorage.score ? parseInt(queryScore.value ? queryScore.value : localStorage.score) : 60000000
    iptH.value = localStorage.iptH ? parseInt(queryH.value ? queryH.value : localStorage.iptH) : 1
    iptF.value = localStorage.iptF ? parseInt(queryF.value ? queryF.value : localStorage.iptF) : 100000
    gsap.to(score, 0.5, {
      value: s,
      delay: 1,
      roundProps: 'value',
      ease: 'power3.inOut',
      onUpdate: () => {
      },
      onComplete: () => {
        setTimeout(() => {
          option.tooltip = 'active'
          score.value = s
          avgMotion()
        }, 1000);
      },
    })
  }, 10)
})

</script>

<template>
  <VueSlider
      v-model="score"
      class="salary"
      v-bind="option"
      :tooltip-formatter="(v: number) => v.toLocaleString()"
  >
    <div class="result"
         :class="{'active': isShowInfo}"
    >
      <dl>
        <dt>국민연금</dt>
        <dd>{{ nationalPension.toLocaleString() }}</dd>
      </dl>
      <dl>
        <dt>의료보험</dt>
        <dd>{{ (nationalHealth).toLocaleString() }}<span>+{{ longtermCareInsurance.toLocaleString() }}</span></dd>
      </dl>
      <dl>
        <dt>고용보험</dt>
        <dd>{{ employmentInsurance.toLocaleString() }}</dd>
      </dl>
      <dl>
        <dt>소득세</dt>
        <dd>{{ (incomeTax).toLocaleString() }} <span>+{{ localIncomeTax.toLocaleString() }}</span></dd>
      </dl>
    </div>
    <div class="avgLine" />
  </VueSlider>
  <div
      class="info-card"
      :class="{'active': isShowInfo}"
  >
    <div
        class="header"
        @click="isShowInfo = !isShowInfo"
    >
      <div class="num-box">
        <img
            style="display: inline-block"
            width="28"
            height="28"
            :src="tada"
        />
        <span class="num">{{ realAmount.toLocaleString() }}</span>
      </div>
      <div class="setting-box">
        <button>
          <img
              width="24"
              height="24"
              :src="account"
          />
        </button>
      </div>
    </div>
    <div class="info-content">
      <dl>
        <dt><h3>인적공제</h3><span>{{ iptH }}명</span></dt>
        <dd>
          <vue-slider
              v-model="iptH"
              :min="1"
              :max="10"
              tooltip="none"
          />
        </dd>
      </dl>
      <dl>
        <dt><h3>비급여</h3><span>{{ iptF.toLocaleString() }}원</span></dt>
        <dd>
          <vue-slider
              v-model="iptF"
              :step="100000"
              :min="0"
              :interval="100000"
              :max="1000000"
              tooltip="none"
          />
        </dd>
      </dl>
      <div class="showEndingCredit">
<!--        <button @click="isShowEndingCredit = true">개발자만나기</button>-->
<!--        <a target="_blank" href="https://aosdin.notion.site/9a33fde065e74aa29f3dacae0d23c5a7">댓글남기기</a>-->
        <button class="share" @click="kakaoLink"><img height="44" src="@/assets/images/ico_kakao_link.png" alt=""></button>
      </div>
    </div>
  </div>
  <ending-credit
      v-if="isShowEndingCredit"
      @close="isShowEndingCredit = false"
  />
</template>

<style lang="scss">
/* 정보창 */
.result {
  position: absolute;
  bottom: 0;
  z-index: 2;
  padding: 20px;
  font-size: 15px;
  font-weight: bold;
  transition: 0.25s bottom ease-in-out;
  &.active {
    bottom: 249px;
  }
  dl {
    dt, dd {
      display: inline-flex;
    }
    dt {
      width: 100px;
    }
    dd {
      span {
        padding-left: 10px;
        color: #7f7f7f;
      }
    }
  }
}
/* 세부설정 */
.info-card {
  position: fixed;
  bottom: -249px;
  left: 0;
  width: 100%;
  background-color: #f7cb71;
  z-index: 4;
  transition: 0.25s bottom ease-in-out;
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
    position: relative;
    padding: 20px;
    height: 200px;
    background-color: #fef8ea;
    &:after {
      content: "- 개인 소득여건에 따라 차이가 발생할 수 있습니다.";
      position: absolute;
      bottom: 0;
      width: 100%;
      font-size: 12px;
      font-weight: 100;
      color: #000;
    }
    &:before {
      content: "- 2021년 9월 기준으로 개발되었습니다.";
      position: absolute;
      bottom: 16px;
      width: 100%;
      font-size: 12px;
      font-weight: 100;
      color: #000;
    }
    dl {
      margin-bottom: 20px;
      dt {
        h3 {
          display: inline-block;
          color: #7f7f7f;
        }
        span {
          display: inline-block;
          padding-left: 10px;
          font-size: 16px;
          font-weight: bold;
        }
      }
      dd {
        padding: 0 10px;
      }
      .vue-slider-dot-handle {
        border-color: #f7cb71;
      }
    }
    .showEndingCredit {
      width: 100%;
      position: absolute;
      bottom: 50px;
      button, a {
        display: inline-block;
        padding: 10px;
        background-color: #f7cb71;
        border-radius: 4px;
        color: #fefaf0;
        font-weight: bold;
        font-size: 16px;
        margin-right: 10px;
        /* button Popular drop shadow */
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
        &.share {
          width: 44px;
          height: 44px;
          padding: 0;
          background: transparent;
        }
      }
    }
  }
}
/* 대한민국 평균라인 */
.avgLine {
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: red;
  z-index: 3;
  opacity: 0;
  &:after {
    content: '대한민국 평균';
    display:block;
    position: absolute;
    top: -10px;
    right: 0;
    width:76px;
    height: 20px;
    font-size: 12px;
    text-align: center;
    line-height: 21px;
    color: #fff;
    background-color: red;
    z-index: 1;
  }
  &:before {
    content: '';
    position: absolute;
    top: -10px;
    right: 76px;
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
  left: 30px;
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

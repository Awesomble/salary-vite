<template>
  <div
    class="star-wars-intro"
    @click="$emit('close')"
  >
    <!-- Logo Image or Text goes in here -->
    <h2 class="main-logo">
<!--      <img src="img/star-wars-intro.png">-->
    </h2>

    <!-- All Scrolling Content Goes in here -->
    <div class="main-content">

      <div class="title-content">
        <p class="content-header">어썸블<br>AWESOMBLE</p>

        <br>

        <p class="content-body">
          세상이 모바일로 급변함에 따라 모바일에 최적화된 연봉 계산기를 만드노니, 우리모두 버닝하여 내년에도 잘 살아보세!
        </p>

        <br>

        <p class="space-button">
          김종환(Aosdin)<br>
          이효훈(Playmore)
        </p>

        <br>

        <a target="_blank" href="https://aosdin.notion.site/9a33fde065e74aa29f3dacae0d23c5a7" class="space-button">개발자만나기버튼</a>

      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "/src/assets/css/starwarsintro.css";
</style>

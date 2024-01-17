<template>
    <div id="clock">
        <div class="time">{{ formattedTime }}</div>
        <div class="btn-container">
            <button id="start" @click="startStopwatch" :disabled="isRunning">Start</button>
            <button id="stop" @click="stopStopwatch" :disabled="!isRunning">Stop</button>
            <button id="reset" @click="resetStopwatch">Submit</button>
        </div>
        <div class="btn-container">
            <button v-for="amt in amts" @click="setqty(amt)" :class="{ selected: qty == amt }">{{ amt }}</button>
        </div>
    </div>
</template>
  
<script setup>
    const elapsedTime = ref(0)
    const isRunning = ref(false)
    const qty = ref()
    const amts = [1,2,3,4,5,6,7,8,9,10]

    const formattedTime = computed(() => {
        const minutes = Math.floor((elapsedTime.value / 1000) / 60)
        const seconds = Math.floor(elapsedTime.value / 1000) % 60
        const millis = elapsedTime.value % 1000
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(millis).padStart(3, '0')}`
    });

    let intervalId

    let lastStart
    let extraTime = 0

    const startStopwatch = () => {
        lastStart = Date.now()

        if (!isRunning.value) {
            intervalId = setInterval(() => {
                elapsedTime.value = Date.now() - lastStart + extraTime
            }, 1)
            isRunning.value = true
        }
    }

    const stopStopwatch = () => {
        if (isRunning.value) {
            clearInterval(intervalId)
            isRunning.value = false
            extraTime += Date.now() - lastStart
        }
    }

    const resetStopwatch = async () => {
        clearInterval(intervalId)
        await $fetch('/api/record/post', {
            method: 'POST',
            body: {
                durationMillis: elapsedTime.value,
                items: qty.value
            }
        })
        elapsedTime.value = 0
        isRunning.value = false
        extraTime = 0
        qty.value = null
    }

    const setqty = (q) => {
        qty.value = q
    }

    watch(isRunning, (newValue) => {
        if (!newValue) {
            clearInterval(intervalId);
        }
    });

    onBeforeUnmount(() => {
        clearInterval(intervalId);
    });
</script>

<style scoped>
/* Font Import */
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

/* CSS Variables */
:root {
  --color: rgb(200, 200, 200);
  --color-light: white;
}

/* Global Styles */
html, body {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}

body {
  background-color: rgb(10, 10, 10);
  font-family: 'Share Tech Mono', sans-serif;

  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-content: stretch;
  align-items: center;
}

/* Clock Styles */
#clock {
  order: 0;
  flex: 0 1 auto;
  align-self: center;

  color: var(--color);
  /* text-shadow: 0px 0px 25px var(--color); */

  /* Time Styles */
  .time {
    font-size: 6.5em;
    text-align: center;
  }

  /* Button Container Styles */
  .btn-container {
    display: flex;
    margin-top: 15px;

    /* Button Styles */
    button {
      text-align: center;
      font-family: 'Share Tech Mono', sans-serif;
      background: transparent;
      /* border: 3px solid var(--color); */
      border: none;
      color: var(--color);
      padding: 10px 15px;
      margin: 0 10px;
      text-transform: uppercase;
      font-size: 2em;
      cursor: pointer;
      /* text-shadow: 0px 0px 10px var(--color); */

      flex-grow: 1;

      transition: color 0.1s ease-out;

      :hover {
        color: var(--color-light);
      }
    }

    .selected {
        background-color: lightgreen;
    }
  }
}

*:disabled {
    color: dimgrey;
}
</style>
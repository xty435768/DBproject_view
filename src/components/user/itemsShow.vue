
<template>
  <div>
    <Items items class="items-area" ref="itemsArea"></Items>
  </div>
</template>

<script>
import Items from './Items'
export default {
  name: 'info',
  components: {
    Items,
  },

}
</script>

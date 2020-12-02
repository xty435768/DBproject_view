<template>
    <div>
        <Items items style="width:1150px" ref="itemsArea"
            :dataSourceAPI="'/commodity/get_all'"
            :showEdit="false"></Items>
    </div>
</template>

<script>
import Items from '../user/Items.vue'
export default {
    name: 'admin_item',
    components: {
        Items,
    }
}
</script>

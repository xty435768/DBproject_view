<template>
    <div>
        <Books books style="width:1150px" ref="booksArea"
            :dataSourceAPI="'/commodity/get_all'"
            :showEdit="false"></Books>
    </div>
</template>

<script>
import Books from '../user/Books.vue'
export default {
    name: 'admin_item',
    components: {
        Books,
    }
}
</script>

<template>
    <div>
        <Books books class="books-area" ref="booksArea"
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

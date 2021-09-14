<template>
    <div class="Index">
        <div 
            class="item"
            v-for="(book, i) of books"
            :key="i"
        >
            <router-link 
                class="book" 
                :to="`/book/${book.key}`"
            >
                <div 
                    class="cover"
                    :style="{ 
                        backgroundImage: `url(/assets/${book.key}/cover.jpg)`
                    }"
                />
                <p>{{ book.title }}</p>
                <span>{{ book.update.title }}</span>
            </router-link>
        </div>
    </div>
</template>

<script>
    import { defineComponent } from 'vue'
    
    export default defineComponent({
        data() {
            return {
                books: {}
            }
        },
        async mounted() {
            this.books = await fetch('/api/books')
                .then(res => res.json())
        }
    })
</script>

<style scoped>
    .Index {
        display: table;
        width: 100%;
    }
    
    .Index .item {
        width: 50%;
        float: left;
    }
    
    .Index .item .book {
        width: 90%;
        margin-top: 10px;
        margin-left: 5%;
        box-shadow: 0 0 5px 2px #ddd;
        padding-bottom: 10px;
        display: block;
        border-radius: 10px;
    }
    
    .Index .item .book div {
        width: 100%;
        height: 30vh;
        background-size: cover;
        background-position: 50%;
        border-radius: 10px 10px 0 0;
    }
    
    .Index .item .book p {
        font-weight: bold;
        text-indent: 1rem;
        margin-top: 10px;
    }
    
    .Index .item .book span {
        text-indent: 1rem;
        display: block;
        color: #999;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
</style>
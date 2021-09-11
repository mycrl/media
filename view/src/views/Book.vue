<template>
    <div class="Book">
        <div 
            class="cover"
            :style="{ 
                backgroundImage: `url(/assets/${key}/cover.jpg)`
            }"
        >
            <router-link
                class="home"
                to="/"
            >首页</router-link>
        </div>
        <div class="box">
            <p class="title">
                {{ book.title }}
            </p>
            <div class="chapters">
                <router-link 
                    v-for="(chapter, i) of book.chapters"
                    :key="chapter.title"
                    :to="`/chapter/${key}/${i}`"
                >
                    {{ chapter.title }}
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
    import { defineComponent } from 'vue'
    
    export default defineComponent({
        data() {
            return {
                key: this.$route.params.key,
                book: {}
            }
        },
        mounted() {
            fetch('/api/book/' + this.key)
                .then(res => res.json())
                .then(book => {
                    this.book = book
                })
        }
    })
</script>

<style scoped>
    .Book .cover {
        height: 30vh;
        background-size: cover;
        background-position: top;
    }
    
    .Book .title {
        font-weight: bold;
        font-size: 1.5rem;
        color: #555;
        padding: 20px;
    }
    
    .Book .chapters {
        padding-bottom: 50px;
    }
    
    .Book .chapters a {
        display: block;
        line-height: 20px;
        border-top: 1px solid #eee;
        padding: 10px 20px;
    }
    
    .home {
        margin-left: 20px;
        padding-top: 20px;
        display: block;
    }
</style>
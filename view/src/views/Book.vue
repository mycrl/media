<template>
    <div class="Book">
        <div class="cover">
            <div 
                class="image"
                :style="{ 
                    backgroundImage: `url(/assets/${key}/cover.jpg)`
                }"
            />
            <router-link
                class="home"
                to="/"
            >首页</router-link>
            <p class="title">
                {{ book.title }}
            </p>
        </div>
        <div class="box">
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
        async mounted() {
            this.book = await fetch('/api/book/' + this.key)
                .then(res => res.json())
            document.title = this.book.title
        }
    })
</script>

<style scoped>
    .Book .cover {
        height: 30vh;
        position: relative;
        border-bottom: 1px solid #ccc;
    }
    
    .Book .cover .home {
        position: absolute;
        z-index: 2;
        top: 20px;
        left: 20px;
    }
    
    .Book .cover .image {
        position: absolute;
        background-size: cover;
        background-position: top;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        filter: blur(1px);
    }
    
    .Book .cover .title {
        font-weight: 700;
        font-size: 1.5rem;
        color: #000;
        position: absolute;
        left: 20px;
        bottom: 20px;
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
</style>
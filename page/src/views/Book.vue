<template>
    <div class="Book">
        <div class="cover">
            <div 
                class="image"
                :style="{ 
                    backgroundImage: `url(${api.getCover(key)})`
                }"
            />
            <router-link
                class="home"
                to="/"
            >首页</router-link>
            <p>{{ book.name }}</p>
        </div>
        <div class="info">
            {{ book.summary }}
        </div>
        <div class="box">
            <div class="chapters">
                <router-link 
                    v-for="(chapter, i) of chapters"
                    :key="chapter.name"
                    :to="`/chapter/${key}/${i}`"
                >
                    <span>{{ chapter.name }}</span>
                    <span>{{ new Date(chapter.create_by)
                        .toString('MM-dd HH:mm') }}</span>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
    import { defineComponent } from 'vue'
    
    export default defineComponent({
        inject: [
            'api'
        ],
        data() {
            return {
                key: this.$route.params.key,
                book: {},
                chapters: []
            }
        },
        mounted() {
            this.api.getBookProfile(this.key).then(({ book, chapters }) => {
                document.title = book.name
                this.chapters = chapters
                this.book = book
            })
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
    
    .Book .cover p {
        font-weight: 700;
        font-size: 1.5rem;
        color: #000;
        position: absolute;
        left: 20px;
        bottom: 20px;
    }
    
    .Book .info {
        color: #555;
        padding: 20px;
        background-color: #eee;
    }
    
    .Book .chapters {
        padding-bottom: 50px;
    }
    
    .Book .chapters a {
        display: flex;
        line-height: 20px;
        border-top: 1px solid #eee;
        padding: 10px 20px;
    }
    
    .Book .chapters a span {
        flex: auto; 
    }
    
    .Book .chapters a span:last-of-type {
        text-align: right;
        color: #999;
        width: 20%;
    }
</style>
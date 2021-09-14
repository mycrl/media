<template>
    <div class="Chapter">
        <div 
            class="controls"
            v-if="book != null"
            v-show="controls"
        >
            <div @click="list">目录</div>
            <div 
                v-if="index < (book.chapters.length - 1)"
                @click="next"
            >下章</div>
            <div @click="top">顶部</div>
        </div>
        <div
            v-if="book != null"
            ref="images"
            class="images"
            @click="click"
        >
            <img 
                v-for="(_, i) of new Array(book.chapters[index].size).fill(0)"
                :src="`/assets/${key}/${book.chapters[index].title}/${i}.jpg`"
                :key="i"
            />
        </div>
    </div>
</template>

<script>
    import { defineComponent } from 'vue'
    
    export default defineComponent({
        data() {
            return {
                key: this.$route.params.key,
                index: Number(this.$route.params.index),
                controls: false,
                book: null
            }
        },
        async beforeRouteUpdate(to, _, next) {
            this.$refs.images.scrollTop = 0
            this.index = Number(to.params.index)
            this.key = to.params.key
            await this.fetch()
            next()
        },
        methods: {
            top() {
                this.$refs.images.scroll({
                    behavior: 'smooth',
                    top: 0,
                })
            },
            list() {
                this.$router.push(`/book/${this.key}`)
            },
            next() {
                this.$router.push(`/chapter/${this.key}/${this.index + 1}`) 
            },
            click() {
                this.controls = !this.controls
            },
            async fetch() {
                this.book = await fetch('/api/book/' + this.key)
                    .then(res => res.json())
                document.title = this.book
                    .chapters[this.index]
                    .title
            }
        },
        mounted() {
            this.fetch()
        }
    })
</script>

<style scoped>
    .Chapter .images {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        overflow-y: auto;
    }
    
    .Chapter .images img {
        width: 100%;
        display: block;
    }
    
    .controls {
        position: fixed;
        z-index: 20;
        bottom: 20px;
        right: 20px;
    }
    
    .controls div {
        border-radius: 50%;
        width: 40px;
        height: 40px;
        background-color: #fff;
        border: 1px solid #ddd;
        text-align: center;
        line-height: 40px;
        margin-top: 10px;
    }
</style>
<template>
    <div class="Chapter">
        <div 
            class="controls"
            :id="controls && 'show'"
        >
            <div @click="list">目录</div>
            <div 
                v-if="index < (chapters.length - 1)"
                @click="next"
            >下章</div>
            <div @click="top">顶部</div>
        </div>
        <div
            ref="images"
            class="images"
            @click="click"
            v-if="chapters.length > 0"
        >
            <img 
                v-for="(_, i) of new Array(chapters[index].size).fill(0)"
                :src="api.getImage(key, chapters[index].name, i)"
                :key="i"
            />
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
                index: Number(this.$route.params.index),
                controls: false,
                chapters: []
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
                const { chapters } = await this.api.getBookProfile(this.key)
                document.title = chapters[this.index].name
                this.chapters = chapters
            }
        },
        mounted() {
            this.fetch()
        }
    })
</script>

<style scoped>
    
    @media (max-width: 500px) {
        .Chapter .images {
            position: fixed;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            overflow-y: auto;
        }   
    }
    
    @media (min-width: 500px) {
        .Chapter .images {
            width: 450px;
            height: 100%;
            overflow-y: auto;
            margin: 0 auto;
            border-left: 1px solid #ddd;
            border-right: 1px solid #ddd;
        }
    }
    
    .Chapter .images img {
        width: 100%;
        display: block;
    }
    
    .controls {
        position: fixed;
        z-index: 20;
        bottom: -41px;
        left: 0;
        width: 100%;
        height: 40px;
        background-color: #fff;
        border-top: 1px solid #ddd;
        display: flex;
        transition: 0.3s;
    }
    
    .controls div {
        flex: 1;
        line-height: 40px;
        text-align: center;
    }
    
    #show {
        bottom: 0;
    }
</style>
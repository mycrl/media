<template>
    <div class="Index">
        <div class="header">
            <button 
                :id=" model == 'comics' && 'select' "
                @click="select('comics')"
            >漫画</button>
            <button 
                :id=" model == 'photos' && 'select' "
                @click="select('photos')"
            >图片</button>
        </div>
        <div 
            class="add"
            v-show="model == 'photos'"
        >
            <input 
                type="text" 
                placeholder="输入页面地址"
                v-model="addUrl"
            />
            <button @click="addPhoto">添加</button>
        </div>
        <div 
            class="item"
            v-for="(item, i) of books"
            :key="i"
        >
            <router-link 
                class="book" 
                :title="item.summary"
                :to="
                     model == 'comics' ? 
                        `/book/${item.uid}` :
                        `/photo/${item.name}/${item.size}`
                "
            >
                <div 
                    class="cover"
                    :style="{ 
                        backgroundImage: `url(${getCover(item)})`
                    }"
                />
                <div class="info">
                    <p>{{ item.name }}</p>
                    <text>
                        最近更新: 
                        {{ new Date(item.chapter_create_by || item.create_by)
                            .toString('MM-dd HH:mm') }}
                        <br>
                        {{ model == 'comics' ? 
                            item.chapter_name : null }} 
                    </text>
                    <span 
                        v-show="model == 'comics'"
                    >{{ item.summary }}</span>
                </div>
            </router-link>
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
                books: {},
                addUrl: null,
                model: this.$route.query.model || 'comics'
            }
        },
        watch: {
            model(value) {
                if (value === 'comics') {
                    this.getBooks()
                } else {
                    this.getPhotos()
                }
            }
        },
        methods: {
            async getBooks() {
                this.books = await this.api.getBooks()
            },
            async getPhotos() {
                this.books = await this.api.getPhotos()
            },
            getCover(book) {
                return this.model === 'comics' ? 
                    this.api.getCover(book.uid) :
                    this.api.getPhoto(book.name, 0)
            },
            async addPhoto() {
                await this.api.addPhoto(this.addUrl)
                this.addUrl = null
            },
            select(model) {
                if (model === 'comics') {
                    this.$router.push(`/?model=comics`)
                } else {
                    this.$router.push(`/?model=photos`)
                }
                
                this.model = model
            }
        },
        mounted() {
            this.model === 'comics' ? 
                this.getBooks() :
                this.getPhotos()
        }
    })
</script>

<style scoped media="">
    
</style>

<style scoped>
    .Index {
        display: flex;
        flex-wrap: wrap;
        padding-bottom: 60px;
    }
    
    .Index .header {
        width: 100%;
        height: 30px;
        padding: 10px;
        padding-bottom: 0;
        display: flex;
    }
    
    .Index .add {
        height: 30px;
        padding: 10px;
        display: flex;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: #fff;
        border-top: 1px solid #ddd;
    }
    
    .Index .header #select {
        background-color: #000;
        color: #fff;
    }
    
    .Index .header button {
        height: 30px;
        border: 1px solid #ddd;
        background-color: #fff;
        margin-right: 10px;
        padding: 0 10px;
        border-radius: 5px;
    }
    
    .Index .add input {
        height: 30px;
        border: 1px solid #eee;
        border-radius: 5px;
        flex: 1;
        text-indent: 1rem;
    }
    
    .Index .add button {
        height: 30px;
        border: 1px solid #eee;
        border-radius: 5px;
        width: 50px;
        margin-left: 10px;
        background-color: #fff;
    }
    
@media (max-width: 500px) {
    .Index .item {
        width: 50%;
        flex-basis: 50%;
    }

    .Index .item .book .info > * {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
}

@media (min-width: 500px) {
    .Index .item {
        width: 25%;
        flex-basis: 25%;
    }

}
            
    .Index .item .book {
        width: 90%;
        margin-top: 10px;
        margin-left: 5%;
        display: block;
        border-radius: 5px;
        border: 1px solid #eee;
    }
    
    .Index .item .book .cover {
        width: 100%;
        height: 30vh;
        background-size: cover;
        background-position: 50%;
        border-radius: 3px 3px 0 0;
    }
    
    .Index .item .book .info {
        padding: 1rem;
    }
    .Index .item .book .info > * {
        display: block;
    }
    
    .Index .item .book p {
        font-weight: bold;
        color: #000;
    }
    
    .Index .item .book text {
        color: #999;
        margin-top: 5px;
    }
    
    .Index .item .book span {
        color: #555;
        margin-top: 10px;
    }
</style>
<template>
    <div class="Photo">
        <a
            v-for="i of new Array(size).fill(0).map((_, i) => i)"
            :href="api.getPhoto(key, i)"
            :key="i"
        >
            <img :src="api.getPhoto(key, i)"/>
        </a>
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
                size: Number(this.$route.params.size)
            }
        },
        async beforeRouteUpdate(to, _, next) {
            setTimeout(() => {
                this.$refs.images.scrollTop = 0
            }, 500)
            
            this.size = Number(to.params.size)
            this.key = to.params.key
            next()
        }
    })
</script>

<style scoped>
    .Photo img {
        width: 100%;
    }
</style>
function QueryString(source) {
  return (location.search.split("?")[1] || "")
    .split("&")
    .map(x => x.split("="))
    .map(x => ({[x[0]]: x[1]}))
    .reduce((x, y) => ({...x, ...y}))
}

window.onload = () => {
  fetch('/data.json')
    .then(res => res.json())
    .then(chapters => {
      const { name, values } = chapters[location.pathname.slice(1)]
      document.title = name
      
      window.VUE = new Vue({
        el: "#App",
        data: {
          index: Number(QueryString().chapter || 0),
          chaptersToggle: false,
          chapters: values,
          vector: [],
        },
        methods: {
          reader({ chapter, range }) {
            this.vector = []
            for (let i = 0; i < Number(range); i ++) {
              this.vector.push(`/dist/${location.pathname.slice(1)}/${chapter}/${i}.jpg`)
            }
          },
          reader_range(range) {
            this.vector = []
            for (let i = range[0]; i <= range[1]; i ++) {
                this.vector.push(`/dist/${location.pathname.slice(1)}/${i}.jpg`)
            }
          },
          goto(index) {
            location.href = location.origin + 
              location.pathname + 
              "?chapter=" + 
              index
          },
          goTop() {
            this.$refs.view.scrollTop = 0
          },
          next() {
            location.href = location.origin + 
              location.pathname + 
              "?chapter=" + 
              (this.index + 1)
          }
        },
        created() {
          const value = this.chapters[this.index]
          Array.isArray(value.range) ? 
            this.reader_range(value.range) : 
            this.reader(value)
        }
      })
    })
}
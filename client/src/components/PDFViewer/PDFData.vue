<script>
import range from 'lodash/range';

function getDefaults(){
    return {
        pages:[],
        cursor: 0,
    }
}

function getDocument(url){
    return import('pdfjs-dist/webpack').then(pdfjs => pdfjs.getDocument(url));
}

function getPages(pdf, first, last){
    const allPages = range(first, last+1).map(number => pdf.getPage(number));
    //range only include value from 'first' to BEFORE 'last', so +1 to include last

    return Promise.all(allPages);
}

const BUFFER_LENGTH = 10; //how many pages per render

export default {
    name:'PDFData',

    props:{
        url:{
            type: String,
            required: true,
        },
    },

    data(){
        return Object.assign(getDefaults(),{
            pdf: undefined,
        });
    },

    watch:{
        url:{
            handler(url){
                getDocument(url)
                .then(pdf => (this.pdf = pdf))
                .catch(resp => {
                    console.log('[PDFData] Failed to retrieve PDF: ' + resp);
                });
            },
            immediate: true, //immediate true means it also runs during the component creation
        },

        pdf(newPdf, oldPdf){
            if(!newPdf) return; //if the new value is null, or undefined, yada yada ..
            if(oldPdf) Object.assign(this, getDefaults()); // if oldPdf has a value, assign getDefaults to this document object

            this.$emit('page-count', this.pageCount);
            this.fetchPages();
        },

    },

    computed:{
        pageCount(){
            return this.pdf ? this.pdf.numPages : 0;
        },
    },

    methods:{
        fetchPages(currentPage = 0){
            if(!this.pdf) return;
            if(this.pageCount > 0 && this.pages.length === this.pageCount) return;

            const startIndex = this.pages.length;
            if(this.cursor > startIndex) return; //if we're about to render the rendered page
            
            const startPage = startIndex + 1;
            const endPage = Math.min(Math.max(currentPage, startIndex + BUFFER_LENGTH), this.pageCount);
            // currentPage, to handle fetching from user input on paginator
            // Min - pageCount, so the value wont exceeds the number of pdf's total pages.

            this.cursor = endPage; //number of rendered pages.
            getPages(this.pdf, startPage, endPage)
            .then((pages) => {
                const deleteCount = 0;
                this.pages.splice(startIndex, deleteCount, ...pages);
                //adding each pages rendered to this.pages after the last index without deleting any

                return this.pages;
            }).catch((resp) =>{
                console.log('[PDFData] Failed to fetch pages: ' + resp);
            })
        }
    },

    created(){
        this.$on('pages-fetch', this.fetchPages);
    },

    render(h){
        return h('div',[
            this.$scopedSlots.document({
                pages: this.pages,
            }),
        ]);
    },
}
</script>

<style>

</style>
import {Table} from './page.js';

class ClassicReport{
    #title;
    #search = `<span><i class="button fas fa-magnifying-glass" onclick="searchKeyword()"><input id="search-bar" placeholder="Search..."></input></i></span>`;
    #records;
    #pagination = 30;
    #pages;
    #currentPage;
    #currentPageNumber;
    #navigation;
    constructor([count, records], title=''){
        this.#title = title;
        this.#records = records;
        this.#pages = Math.ceil(count / this.#pagination);
        this.#currentPage = new Table(records.slice(0, 30));
        this.#currentPageNumber = 1;
    }
    get navigation(){
        return '<div style="float: right"><i class="fas fa-angles-left button"></i>' +
            '<i class="fas fa-angle-left button"></i>' +
            `Page ${this.#currentPageNumber} of ${this.#pages}` +
            '<i class="fas fa-angle-right button"></i>' +
            '<i class="fas fa-angles-right button"></i></div>';
    }

    set title(HTML) {
        this.#title = HTML;
    }
    render(){
        return `<div>${this.#title} &emsp;&emsp; ${this.#search}</div>` + `<div id="report-detail">${this.#currentPage.render()}<p></p>${this.navigation}</div>`;
    }
}
export default ClassicReport;
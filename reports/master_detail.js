import {Table} from './page.js';
import ClassicReport from './classic_report.js';

class MasterTable extends Table {
    constructor(rows, title='') {
        super(rows, title);
        let HTML = '';
        rows.forEach((row) => {
            HTML += `<tr class="record-item" onclick="showDetailFor({id: '${row.device_id}', name: '${row.name}'})">`;
            Object.entries(row).forEach(([key, value]) => {
                if(key.match(/_id/i)){

                }else{
                    HTML += `<td>${value}</td>`;
                }
            });
            HTML += "</tr>";
        })
        this.body = HTML;
    }
}

class Detail extends ClassicReport{
    #detailViews = {
        bar: `<i class="button fas fa-chart-column" onclick="changeDetailVisualization('bar')"></i>`,
        list: `<i class="button fas fa-table-list" onclick="changeDetailVisualization('list')"></i>`,
    };
    constructor([count, records], title='Events'){
        super([count, records], title);
        this.title = `<span style="font-weight: bold; font-size: 24px;">${title}  <span id="toggle-icon">${this.#detailViews.bar}</span></span>`;
    }
}

class MasterDetailReport{
    #master;
    #separator = '<div class="separator"></div>';
    #detail;
    constructor([summaryTitle, summary], events) {
        this.#master = new MasterTable(summary, summaryTitle);
        this.#detail = new Detail(events);
    }

    get detail() {
        return this.#detail;
    }
    render () {
        return `<div id="master-section">${this.#master.render()}</div>` +
            this.#separator +
            `<div id="detail-section">${this.#detail.render()}</div>`;
    }}

export  {MasterDetailReport, Detail};
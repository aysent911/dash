import path from 'path';
class Table{
    #thead;
    #tbody;
    constructor(rows){
        if(rows.length > 0){
            this.#thead = "<thead><tr>";
            Object.keys(rows[0]).forEach((key) => {
                if(key.match(/_id/i)){

                }else{
                    this.#thead += `<th style="text-wrap: pretty;">${key.replaceAll('_', ' ').toUpperCase()}</th>`;
                }
            });
            this.#thead += "</tr></thead>";
            this.#tbody = "<tbody>";
            rows.forEach((row) => {
                this.#tbody += `<tr class="record-item">`;
                Object.entries(row).forEach(([key, value]) => {
                    if(key.match(/_id/i)){

                    }else if(key.match(/link/i)){
                        this.#tbody +=
                            `<td onclick="showEventSnapshot('created_at=${new Date(row.created_at).toISOString()}&device_id=${row.device_id}&link=${path.basename(value || "none")}')">
                                <i class="fas fa-up-right-from-square"></i>
                             </td>`;
                    }else{
                        this.#tbody += `<td>${value}</td>`;
                    }
                });
                this.#tbody += "</tr>";
            })
            this.#tbody += "</tbody>";
        }
    }
    set body(HTML) {
        this.#tbody = HTML;
    }
    set head(HTML){
        this.#thead = HTML;
    }
    render(){
        return this.#tbody? "<table>" + this.#thead + this.#tbody + "</table>":
            '<div style="margin: 0 auto"><p>Oops! No matching record found!</p></div>';
    }
}

class chart {

}


export  {Table};
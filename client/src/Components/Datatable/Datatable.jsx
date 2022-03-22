import React from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import "./Datatable.scss"

class Datatable extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            columns: props.columns,
            rowLimit: props.rowLimit,
            search: '',
            rows: props.rows,
            rowsShown: props.rows,
            record: props.rows.length,
            ignore: props.ignore,
            start: 0,
            order: true,
            orderField: null,
            page: 0
        }
    }
    componentDidUpdate(prevProps){
        if(prevProps !== this.props){
            let _state = this.state
            this.setState({
                columns: this.props.columns,
                rowLimit: this.props.rowLimit,
                search: _state.search,
                rows: this.props.rows,
                rowsShown: this.props.rows,
                record: this.props.rows.length,
                ignore: this.props.ignore,
                start: _state.start,
                order: _state.order,
                orderField: _state.orderField,
                page: _state.page
            })
        }
    }

    filter = ()=>{
        if(this.state.search!==''){
            let rows = []
            this.state.rows.forEach(row=>{
                row.every((field,key)=>{
                    if(!this.state.ignore.includes(key)){
                        if(field.toString().toLowerCase().search(this.state.search)!==-1){
                            rows.push(row)
                            return false
                        }
                        return true
                    }
                    return false
                })
            })
            this.updateState("rowsShown",rows)
            this.updateState("record",rows.length)
        }
        else{
            this.updateState("rowsShown",this.state.rows)
            this.updateState("record",this.state.rows.length)
        }
    }
    updateTable = (e)=>{
        this.updateState("search",e.target.value)
        this.filter()
    }
    updateLimit = (e)=>{
        this.updateState("rowLimit",e.target.value)
        this.filter()
    }
    updateState = (field,value)=>{
        let state = this.state
        state[field] = value
        this.setState(state)
    }
    filterByColumn = (k)=>{
        let rowsShown = this.state.rowsShown
        rowsShown.sort((a, b)=>{
            if(a[k] === b[k]){
                return 0
            }else{
                if(this.state.order){
                    return ( (a[k] < b[k]) ? -1 : 1 )
                }else{
                    return ( (a[k] < b[k]) ? 1 : -1 )
                }
            }
        });
        this.updateState("orderField",k)
        this.updateState("order",!this.state.order)
        this.updateState("rowsShown",rowsShown)
    }
    switchPage = (page)=>{
        this.updateState("page",page)
        this.updateState("start",this.state.rowLimit*page)
    }
    render(){
        let {ignore,rowsShown,record,columns,rowLimit,page,start} = this.state
        let limit = rowLimit > record ? parseInt(record) : (parseInt(rowLimit) + parseInt(start)) > record ? record : (parseInt(rowLimit) + parseInt(start))
        let rows = []
        if(record){
            for(let i=start;i<limit;i++){
                rows.push(<tr className="datatable__table__row" key={i}>
                    {rowsShown[i].map((cell,k)=><td key={i+""+k} className="datatable__table__cell" >{cell}</td>)}
                </tr>)
            }
        }else{
            rows.push( <tr key={1}><td colSpan={this.props.columns.length} key={0} className="datatable__table__cell datatable__table__empty">Aucun résultat trouvé</td></tr>)
        }



        return <div className="datatable">
            <div className="datatable__filter">
                <div>
                    <label htmlFor="datable__filter__row-limit">Nombre de lignes :</label>
                    <select id="datable__filter__row-limit" onChange={this.updateLimit} defaultValue={this.state.rowLimit}>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="datable__filter__search">Rechercher :</label>
                    <input onChange={this.updateTable} type="text" id="datable__filter__search"/>
                </div>
            </div>
            <div className="datatable__table-container">
                <table className="datatable__table">
                    <thead >
                        <tr className="datatable__table__head">
                            {columns.map((c,k)=>
                                <th className="datatable__table__column-title datatable__table__cell" key={k}>
                                    <div>
                                        <span>{c}</span>
                                        {!(ignore.includes(k))? <button onClick={()=>{this.filterByColumn(k)}}><i className={"bi bi-arrow-down-up "+(this.state.orderField === k ? 'active' : '')}></i></button> : ''}
                                    </div>
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map(r=>r)}
                    </tbody>
                </table>
            </div>
            <div className="datatable__pagination">
                <button >Précédent</button>
                {[...Array(parseInt(record/rowLimit) <= 0 ? 1 : Math.round(parseFloat(record)/parseFloat(rowLimit)))].map((record, key) =>
                    <button  onClick={()=>{this.switchPage(key)}} className={page===key ? 'active' : ''} key={key}>{key+1}</button>
                )}
                <button >Suivant</button>
            </div>
        </div>
    }
}

export default Datatable
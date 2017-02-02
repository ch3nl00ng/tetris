class RWTableRow extends React.Component {
    render() {
        return (
            <div className="rw-table-row">
                <span>{this.props.region}</span>&nbsp;
                <span>{this.props.oddity}</span>&nbsp;
                <span>{this.props.color}</span>&nbsp;
            </div>
        );
    }
}

class RWTable extends React.Component {
    constructor(props) {
        super(props);

        var jsonStr = localStorage.getItem('rw-table-data');

        var rwTableData = [];
        try {
            if (jsonStr) {
                rwTableData = JSON.parse(jsonStr);
            }
        }
        catch (e) {
            console.log('Error getting data from local storage.');
        }

        if (Array !== rwTableData.constructor) {
            rwTableData = [];
        }

        this.state = {
            rwTableData: rwTableData,
        };
    }

    addNew() {
        var newRWTableRow = {
            region: $('.rw-table-new-region').val(),
            oddity: $('.rw-table-new-oddity').val(),
            color: $('.rw-table-new-color').val(),
        };

        var rwTableData = this.state.rwTableData;
        rwTableData.push(newRWTableRow);

        this.setState({
            rwTableData: rwTableData,
        });
    }

    render() {
        var rowDoms = [];
        for (var i = 0; i < this.state.rwTableData.length; i++) {
            rowDoms.push(
                <RWTableRow 
                    region={this.state.rwTableData[i].region}
                    oddity={this.state.rwTableData[i].oddity}
                    color={this.state.rwTableData[i].color}
                />
            );
        }

        return (
            <div className="rw-table">
                {rowDoms}
                <div>
                    <span>
                        <input
                            className="rw-table-new-region"
                            type="text"
                            defaultValue="" 
                        />
                    </span>
                    &nbsp;
                    <span>
                        <input
                            className="rw-table-new-oddity"
                            type="text"
                            defaultValue="" 
                        />
                    </span>
                    &nbsp;
                    <span>
                        <input
                            className="rw-table-new-color"
                            type="text"
                            defaultValue="" 
                        />
                    </span>
                    &nbsp;
                    <input className="rw-table-new-button" type="button" value="Add"
                            onClick={this.addNew.bind(this)}
                    />
                </div>
            </div>
        );
    }
}

ReactDOM.render(<RWTable />, document.getElementById('rw-table'));

//# sourceURL=rw-table.js
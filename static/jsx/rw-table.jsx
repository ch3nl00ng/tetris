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

    getRateDisplayDoms() {
        var regionMap = {};
        var oddityMap = {};
        var colorMap = {};
        for (var i = 0; i < this.state.rwTableData.length; i++) {
            var rwTableRow = this.state.rwTableData[i];

            if (!regionMap[rwTableRow.region]) {
                regionMap[rwTableRow.region] = 1;
            }
            else {
                regionMap[rwTableRow.region]++;
            }

            if (!oddityMap[rwTableRow.oddity.toUpperCase()]) {
                oddityMap[rwTableRow.oddity.toUpperCase()] = 1;
            }
            else {
                oddityMap[rwTableRow.oddity.toUpperCase()]++;
            }

            if (!colorMap[rwTableRow.color.toUpperCase()]) {
                colorMap[rwTableRow.color.toUpperCase()] = 1;
            }
            else {
                colorMap[rwTableRow.color.toUpperCase()]++;
            }
        }

        var regionTotal = 0;
        for (var region in regionMap) {
            regionTotal += regionMap[region];
        }
        var regionRateDoms = [];
        for (var region in regionMap) {
            regionRateDoms.push(<span key={region}>{region}: {(regionMap[region]/regionTotal).toFixed(2)}&nbsp;</span>);
        }

        var oddityTotal = 0;
        for (var oddity in oddityMap) {
            oddityTotal += oddityMap[oddity];
        }
        var oddityRateDoms = [];
        for (var oddity in oddityMap) {
            oddityRateDoms.push(<span key={oddity}>{oddity}: {(oddityMap[oddity]/oddityTotal).toFixed(2)}&nbsp;</span>);
        }

        var colorTotal = 0;
        for (var color in colorMap) {
            colorTotal += colorMap[color];
        }
        var colorRateDoms = [];
        for (var color in colorMap) {
            colorRateDoms.push(<span key={color}>{color}: {(colorMap[color]/colorTotal).toFixed(2)}&nbsp;</span>);
        }

        return (
            <div>
                <div>
                    R:&nbsp;
                    {regionRateDoms}
                </div>
                <div>
                    O:&nbsp;
                    {oddityRateDoms}
                </div>
                <div>
                    C:&nbsp;
                    {colorRateDoms}
                </div>
            </div>
        );
    }

    render() {
        var rowDoms = [];
        for (var i = 0; i < this.state.rwTableData.length; i++) {
            rowDoms.push(
                <RWTableRow 
                    key={i}
                    region={this.state.rwTableData[i].region}
                    oddity={this.state.rwTableData[i].oddity}
                    color={this.state.rwTableData[i].color}
                />
            );
        }

        var rateDom = this.getRateDisplayDoms();

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
                {rateDom}
            </div>
        );
    }
}

ReactDOM.render(<RWTable />, document.getElementById('rw-table'));

//# sourceURL=rw-table.js

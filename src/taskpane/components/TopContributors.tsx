import * as React from 'react';
import {
    XYPlot,
    VerticalBarSeries,
    LabelSeries
} from 'react-vis';

class TopContributors extends React.Component {
    
    props: any;
    render() {
        const data = this.props.data;
        const chartWidth = 300;
        const chartHeight = 100;
        const chartDomain = [0, chartHeight];
        return (
            <div style = {{height: 130}} className = "ms-model__analysis_barChart" >
                <h3>&nbsp;&nbsp;Top Contributors</h3>
            <XYPlot 
               xType="ordinal" 
               width={chartWidth} 
               height={chartHeight} 
               yDomain={chartDomain}
             >
                <VerticalBarSeries
                    data={data}
                    color = "white"
                />
                 <LabelSeries
                    color = "#4282BE"
                    data={data.map(obj => {
                        return { ...obj, label: obj.x.toString()}
                    })}
                    
                    labelAnchorX="middle"
                    labelAnchorY="text-after-edge"
                />
            </XYPlot>
            </div>
        );
    }
}

export default TopContributors;
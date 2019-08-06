import * as React from 'react';
import { XYPlot, VerticalBarSeries, XAxis } from 'react-vis';

class TopContributors extends React.Component {
    
    props: any;
    render() {
        const data = this.props.data;
        const chartWidth = 300;
        const chartHeight = 110;
        const chartDomain = [0, chartHeight];
        return (
            <XYPlot 
                xType="ordinal" 
                width={chartWidth} 
                height={chartHeight} 
                yDomain={chartDomain}>

                <VerticalBarSeries
                    data={data}
                    color="#0078d4"/>
                <XAxis />
            </XYPlot>
        );
    }
}

export default TopContributors;
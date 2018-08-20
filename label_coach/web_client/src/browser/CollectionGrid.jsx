import * as React from "react";
import {Responsive, WidthProvider} from 'react-grid-layout';
import "../styles/CollectionGrid.css"

const ResponsiveGridLayout = WidthProvider(Responsive);
import connect from "react-redux/es/connect/connect";

class CollectionGridP extends React.Component {
    constructor(props) {
        super(props);

        const layout = this.generateLayout();
        this.state = {layout};
    }

    generateDOM() {
        return _.map(_.range(this.props.items), function (i) {
            return (
                <div key={i} className="tn-card">
                    <span className="text">{i}</span>
                </div>
            );
        });
    }

    generateLayout() {
        const p = this.props;
        return _.map(new Array(p.items), function (item, i) {
            return {
                x: (i * 2) % 12,
                y: Math.floor(i / 12) * 2,
                w: 2,
                h: 3,
                i: i.toString()
            };
        });
    }

    onLayoutChange(layout) {
        this.props.onLayoutChange(layout);
    }

    render() {
        return (
            <ResponsiveGridLayout
                breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
                cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 12}}
                layout={this.state.layout}
                onLayoutChange={this.onLayoutChange}
                {...this.props}>

                {this.generateDOM()}
            </ResponsiveGridLayout>
        );
    }
}

// ---------- Container ----------

function mapStateToProps(state) {
    return state
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        onLayoutChange: () => {
        }
    }
}

const CollectionGrid = connect(
    mapStateToProps,
    mapDispatchToProps
)(CollectionGridP);

export default CollectionGrid;
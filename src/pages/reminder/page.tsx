import React, { PureComponent } from "react";
import { connect } from "react-redux";

import { IReminderPageProps, MapStateToProps, MapDispatchToProps } from "./page-props";

class ReminderPage extends PureComponent<IReminderPageProps> {
    render() {
        return (
            <div></div>
        );
    }
}

export default connect(
    MapStateToProps,
    MapDispatchToProps
)(ReminderPage);
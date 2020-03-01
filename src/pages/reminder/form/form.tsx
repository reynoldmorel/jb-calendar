import React, { PureComponent } from "react";
import { connect } from "react-redux";

import { IReminderFormProps, MapStateToProps, MapDispatchToProps } from "./form-props";

class ReminderForm extends PureComponent<IReminderFormProps> {

    render() {
        return (
            <div>
                Content Here
            </div>
        );
    }


}

export default connect(
    MapStateToProps,
    MapDispatchToProps
)(ReminderForm);
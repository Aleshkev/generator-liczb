import { withStyles } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import React, { Component } from "react";

const styles = theme => ({
  bigNumberDisplay: {
    width: "100%",
    textAlign: "center",
    fontWeight: "bold",

    fontSize: "50vw",
    [theme.breakpoints.up("sm")]: {
      fontSize: "25vw",
      [theme.breakpoints.up("xl")]: {
        fontSize: 500
      }
    }
  }
});

class BigNumberDisplay extends Component {
  constructor() {
    super();
  }

  render() {
    const { classes } = this.props;
    return (
      <Paper>
        <Typography className={classes.bigNumberDisplay}>
          {this.props.chosenNumber !== null ? this.props.chosenNumber : ""}
        </Typography>
      </Paper>
    );
  }
}

export default withStyles(styles)(BigNumberDisplay);

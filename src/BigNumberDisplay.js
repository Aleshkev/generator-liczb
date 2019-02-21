import { withStyles } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import React, { Component } from "react";

const styles = theme => ({
  bigNumberPaper: {
    overflow: "hidden",

    height: "72vw",
    [theme.breakpoints.up("sm")]: {
      height: "36vw",
      [theme.breakpoints.up("xl")]: {
        height: 720
      }
    }
  },
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
    return this.props.chosenNumber !== null ? (
      <Paper className={classes.bigNumberPaper}>
        <Typography className={classes.bigNumberDisplay}>
          {this.props.chosenNumber !== null ? this.props.chosenNumber : ""}
        </Typography>
      </Paper>
    ) : null;
  }
}

export default withStyles(styles)(BigNumberDisplay);

import React, { Component } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Button from "@material-ui/core/Button";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ToggleButton from "@material-ui/lab/ToggleButton";
import { range } from "lodash";

import { generateNumber } from "./numberGenerator.js";

const styles = theme => ({
  main: {
    margin: theme.spacing.unit * 2
  },

  numbersContainer: {
    [theme.breakpoints.up("sm")]: {
      maxWidth: 4 * 48 + 2 * 24 + 2 * 12 // 4 * 48 (from 4 buttons in row) + 2 * 24 (ExpansionPanel padding) + 24 (Grid spacing)
    },
    paddingBottom: 0
  },
  numbersItem: {
    width: "100%",
    borderRadius: 0
  },
  numbersItemSelected: {
    color: `${theme.palette.primary.main} !important`,
    backgroundColor: `rgba(121, 134, 203, 0.2) !important` // I believe it's actually primary.light, but with alpha.
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
  },

  newNumberButton: {
    width: "100%",
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit
  },

  noBottomMargin: {
    marginBottom: 0
  }
});

class App extends Component {
  constructor() {
    super();

    this.state = {
      whitelist: range(1, 8),
      avoidRepetition: false,
      chosenNumbers: [-1]
    };
  }

  onWhitelistChange = i => {
    const whitelist = this.state.whitelist.slice();
    if (whitelist.indexOf(i) === -1) whitelist.push(i);
    else whitelist.splice(whitelist.indexOf(i), 1);
    this.setState({ whitelist: whitelist });
  };

  newNumber = () => {
    const x = generateNumber(
      this.state.whitelist.slice(),
      this.state.chosenNumbers.slice(),
      this.state.avoidRepetition
    );

    this.state.chosenNumbers.push(x);
    this.setState({ chosenNumbers: this.state.chosenNumbers });
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.main}>
        <CssBaseline />
        <Grid container spacing={16} direction="row" justify="center">
          <Grid item xs={12} sm={6} className={classes.numbersContainer}>
            <ExpansionPanel defaultExpanded={true}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                Zakres
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Grid
                  container
                  direction="column"
                  justify="center"
                  style={{ maxHeight: 32 * 10 }}
                >
                  {range(1, 41).map(i => (
                    <Grid item key={i}>
                      <ToggleButton
                        value={i}
                        selected={this.state.whitelist.indexOf(i) !== -1}
                        onChange={event => this.onWhitelistChange(i)}
                        classes={{
                          root: classes.numbersItem,
                          selected: classes.numbersItemSelected
                        }}
                      >
                        {i}
                      </ToggleButton>
                    </Grid>
                  ))}
                </Grid>
              </ExpansionPanelDetails>
            </ExpansionPanel>

            <ExpansionPanel classes={{ expanded: classes.noBottomMargin }}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                Ustawienia
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <FormControlLabel
                  control={
                    <Switch
                      checked={this.state.avoidRepetition}
                      onChange={() =>
                        this.setState({
                          avoidRepetition: !this.state.avoidRepetition
                        })
                      }
                    />
                  }
                  label="Unikaj powtórzeń"
                />
              </ExpansionPanelDetails>
            </ExpansionPanel>

            <Button
              disabled={this.state.whitelist.length < 2}
              onClick={this.newNumber}
              variant="contained"
              color="primary"
              className={classes.newNumberButton}
            >
              Nowy numer
            </Button>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Paper>
              <Typography className={classes.bigNumberDisplay}>
                {this.state.chosenNumbers.length > 1
                  ? this.state.chosenNumbers[
                      this.state.chosenNumbers.length - 1
                    ]
                  : ""}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(App);

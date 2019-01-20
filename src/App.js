import React, { Component } from "react";
import {
  CssBaseline,
  Button,
  Switch,
  FormControlLabel,
  Grid,
  Paper,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Typography
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { range, remove } from "lodash";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { ToggleButton } from "@material-ui/lab";
import * as Color from "color";

import weights from "./weights.js";
import generateNumber from "./numberGenerator.js";

const styles = theme => ({
  main: {
    margin: theme.spacing.unit * 2
  },

  numbersContainer: {
    [theme.breakpoints.up("sm")]: {
      maxWidth: 4 * 48 + 2 * 24 + 2 * 12 // 4 * 48 (from 4 buttons in row) + 2 * 24 (ExpansionPanel padding) + 24 (Grid spacing)
    }
  },
  numbersItem: {
    width: "100%",
    borderRadius: 0
  },
  numbersItemSelected: {
    color: `${theme.palette.primary.main} !important`,
    backgroundColor: `${Color(theme.palette.primary.light).alpha(
      0.2
    )} !important`
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

    this.n = 40;

    this.state = {
      whitelist: range(1, 30),
      avoidRepetition: false,
      chosenNumbers: [-1]
    };
  }

  onWhitelistChange = i => {
    const whitelist = this.state.whitelist.slice();
    if (whitelist.indexOf(i) == -1) whitelist.push(i);
    else whitelist.splice(whitelist.indexOf(i), 1);
    this.setState({ whitelist: whitelist });
  };

  newNumber = () => {
    const x = generateNumber(
      this.state.whitelist.slice(),
      this.state.chosenNumbers.slice(),
      weights,
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
                  {range(1, this.n + 1).map(i => (
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

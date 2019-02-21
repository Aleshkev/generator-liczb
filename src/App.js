import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import withStyles from "@material-ui/core/styles/withStyles";
import Switch from "@material-ui/core/Switch";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ToggleButton from "@material-ui/lab/ToggleButton";
import range from "lodash/range";
import sumBy from "lodash/sumBy";
import React, { Component } from "react";
import { generateNumber } from "./numberGenerator.js";
import BigNumberDisplay from "./BigNumberDisplay.js";

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

    let whitelist = [];
    for (let i = 0; i < 40; ++i) whitelist[i] = i < 29;

    this.state = {
      whitelist: whitelist,
      avoidRepetition: true,
      chosenNumber: null
    };
  }

  onWhitelistChange = (i, shift) => {
    const whitelist = this.state.whitelist.slice();

    if (shift) {
      for (let j = i - 1; j >= 0 && whitelist[i] === whitelist[j]; --j)
        whitelist[j] = !whitelist[j];
    }
    whitelist[i] = !whitelist[i];

    this.setState({ whitelist: whitelist });
  };

  newNumber = () => {
    const collapsedWhitelist = [];
    for (let i = 0; i < 40; ++i) {
      if (this.state.whitelist[i]) collapsedWhitelist.push(i + 1);
    }

    const x = generateNumber(collapsedWhitelist, this.state.avoidRepetition);

    this.setState({ chosenNumber: x });
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
                  {range(40).map(i => (
                    <Grid item key={i}>
                      <ToggleButton
                        value={i}
                        selected={this.state.whitelist[i]}
                        onChange={event => {
                          event.stopPropagation();
                          this.onWhitelistChange(i, event.shiftKey);
                        }}
                        classes={{
                          root: classes.numbersItem,
                          selected: classes.numbersItemSelected
                        }}
                      >
                        {i + 1}
                      </ToggleButton>
                    </Grid>
                  ))}
                </Grid>
              </ExpansionPanelDetails>
            </ExpansionPanel>

            <ExpansionPanel
              defaultExpanded={this.state.avoidRepetition}
              classes={{ expanded: classes.noBottomMargin }}
            >
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
              disabled={sumBy(this.state.whitelist) < 2}
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
              <BigNumberDisplay chosenNumber={this.state.chosenNumber} />
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(App);

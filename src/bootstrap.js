import { install } from '@material-ui/styles';

install();

// "It is recommended to place the above code in a separate file (e.g. bootstrap.js) and to import it in your application's entry point (e.g. index.js). This ensures that the installation is executed before anything else, because ECMAScript imports are hoisted to the top of the module. If the installation step is not performed correctly the resulting build could have conflicting class names."

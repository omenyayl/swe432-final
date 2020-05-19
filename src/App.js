import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import Container from "@material-ui/core/Container";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Alert from "@material-ui/lab/Alert";
import SnackBar from '@material-ui/core/Snackbar'
import axios from "axios";
import PropTypes from "prop-types";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Paper from "@material-ui/core/Paper";

const API = "https://olegs-tech.space/final";

const TruthTable = ({ truthList }) => {

    return (
        <div>
            {typeof truthList !== 'string' ?
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                {truthList[0].map(header => (
                                    <TableCell><strong>{header}</strong></TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {truthList.slice(1, truthList.length).map(r =>
                                (
                                    <TableRow>
                                        {r.map(c => (
                                            <TableCell component="th" scope="row">
                                                {c}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                )
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                :""
            }
        </div>
    )
};

TruthTable.propTypes = {
    truthList: PropTypes.array.isRequired
};

const App = () => {
    const [output, setOutput] = useState([[]]);
    const [expression, setExpression] = useState('');
    const [snackbarShown, setSnackbarShown] = useState(false);
    const [errorMessage, setErrorMessage] = useState("Please input a valid expression");

    function translateSyntax(expression) {
        expression = expression.replace(/(\s+(and)\s+)|(\s+(AND)\s+)|(\s+(\&)\s+)/g, " && ");
        expression = expression.replace(/(\s+(or)\s+)|(\s+(OR)\s+)|(\s+(\|)\s+)/g, " || ");
        return expression;
    }

    function onExecute(expression) {
        if (expression === null || expression === '') {
            setSnackbarShown(true);
            setErrorMessage("Please input an expression");
            return;
        }
        axios.post(API, { expression: translateSyntax(expression) })
            .then(res => {
                if (typeof res.data === 'string') {
                    setErrorMessage("Your expression is invalid");
                    setSnackbarShown(true);
                }
                setOutput(res.data);
            }).catch(e => console.error(e));
    }

    const handleClose = () => {
        setSnackbarShown(false);
    };

    return (
        <Container className="App">
            <h1>Boolean Expression Interpreter</h1>
            <Card className="card-content">
                <Typography color="textSecondary" gutterBottom>
                    Boolean Expression
                </Typography>
                <CardContent>
                    <div className="margin-1 align-left">
                        <strong>Input your expression below</strong>
                        <p>* Example: A && B && C || (D && E)</p>
                        <p>* use the following symbols for logical AND: and, AND, &, &&</p>
                        <p>* use the following symbols for logical OR: or, OR, |, ||</p>
                        <p>* Make sure to add spaces between logical operators and boolean variables</p>
                        <TextField
                            multiline={true}
                            helperText={"Expression"}
                            onChange={(e) => { setExpression(e.target.value) }}
                            fullWidth={true}/>
                    </div>
                </CardContent>
                <CardActions>
                    <Button variant={'contained'} color={"primary"} onClick={() => { onExecute(expression) }}>Execute</Button>
                </CardActions>
            </Card>
            <br/>
            <TruthTable truthList={output}/>
            <SnackBar
                open={snackbarShown}
                onClose={handleClose}
                autoHideDuration={3500}>
                <Alert severity="error">{errorMessage}</Alert>
            </SnackBar>
        </Container>
    );
};

export default App;

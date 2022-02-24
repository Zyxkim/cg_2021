import React from "react";

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {Container} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";

class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    field: "date",
                    width: 150,
                    headerName: "Дата"
                },
                {
                    field: "time",
                    width: 150,
                    headerName: "Время"
                },
                {
                    field: "path_1",
                    width: 250,
                    headerName: "Путь к карте высот"
                },
                {
                    field: "path_2",
                    width: 250,
                    headerName: "Путь к карте цветов"
                },
                {
                    field: "height_map",
                    headerName: "Карта 1",
                    width: 150,
                    renderCell: (params) => <img src={"http://localhost:6001/data/images/" + params.value}/>
                },
                {
                    field: "color_map",
                    headerName: "Карта 2",
                    width: 150,
                    renderCell: (params) => <img src={"http://localhost:6001/data/images/" + params.value}/>
                }
            ],
            rows: []
        };
    }

    componentDidMount() {
        fetch('http://localhost:8000/get_all_maps/'
        )
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                this.setState({
                    rows: data.data
                })
            });
    }

    handleGenerator = () => {
        window.open("http://localhost:3000/", "_self")
    };

    handleClear = () => {
        fetch('http://localhost:8000/clear_json/'
        )
            .then((response) => {
                return response.json()
            })
            .then(() => {
                window.open("http://localhost:3000/list", "_self")
            });
    };

    render() {
        return (
            <div>
                <Box sx={{flexGrow: 1}}>
                    <AppBar position="static">
                        <Toolbar>
                            <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                                Список рельефов
                            </Typography>
                            <Button color="inherit" onClick={this.handleGenerator}>Генератор</Button>
                            <Button color="inherit" onClick={this.handleClear}>Очистка</Button>
                        </Toolbar>
                    </AppBar>
                    <Container>
                        <div style={{height: 'calc(100vh - 64px)', width: '100%'}}>
                            {this.state.rows.length > 0 ? <DataGrid
                                rows={this.state.rows}
                                columns={this.state.columns}
                                rowHeight={150}
                                pageSize={5}
                                rowsPerPageOptions={[5]}
                                disableSelectionOnClick
                            /> : <DataGrid
                                rows={this.state.rows}
                                columns={this.state.columns}
                                rowHeight={150}
                                pageSize={5}
                                rowsPerPageOptions={[5]}
                                disableSelectionOnClick
                            />}
                        </div>
                    </Container>
                </Box>
            </div>
        )
    }
}

export default List
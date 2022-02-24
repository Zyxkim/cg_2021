import React, {Suspense} from "react";
import {Canvas, useLoader} from "react-three-fiber";
import * as THREE from "three";
import {Plane, OrbitControls} from "drei";

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {ButtonBase, Grid, Paper, Slider} from "@mui/material";

const Terrain = (props) => {
    const queryParams = new URLSearchParams(window.location.search);
    const height_value = queryParams.get('height');
    const hm = "http://localhost:6001/data/images/" + queryParams.get('hm');
    const cm = "http://localhost:6001/data/images/" + queryParams.get('cm');

    const height = useLoader(THREE.TextureLoader, hm);
    const colors = useLoader(THREE.TextureLoader, cm);

    console.log(hm)
    return (
        <group>
            <Plane
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, 0, 0]}
                args={[32, 32, 128, 128]}
            >
                <meshStandardMaterial
                    attach="material"
                    color="white"
                    map={colors}
                    metalness={0.2}
                    displacementScale={height_value ? height_value * -1 : 1}
                    displacementMap={height}
                />
            </Plane>
        </group>
    );
};

class Generator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            size: new URLSearchParams(window.location.search).get('size') ? new URLSearchParams(window.location.search).get('size') : 128,
            seed: new URLSearchParams(window.location.search).get('seed') ? new URLSearchParams(window.location.search).get('seed') : 0,
            octaves: new URLSearchParams(window.location.search).get('octaves') ? new URLSearchParams(window.location.search).get('octaves') : 1,
            persistance: new URLSearchParams(window.location.search).get('persistence') ? new URLSearchParams(window.location.search).get('persistence') : 0.5,
            lacunarity: new URLSearchParams(window.location.search).get('lacunarity') ? new URLSearchParams(window.location.search).get('lacunarity') : 2,
            height: new URLSearchParams(window.location.search).get('height') ? new URLSearchParams(window.location.search).get('height') : 1,
            scale: new URLSearchParams(window.location.search).get('scale') ? new URLSearchParams(window.location.search).get('scale') : 1,
            region: new URLSearchParams(window.location.search).get('region') ? new URLSearchParams(window.location.search).get('region') : 1,
            interpolation: new URLSearchParams(window.location.search).get('interpolation') ? new URLSearchParams(window.location.search).get('interpolation') : 0,
            hm: new URLSearchParams(window.location.search).get('hm') ? new URLSearchParams(window.location.search).get('hm') : "",
            cm: new URLSearchParams(window.location.search).get('cm') ? new URLSearchParams(window.location.search).get('cm') : ""
        };
    }

    handleHeightChange = (event, newValue) => {
        this.state.height = newValue
    };

    handleSizeChange = (event, newValue) => {
        this.state.size = newValue
    };

    handleSeedChange = (event, newValue) => {
        this.state.seed = newValue
    };

    handleOctavesChange = (event, newValue) => {
        this.state.octaves = newValue
    };

    handlePersChange = (event, newValue) => {
        this.state.persistance = newValue
    };

    handleLacChange = (event, newValue) => {
        this.state.lacunarity = newValue
    };

    handleScaleChange = (event, newValue) => {
        this.state.scale = newValue
    };

    handleRegionChange = (event, newValue) => {
        this.state.region = newValue
    };

    handleIntChange = (event, newValue) => {
        this.state.interpolation = newValue
    };

    handleClick = (event) => {
        event.preventDefault()
        fetch('http://localhost:8000/get_noise_map/' +
            "?size=" + this.state.size +
            "&seed=" + this.state.seed +
            "&octaves=" + this.state.octaves +
            "&persistence=" + this.state.persistance +
            "&scale=" + this.state.scale +
            "&region=" + this.state.region +
            "&interpolation=" + this.state.interpolation +
            "&lacunarity=" + this.state.lacunarity
        )
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                console.log(data.data)
                window.open("http://localhost:3000/?height=" + this.state.height +
                    "&size=" + this.state.size +
                    "&seed=" + this.state.seed +
                    "&octaves=" + this.state.octaves +
                    "&persistence=" + this.state.persistance +
                    "&lacunarity=" + this.state.lacunarity +
                    "&scale=" + this.state.scale +
                    "&region=" + this.state.region +
                    "&interpolation=" + this.state.interpolation +
                    "&hm=" + data.data.noise +
                    "&cm=" + data.data.color
                    , "_self")
            });
    }

    handleList = () => {
        window.open("http://localhost:3000/list", "_self")
    };


    render() {
        return (
            <div>
                <Box sx={{flexGrow: 1}}>
                    <AppBar position="static">
                        <Toolbar>
                            <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                                Генератор
                            </Typography>
                            <Button color="inherit" onClick={this.handleList}>Список</Button>
                        </Toolbar>
                    </AppBar>
                </Box>
                <Grid container>
                    <Grid item xs={3}>
                        <Paper
                            variant="outlined"
                            square
                            sx={{
                                p: 2,
                                margin: 0,
                                flexGrow: 1,
                                backgroundColor: (theme) =>
                                    theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
                            }}
                        >
                            <div className="inner_container">
                                <Typography variant="body2" gutterBottom>
                                    Size
                                    <Slider
                                        aria-label="Small steps"
                                        onChange={this.handleSizeChange}
                                        defaultValue={new URLSearchParams(window.location.search).get('size') ? new URLSearchParams(window.location.search).get('size') : 128}
                                        step={100}
                                        marks
                                        min={128}
                                        max={2048}
                                        valueLabelDisplay="auto"
                                    />
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    Scale
                                    <Slider
                                        aria-label="Small steps"
                                        onChange={this.handleScaleChange}
                                        defaultValue={new URLSearchParams(window.location.search).get('scale') ? new URLSearchParams(window.location.search).get('scale') : 1}
                                        step={1}
                                        marks
                                        min={1}
                                        max={10}
                                        valueLabelDisplay="auto"
                                    />
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    Region
                                    <Slider
                                        aria-label="Small steps"
                                        onChange={this.handleRegionChange}
                                        defaultValue={new URLSearchParams(window.location.search).get('region') ? new URLSearchParams(window.location.search).get('region') : 1}
                                        step={0.1}
                                        marks
                                        min={0}
                                        max={1}
                                        valueLabelDisplay="auto"
                                    />
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    Seed
                                    <Slider
                                        aria-label="Small steps"
                                        onChange={this.handleSeedChange}
                                        defaultValue={new URLSearchParams(window.location.search).get('seed') ? new URLSearchParams(window.location.search).get('seed') : 0}
                                        step={1}
                                        marks
                                        min={0}
                                        max={10}
                                        valueLabelDisplay="auto"
                                    />
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    Octaves
                                    <Slider
                                        aria-label="Small steps"
                                        onChange={this.handleOctavesChange}
                                        defaultValue={new URLSearchParams(window.location.search).get('octaves') ? new URLSearchParams(window.location.search).get('octaves') : 1}
                                        step={1}
                                        marks
                                        min={0}
                                        max={5}
                                        valueLabelDisplay="auto"
                                    />
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    Persistence
                                    <Slider
                                        aria-label="Small steps"
                                        onChange={this.handlePersChange}
                                        defaultValue={new URLSearchParams(window.location.search).get('persistence') ? new URLSearchParams(window.location.search).get('persistence') : 0.5}
                                        step={0.1}
                                        marks
                                        min={0}
                                        max={1}
                                        valueLabelDisplay="auto"
                                    />
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    Lacunarity
                                    <Slider
                                        aria-label="Small steps"
                                        onChange={this.handleLacChange}
                                        defaultValue={new URLSearchParams(window.location.search).get('lacunarity') ? new URLSearchParams(window.location.search).get('lacunarity') : 2}
                                        step={0.5}
                                        marks
                                        min={0}
                                        max={2}
                                        valueLabelDisplay="auto"
                                    />
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    Height
                                    <Slider
                                        onChange={this.handleHeightChange}
                                        aria-label="Small steps"
                                        defaultValue={new URLSearchParams(window.location.search).get('height') ? new URLSearchParams(window.location.search).get('height') : 1}
                                        step={1}
                                        marks
                                        min={1}
                                        max={30}
                                        valueLabelDisplay="auto"
                                    />
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    Interpolation (Linear - Cos)
                                    <Slider
                                        onChange={this.handleIntChange}
                                        aria-label="Small steps"
                                        defaultValue={new URLSearchParams(window.location.search).get('interpolation') ? new URLSearchParams(window.location.search).get('interpolation') : 0}
                                        step={1}
                                        marks
                                        min={0}
                                        max={1}
                                        valueLabelDisplay="auto"
                                    />
                                </Typography>
                                <Button variant="contained" onClick={this.handleClick}>Генерация</Button>
                                {/*
                                <Typography variant="body2" gutterBottom>
                                    Вода
                                </Typography>
                                <div className="water"/>
                                <Typography variant="body2" gutterBottom>
                                    Песок
                                </Typography>
                                <div className="sand"/>
                                <Typography variant="body2" gutterBottom>
                                    Трава
                                </Typography>
                                <div className="grass"/>
                                <Typography variant="body2" gutterBottom>
                                    Горы
                                </Typography>
                                <div className="mountain"/>*/}
                            </div>
                        </Paper>
                    </Grid>
                    <Grid item xs={2}>
                        <Paper
                            variant="outlined"
                            square
                            sx={{
                                p: 2,
                                margin: 0,
                                flexGrow: 1,
                                backgroundColor: (theme) =>
                                    theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
                            }}
                        >
                            <div className="inner_container">
                                <ButtonBase sx={{width: 208, height: 208}}>
                                    <img
                                        className="generator_image"
                                        src={"http://localhost:6001/data/images/" + this.state.hm}
                                        alt="heightmap"
                                        loading="lazy"
                                    />
                                </ButtonBase>
                                <p></p>
                                <ButtonBase sx={{width: 208, height: 208}}>
                                    <img
                                        className="generator_image"
                                        src={"http://localhost:6001/data/images/" + this.state.cm}
                                        alt="colormap"
                                        loading="lazy"
                                    />
                                </ButtonBase>
                                <Typography gutterBottom variant="subtitle1" component="div">
                                    Карта высот и цветов:
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    {this.state.hm ? this.state.hm : "-"}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    {this.state.cm ? this.state.cm : "-"}
                                </Typography>
                            </div>
                        </Paper>
                    </Grid>
                    <Grid item xs={7}>
                        <Paper
                            variant="outlined"
                            square
                            sx={{
                                p: 2,
                                margin: 0,
                                flexGrow: 1,
                                backgroundColor: (theme) =>
                                    theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
                            }}
                        >
                            <div className="my_canvas">
                                <Canvas>
                                    <color attach="background" args={"black"}/>
                                    <OrbitControls/>
                                    <pointLight intensity={2} position={[7, 5, 1]}/>
                                    <Suspense fallback={null}>
                                        <Terrain
                                            height={this.state.height}
                                        />
                                    </Suspense>
                                </Canvas>
                            </div>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default Generator
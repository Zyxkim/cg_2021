import json

from fastapi import FastAPI
from matplotlib import pyplot as plt
import datetime
import numpy as np

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

STORAGE = "../storage/data/images/"
JSON = "../storage/data/data.json"


@app.get("/")
async def root():
    return {"message": "Coursework, CG."}


permutation = [151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36,
               103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0,
               26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56,
               87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166,
               77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55,
               46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132,
               187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109,
               198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126,
               255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183,
               170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43,
               172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112,
               104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162,
               241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106,
               157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205,
               93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180]


def perlin(x, y, seed, scale, interpolation):
    np.random.seed(seed)
    p = np.array(permutation)
    np.random.shuffle(p)

    x = x / scale
    y = y / scale
    x_in = x.astype(int) % 255
    y_in = y.astype(int) % 255
    x_left = x - x_in
    y_left = y - y_in

    n0 = gradient(p[(p[x_in] + y_in) % 255], x_left, y_left)
    n1 = gradient(p[(p[x_in] + y_in + 1) % 255], x_left, y_left - 1)
    n2 = gradient(p[(p[x_in + 1] + y_in + 1) % 255], x_left - 1, y_left - 1)
    n3 = gradient(p[(p[x_in + 1] + y_in) % 255], x_left - 1, y_left)
    fade_x = fade(x_left)
    fade_y = fade(y_left)

    if interpolation == 1:
        return cos_interpolation(cos_interpolation(n0, n3, fade_x), cos_interpolation(n1, n2, fade_x), fade_y)
    else:
        return interpolation(interpolation(n0, n3, fade_x), interpolation(n1, n2, fade_x), fade_y)


def cos_interpolation(a, b, x):
    f = (1 - np.cos(x * np.pi)) / 2
    return a + (b - a) * f


def interpolation(a, b, x):
    return a + x * (b - a)
    # return a + (3.0 - x * 2.0) * x * x * (b - a)
    # return a + (b - a) * ((x * (x * 6.0 - 15.0) + 10.0) * x * x * x)

def fade(t):
    return 6 * t ** 5 - 15 * t ** 4 + 10 * t ** 3


def gradient(h, x, y):
    vectors = np.array([[0, 1], [1, 0], [0, -1], [-1, 0]])
    g0 = np.array([elem[:, 0] for elem in vectors[h % 4]])
    g1 = np.array([elem[:, 1] for elem in vectors[h % 4]])
    grad = g0 * x + g1 * y
    return grad


def add_color(height_map, size):
    color_map = np.zeros((size, size, 3))
    for i in range(size):
        for j in range(size):
            if height_map[i][j] < -0.2:
                color_map[i][j] = water
            elif height_map[i][j] < -0.1:
                color_map[i][j] = beach
            elif height_map[i][j] < 0.1:
                color_map[i][j] = plain
            elif height_map[i][j] < 0.4:
                color_map[i][j] = mountain
            elif height_map[i][j] < 1.0:
                color_map[i][j] = snow
    return color_map


'''frequency = 1
seed = 1
size = 1024'''

snow_cap = 1
mountain_cap = 1
plain_cap = 1
beach_cap = 1
water_cap = 1

water = [0, 0.3, 0.5]
plain = [0, 0.5, 0.2]
beach = [0.7, 0.6, 0.5]
snow = [1, 1, 1]
mountain = [0.3, 0.2, 0.1]


@app.get("/get_noise_map/")
async def get_noise_map(size: int = 1024, seed: int = 0, octaves: int = 1,
                        persistence: float = 0.5, lacunarity: float = 2,
                        region: float = 1, scale: int = 1, interpolation: int = 0):
    lin = np.linspace(1, 10, size, endpoint=False)
    x, y = np.meshgrid(lin, lin)

    noise = np.zeros((size, size))
    frequency = 1
    amplitude = 1

    for _ in range(octaves):
        noise += amplitude * perlin(frequency * x, frequency * y, seed, scale, interpolation)
        frequency *= lacunarity
        amplitude *= persistence

    noise *= region

    color_world = add_color(noise, size)

    date_time = datetime.datetime.now()
    string_date_time = date_time.strftime("%m-%d-%Y_%H-%M-%S")
    string_date = date_time.strftime("%m.%d.%Y")
    string_time = date_time.strftime("%H:%M")

    noise_file = STORAGE + string_date_time + ".png"
    color_file = STORAGE + "color_" + string_date_time + ".png"

    noise_file_name = string_date_time + ".png"
    color_file_name = "color_" + string_date_time + ".png"

    plt.imsave(noise_file, noise, cmap="Greys")
    plt.imsave(color_file, color_world)

    new_data = {
        'date': string_date,
        'time': string_time,
        'height_map': noise_file_name,
        'color_map': color_file_name,
        'path_1': noise_file_name,
        "path_2": color_file_name
    }

    opened_json = open(JSON, "r")
    json_data = json.load(opened_json)
    opened_json.close()
    json_data['data'].append(new_data)

    opened_json = open(JSON, "w")
    opened_json.write(json.dumps(json_data))
    opened_json.close()

    # return FileResponse(color_file, noise_file)
    return {'data': {'noise': noise_file_name, 'color': color_file_name}}


@app.get("/get_all_maps/")
async def get_all_maps():
    opened_json = open(JSON, "r")
    json_data = json.load(opened_json)
    opened_json.close()

    for i in range(len(json_data['data'])):
        json_data['data'][i]['id'] = i
    return json_data


@app.get("/clear_json/")
async def clear_json():
    new_data = {
        'data': []
    }
    opened_json = open(JSON, "w")
    opened_json.write(json.dumps(new_data))
    opened_json.close()
    return new_data

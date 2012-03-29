/*
Copyright 2011 Adobe Systems, incorporated
This work is licensed under a Creative Commons Attribution-Noncommercial-Share Alike 3.0 Unported License http://creativecommons.org/licenses/by-nc-sa/3.0/ . 
Permissions beyond the scope of this license, pertaining to the examples of code included within this work are available at Adobe http://www.adobe.com/communities/guidelines/ccplus/commercialcode_plus_permission.html .
*/

(function () {
	
function color() {
	return {
		type: 'color',
		mixer: mixVector,
		generator: generateVector
	};
}

function transform() {
    return {
        type: 'transform',
        generator: generateTransform,
        mixer: mixHash(mixNumber)
    };
}

function range(min, max, step) {
    return {
        type: 'range',
        min: min,
        max: max,
        step: step
    };
}

function checkbox() {
    return range(0, 1, 1);
}

function normalAmountConfig (defaultValue, min, max, step) {
	if (min === undefined) {
		min = 0.0;
	}
	
	if (max === undefined) {
		max = 0.0;
	}
	
	if (defaultValue === undefined) {
		defaultValue = (max - min) / 2;
	}
	
	if (step === undefined) {
		step = (max - min) / 100;
	}
	
	return {
	    params: {
	        amount: defaultValue
	    },
	    config: {
	        amount: range(min, max, step)
	    }
	};
};
window.filterMargins = "50px 100px 200px 50px";
window.filterConfigs = {
    'drop-shadow': {
        hasVertex: true,
        hasFragment: true,
        params: {
            radius: 5.0,
            offset_x: 5.0,
            offset_y: 5.0,
            flood_color: [0.0, 0.0, 0.0, 0.5]
        },
        config: {
            radius: range(1, 10, 0.01),
            offset_x: range(0, 20, 0.01),
            offset_y: range(0, 20, 0.01),
            flood_color: color()
        }
    },
    gamma: {
        params: {
            amplitude: 1.0,
            exponent: 1.0,
            offset: 0.0
        },
        config: {
            amplitude: range(0, 10, 0.01),
            exponent: range(0.0, 5.0, 0.01),
            offset: range(0, 1.0, 0.01)
        }
    },
    "gaussian-horiz": {
        params: {
            deviation: 3.0
        },
        config: {
            deviation: {
                type: 'range',
                min: 0,
                max: 10,
                step: 1,
                generator: generateBlurKernel
            }
        }
    },
    
    "gaussian-vert": {
        params: {
            deviation: 3.0
        },
        config: {
            deviation: {
                type: 'range',
                min: 0,
                max: 10,
                step: 1,
                generator: generateBlurKernel
            }
        }
    },
    grayscale: normalAmountConfig(0.5),
    dissolve: normalAmountConfig(0.25, 0, 1, 0.001),
    'hue-rotate': {
        params: {
            angle: 180
        },
        config: {
            angle: range(0, 360, 0.01)
        }
    },
    invert: normalAmountConfig(1),
    opacity: normalAmountConfig(0.25),
    saturate: normalAmountConfig(0.5, 0, 5),
	sepia: normalAmountConfig(0.5),
	sharpen: {
		params: {
			radius: 5.0,
			amount: 0.5
		},
		config: {
			radius: range(0.0, 10.0, 0.01),
			amount: range(0.0, 1.0, 0.01)
		}
	},
	burn: {
	    params: {
	        t: 0.5,
	        sampler3: "texture(url(images/burn-texture.png))"
	    },
	    config: {
	        t: range(0.0, 1.5, 0.01),
	        sampler3: {
	            type: 'unknown',
	            value: "texture(url(images/burn-texture.png))"
	        }
	    }
	},
	warp: {
	    hasVertex: true,
	    hasFragment: true,
	    mesh: "20 20",
	    meshBox: "border-box",
	    params: {
	        k: generateWarpPoints(),
	        matrix: {
	            rotationX: 0,
	            rotationY: 0,
	            rotationZ: 0
	        },
	        factor: [1, 1, 2, 6],
	        useColoredBack: 1,
	        backColor: [1.0, 1.0, 1.0, 1.0],
	    },
	    config: {
	        k: {
	            type: 'controlPoints',
	            generator: generateWarpArray,
	            mixer: mixVectorOfVectors
	        },
	        factor: {
	            type: 'hidden',
	            generator: generateFilterArray,
	            mixer: dontMix
	        },
	        matrix: transform(),
	        useColoredBack: checkbox(),
	        backColor: color(),
	    }
	},
	"rolling-scroll": {
	    hasVertex: true,
	    hasFragment: true,
	    mesh: "500 1",
	    meshBox: "border-box",
	    params: {
	        matrix: {
	            rotationX: 0,
	            rotationY: 0,
	            rotationZ: 0
	        },
	        rollRatio: 0,
	        initialRollSize: 0.01,
	        rollSeparation: 0.005,
	        depth: 500,
	        useColoredBack: 1,
	        backColor: [1.0, 1.0, 1.0, 1.0],
	    },
	    config: {
	        matrix: transform(),
	        rollRatio: range(0, 1, 0.01),
	        initialRollSize: range(0, 0.1, 0.0001),
	        rollSeparation: range(0, 0.1, 0.0001),
	        depth: range(0, 2000, 1),
	        useColoredBack: checkbox(),
	        backColor: color(),
	    }
	},
	"fold": {
	    hasVertex: true,
	    hasFragment: true,
	    mesh: "40 7",
	    meshBox: "border-box",
	    params: {
	        matrix: {
	            rotationX: 0,
	            rotationY: 0,
	            rotationZ: 0
	        },
	        t: 0,
	        spins: 0.5,
	        phase: 0,
	        mapDepth: 50,
	        mapCurve: 0.09,
	        minSpacing: 0.15,
	        useColoredBack: 1,
	        backColor: [1.0, 1.0, 1.0, 1.0],
	    },
	    config: {
	        matrix: transform(),
	        t: range(0, 1, 0.01),
	        spins: range(0.5, 10, 0.01),
	        phase: range(-3.14, 3.14, 0.001),
	        mapDepth: range(0.0, 100, 0.01),
	        mapCurve: range(-0.5, 0.5, 0.001),
	        minSpacing: range(0, 0.5, 0.001),
	        useColoredBack: checkbox(),
	        backColor: color(),
	    }
	},
	"quad-shuffle": {
	    hasVertex: true,
	    hasFragment: true,
	    mesh: "100 100",
	    meshBox: "border-box detached",
        useColoredBack: 0,
	    params: {
	        matrix: {
	            rotationX: 20,
	            rotationY: 20,
	            rotationZ: 20
	        },
	        perspective: 1000,
	        amount: 10,
	        t: 0
	    },
	    config: {
	        matrix: transform(),
	        perspective: range(200, 2000, 100),
	        amount: range(0, 500, 10),
	        t: range(0, 1, 0.01)
	    }
	},
	"quad-explosion": {
	    hasVertex: true,
	    hasFragment: true,
	    mesh: "76 100",
	    meshBox: "border-box detached",
	    params: {
	        matrix: {
	            rotationX: 0,
	            rotationY: 0,
	            rotationZ: 0
	        },
	        perspective: 1000,
	        amount: 1.5,
	        rotateAngleX: 0,
	        rotateAngleY: 0,
	        rotateAngleZ: 0,
	        centerX: 0.5,
	        centerY: 0.5,
	        t: 0.5,
	        fade: 0.7
	    },
	    config: {
	        matrix: transform(),
	        perspective: range(200, 2000, 100),
	        amount: range(1, 5, 0.1),
	        rotateAngleX: range(-180, 180, 0.001),
	        rotateAngleY: range(-180, 180, 0.001),
	        rotateAngleZ: range(-180, 180, 0.001),
	        centerX: range(-1, 2, 0.001),
	        centerY: range(-1, 2, 0.001),
	        t: range(0, 1, 0.01),
	        fade: range(0, 1, 0.01)
	    }
	}
};
})()
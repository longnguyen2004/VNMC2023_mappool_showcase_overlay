import type { EmitterContainer } from "tsparticles-plugin-emitters";

export const emitterConfig: Parameters<EmitterContainer["addEmitter"]>[0] =
{
    size: {
        width: 0, height: 0
    },
    rate: {
        quantity: 5,
        delay: 0.01
    },
    fill: false,
    particles: {
        shape: {
            type: "line",
            options: {
                square: {
                    fill: false
                }
            }
        },
        color: {
            value: [
                "#7f3d3d", "#a54f4f", "#cb6161",
                "#f27d0c", "#f07f13", "#ffe808", "#ff0000",
                "#ffffff"
            ]
        },
        size: {
            value: {
                min: 1,
                max: 50
            },
            animation: {
                enable: true,
                speed: 100,
                startValue: "max",
                destroy: "min"
            }
        },
        rotate: {
            path: true
        },
        stroke: {
            width: 1
        },
        opacity: {
            value: {
                min: 0.5,
                max: 1
            }
        },
        move: {
            enable: true,
            speed: {
                min: 1,
                max: 3
            },
            outModes: "destroy" as const,
        },
        life: {
            count: 1,
            duration: {
                value: {
                    min: 4,
                    max: 10
                }
            }
        }
    }
};

export const containerConfig = {
    emitters: []
};

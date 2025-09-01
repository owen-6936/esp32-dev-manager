export interface PinConfig {
    pin: number;
    function: string;
    component: string;
    project: string;
    mode:
        | "GPIO"
        | "input"
        | "output"
        | "PWM"
        | "ADC"
        | "DAC"
        | "I2C"
        | "SPI"
        | "UART"
        | "other";
}

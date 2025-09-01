// Enum to define pin functionalities for better readability
export enum PinFunction {
    GPIO_PIN = "GPIO_PIN",
    ADC_PIN = "ADC_PIN",
    I2C_SDA_PIN = "I2C_SDA_PIN",
    I2C_SCL_PIN = "I2C_SCL_PIN",
    SPI_MOSI_PIN = "SPI_MOSI_PIN",
    SPI_MISO_PIN = "SPI_MISO_PIN",
    SPI_SCK_PIN = "SPI_SCK_PIN",
    UART_RX_PIN = "UART_RX_PIN",
    UART_TX_PIN = "UART_TX_PIN",
    USB_JTAG_PIN = "USB_JTAG_PIN",
    STRAPPING_PIN = "STRAPPING_PIN",
}

// Interface to define the structure of a pin configuration object
export interface PinConfig {
    pinNumber: number;
    function: PinFunction;
    description: string;
}

// Array of PinConfig objects for the ESP32-S3
export const esp32s3Pins: PinConfig[] = [
    {
        pinNumber: 0,
        function: PinFunction.STRAPPING_PIN,
        description: "Bootstrapping pin, do not use",
    },
    { pinNumber: 1, function: PinFunction.ADC_PIN, description: "ADC1_CH0" },
    { pinNumber: 2, function: PinFunction.ADC_PIN, description: "ADC1_CH1" },
    {
        pinNumber: 3,
        function: PinFunction.STRAPPING_PIN,
        description: "Bootstrapping pin, do not use",
    },
    { pinNumber: 4, function: PinFunction.ADC_PIN, description: "ADC1_CH3" },
    { pinNumber: 5, function: PinFunction.ADC_PIN, description: "ADC1_CH4" },
    { pinNumber: 6, function: PinFunction.ADC_PIN, description: "ADC1_CH5" },
    { pinNumber: 7, function: PinFunction.ADC_PIN, description: "ADC1_CH6" },
    {
        pinNumber: 8,
        function: PinFunction.I2C_SDA_PIN,
        description: "I2C SDA (default)",
    },
    {
        pinNumber: 9,
        function: PinFunction.I2C_SCL_PIN,
        description: "I2C SCL (default)",
    },
    { pinNumber: 10, function: PinFunction.ADC_PIN, description: "ADC1_CH9" },
    { pinNumber: 11, function: PinFunction.ADC_PIN, description: "ADC2_CH0" },
    { pinNumber: 12, function: PinFunction.ADC_PIN, description: "ADC2_CH1" },
    { pinNumber: 13, function: PinFunction.ADC_PIN, description: "ADC2_CH2" },
    { pinNumber: 14, function: PinFunction.ADC_PIN, description: "ADC2_CH3" },
    { pinNumber: 15, function: PinFunction.ADC_PIN, description: "ADC2_CH4" },
    { pinNumber: 16, function: PinFunction.ADC_PIN, description: "ADC2_CH5" },
    { pinNumber: 17, function: PinFunction.ADC_PIN, description: "ADC2_CH6" },
    { pinNumber: 18, function: PinFunction.ADC_PIN, description: "ADC2_CH7" },
    {
        pinNumber: 19,
        function: PinFunction.USB_JTAG_PIN,
        description: "USB D- (default)",
    },
    {
        pinNumber: 20,
        function: PinFunction.USB_JTAG_PIN,
        description: "USB D+ (default)",
    },
    {
        pinNumber: 21,
        function: PinFunction.GPIO_PIN,
        description: "General Purpose I/O",
    },
    {
        pinNumber: 26,
        function: PinFunction.SPI_MOSI_PIN,
        description: "SPI0/1, connected to Flash",
    },
    {
        pinNumber: 27,
        function: PinFunction.SPI_MISO_PIN,
        description: "SPI0/1, connected to Flash",
    },
    {
        pinNumber: 28,
        function: PinFunction.GPIO_PIN,
        description: "General Purpose I/O",
    },
    {
        pinNumber: 29,
        function: PinFunction.GPIO_PIN,
        description: "General Purpose I/O",
    },
    {
        pinNumber: 30,
        function: PinFunction.GPIO_PIN,
        description: "General Purpose I/O",
    },
    {
        pinNumber: 31,
        function: PinFunction.GPIO_PIN,
        description: "General Purpose I/O",
    },
    {
        pinNumber: 32,
        function: PinFunction.GPIO_PIN,
        description: "General Purpose I/O",
    },
    {
        pinNumber: 33,
        function: PinFunction.GPIO_PIN,
        description: "General Purpose I/O (can be used for PSRAM)",
    },
    {
        pinNumber: 34,
        function: PinFunction.GPIO_PIN,
        description: "General Purpose I/O (can be used for PSRAM)",
    },
    {
        pinNumber: 35,
        function: PinFunction.GPIO_PIN,
        description: "General Purpose I/O (can be used for PSRAM)",
    },
    {
        pinNumber: 36,
        function: PinFunction.GPIO_PIN,
        description: "General Purpose I/O (can be used for PSRAM)",
    },
    {
        pinNumber: 37,
        function: PinFunction.GPIO_PIN,
        description: "General Purpose I/O (can be used for PSRAM)",
    },
    {
        pinNumber: 38,
        function: PinFunction.GPIO_PIN,
        description: "General Purpose I/O",
    },
    {
        pinNumber: 39,
        function: PinFunction.GPIO_PIN,
        description: "General Purpose I/O",
    },
    {
        pinNumber: 40,
        function: PinFunction.GPIO_PIN,
        description: "General Purpose I/O",
    },
    {
        pinNumber: 41,
        function: PinFunction.GPIO_PIN,
        description: "General Purpose I/O",
    },
    {
        pinNumber: 42,
        function: PinFunction.GPIO_PIN,
        description: "General Purpose I/O",
    },
    {
        pinNumber: 43,
        function: PinFunction.UART_RX_PIN,
        description: "UART0 RX (default)",
    },
    {
        pinNumber: 44,
        function: PinFunction.UART_TX_PIN,
        description: "UART0 TX (default)",
    },
    {
        pinNumber: 45,
        function: PinFunction.STRAPPING_PIN,
        description: "Bootstrapping pin, do not use",
    },
    {
        pinNumber: 46,
        function: PinFunction.STRAPPING_PIN,
        description: "Bootstrapping pin, do not use",
    },
    {
        pinNumber: 47,
        function: PinFunction.GPIO_PIN,
        description: "General Purpose I/O",
    },
    {
        pinNumber: 48,
        function: PinFunction.GPIO_PIN,
        description: "General Purpose I/O",
    },
];

const SerialPort = require("serialport");
const BafangParser = require("./bafang-parser");

if (process.argv.length < 4) {
    console.log("Usage:\n$ node app.js /dev/ttyUSB0 /dev/ttyUSB1\nwhere /dev/ttyUSB0 is a serial port connected to "
    + "the motor,\nand /dev/ttyUSB1 is the port connected to display");
    process.exit(1);
}

const MOTOR_PORT_NAME = process.argv[2]
const DISPLAY_PORT_NAME = process.argv[3];

const startProxy = (motorPortName, displayPortName) => {
	const motorStack = [];
	const displayStack = [];

    const motorPort = new SerialPort(motorPortName, {
        baudRate: 1200,
        autoOpen: false,
    });

    const displayPort = new SerialPort(displayPortName, {
        baudRate: 1200,
        autoOpen: false,
    });

    motorPort.open((error) => {
        if (error) {
            return console.log("Error opening port: ", error.message)
        }
        console.log("Motor Port Ready!")
    });

    displayPort.open((error) => {
        if (error) {
            return console.log("Error opening port: ", error.message)
        }
        console.log("Display Port Ready!")
    })

    const motorParser = new BafangParser({length: 1});
    const displayParser = new BafangParser({length: 1});

    motorPort.pipe(motorParser);
    displayPort.pipe(displayParser);

    motorParser.on("data", async(data) => {
    	motorStack.push(Array.from(data)[0]);
    	if (displayStack.length > 0) {
			console.log("D:", Array.from(displayStack).map((byte) => byte.toString(16)).join(" "));
			displayStack.length = 0;
		}
        displayPort.write(Array.from(data));
    });

    displayParser.on("data", async (data) => {
		displayStack.push(Array.from(data)[0]);
		if (motorStack.length > 0) {
			console.log("M:", Array.from(motorStack).map((byte) => byte.toString(16)).join(" "));
			motorStack.length = 0;
		}
        motorPort.write(Array.from(data));
    });
};

startProxy(MOTOR_PORT_NAME, DISPLAY_PORT_NAME);

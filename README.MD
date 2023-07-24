# After Effects LED Animation Exporter 💡

This tool is a JavaScript script designed to export LED animations from an Adobe After Effects project that you can then use on your embedded projects for Raspberry Pi, Arduino and other small devices with lots of LEDs that can light up and animate. It is simple to use allowing for a high level of control and customization of your device's LEDs. Anthing that you can animate in After Effects using an object that changes colour over time can be used so long as you following the prescribed project format. It is easy to making pulsing, glowing, rapidly flashing sequences, or sequences that have a trail like in Knight Rider or a Cylon. The script will output the animation data in a variety of formats, e.g. JSON and C++ source code, with no configuration necessary.

## Prerequisites 📋

This script requires **Adobe After Effects CC 2019 (v16)** or later versions.

## How It Works 🛠️

Once executed within the After Effects environment, the script analyzes your LED animation project and exports the animations in the specified format. Additionally, it generates a detailed log file for every action taken during the export process, making it easy for you to follow along and troubleshoot any issues.

## Running the Script 🏃‍♂️

Here's how to use the script:

1. Open your After Effects LED animation project.
2. Navigate to `File > Scripts > Run Script...`.
3. Choose the script from your file system.
4. The script will run automatically.
5. After completion, the output files will be created in the same location where the script was run.
6. A log file is also generated, providing insights into each step the script performed.

## Attached Project File 📁

This repository also includes a .aep (Adobe After Effects Project) file as a sample. It presents interesting LED animations and provides an example of how to set up your own After Effects project for similar exports.

## Source Code 📚

The source code for the script, written in JavaScript, is included in this repository. Feel free to explore it and modify the script according to your specific needs.

## Function Descriptions

ere's a high-level overview:

1. `componentScalarToHexByte(c, prefix)` & `componentScalarToHexByteCpp(c)`: Convert a color component scalar value to a hexadecimal byte, optionally with a prefix. The `Cpp` variant is meant for a C++ target project.

2. `toHexByte(i, prefix)` & `toHexByteCpp(i)`: Convert a value to a hexadecimal byte, optionally with a prefix.

3. `logStart()`, `log(msg)`, `logEnd()`: These functions manage the logging process. `logStart()` initializes the log, `log(msg)` records a new log entry with the provided message, and `logEnd()` signifies the end of the logging process.

4. `rgbScalarToHex(r, g, b, prefix)` & `rgbScalarToHexCpp(r, g, b)`: Convert RGB values to a hexadecimal representation.

5. `rgbaScalarToHex(r, g, b, a, prefix)` & `rgbaScalarToHexCpp(r, g, b, a)`: Convert RGBA values to a hexadecimal representation.

6. `isSecurityPrefSet()`: Check if security preferences have been properly set in the Adobe After Effects environment.

7. `extractLayerNames(comp)`: Extract names of all the layers in the given composition.

8. `formatHeaderAsSequentialRGBAHexQuadsInCpp(animationName, frameDuration, numMarkers)` & similar functions: Format the header or body of the animation data in various formats (sequential or positional, RGBA or RGB, Hex Quads or Hex Bytes), for use with C++ projects.

9. `isLEDIlluminated(ledColour)`: Check if a given LED is illuminated based on its color value.

10. `writeDataFile(filename, outputData)`: Write the provided data to a file with the given filename.

11. `extractMarkerData(comp)`: Extract marker data from the given composition.

12. `extractAnimationData(comp, startTime, duration)`: Extract animation data from the given composition for a specified time duration.

13. `formatFileName(prefix, compName, suffix)`: Format a filename using the provided prefix, composition name, and suffix.

14. `formatAnimationName(compName, markerComment)`: Format the animation name using the composition name and marker comment.

15. `exportLEDAnimations(thisObject)`: The main function that drives the script. It validates the environment, extracts necessary data, formats and writes it to files.

## Main Script Execution

In the script, `exportLEDAnimations(this);` is called, which initiates the script, calling the `exportLEDAnimations()` function with `this` as the context, referring to the current After Effects project.

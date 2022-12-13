// Copyright 2020 Justin Lloyd All Right Reserved
// https://justin-lloyd.com/

{
    var logFile;

    function componentScalarToHexByte(c, prefix) {
        prefix = (typeof prefix !== 'undefined') ? prefix : ""
        var hex = (c * 255.0).toString(16);
        return prefix + (hex.length === 1 ? "0" + hex : hex);
    }

    function componentScalarToHexByteCpp(c) {
        return componentScalarToHexByte(c, '0x');
    }

    function toHexByte(i, prefix) {
        prefix = (typeof prefix !== 'undefined') ? prefix : ""
        //var hex = i;
        var hex = i.toString(16);
        return prefix + (hex.length === 1 ? "0" + hex : hex);
        //return hex;
    }

    function toHexByteCpp(i) {
        return toHexByte(i, '0x');
    }

    function logStart() {
        logFile = new File("export.log");
        logFile.open("w");
    }

    function log(msg) {
        logFile.writeln(msg);
    }

    function logEnd() {
        logFile.close();
    }

    function rgbScalarToHex(r, g, b, prefix) {
        prefix = (typeof prefix !== 'undefined') ? prefix : ""

        return prefix + componentScalarToHexByte(r) + componentScalarToHexByte(g) + componentScalarToHexByte(b);
    }

    function rgbScalarToHexCpp(r, g, b) {
        return rgbScalarToHex(r, g, b, '0x');
    }

    function rgbaScalarToHex(r, g, b, a, prefix) {
        prefix = (typeof prefix !== 'undefined') ? prefix : ""

        return prefix + componentScalarToHexByte(r) + componentScalarToHexByte(g) + componentScalarToHexByte(b) + componentScalarToHexByte(a);
    }

    function rgbaScalarToHexCpp(r, g, b, a) {
        return rgbaScalarToHex(r, g, b, a, '0x');
    }

    function isSecurityPrefSet() {
        var securitySetting = app.preferences.getPrefAsLong("Main Pref Section", "Pref_SCRIPTING_FILE_NETWORK_SECURITY");
        return (securitySetting === 1);
    }

    function extractLayerNames(comp) {
        var layerNames = [];
        for (var i = 1; i <= comp.layers.length; i++) {
            layerNames.push(comp.layers[i].name);
        }

        return layerNames;
    }

    function formatHeaderAsSequentialRGBAHexQuadsInCpp(animationName, frameDuration, numMarkers) {
        var output = [];
        output.push("// exported animation data @ " + Date(Date.now()));
        output.push("");
        output.push("// RGBA Hex Quads in C struct style");
        output.push("// RGBA format");
        output.push("// RGB (red,green,blue) represents colour of the LED where 0 is no colour for that colour component and FF is full colour.");
        output.push("// A (alpha) represents brightness of the LED where 0 is off and FF is full brightness.");
        output.push("// For example, RGBA=0xFF0000FF means completely red LED with no green or blue, with the LED at full brightness.");
        output.push("");
        output.push("// frame duration is: " + 1000 * frameDuration + "ms");
        output.push("// frame rate is: " + 1 / frameDuration + "fps");
        output.push("");
        output.push("// There are " + numMarkers + " animations in this animation set");
        output.push("");
        return output.join('\n');
    }

    function formatAsSequentialRGBAHexQuadsInCpp(animationName, frameDuration, layerNames, animationData) {
        var output = [];
        log("Formatting output as hex quads in C++");
        output.push("int " + animationName + " = new int[" + animationData.length + "][" + animationData[0].length + "]");
        output.push('{');
        output.push("\t// " + layerNames.join(', '));

        var framesOutput = [];
        log("Exporting animation data with " + animationData.length + " frames");
        for (var frame = 0; frame < animationData.length; frame++) {
            var singleFrameOutput = [];
            singleFrameOutput.push('\t// frame :' + frame + ' (' + Math.floor(1000 * frameDuration * frame) + 'ms)');
            var ledRGBAValues = [];
            for (var ledIndex = 0; ledIndex < animationData[frame].length; ledIndex++) {
                var ledColour = animationData[frame][ledIndex];
                ledRGBAValues.push(rgbaScalarToHexCpp(ledColour[0], ledColour[1], ledColour[2], ledColour[3]));
            }
            ;

            singleFrameOutput.push("\t{ " + ledRGBAValues.join(', ') + " }");
            framesOutput.push(singleFrameOutput.join('\n'))
        }

        output.push(framesOutput.join(',\n'))
        output.push('};')

        return output.join('\n');
    }

    function formatHeaderAsSequentialRGBHexQuadsInCPP(animationName, frameDuration, numMarkers) {
        var output = [];
        output.push("// exported animation data @ " + Date(Date.now()));
        output.push("");
        output.push("// Sequential RGB Hex Quads in C struct style");
        output.push("// RGB format");
        output.push("// RGB (red,green,blue) represents colour of the LED where 0 is no colour for that colour component and FF is full colour.");
        output.push("// For example, RGBA=0x00FF0000 means completely red LED with no green or blue.");
        output.push("");
        output.push("// frame duration is: " + 1000 * frameDuration + "ms");
        output.push("// frame rate is: " + 1 / frameDuration + "fps");
        output.push("");
        output.push("// There are " + numMarkers + " animations in this animation set");
        output.push("");
        return output.join('\n');
    }

    function formatAsSequentialRGBHexQuadsInCPP(animationName, frameDuration, layerNames, animationData) {
        var output = [];
        log("Formatting output as RGB hex quads in C++");

        output.push("int " + animationName + " = new int[" + animationData.length + "][" + animationData[0].length + "]");
        output.push('{');
        output.push("\t// " + layerNames.join(', '));

        var framesOutput = [];
        log("Exporting animation data with " + animationData.length + " frames");
        for (var frame = 0; frame < animationData.length; frame++) {
            var singleFrameOutput = [];
            singleFrameOutput.push('\t// frame :' + frame + ' (' + Math.floor(1000 * frameDuration * frame) + 'ms)');
            var ledRGBValues = [];
            for (var ledIndex = 0; ledIndex < animationData[frame].length; ledIndex++) {
                var ledColour = animationData[frame][ledIndex];
                ledRGBValues.push(rgbScalarToHexCpp(ledColour[0], ledColour[1], ledColour[2]));
            }
            ;

            singleFrameOutput.push("\t{ " + ledRGBValues.join(', ') + " }");
            framesOutput.push(singleFrameOutput.join('\n'))
        }

        output.push(framesOutput.join(',\n'))
        output.push('};')

        return output.join('\n');
    }

    function formatHeaderAsSequentialRGBAHexBytesInCPP(animationName, frameDuration, numMarkers) {
        var output = [];
        output.push("// exported animation data @ " + Date(Date.now()));
        output.push("// Sequential RGBA Hex Bytes in C struct style");
        output.push("");
        output.push("// R, G, B, A format");
        output.push("// R,G,B (red,green,blue) represents colour of the LED where 0 is no colour for that colour component and FF is full colour.");
        output.push("// A (alpha) represents brightness of the LED where 0 is off and FF is full brightness.");
        output.push("// For example, RGBA=0xFF,0x00,0x00,0xFF means completely red LED with no green or blue, with the LED at full brightness.");
        output.push("");
        output.push("// frame duration is: " + 1000 * frameDuration + "ms");
        output.push("// frame rate is: " + 1 / frameDuration + "fps");
        output.push("");
        output.push("// There are " + numMarkers + " animations in this animation set");
        output.push("");
        return output.join('\n');
    }

    function formatAsSequentialRGBAHexBytesInCPP(animationName, frameDuration, layerNames, animationData) {
        var output = [];
        log("Formatting output as hex bytes in C++");

        output.push("int " + animationName + " = new int[" + animationData.length + "][" + animationData[0].length + "][4]");
        output.push('{');
        output.push("\t// " + layerNames.join(', '));

        var framesOutput = [];
        log("Exporting animation data with " + animationData.length + " frames");
        for (var frame = 0; frame < animationData.length; frame++) {
            var singleFrameOutput = [];
            singleFrameOutput.push('\t// frame :' + frame + ' (' + Math.floor(1000 * frameDuration * frame) + 'ms)');
            var ledRGBAValues = [];
            for (var ledIndex = 0; ledIndex < animationData[frame].length; ledIndex++) {
                var ledColour = animationData[frame][ledIndex];
                var ledComponentValues = [];
                for (var c = 0; c < ledColour.length; c++) {
                    ledComponentValues.push(componentScalarToHexByteCpp(ledColour[c]));
                }

                ledRGBAValues.push("{ " + ledComponentValues.join(",") + " }");
            }
            ;

            singleFrameOutput.push("\t{ " + ledRGBAValues.join(', ') + " }");
            framesOutput.push(singleFrameOutput.join('\n'))
        }

        output.push(framesOutput.join(',\n'))
        output.push('};')

        return output.join('\n');
    }

    function formatHeaderAsSequentialRGBHexBytesInCPP(animationName, frameDuration, numMarkers) {
        var output = [];
        output.push("// exported animation data @ " + Date(Date.now()));
        output.push("// Sequential RGB Hex Bytes in C struct style");
        output.push("");
        output.push("// R, G, B format");
        output.push("// R,G,B (red,green,blue) represents colour of the LED where 0 is no colour for that colour component and FF is full colour.");
        output.push("// For example, RGB=0xFF,0x00,0x00F means completely red LED with no green or blue.");
        output.push("");
        output.push("// frame duration is: " + 1000 * frameDuration + "ms");
        output.push("// frame rate is: " + 1 / frameDuration + "fps");
        output.push("");
        output.push("// There are " + numMarkers + " animations in this animation set");
        output.push("");
        return output.join('\n');
    }

    function formatAsSequentialRGBHexBytesInCPP(animationName, frameDuration, layerNames, animationData) {
        var output = [];
        log("Formatting output as hex bytes in C++");

        output.push("int " + animationName + " = new int[" + animationData.length + "][" + animationData[0].length + "][4]");
        output.push('{');
        output.push("\t// " + layerNames.join(', '));

        var framesOutput = [];
        log("Exporting animation data with " + animationData.length + " frames");
        for (var frame = 0; frame < animationData.length; frame++) {
            var singleFrameOutput = [];
            singleFrameOutput.push('\t// frame :' + frame + ' (' + Math.floor(1000 * frameDuration * frame) + 'ms)');
            var ledRGBValues = [];
            for (var ledIndex = 0; ledIndex < animationData[frame].length; ledIndex++) {
                var ledColour = animationData[frame][ledIndex];
                var ledComponentValues = [];
                // -1 skips the alpha component
                for (var c = 0; c < ledColour.length - 1; c++) {
                    ledComponentValues.push(componentScalarToHexByteCpp(ledColour[c]));
                }

                ledRGBValues.push("{ " + ledComponentValues.join(",") + " }");
            }
            ;

            singleFrameOutput.push("\t{ " + ledRGBValues.join(', ') + " }");
            framesOutput.push(singleFrameOutput.join('\n'))
        }

        output.push(framesOutput.join(',\n'))
        output.push('};')

        return output.join('\n');
    }

    function formatHeaderAsPositionalRGBHexBytesInCPP(animationName, frameDuration, numMarkers) {
        var output = [];
        output.push("// exported animation data @ " + Date(Date.now()));
        output.push("// Positional RGB Hex Bytes in C struct style");
        output.push("");
        output.push("// R, G, B format with LED index");
        output.push("// P, R,G,B (position, red,green,blue) represents position of LED and colour of the LED where 0 is no colour for that colour component and FF is full colour.");
        output.push("// For example, PRGB=0x02, 0xFF,0x00,0x00F means set the third LED to completely red LED with no green or blue.");
        output.push("");
        output.push("// frame duration is: " + 1000 * frameDuration + "ms");
        output.push("// frame rate is: " + 1 / frameDuration + "fps");
        output.push("");
        output.push("// There are " + numMarkers + " animations in this animation set");
        output.push("");
        return output.join('\n');

    }

    function isLEDIlluminated(ledColour) {
        if (ledColour[3] === 0) {
            return false;
        }
        if (ledColour[0] === 0 && ledColour[1] === 0 && ledColour[2] === 0) {
            return false;
        }
        return true;
    }

    function formatAsPositionalRGBInJSON(animationName, frameDuration, layerNames, animationData) {
        log("Formatting output as RGB hex in JSON");
        var obj = {};
        obj.animationName = animationName;
        obj.frameRate = 1 / frameDuration;
        obj.frameDuration = 1000 * frameDuration;
        obj.frameCount = animationData.length;
        obj.frames = [];
        log("Exporting animation data with " + animationData.length + " frames");
        for (var frame = 0; frame < animationData.length; frame++) {
            frameData = {};
            frameData.frameIndex = frame;
            frameData.timestamp = Math.floor(1000 * frameDuration * frame);
            frameData.leds = [];
            for (var ledIndex = 0; ledIndex < animationData[frame].length; ledIndex++) {
                var ledColour = animationData[frame][ledIndex];
                if (!isLEDIlluminated(ledColour)) {
                    continue;
                }

                var ledData = {};
                ledData.ledIndex = ledIndex;
                ledData.red = Math.round(ledColour[0] * 255.0);
                ledData.green = Math.round(ledColour[1] * 255.0);
                ledData.blue = Math.round(ledColour[2] * 255.0);
                frameData.leds.push(ledData);
            }

            obj.frames.push(frameData);
        }

        return obj;
    }

    function formatAsPositionalRGBHexBytesInCPP(animationName, frameDuration, layerNames, animationData) {
        var output = [];
        log("Formatting output as hex bytes in C++");

        output.push("int " + animationName + " = new int[" + animationData.length + "][" + animationData[0].length + "][4]");
        output.push('{');
        output.push("\t// " + layerNames.join(', '));

        var framesOutput = [];
        log("Exporting animation data with " + animationData.length + " frames");
        for (var frame = 0; frame < animationData.length; frame++) {
            var singleFrameOutput = [];
            singleFrameOutput.push('\t// frame :' + frame + ' (' + Math.floor(1000 * frameDuration * frame) + 'ms)');
            var ledRGBValues = [];
            for (var ledIndex = 0; ledIndex < animationData[frame].length; ledIndex++) {
                var ledColour = animationData[frame][ledIndex];
                var ledComponentValues = [];
                if (!isLEDIlluminated(ledColour)) {
                    continue;
                }
                ledComponentValues.push(toHexByteCpp(ledIndex));
                // -1 skips the alpha component
                for (var c = 0; c < ledColour.length - 1; c++) {
                    ledComponentValues.push(componentScalarToHexByteCpp(ledColour[c]));
                }
                ledRGBValues.push("{ " + ledComponentValues.join(",") + " }");
            }

            singleFrameOutput.push("\t{ " + ledRGBValues.join(', ') + " }");
            framesOutput.push(singleFrameOutput.join('\n'))
        }

        output.push(framesOutput.join(',\n'))
        output.push('};')

        return output.join('\n');
    }


    function writeDataFile(filename, outputData) {
        var dataFile = new File(filename);
        dataFile.open("w");
        dataFile.write(outputData);
        dataFile.close();
    }

    function extractMarkerData(comp) {
        var markerData = [];
        for (var markerIndex = 1; markerIndex <= comp.markerProperty.numKeys; markerIndex++) {
            markerData.push(comp.markerProperty.keyValue(markerIndex))
        }
        return markerData;
    }

    function extractAnimationData(comp, startTime, duration) {
        var animationData = [];
        //for (var time = comp.workAreaStart; time <= comp.workAreaStart + comp.workAreaDuration; time += comp.frameDuration) {
        for (var time = startTime; time <= startTime + duration; time += comp.frameDuration) {
            var animationFrame = [];
            for (var i = 1; i <= comp.layers.length; i++) {
                var curLayer = comp.layers[i];
                if (curLayer.name.indexOf('LED ') === -1) {
                    // this is not an LED layer, skip it
                    continue;
                }

                var colourAtTime = curLayer("Contents")("Ellipse 1").content("Fill 1")("Color").valueAtTime(time, true);
                // the opacity is animated separately from the colour
                //var opacityAtTime = curLayer.opacity.valueAtTime(time, true) / 100.0;
                var opacityAtTime = curLayer("Contents")("Ellipse 1").content("Fill 1")("Opacity").valueAtTime(time, true) / 100.0;
                colourAtTime[3] = opacityAtTime;
                animationFrame.push(colourAtTime);
            }
            animationData.push(animationFrame);
        }

        return animationData;
    }

    function formatFileName(prefix, compName, suffix) {
        var newName = prefix + '_' + compName + "_" + suffix;
        newName = newName.replace(/ /g, '_');
        newName = newName.replace(/-/g, '_');
        newName = newName.replace(/__/g, '_');
        newName = newName.toLowerCase();
        return newName;
    }

    function formatAnimationName(compName, markerComment) {
        var newName = 'anim_' + compName + "_" + markerComment
        newName = newName.replace(/ /g, '_');
        newName = newName.replace(/-/g, '_');
        newName = newName.replace(/\_\_/g, '_');
        newName = newName.toLowerCase();
        return newName;
    }

    function exportLEDAnimations(thisObject) {
        var scriptName = "Export LED Animations";
        if (parseFloat(app.version) < 16) {
            alert("This script requires After Effects CS 2019 or later.", scriptName);
            return;
        }

        if (isSecurityPrefSet() == false) {
            alert("This script requires the scripting security preference to be set.\nGo to the \"Scripting & Expressions\" panel of your application preferences, and make sure that \"Allow Scripts to Write Files and Access Network\" is checked.", scriptName);
            return;
        }

        if (!app.project) {
            alert("Please open a project first to use this script.", scriptName);
            return;
        }

        var activeComp = app.project.activeItem;
        if (activeComp == null || !(activeComp instanceof CompItem)) {
            alert("Select the layers for export in your composition");
            return
        }

        logStart();
        var layerNames = extractLayerNames(activeComp)
        log("Extracting animation data");

        log("Found " + activeComp.markerProperty.numKeys + " markers on " + activeComp.name);
        var sequentialRGBAHexQuadsInCpp = [];
        sequentialRGBAHexQuadsInCpp.push(formatHeaderAsSequentialRGBAHexQuadsInCpp(animationName, activeComp.frameDuration, activeComp.markerProperty.numKeys));
        var sequentialRGBAHexBytesInCpp = [];
        sequentialRGBAHexBytesInCpp.push(formatHeaderAsSequentialRGBAHexBytesInCPP(animationName, activeComp.frameDuration, activeComp.markerProperty.numKeys));
        var sequentialRGBHexBytesInCpp = [];
        sequentialRGBHexBytesInCpp.push(formatHeaderAsSequentialRGBHexBytesInCPP(animationName, activeComp.frameDuration, activeComp.markerProperty.numKeys));
        var sequentialRGBHexQuadsInCpp = [];
        sequentialRGBHexQuadsInCpp.push(formatHeaderAsSequentialRGBHexQuadsInCPP(animationName, activeComp.frameDuration, activeComp.markerProperty.numKeys));
        var positionalRGBHexBytesInCpp = [];
        positionalRGBHexBytesInCpp.push(formatHeaderAsPositionalRGBHexBytesInCPP(animationName, activeComp.frameDuration, activeComp.markerProperty.numKeys));
        var positionalRGBInJSON = [];
        for (var markerIndex = 1; markerIndex <= activeComp.markerProperty.numKeys; markerIndex++) {
            var activeMarker = activeComp.markerProperty.keyValue(markerIndex);
            var startTime = activeComp.markerProperty.keyTime(markerIndex);
            var duration = activeComp.markerProperty.keyValue(markerIndex).duration;
            var animationData = extractAnimationData(activeComp, startTime, duration);
            log("Formatting data for " + activeComp.name + "/" + activeMarker.comment + " starting at " + startTime + " for " + duration + " seconds");
            // log("Marker \"" + activeMarker.comment "= " + activeComp.markerProperty.keyTime(markerIndex));
            var animationName = formatAnimationName(activeComp.name, activeMarker.comment);
            sequentialRGBAHexQuadsInCpp.push(formatAsSequentialRGBAHexQuadsInCpp(animationName, activeComp.frameDuration, layerNames, animationData));
            sequentialRGBAHexBytesInCpp.push(formatAsSequentialRGBAHexBytesInCPP(animationName, activeComp.frameDuration, layerNames, animationData));
            sequentialRGBHexBytesInCpp.push(formatAsSequentialRGBHexBytesInCPP(animationName, activeComp.frameDuration, layerNames, animationData));
            sequentialRGBHexQuadsInCpp.push(formatAsSequentialRGBHexQuadsInCPP(animationName, activeComp.frameDuration, layerNames, animationData));
            positionalRGBHexBytesInCpp.push(formatAsPositionalRGBHexBytesInCPP(animationName, activeComp.frameDuration, layerNames, animationData));
            positionalRGBInJSON.push(formatAsPositionalRGBInJSON(animationName, activeComp.frameDuration, layerNames, animationData));
            log("Writing data files");
        }

        writeDataFile(formatFileName("anim", activeComp.name, "_sequential_c_struct_rgba_hex_quads.cpp"), sequentialRGBAHexQuadsInCpp.join('\n'));
        writeDataFile(formatFileName("anim", activeComp.name, "_sequential_c_struct_rgba_hex_bytes.cpp"), sequentialRGBAHexBytesInCpp.join('\n'));
        writeDataFile(formatFileName("anim", activeComp.name, "_sequential_c_struct_rgb_hex_quads.cpp"), sequentialRGBHexQuadsInCpp.join('\n'));
        writeDataFile(formatFileName("anim", activeComp.name, "_sequential_c_struct_rgb_hex_bytes.cpp"), sequentialRGBHexBytesInCpp.join('\n'));
        writeDataFile(formatFileName("anim", activeComp.name, "_positional_c_struct_rgb_hex_bytes.cpp"), positionalRGBHexBytesInCpp.join('\n'));
        writeDataFile(formatFileName("anim", activeComp.name, "_positional_rgb.json"), JSON.stringify(positionalRGBInJSON));

        logEnd();
    }

    exportLEDAnimations(this);

}

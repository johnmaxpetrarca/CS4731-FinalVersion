let modelViewMatrix;
let projectionMatrix;
let lampVertices = [];
let lampColors = [];

let lampDiffuseColors = [];
let lampSpecularColors = [];

let streetDiffuseColors = [];
let streetSpecularColors = [];
let streetColors = [];
let streetVertices = [];
let streetNormals = [];

let carDiffuseColors = [];
let carSpecularColors = [];
let carColors = [];
let carVertices = [];

let stopSignDiffuseColors = [];
let stopSignSpecularColors = [];
let stopSignColors = [];
let stopSignVertices = [];

let bunnyDiffuseColors = [];
let bunnySpecularColors = [];
let bunnyColors = [];
let bunnyVertices = [];

let objectAmbientColor = vec3(1,1,1);

let uModelViewMatrix;
let uProjectionMatrix;

let stack = [];
let projectStack = [];

let alpha = 0;
let theta = 0;

let bobbing = .1;
let currBob = .1;
let prevBob = 0;

let lightPosition = vec4(1.0,1.0,1.0,1.0);

let lightAmbient = vec4(.2,.2,.2,1.0);
let lightDiffuse = vec4(1.0,1.0,1.0,1.0);
let lightSpecular = vec4(1.0,1.0,1.0,1.0);


function main() {
    // Retrieve <canvas> element
    let canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    let gl = WebGLUtils.setupWebGL(canvas, undefined);

    //Check that the return value is not null.
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    // Set viewport
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Set clear color
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Initialize shaders
    let program = initShaders(gl, "vshader", "fshader");
    gl.useProgram(program);

    // Get the stop sign
    let stopSign = new Model(
        "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3/stopsign.obj",
        "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3/stopsign.mtl");

    // Get the lamp
    let lamp = new Model(
        "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3/lamp.obj",
        "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3/lamp.mtl");

    // Get the car
    let car = new Model(
        "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3/car.obj",
        "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3/car.mtl");

    // Get the street
    let street = new Model(
        "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3/street.obj",
        "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3/street.mtl");

    // Get the bunny (you will not need this one until Part II)
    let bunny = new Model(
        "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3/bunny.obj",
        "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3/bunny.mtl");



    let vPosition = gl.getAttribLocation(program, 'vPosition');
    let vColor = gl.getAttribLocation(program, 'vColor');

    let vBuffer = gl.createBuffer();
    let cBuffer = gl.createBuffer();

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);



    function render() {

        window.onkeyup = handleKeys;

        // Clear the canvas
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        let eye = vec3(0, 5, 8);
        let far = 4000;
        let at = vec3(0, 0, 0);
        let at2 = subtract(at, eye);
        let up = vec3(0, 1, 0);
        let aspect = canvas.width / canvas.height;



        modelViewMatrix = lookAt(eye, at, up);
        projectionMatrix = perspective(80, aspect, .1, far);
        





        if (lamp.mtlParsed && lamp.objParsed) {
            setUpLampGeometry();
        }

        if (street.mtlParsed && street.objParsed) {
            setUpStreetGeometry();
        }
        if (car.mtlParsed && car.objParsed) {
            setUpCarGeometry();
        }

        if (stopSign.mtlParsed && stopSign.objParsed) {
            setUpStopSignGeometry();
        }

        if(bunny.mtlParsed && bunny.objParsed){
            setUpBunnyGeometry();
        }
        
        

        if (lamp.mtlParsed && lamp.objParsed
            && street.mtlParsed && street.objParsed
            && car.mtlParsed && car.objParsed &&
            stopSign.mtlParsed && stopSign.objParsed
            && bunny.mtlParsed && bunny.objParsed) {

        // animate camera to move around origin...
        stack.push(modelViewMatrix);
            if(cPressed){
                theta += 4;
                modelViewMatrix = mult(modelViewMatrix, rotateY(theta));
            }else{
                modelViewMatrix = mult(modelViewMatrix, rotateY(theta))
            }
            

            stack.push(modelViewMatrix);
                modelViewMatrix = mult(modelViewMatrix, scalem(1,1.3,1));
                gl.uniformMatrix4fv(uModelViewMatrix, false, flatten(modelViewMatrix));
                gl.uniformMatrix4fv(uProjectionMatrix, false, flatten(projectionMatrix));
                drawLamp();
                stack.push(modelViewMatrix);
                    modelViewMatrix = mult(modelViewMatrix, scalem(1,1.3,1));
                    modelViewMatrix = mult(modelViewMatrix, translate(6,0,0));
                    modelViewMatrix = mult(modelViewMatrix, rotateY(90));
                    drawStopSign();
                modelViewMatrix = stack.pop();
            modelViewMatrix = stack.pop();

            stack.push(modelViewMatrix);
                modelViewMatrix = mult(modelViewMatrix, translate(0, 0, 0));
                modelViewMatrix = mult(modelViewMatrix, rotateY(90));
                modelViewMatrix = mult(modelViewMatrix, scalem(1.4, 1.4, 1.4));

                gl.uniformMatrix4fv(uModelViewMatrix, false, flatten(modelViewMatrix));
                gl.uniformMatrix4fv(uProjectionMatrix, false, flatten(projectionMatrix));
            drawStreet();
            modelViewMatrix = stack.pop();
            
            stack.push(modelViewMatrix);
                stack.push(modelViewMatrix)

                    if(mPressed){
                        alpha += 4;
                        modelViewMatrix = mult(modelViewMatrix, rotateY(-alpha));
                        console.log("M was pressed");
                    }else{
                        modelViewMatrix = mult(modelViewMatrix, rotateY(-alpha));
                    }
                    
                    modelViewMatrix = mult(modelViewMatrix, translate(4,0,0));
                    
                    gl.uniformMatrix4fv(uModelViewMatrix, false, flatten(modelViewMatrix));
                    gl.uniformMatrix4fv(uProjectionMatrix, false, flatten(projectionMatrix));
                    drawCar();
                    stack.push(modelViewMatrix)
                        modelViewMatrix = mult(modelViewMatrix, translate(0, 1, 1.5));

                        gl.uniformMatrix4fv(uModelViewMatrix, false, flatten(modelViewMatrix));
                        gl.uniformMatrix4fv(uProjectionMatrix, false, flatten(projectionMatrix));
                        drawBunny();
                    modelViewMatrix = stack.pop();
                modelViewMatrix = stack.pop();
            modelViewMatrix = stack.pop();
        modelViewMatrix = stack.pop();
        }

        // Request the next frame
        requestAnimationFrame(render);
    }

    function setUpStopSignGeometry() {
        // This assumes that your Face class and lamp.faces have been set up correctly.
        for (let face of stopSign.faces) {
            for (let vert of face.faceVertices) {
                stopSignVertices.push(vert[0], vert[1], vert[2]);

                let diffuseColor = mult(stopSign.diffuseMap.get(face.material), lightDiffuse);
                let specularColor = mult(stopSign.specularMap.get(face.material), lightSpecular);

                if (diffuseColor) {
                    stopSignDiffuseColors.push(diffuseColor);
                } else {
                    console.warn(`Diffuse color for material ${face.material} not found`);
                }

                if (specularColor) {
                    stopSignSpecularColors.push(specularColor);
                } else {
                    console.warn(`Specular color for material ${face.material} not found`);
                }
            }
        }
    }

    function setUpCarGeometry() {
        // This assumes that your Face class and lamp.faces have been set up correctly.
        for (let face of car.faces) {
            for (let vert of face.faceVertices) {
                carVertices.push(vert[0], vert[1], vert[2]);

                let diffuseColor = mult(car.diffuseMap.get(face.material), lightDiffuse);
                let specularColor = mult(car.specularMap.get(face.material), lightSpecular);

                if (diffuseColor) {
                    carDiffuseColors.push(diffuseColor);
                } else {
                    console.warn(`Diffuse color for material ${face.material} not found`);
                }

                if (specularColor) {
                    carSpecularColors.push(specularColor);
                } else {
                    console.warn(`Specular color for material ${face.material} not found`);
                }
            }
        }
    }


    function setUpLampGeometry() {
        // This assumes that your Face class and lamp.faces have been set up correctly.
        for (let face of lamp.faces) {
            for (let vert of face.faceVertices) {
                lampVertices.push(vert[0], vert[1], vert[2]);

                let diffuseColor = mult(lamp.diffuseMap.get(face.material), lightDiffuse);
                let specularColor = mult(lamp.specularMap.get(face.material), lightSpecular);

                if (diffuseColor) {
                    lampDiffuseColors.push(diffuseColor);
                } else {
                    console.warn(`Diffuse color for material ${face.material} not found`);
                }

                if (specularColor) {
                    lampSpecularColors.push(specularColor);
                } else {
                    console.warn(`Specular color for material ${face.material} not found`);
                }
            }
        }
    }


    function setUpStreetGeometry() {
        for (let face of street.faces) {
            for (let vert of face.faceVertices) {
                streetVertices.push(vert[0], vert[1], vert[2]);

                let diffuseColor = mult(street.diffuseMap.get(face.material), lightDiffuse);
                let specularColor = mult(street.specularMap.get(face.material), lightSpecular);

                if (diffuseColor) {
                    streetDiffuseColors.push(diffuseColor);
                } else {
                    console.warn(`Diffuse color for material ${face.material} not found`);
                }

                if (specularColor) {
                    streetSpecularColors.push(specularColor);
                } else {
                    console.warn(`Specular color for material ${face.material} not found`);
                }
            }

            for(let norm of face.faceNormals) {
                streetNormals.push(norm[0], norm[1], norm[2]);
            }
        }
    }

    function setUpBunnyGeometry(){
        for (let face of bunny.faces) {
            for (let vert of face.faceVertices) {
                bunnyVertices.push(vert[0], vert[1], vert[2]);

                let diffuseColor = mult(bunny.diffuseMap.get(face.material), lightDiffuse);
                let specularColor = mult(bunny.specularMap.get(face.material), lightSpecular);

                if (diffuseColor) {
                    bunnyDiffuseColors.push(diffuseColor);
                } else {
                    console.warn(`Diffuse color for material ${face.material} not found`);
                }

                if (specularColor) {
                    bunnySpecularColors.push(specularColor);
                } else {
                    console.warn(`Specular color for material ${face.material} not found`);
                }
            }
        }
    }


    function drawStreet() {
        let vDiffuseColor = gl.getAttribLocation(program, 'vDiffuseColor');
        // let vSpecularColor = gl.getAttribLocation(program, 'vSpecularColor');

        let diffuseCBuffer = gl.createBuffer();
        // let specularCBuffer = gl.createBuffer();

        // Buffer setup for diffuse colors
        gl.bindBuffer(gl.ARRAY_BUFFER, diffuseCBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(streetDiffuseColors), gl.STATIC_DRAW);
        gl.vertexAttribPointer(vDiffuseColor, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vDiffuseColor);

        // Buffer setup for specular colors
        // gl.bindBuffer(gl.ARRAY_BUFFER, specularCBuffer);
        // gl.bufferData(gl.ARRAY_BUFFER, flatten(lampSpecularColors), gl.STATIC_DRAW);
        // gl.vertexAttribPointer(vSpecularColor, 4, gl.FLOAT, false, 0, 0);
        // gl.enableVertexAttribArray(vSpecularColor);

        // let diffuseProduct = mult(lightDiffuse, streetDiffuseColors);

        //gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(streetDiffuseColors));
        // gl.uniformMatrix4fv(gl.getUniformLocation(program, "lightPosition"), flatten(lightPosition));


        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(streetVertices), gl.STATIC_DRAW);
        gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);


        var vNormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(streetNormals), gl.STATIC_DRAW);

        var vNormals = gl.getAttribLocation(program, "vNormal");
        gl.vertexAttribPointer(vNormals, 4, gl.FLOAT, false, 0,0);
        gl.enableVertexAttribArray(vNormals);


        // gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
        // gl.bufferData(gl.ARRAY_BUFFER, flatten(lampColors), gl.STATIC_DRAW);
        // gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
        // gl.enableVertexAttribArray(vColor);

        // You need to send the matrices to your vertex shader
        // For simplicity, we'll just use the modelViewMatrix for the model transformation.

        // uModelViewMatrix = gl.getUniformLocation(program, 'uModelViewMatrix');
        // gl.uniformMatrix4fv(uModelViewMatrix, false, flatten(modelViewMatrix));

        // uProjectionMatrix = gl.getUniformLocation(program, 'uProjectionMatrix');
        // gl.uniformMatrix4fv(uProjectionMatrix, false, flatten(projectionMatrix));

        // Draw the lamp object
        gl.drawArrays(gl.TRIANGLES, 0, streetVertices.length / 6);
    }

    function drawBunny() {
        let vDiffuseColor = gl.getAttribLocation(program, 'vDiffuseColor');
        // let vSpecularColor = gl.getAttribLocation(program, 'vSpecularColor');

        let diffuseCBuffer = gl.createBuffer();
        // let specularCBuffer = gl.createBuffer();

        // Buffer setup for diffuse colors
        gl.bindBuffer(gl.ARRAY_BUFFER, diffuseCBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(bunnyDiffuseColors), gl.STATIC_DRAW);
        gl.vertexAttribPointer(vDiffuseColor, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vDiffuseColor);

        // Buffer setup for specular colors
        // gl.bindBuffer(gl.ARRAY_BUFFER, specularCBuffer);
        // gl.bufferData(gl.ARRAY_BUFFER, flatten(lampSpecularColors), gl.STATIC_DRAW);
        // gl.vertexAttribPointer(vSpecularColor, 4, gl.FLOAT, false, 0, 0);
        // gl.enableVertexAttribArray(vSpecularColor);



        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(bunnyVertices), gl.STATIC_DRAW);
        gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);

        // gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
        // gl.bufferData(gl.ARRAY_BUFFER, flatten(lampColors), gl.STATIC_DRAW);
        // gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
        // gl.enableVertexAttribArray(vColor);

        // You need to send the matrices to your vertex shader
        // For simplicity, we'll just use the modelViewMatrix for the model transformation.

        // uModelViewMatrix = gl.getUniformLocation(program, 'uModelViewMatrix');
        // gl.uniformMatrix4fv(uModelViewMatrix, false, flatten(modelViewMatrix));

        // uProjectionMatrix = gl.getUniformLocation(program, 'uProjectionMatrix');
        // gl.uniformMatrix4fv(uProjectionMatrix, false, flatten(projectionMatrix));

        // Draw the lamp object
        gl.drawArrays(gl.TRIANGLES, 0, bunnyVertices.length / 6);
    }



    function drawLamp() {

        let vDiffuseColor = gl.getAttribLocation(program, 'vDiffuseColor');
        // let vSpecularColor = gl.getAttribLocation(program, 'vSpecularColor');

        let diffuseCBuffer = gl.createBuffer();
        // let specularCBuffer = gl.createBuffer();

        // Buffer setup for diffuse colors
        gl.bindBuffer(gl.ARRAY_BUFFER, diffuseCBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(lampDiffuseColors), gl.STATIC_DRAW);
        gl.vertexAttribPointer(vDiffuseColor, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vDiffuseColor);

        // Buffer setup for specular colors
        // gl.bindBuffer(gl.ARRAY_BUFFER, specularCBuffer);
        // gl.bufferData(gl.ARRAY_BUFFER, flatten(lampSpecularColors), gl.STATIC_DRAW);
        // gl.vertexAttribPointer(vSpecularColor, 4, gl.FLOAT, false, 0, 0);
        // gl.enableVertexAttribArray(vSpecularColor);



        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(lampVertices), gl.STATIC_DRAW);
        gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);

        // gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
        // gl.bufferData(gl.ARRAY_BUFFER, flatten(lampColors), gl.STATIC_DRAW);
        // gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
        // gl.enableVertexAttribArray(vColor);

        // You need to send the matrices to your vertex shader
        // For simplicity, we'll just use the modelViewMatrix for the model transformation.

        // uModelViewMatrix = gl.getUniformLocation(program, 'uModelViewMatrix');
        // modelViewMatrix = mult(modelViewMatrix, translate(0, 0, 0));
        // gl.uniformMatrix4fv(uModelViewMatrix, false, flatten(modelViewMatrix));

        // uProjectionMatrix = gl.getUniformLocation(program, 'uProjectionMatrix');
        // projectionMatrix = mult(projectionMatrix, translate(0, 0, 0));
        // gl.uniformMatrix4fv(uProjectionMatrix, false, flatten(projectionMatrix));

        // Draw the lamp object
        gl.drawArrays(gl.TRIANGLES, 0, lampVertices.length / 6);
    }


    function drawCar() {
        let vDiffuseColor = gl.getAttribLocation(program, 'vDiffuseColor');
        // let vSpecularColor = gl.getAttribLocation(program, 'vSpecularColor');

        let diffuseCBuffer = gl.createBuffer();
        // let specularCBuffer = gl.createBuffer();

        // Buffer setup for diffuse colors
        gl.bindBuffer(gl.ARRAY_BUFFER, diffuseCBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(carDiffuseColors), gl.STATIC_DRAW);
        gl.vertexAttribPointer(vDiffuseColor, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vDiffuseColor);

        // Buffer setup for specular colors
        // gl.bindBuffer(gl.ARRAY_BUFFER, specularCBuffer);
        // gl.bufferData(gl.ARRAY_BUFFER, flatten(lampSpecularColors), gl.STATIC_DRAW);
        // gl.vertexAttribPointer(vSpecularColor, 4, gl.FLOAT, false, 0, 0);
        // gl.enableVertexAttribArray(vSpecularColor);



        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(carVertices), gl.STATIC_DRAW);
        gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);

        // gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
        // gl.bufferData(gl.ARRAY_BUFFER, flatten(lampColors), gl.STATIC_DRAW);
        // gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
        // gl.enableVertexAttribArray(vColor);

        // You need to send the matrices to your vertex shader
        // For simplicity, we'll just use the modelViewMatrix for the model transformation.

        uModelViewMatrix = gl.getUniformLocation(program, 'uModelViewMatrix');
        gl.uniformMatrix4fv(uModelViewMatrix, false, flatten(modelViewMatrix));

        uProjectionMatrix = gl.getUniformLocation(program, 'uProjectionMatrix');
        gl.uniformMatrix4fv(uProjectionMatrix, false, flatten(projectionMatrix));

        // Draw the lamp object
        gl.drawArrays(gl.TRIANGLES, 0, carVertices.length / 6);
    }


    function drawStopSign() {
        let vDiffuseColor = gl.getAttribLocation(program, 'vDiffuseColor');
        // let vSpecularColor = gl.getAttribLocation(program, 'vSpecularColor');

        let diffuseCBuffer = gl.createBuffer();
        // let specularCBuffer = gl.createBuffer();

        // Buffer setup for diffuse colors
        gl.bindBuffer(gl.ARRAY_BUFFER, diffuseCBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(stopSignDiffuseColors), gl.STATIC_DRAW);
        gl.vertexAttribPointer(vDiffuseColor, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vDiffuseColor);

        // Buffer setup for specular colors
        // gl.bindBuffer(gl.ARRAY_BUFFER, specularCBuffer);
        // gl.bufferData(gl.ARRAY_BUFFER, flatten(lampSpecularColors), gl.STATIC_DRAW);
        // gl.vertexAttribPointer(vSpecularColor, 4, gl.FLOAT, false, 0, 0);
        // gl.enableVertexAttribArray(vSpecularColor);



        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(stopSignVertices), gl.STATIC_DRAW);
        gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);

        // gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
        // gl.bufferData(gl.ARRAY_BUFFER, flatten(lampColors), gl.STATIC_DRAW);
        // gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
        // gl.enableVertexAttribArray(vColor);

        // You need to send the matrices to your vertex shader
        // For simplicity, we'll just use the modelViewMatrix for the model transformation.

        uModelViewMatrix = gl.getUniformLocation(program, 'uModelViewMatrix');
        gl.uniformMatrix4fv(uModelViewMatrix, false, flatten(modelViewMatrix));

        uProjectionMatrix = gl.getUniformLocation(program, 'uProjectionMatrix');
        gl.uniformMatrix4fv(uProjectionMatrix, false, flatten(projectionMatrix));

        // Draw the lamp object
        gl.drawArrays(gl.TRIANGLES, 0, stopSignVertices.length / 6);
    }



    // Start the render loop
    render();

}

var firstTime = true;

//car moves = true and stops = false
var mPressed;

//camera animation = true, camera stop = false
var dPressed;

var cPressed;

function handleKeys(e){

    e = e || window.event;

    if (e.keyCode == '77') {

        if(firstTime === true){
            mPressed = true;
            firstTime = false;
        }else if(mPressed === true){
            mPressed = false;
        }else if(mPressed === false){
            mPressed = true;
        }


    }
    else if (e.keyCode == '68') {
        // down arrow
        if(!dPressed){
            dPressed = true;
        }else{
            dPressed = false;
        }
        
    }
    else if (e.keyCode == '67') {
        // press C
        if(!cPressed){
            cPressed = true;
        }else{
            cPressed = false;
        }
        // requestAnimationFrame(render4);
    }
    else if (e.keyCode == '39') {
        // right arrow
    }

}





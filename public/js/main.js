import * as THREE from '/three/build/three.module.js';
import { OrbitControls } from '/three/examples/jsm/controls/OrbitControls.js';
import { ImprovedNoise } from '/three/examples/jsm/math/ImprovedNoise.js';
import { GUI } from '/three/examples/jsm/libs/dat.gui.module.js';
import { WEBGL } from '/three/examples/jsm/WebGL.js';

if ( WEBGL.isWebGL2Available() === false ) {
    document.body.appendChild( WEBGL.getWebGL2ErrorMessage() );
}

let renderer, scene, camera, mesh, analyser;
let fftSize = 64;
let startButton = document.getElementById( 'startButton' );
startButton.addEventListener( 'click', e => {
    init(null);
    animate();
});

export default {
    init: init,
    animate: animate
}

export function init(detector) {

    let overlay = document.getElementById( 'overlay' );
    overlay.remove();

    let container = document.getElementById( 'container' );
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 100 );
    camera.position.set( 0, 0, 1.5 );

    new OrbitControls( camera, renderer.domElement );

    // Sky


    const mat = new THREE.MeshBasicMaterial({color: 'rgb(105,140,190)',
            side: THREE.BackSide});

    const sky = new THREE.Mesh(
        new THREE.SphereBufferGeometry( 10 ),
        mat
    );
    scene.add( sky );

    // Texture

    const size = 128;
    const data = new Uint8Array( size * size * size );

    let i = 0;
    const scale = 0.05;
    const perlin = new ImprovedNoise();
    const vector = new THREE.Vector3();

    for ( let z = 0; z < size; z ++ ) {

        for ( let y = 0; y < size; y ++ ) {

            for ( let x = 0; x < size; x ++ ) {

                const d = 1.0 - vector.set( x, y, z ).subScalar( size / 2 ).divideScalar( size ).length();
                data[ i ] = ( 128 + 128 * perlin.noise( x * scale / 1.5, y * scale, z * scale / 1.5 ) ) * d * d;
                i ++;

            }

        }

    }

    const texture = new THREE.DataTexture3D( data, size, size, size );
    texture.format = THREE.RedFormat;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.unpackAlignment = 1;

    // Material

    const vertexShader = `
					in vec3 position;
					uniform mat4 modelMatrix;
					uniform mat4 modelViewMatrix;
					uniform mat4 projectionMatrix;
					uniform vec3 cameraPos;
					out vec3 vOrigin;
					out vec3 vDirection;
					void main() {
						vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
						vOrigin = vec3( inverse( modelMatrix ) * vec4( cameraPos, 1.0 ) ).xyz;
						vDirection = position - vOrigin;
						gl_Position = projectionMatrix * mvPosition;
					}
				`;

    const fragmentShader = `
					precision highp float;
					precision highp sampler3D;
					uniform mat4 modelViewMatrix;
					uniform mat4 projectionMatrix;
					in vec3 vOrigin;
					in vec3 vDirection;
					out vec4 color;
					uniform vec3 base;
					uniform sampler3D map;
					uniform float threshold;
					uniform float range;
					uniform float opacity;
					uniform float steps;
					uniform float frame;
					uint wang_hash(uint seed)
					{
							seed = (seed ^ 61u) ^ (seed >> 16u);
							seed *= 9u;
							seed = seed ^ (seed >> 4u);
							seed *= 0x27d4eb2du;
							seed = seed ^ (seed >> 15u);
							return seed;
					}
					float randomFloat(inout uint seed)
					{
							return float(wang_hash(seed)) / 4294967296.;
					}
					vec2 hitBox( vec3 orig, vec3 dir ) {
						const vec3 box_min = vec3( - 0.5 );
						const vec3 box_max = vec3( 0.5 );
						vec3 inv_dir = 1.0 / dir;
						vec3 tmin_tmp = ( box_min - orig ) * inv_dir;
						vec3 tmax_tmp = ( box_max - orig ) * inv_dir;
						vec3 tmin = min( tmin_tmp, tmax_tmp );
						vec3 tmax = max( tmin_tmp, tmax_tmp );
						float t0 = max( tmin.x, max( tmin.y, tmin.z ) );
						float t1 = min( tmax.x, min( tmax.y, tmax.z ) );
						return vec2( t0, t1 );
					}
					float sample1( vec3 p ) {
						return texture( map, p ).r;
					}
					float shading( vec3 coord ) {
						float step = 0.01;
						return sample1( coord + vec3( - step ) ) - sample1( coord + vec3( step ) );
					}
					void main(){
						vec3 rayDir = normalize( vDirection );
						vec2 bounds = hitBox( vOrigin, rayDir );
						if ( bounds.x > bounds.y ) discard;
						bounds.x = max( bounds.x, 0.0 );
						vec3 p = vOrigin + bounds.x * rayDir;
						vec3 inc = 1.0 / abs( rayDir );
						float delta = min( inc.x, min( inc.y, inc.z ) );
						delta /= steps;
						// Jitter
						// Nice little seed from
						// https://blog.demofox.org/2020/05/25/casual-shadertoy-path-tracing-1-basic-camera-diffuse-emissive/
						uint seed = uint( gl_FragCoord.x ) * uint( 1973 ) + uint( gl_FragCoord.y ) * uint( 9277 ) + uint( frame ) * uint( 26699 );
						vec3 size = vec3( textureSize( map, 0 ) );
						float randNum = randomFloat( seed ) * 2.0 - 1.0;
						p += rayDir * randNum * ( 1.0 / size );
						//
						vec4 ac = vec4( base, 0.0 );
						for ( float t = bounds.x; t < bounds.y; t += delta ) {
							float d = sample1( p + 0.5 );
							d = smoothstep( threshold - range, threshold + range, d ) * opacity;
							float col = shading( p + 0.5 ) * 3.0 + ( ( p.x + p.y ) * 0.25 ) + 0.2;
							ac.rgb += ( 1.0 - ac.a ) * d * col;
							ac.a += ( 1.0 - ac.a ) * d;
							if ( ac.a >= 0.95 ) break;
							p += rayDir * delta;
						}
						color = ac;
						if ( color.a == 0.0 ) discard;
					}
				`;

    const geometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
    const material = new THREE.RawShaderMaterial( {
        glslVersion: THREE.GLSL3,
        uniforms: {
            base: { value: new THREE.Color( 0xebe3e7 ) },
            map: { value: texture },
            cameraPos: { value: new THREE.Vector3() },
            threshold: { value: 0.25 },
            opacity: { value: 0.25 },
            range: { value: 0.1 },
            steps: { value: 100 },
            frame: { value: 0 }
        },
        vertexShader,
        fragmentShader,
        side: THREE.BackSide,
        transparent: true
    } );

    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    //music
    let listener = new THREE.AudioListener();
    let audio = new THREE.Audio(listener);
    let file = '../Golden.mp3';
    let mediaElement, paused;

    audio.hasPlaybackControl = true;

    if ( /(iPad|iPhone|iPod)/g.test( navigator.userAgent ) ) {
        let loader = new THREE.AudioLoader();
        loader.load( file, function ( buffer ) {
            audio.setBuffer( buffer );
            audio.setVolume(0.3);
            audio.play();
        } );
    } else {
        mediaElement = new Audio( file );
        mediaElement.volume = 0.3;
        mediaElement.play();
        audio.setMediaElementSource( mediaElement );
    }

    analyser = new THREE.AudioAnalyser( audio, fftSize);

    //gui
    const parameters = {
        size: 0.67,
        transparency: 0.25,
        canvas_r: 105,
        canvas_g: 140,
        canvas_b: 190,
        volume: 0.3,
        pause: false,
        play_again: function(){},
        reset: function (){},
        help: function (){}
    };

    function onPauseClick(){
        console.log("paused");
        if(paused === undefined || paused === null){
            paused = true;
        }

        if(mediaElement){
            console.log('me');
            if(paused){
                console.log('1');
                mediaElement.pause();
                paused = false;
            }else{
                mediaElement.play();
                paused = true;
            }
        }else{
            if(paused){
                console.log('2');
                audio.pause();
                paused = false;
            }else{
                audio.play();
                paused = true;
            }
        }
    }

    function onPlayAgain(){
        if(audio.isPlaying || mediaElement.ended){
            if(mediaElement){
                mediaElement.play();
            }else {
                audio.play();
            }
        }else{
            alert("The music is still playing :)");
        }
    }

    function onReset() {
        resetSlider('size', 0.67);
        resetSlider('transparency', 0.25);
        resetSlider('canvas_r', 105);
        resetSlider('canvas_g', 140);
        resetSlider('canvas_b', 190);
        resetSlider('volume', 0.3);
    }

    function update() {
        material.uniforms.threshold.value = Math.abs(parameters.size-1);
        material.uniforms.opacity.value = parameters.transparency;
        if(mediaElement === undefined){
            audio.setVolume(parameters.volume)
        }else{
            mediaElement.volume = parameters.volume
        }
        mat.color.setRGB(parameters.canvas_r/255, parameters.canvas_g/255, parameters.canvas_b/255);
    }

    function resetSlider(name, val){
        for (let i = 0; i < gui.__controllers.length; i++) {
            if (gui.__controllers[i].property === name) {
                gui.__controllers[i].setValue(val);
                break
            }
        }
    }

    function onHelp() {
        alert("Use 'size' to change size of the cloud\n" +
                "Use 'transparency' to change the opacity of the cloud\n" +
                "Use 'canvas rgb' to change the color of background\n" +
                "Use 'volume' to change music loudness\n" +
                "Use 'pause' to pause the song, another hit would resume it\n" +
                "Use 'play_again' after the song is finished to play it again\n" +
                "Use 'reset' to set the slide bar values above to default\n" +
                "You know what 'help' does :)");
    }

    const gui = new GUI();
    gui.add( parameters, 'size', 0, 1, 0.01 ).onChange( update );
    gui.add( parameters, 'transparency', 0, 1, 0.01 ).onChange( update );
    gui.add( parameters, 'canvas_r', 0, 255, 1 ).onChange( update );
    gui.add( parameters, 'canvas_g', 0, 255, 1 ).onChange( update );
    gui.add( parameters, 'canvas_b', 0, 255, 1 ).onChange( update );
    gui.add( parameters, 'volume', 0, 1, 0.01 ).onChange( update );
    gui.add( parameters, 'pause').onChange(onPauseClick);
    gui.add( parameters, 'play_again').onChange(onPlayAgain);
    gui.add( parameters, 'reset').onChange(onReset);
    gui.add( parameters, 'help').onChange(onHelp);
    window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function getAverage(array){
    let val = 0, length = array.length;
    for(let i = 0; i < length; i++){
        val += array[i];
    }
    return val/length;
}

export function animate() {

    requestAnimationFrame( animate );

    mesh.material.uniforms.cameraPos.value.copy( camera.position );
    mesh.rotation.y = - performance.now() / 7500;
    mesh.material.uniforms.frame.value ++;
    let avg = getAverage(analyser.getFrequencyData());
    if(avg > 0){
        mesh.material.uniforms.range.value = avg/130*0.15 + 0.1;
        mesh.material.uniforms.steps.value = avg/150*180 + 10;
        if(avg <= 30){
            mesh.material.uniforms.base.value = new THREE.Color(0x9a7185);
        }else if(avg <= 50){
            mesh.material.uniforms.base.value = new THREE.Color(0xa58193);
        }else if(avg <= 70){
            mesh.material.uniforms.base.value = new THREE.Color(0xb191a0);
        }else if(avg <= 90){
            mesh.material.uniforms.base.value = new THREE.Color(0xbca0ae);
        }else if(avg <= 110){
            mesh.material.uniforms.base.value = new THREE.Color(0xc7b0bb);
        }else if(avg <= 130){
            mesh.material.uniforms.base.value = new THREE.Color(0xd2c0c9);
        }else{
            mesh.material.uniforms.base.value = new THREE.Color(0xddcfd6);
        }
    }
    renderer.render( scene, camera );
}
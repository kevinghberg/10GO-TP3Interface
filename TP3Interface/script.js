window.addEventListener('load', function () {

    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = 700
    canvas.height = 500
    let rivales = []
    let gameSpeed = 6
    let score = 0;
    let scoreToWin = 50
    let gameStarted = false;
    let gameOver = false;
    let gameEnded = false;

    let audio = document.getElementById('cancion');
    audio.volume = 0.2
    
    setTimeout(function () {
        audio.play()
    }, 10)

    let audio2 = document.getElementById('cancion2')
    audio2.pause()
    setTimeout(function () {
        audio2.play()
    }, 7000)

    let audio3 = this.document.getElementById('cancion3')

    let audio4 = document.getElementById('cancion4')
    audio4.volume = 0.4
 

    document.querySelector("#botonRestart").addEventListener('click', function () {
        window.location.reload();
    });


    const backgroundLayer = new Image();
    backgroundLayer.src = 'layer.png'

    const backgroundLayer2 = new Image();
    backgroundLayer2.src = 'layer2.png'



    class Entrada {
        constructor() {
            this.keys = []
            this.keyStart = []
            window.addEventListener('keydown', e => {
                if (e.key === 'ArrowUp' && this.keys.indexOf(e.key) === -1) {
                    this.keys.push(e.key)
                }
            })
            window.addEventListener('keyup', e => {
                if (e.key === 'ArrowUp') {
                    this.keys.splice(this.keys.indexOf(e.key), 1)
                }
            })
            window.addEventListener('keydown', e => {
                if (e.key === " " && this.keyStart.indexOf(e.key) === -1) {
                    this.keyStart.push(e.key)
                }
            })
            window.addEventListener('keyup', e => {
                if (e.key === " ") {
                    this.keyStart.splice(this.keyStart.indexOf(e.key), 1)
                }
            })

        }

    }

    class Jugador {
        constructor(jWidth, jHeight) {
            this.jHeight = jHeight
            this.jWidth = jWidth
            this.width = 35
            this.height = 34
            this.x = 0
            this.y = this.jHeight - this.height
            this.image = document.getElementById('jugador')
            this.frameX = 0
            this.frameY = 0
            this.speed = 0
            this.vy = 0
            this.gravedad = 0.6;
        }

        dibujar(context) {
            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height)
        }
        update(entrada, rivales) {
            // colision
            rivales.forEach(rival => {
                const dx = rival.x - this.x
                const dy = rival.y - this.y;
                const distancia = Math.sqrt(dx * dx + dy * dy)

                if (distancia < rival.width / 2 + this.width / 2) {
                    this.frameY = 7.7
                    this.frameX = 2.64310
                    this.x = 0
                    this.y = this.jHeight - this.height

                    gameOver = true

                } else if (distancia - 50 < rival.width / 2 + this.width / 2) {

                    rival.frameY = 7.8
                    rival.frameX = 4.5

                }

            }

            );
            //controles

            if (entrada.keys.indexOf('ArrowUp') > -1 && this.estaEnSuelo()) {
                this.vy -= 10
                this.frameX = 0.1
            } else {
                this.speed = 0
            }

            //saltar en y
            this.y += this.vy

            if (!this.estaEnSuelo()) {
                this.vy += this.gravedad;
            } else {
                this.vy = 0
                this.frameX = 2.64310
            }

            if (this.y > this.jHeight - this.height)
                this.y = this.jHeight - this.height;
        }

        estaEnSuelo() {
            return this.y >= this.jHeight - this.height;
        }
    }

    class Rival {
        constructor(jWidth, jHeight) {
            this.jWidth = jWidth
            this.jHeight = jHeight
            this.width = 37
            this.height = 30
            this.image = document.getElementById('rival')
            this.x = this.jWidth
            this.y = this.jHeight - this.height
            this.frameX = -0.1
            this.frameY = 5.55
            this.rivalABorrar = false;
        }
        dibujar(context) {
            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height,
                this.x, this.y, this.width, this.height)
        }
        actualizar(deltaTime) {
            this.x--
            this.x--
            this.x--
            this.x--
            if (this.x < 0 - this.width) {
                this.rivalABorrar = true;
                score++
            }
        }
    }

    class Layer {
        constructor(imagen, velocidadN) {
            this.x = 0
            this.y = 0
            this.width = canvas.width
            this.height = canvas.height
            this.x2 = this.width
            this.image = imagen
            this.velocidadN = velocidadN
            this.velocidad = gameSpeed * velocidadN
        }

        actualizar() {
            this.speed = gameSpeed * this.velocidadN
            if (this.x <= - this.width) {
                this.x = this.width + this.x2 - this.speed
            }
            if (this.x2 <= - this.width) {
                this.x2 = this.width + this.x - this.speed
            }

            this.x = Math.floor(this.x - this.speed)
            this.x2 = Math.floor(this.x2 - this.speed)
        }
        dibujar() {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
            ctx.drawImage(this.image, this.x2, this.y, this.width, this.height)
        }
    }



    function rivals(deltaTime) {
        if (enemyTimer > enemyInterval + randomEnemyInterval) {
            randomEnemyInterval = Math.random() * 1000
            rivales.push(new Rival(canvas.width, canvas.height))
            enemyTimer = 0
        } else {
            enemyTimer += deltaTime
        }
        rivales.forEach(rival => {
            rival.dibujar(ctx)
            rival.actualizar(deltaTime)
        })
        rivales = rivales.filter(rival =>
            !rival.rivalABorrar)
    }


    function estadoJuego(context) {

        context.fillStyle = 'black'
        context.font = '15px Verdana'
        context.fillText('Ingleses Gambeteados: ' + score + '/' + scoreToWin, 20, 50)
        if (gameOver) {
            audio3.play();
            audio.pause()
            audio2.pause()
            audio4.pause()
            context.textAlign = 'center'
            context.fillStyle = 'black'
            context.font = '15px Verdana'
            context.fillText('ME CORTARON LAS PIERNAS', canvas.width / 2, 200)
        }
        if (scoreToWin - 8 === score) {
            context.textAlign = 'start'
            context.fillStyle = 'black'
            context.font = '10px Verdana'
            context.fillText('GAMBETEA 10 INGLESES MAS Y GANA!', canvas.width / 2 + 2, 200 + 2)
            audio4.play();
            audio.volume = 0.3
            audio2.pause()
        }
        if (score === scoreToWin) {
            context.textAlign = 'center'
            context.fillStyle = 'black'
            context.font = '20px Verdana'
            context.fillText('BARRILETE COSMICO!', canvas.width / 2, 200)
        }
    }




    const entrada = new Entrada();
    const jugador = new Jugador(canvas.width, canvas.height)
    const layer1 = new Layer(backgroundLayer, 0.1)
    const layer2 = new Layer(backgroundLayer2, 0.5)
    const layers = [layer1, layer2]

    let lastTime = 0;
    let enemyTimer = 0;
    let enemyInterval = 800;
    let randomEnemyInterval = Math.random() * 1000

    function animar(timeStamp) {

        if (entrada.keyStart.indexOf(' ') > -1) {
            gameStarted = true
        }

        if (gameStarted && !gameOver && !gameEnded) {
            const deltaTime = timeStamp - lastTime;
            lastTime = timeStamp
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            layers.forEach(layer => {
                layer.actualizar();
                layer.dibujar();
            })
            jugador.update(entrada, rivales)
            jugador.dibujar(ctx)
            rivals(deltaTime)
            estadoJuego(ctx)
        }
        if (!gameOver) {
            requestAnimationFrame(animar)
        }
        if (score === scoreToWin) {
            gameEnded = true;
            requestAnimationFrame(animar)
        }


    }
    animar(0)
})
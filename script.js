document.addEventListener('DOMContentLoaded', () => {

    const container = document.querySelector('[data-js="puzzle-container"]')
    const puzzleScreen = document.getElementById('puzzle-screen')

    const circles = [
        document.querySelector('[data-js="puzzle-outer"]'),
        document.querySelector('[data-js="puzzle-central"]'),
        document.querySelector('[data-js="puzzle-inner"]'),
    ]

    let currentLayer = 0
    const rotations = [0, 0, 0]
    const rotationStep = 45
    let isCompleted = false
    const isLocked = [false, false, false]

    const correctRotations = [0, 0, 0]

    function init() {
        circles.forEach((circle, index) => {
            const randomRotation = Math.floor(Math.random() * 8) * rotationStep
            rotations[index] = randomRotation
            circle.style.transform = `rotate(${randomRotation}deg)`
        })

        const virtualBeastsScreen = document.getElementById('virtual-beasts-screen')
        if (virtualBeastsScreen) {
            virtualBeastsScreen.style.opacity = '0'
            virtualBeastsScreen.style.pointerEvents = 'none'
        }
    }

    function lockNextScreen(screenId) {
        const screen = document.getElementById(screenId)
        if (screen) {
            screen.style.opacity = '0'
            screen.style.pointerEvents = 'none'
        }
    }

    function unlockNextScreen(screenId) {
        const screen = document.getElementById(screenId)
        if (screen) {
            screen.classList.add('active')
            screen.style.opacity = '1'
            screen.style.pointerEvents = 'auto'
            setTimeout(() => {
                initPhysics()
            }, 100)
            
        }
    }

    function rotateCircle(layerIndex) {
        if (isCompleted) return
        if (isLocked[layerIndex]) return

        const circle = circles[layerIndex]
        const targetRotation = rotations[layerIndex] + rotationStep

        const startRotation = rotations[layerIndex]
        const frameStep = rotationStep / 10
        let currentStep = 0

        function animate() {
            currentStep += frameStep
            const currentRotation = startRotation + currentStep
            circle.style.transform = `rotate(${currentRotation}deg)`

            if (currentStep < rotationStep) {
                requestAnimationFrame(animate)
            } else {
                rotations[layerIndex] = targetRotation % 360
                circle.style.transform = `rotate(${rotations[layerIndex]}deg)`

                if (isCircleCompleted(layerIndex)) {
                    lockCircle(layerIndex)
                }

                if (isPuzzleCompleted()) {
                    celebrateCompletion()
                    unlockNextScreen('virtual-beasts-screen')
                }
            }
        }

        requestAnimationFrame(animate)
    }

    function isCircleCompleted(index) {
        const currentAngle = rotations[index]
        const correctAngle = correctRotations[index]
        return currentAngle % 360 === correctAngle % 360
    }

    function lockCircle(index) {
        isLocked[index] = true
        circles[index].style.cursor = 'default'
    }

    function isPuzzleCompleted() {
        return circles.every((circle, index) => isCircleCompleted(index))
    }

    function celebrateCompletion() {
        isCompleted = true
        console.log('🎉 Логотип собран!')

        circles.forEach((circle, index) => {
            setTimeout(() => {
                circle.classList.add('completed')
                circle.style.animation = 'complete-pulse 0.5s ease forwards'
            }, index * 200)
        })
    }

    circles.forEach((circle, index) => {
        circle.addEventListener('click', (e) => {
            if (isCompleted) return
            if (isLocked[index]) return

            rotateCircle(index)
        })
    })

    document.addEventListener('keydown', (e) => {
        if (isCompleted) return

        if (e.key >= '1' && e.key <= '3') {
            currentLayer = parseInt(e.key) - 1
        }
        
        if (e.key === 'ArrowRight' || e.key === ' ') {
            if (!isLocked[currentLayer]) {
                rotateCircle(currentLayer)
            }
        }
    })

    let touchStartX = 0
    let touchEndX = 0

    container.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX
    })

    container.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX
        handleSwipe()
    })

    function handleSwipe() {
        if (isCompleted) return
        if (isLocked[currentLayer]) return

        const swipeThreshold = 50
        if (touchEndX < touchStartX - swipeThreshold) {
            rotateCircle(currentLayer)
        }
    }

    init()

    const animalMessages = {
        dog1: `Как выбрать хороший приют?
Публикует статистику (поступления/пристройства)
Стерилизует и вакцинирует перед выдачей
Проверяет усыновителей (анкета, визит)
Чистота, просторные вольеры, выгул для собак
Рассказывает историю каждого животного
Сторителлинг работает: животные с историей находят дом на 25% быстрее.`,
        
        cat1: `Как выбрать хороший приют?
Публикует статистику (поступления/пристройства)
Стерилизует и вакцинирует перед выдачей
Проверяет усыновителей (анкета, визит)
Чистота, просторные вольеры, выгул для собак
Рассказывает историю каждого животного
Сторителлинг работает: животные с историей находят дом на 25% быстрее.`,
        
        cat2: `Как выбрать хороший приют?
Публикует статистику (поступления/пристройства)
Стерилизует и вакцинирует перед выдачей
Проверяет усыновителей (анкета, визит)
Чистота, просторные вольеры, выгул для собак
Рассказывает историю каждого животного
Сторителлинг работает: животные с историей находят дом на 25% быстрее.`
    }

    const modal = document.getElementById('animal-message-modal')
    const modalText = document.getElementById('modal-text')
    const takeBtn = document.getElementById('take-btn')
    const leaveBtn = document.getElementById('leave-btn')

    document.querySelectorAll('.animal').forEach(animal => {
        animal.addEventListener('click', () => {
            const animalType = animal.dataset.animal
            const message = animalMessages[animalType]
            
            if (message) {
                modalText.textContent = message
                modal.classList.add('active')
            }
        })
    })

    function closeModal() {
        modal.classList.remove('active')
    }

    takeBtn.addEventListener('click', () => {
        console.log('Забрать животное')
        closeModal()
    })

    leaveBtn.addEventListener('click', () => {
        console.log('Оставить')
        closeModal()
    })

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal()
        }
    })


    const physicsScreen = document.getElementById('physics-screen')
    const physicsContainer = document.getElementById('physics-container')

    const originalUnlockNextScreen = unlockNextScreen
    unlockNextScreen = function(screenId) {
        originalUnlockNextScreen(screenId)
        if (screenId === 'virtual-beasts-screen') {
            setTimeout(() => {
                physicsScreen.classList.add('active')
                initPhysics()
            }, 1000)
        }
    }

    function initPhysics() {
        const Engine = Matter.Engine,
            Render = Matter.Render,
            Runner = Matter.Runner,
            MouseConstraint = Matter.MouseConstraint,
            Mouse = Matter.Mouse,
            Composite = Matter.Composite,
            Bodies = Matter.Bodies,
            Body = Matter.Body,
            Events = Matter.Events,
            Common = Matter.Common

        const engine = Engine.create()
        const world = engine.world

        const width = physicsContainer.clientWidth || window.innerWidth
    const height = physicsContainer.clientHeight || (window.innerHeight - 150)

        const render = Render.create({
            element: physicsContainer,
            engine: engine,
            options: {
                width: width,
                height: height,
                wireframes: false,
                background: 'transparent',
                pixelRatio: window.devicePixelRatio
            }
        })

        Render.run(render)
        const runner = Runner.create()
        Runner.run(runner, engine)

        const ground = Bodies.rectangle(width / 2, height - 25, width, 50, { 
            isStatic: true,
            render: {
                fillStyle: '#002828',
                strokeStyle: '#002828',
                lineWidth: 2
            }
        })

        const leftWall = Bodies.rectangle(25, height / 2, 50, height, { 
            isStatic: true,
            render: { visible: false }
        })

        const rightWall = Bodies.rectangle(width - 25, height / 2, 50, height, { 
            isStatic: true,
            render: { visible: false }
        })

        Composite.add(world, [ground, leftWall, rightWall])
        const shapes = []
        const shapeTypes = 5

        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const x = Common.random(100, width - 100)
                const y = Common.random(-500, -100)
                const size = Common.random(40, 70)
                const shapeType = Math.floor(Common.random(1, shapeTypes + 1))

                let body
                const options = {
                    restitution: 0.7,
                    friction: 0.3,
                    frictionAir: 0.01,
                    render: {
                        sprite: {
                            texture: `pictures/figure_${shapeType}.svg`,
                            xSize: size,
                            ySize: size
                        }
                    }
                }

                switch (Math.floor(Common.random(0, 3))) {
                    case 0:
                        body = Bodies.rectangle(x, y, size, size * 0.8, options)
                        break
                    case 1:
                        body = Bodies.circle(x, y, size / 2, options)
                        break
                    case 2:
                        body = Bodies.polygon(x, y, 3, size / 2, options)
                        break
                }

                if (body) {
                    Body.setAngle(body, Common.random(0, Math.PI * 2))
                    Body.setAngularVelocity(body, Common.random(-0.05, 0.05))
                    shapes.push(body)
                    Composite.add(world, body)
                }
            }, i * 250)
        }

        const mouse = Mouse.create(render.canvas)
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: { visible: false }
            }
        })

        Composite.add(world, mouseConstraint)
        render.mouse = mouse

        Events.on(engine, 'beforeUpdate', () => {
            const mousePosition = mouse.position
            const repelRadius = 120
            const repelForce = 0.08

            shapes.forEach(shape => {
                const dx = shape.position.x - mousePosition.x
                const dy = shape.position.y - mousePosition.y
                const distance = Math.sqrt(dx * dx + dy * dy)

                if (distance < repelRadius && distance > 0) {
                    const force = (repelRadius - distance) / repelRadius * repelForce
                    const angle = Math.atan2(dy, dx)
                    
                    Body.applyForce(shape, shape.position, {
                        x: Math.cos(angle) * force,
                        y: Math.sin(angle) * force
                    })
                }
            })
        })
        window.addEventListener('resize', () => {
            const newWidth = window.innerWidth
            const newHeight = window.innerHeight

            render.options.width = newWidth
            render.options.height = newHeight
            render.canvas.width = newWidth
            render.canvas.height = newHeight

            Body.setPosition(ground, { x: newWidth / 2, y: newHeight - 25 })
            Body.setPosition(leftWall, { x: 25, y: newHeight / 2 })
            Body.setPosition(rightWall, { x: newWidth - 25, y: newHeight / 2 })
        })
    }
})




    
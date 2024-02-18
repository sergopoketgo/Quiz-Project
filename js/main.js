const gameSection = document.querySelector(".section-game")
const menuSection = document.querySelector(".section-menu")
const question = document.querySelector(".section-game__question")
const answerButtons = document.querySelectorAll(".section-game__card")
const answers = document.querySelectorAll(".section-game__card-number")
const gameStatus = document.querySelector(".section-game__status")
const startBtn = document.querySelector(".section-menu__start-btn")
const menuBalance = document.querySelector(".section-menu__balance-number")

// const gameHeart = document.querySelectorAll(".section-game__heart")
const gameHeartSolid = document.querySelectorAll(".section-game__heart-solid")
const gameHeartLeft = document.querySelectorAll(".section-game__heart-left")
const gameHeartRight = document.querySelectorAll(".section-game__heart-right")

let hearts = 3
let gameResult = 0

menuBalance.textContent = (localStorage.getItem("balance")) ? localStorage.getItem("balance") : "0"

function startHeartAnimation(heartSolid, heartLeft, heartRight) {
    heartSolid[hearts].animate({transform: ["skew(0, 0) scale(1)", "skew(15deg, 15deg) scale(1.2)", "skew(-15deg, -15deg) scale(1.2)", "skew(25deg, 25deg) scale(1.5)", "skew(-15deg, -15deg) scale(1.5)"], opacity: [1, 1, 1, 1, 0]}, {duration: 700, easing: "ease-in"}).addEventListener("finish", () => {
        heartSolid[hearts].style.display = "none"
        heartLeft[hearts].style.display = "block"
        heartRight[hearts].style.display = "block"

        heartLeft[hearts].animate({transform: ["scale(1.5) translateX(-1px) rotateZ(0)", "scale(0.8, 1) translate(-18px) rotateZ(-30deg)"]}, {duration: 75, fill: "both", easing: "ease-in"})
        heartRight[hearts].animate({transform: ["scale(1.5) translateX(1px) rotateZ(0)", "scale(0.8, 1) translate(18px) rotateZ(30deg)"]}, {duration: 75, fill: "both", easing: "ease-in"})

        setTimeout(() => {
            heartLeft[hearts].animate({filter: ["grayscale(0)", "grayscale(1)"]}, {duration: 350, fill: "both"})
            heartRight[hearts].animate({filter: ["grayscale(0)", "grayscale(1)"]}, {duration: 350, fill: "both"})
        }, 250)
    })
}


VanillaTilt.init(gameSection, {
    max: 15,
    reset: false,
    speed: 900
});


function randInt(min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min))
}


// function randIntMultiple(min, max) {
//     let randomNumber
//     do {
//         randomNumber = randInt(min, max)
//     } while (randomNumber % 2 !== 0)
//
//     return randomNumber
// }


function randomQuestion() {
    let operationNum = randInt(0,3)
    if (operationNum === 0) {  // +
        let firstNum = randInt(1, 50)
        let lastNum = randInt(1, 50)

        question.textContent = `${firstNum} + ${lastNum}`
    } else if (operationNum === 1) {  // -
        let firstNum = randInt(1, 75)
        let lastNum = randInt(1, firstNum)

        question.textContent = `${firstNum} - ${lastNum}`
    } else if (operationNum === 2) {  // *
        let firstNum = randInt(1, 10)
        let lastNum = randInt(1, 10)

        question.textContent = `${firstNum} × ${lastNum}`
    } else {  // /
        let firstNum = randInt(1, 75)
        let lastNum = randInt(1, firstNum)

        while (!Number.isInteger(firstNum / lastNum)) {
            firstNum = randInt(1, 75)
            lastNum = randInt(1, firstNum)
        }
        question.textContent = `${firstNum} ⁄ ${lastNum}`
    }

    let correctAnswer = (operationNum !== 3 && operationNum !== 2) ? eval(question.textContent) : (operationNum === 2) ? eval(question.textContent.replace("×", "*")) : eval(question.textContent.replace("⁄", "/"))

    let wrongAnswers = []
    for (let i = 0; i < 4; i++) {
        do {
            wrongAnswers[i] = (randInt(correctAnswer - randInt(5, 15), correctAnswer + randInt(5, 15)))
        } while (wrongAnswers[i] === correctAnswer || (() => {
            let isWrongAnswerRepeat = false
            for (let j = 0; j < (wrongAnswers.length-1); j++) {
                if (wrongAnswers[i] === wrongAnswers[j]) {
                    isWrongAnswerRepeat = true
                    break
                }
            }
            return isWrongAnswerRepeat
        })())
    }

    let outputAnswers = [...wrongAnswers]
    outputAnswers.splice(randInt(0, outputAnswers.length), 0, correctAnswer)

    answers.forEach((answer, index) => {
        answer.textContent = outputAnswers[index]
    })

    return correctAnswer
}


// question.addEventListener("click", () => {randomQuestion()})


let currentCorrectAnswer = randomQuestion()

answerButtons.forEach((clickedBtn) => {
    clickedBtn.addEventListener("click", () => {
        let IsCorrectAnswer = clickedBtn.querySelector(".section-game__card-number").textContent === currentCorrectAnswer.toString()

        if (IsCorrectAnswer) {
            gameStatus.src = "img/png/section-game__status-correct.png"
            gameResult++
        } else
            gameStatus.src = "img/png/section-game__status-incorrect.png"
        gameStatus.style.display = "block"

        // if (btn.textContent.replace(/[\n\t ]/g, "") === currentCorrectAnswer.toString()) {
        // answerButtons.forEach((btn) => {if (btn.textContent.replace(/[\n\t ]/g, "") !== currentCorrectAnswer.toString()) {btn.style.filter = "brightness(0.7)"} else {btn.style.filter = "brightness(1.3)"}})

        answerButtons.forEach((btn) => {
            let cardShadow = ""

            if (btn !== clickedBtn) {
                if (btn.classList.contains("card_left_shadow")) cardShadow = "drop-shadow(-4px 5px 0 #173665) "
                else if (btn.classList.contains("card_right_shadow")) cardShadow = "drop-shadow(4px 5px 0 #173665) "
                else cardShadow = "drop-shadow(0 5px 0 #173665) "
            } else {
                if (btn.classList.contains("card_left_shadow")) btn.style.transform = "translate(-5px, 5px) scale(110%)"
                else if (btn.classList.contains("card_right_shadow")) btn.style.transform = "translate(5px, 5px) scale(110%)"
                else btn.style.transform = "translateY(5px) scale(110%)"
            }

            if (btn.textContent.replace(/[\n\t ]/g, "") !== currentCorrectAnswer.toString())
                btn.style.filter = `${cardShadow}brightness(0.7)`
            else
                btn.style.filter = `${cardShadow}brightness(1.3)`
        })

        gameSection.style.display = null
        const gameSectionClone = gameSection.cloneNode(true)
        gameSectionClone.style.display = "flex"
        document.querySelector("main").appendChild(gameSectionClone)

        gameSectionClone.querySelector(".section-game__right-bar").animate([{opacity: 0}, {opacity: 1}], {duration: 100}).addEventListener("finish", () => {
            if (!IsCorrectAnswer) {
                hearts--
                startHeartAnimation(gameSectionClone.querySelectorAll(".section-game__heart-solid"), gameSectionClone.querySelectorAll(".section-game__heart-left"), gameSectionClone.querySelectorAll(".section-game__heart-right"))
                gameHeartSolid[hearts].style.display = "none"
                gameHeartLeft[hearts].style.display = "block"
                gameHeartRight[hearts].style.display = "block"

                gameHeartLeft[hearts].style.transform = "scale(0.8, 1) translate(-18px) rotateZ(-30deg)"
                gameHeartRight[hearts].style.transform = "scale(0.8, 1) translate(18px) rotateZ(30deg)"
                gameHeartLeft[hearts].style.filter = "grayscale(1)"
                gameHeartRight[hearts].style.filter = "grayscale(1)"

                if (hearts === 0) {
                    setTimeout(() => {
                        // gameSectionClone.animate({transform: ["skew(0, 0) scale(1)", "skew(15deg, 15deg) scale(1.2)", "skew(-15deg, -15deg) scale(1.2)", "skew(25deg, 25deg) scale(1.5)", "skew(-15deg, -15deg) scale(1.5)"], opacity: [1, 1, 1, 1, 0]}, {duration: 1000, easing: "ease-in"})
                        // gameSectionClone.style.opacity = "0"
                        gameSectionClone.animate({filter: ["grayscale(0) blur(0)", "grayscale(1) blur(25px)"]}, {duration: 3000, fill: "both"}).addEventListener("finish", () => {
                            // gameSectionClone.style.opacity = "0"
                            gameSectionClone.animate({opacity: [1, 0]}, {duration: 500, fill: "both"}).addEventListener("finish", () => {
                                gameSectionClone.style.display = null
                                setTimeout(() => {
                                    hearts = 3
                                    answerButtons.forEach((btn) => {btn.style.filter = null; btn.style.transform = null})
                                    gameStatus.style.display = null

                                    for (let i=0; i<3; i++) {
                                        gameHeartLeft[i].style = gameHeartRight[i].style = gameHeartSolid[i].style.display = null
                                    }

                                    currentCorrectAnswer = randomQuestion()

                                    startBtn.classList.remove("disabled")
                                    menuSection.style.display = null
                                    localStorage.setItem("balance", (localStorage.getItem("balance")) ? (+localStorage.getItem("balance") + gameResult).toString() : gameResult.toString())
                                    menuBalance.textContent = localStorage.getItem("balance")
                                    // if (localStorage.getItem("balance"))
                                    //     localStorage.setItem("balance", (+localStorage.getItem("balance") + gameResult).toString())
                                    // else
                                    //     localStorage.setItem("balance", gameResult.toString())
                                }, 1000)
                            })
                        })
                    }, 1750)  /*1300*/
                }
            }
            if (hearts !== 0) {
                setTimeout(() => {
                    gameSectionClone.animate([{transform: "rotateX(0) rotateY(0) rotateZ(0)"}, {transform: "rotateX(90deg) rotateY(90deg) rotateZ(90deg)"}], {duration: 1250, iterations: 1, fill: "both", easing: "ease"}).addEventListener("finish", () => {
                        const cloneQuestion = gameSectionClone.querySelector(".section-game__question")
                        const cloneAnswerButtons = gameSectionClone.querySelectorAll(".section-game__card")
                        const cloneAnswers = gameSectionClone.querySelectorAll(".section-game__card-number")
                        const cloneGameStatus = gameSectionClone.querySelector(".section-game__status")

                        answerButtons.forEach((btn) => {btn.style.filter = null; btn.style.transform = null})
                        cloneAnswerButtons.forEach((btn) => {btn.style.filter = null; btn.style.transform = null})
                        gameStatus.style.display = null
                        cloneGameStatus.style.display = null
                        currentCorrectAnswer = randomQuestion()
                        cloneQuestion.textContent = question.textContent
                        cloneAnswers.forEach((cloneAnswer, index) => {
                            cloneAnswer.textContent = answers[index].textContent
                        })

                        gameSectionClone.animate([{transform: "rotateX(90deg) rotateY(90deg) rotateZ(90deg)"}, {transform: "rotateX(180deg) rotateY(180deg) rotateZ(180deg)"}], {duration: 1500, iterations: 1, fill: "both", easing: "ease"}).addEventListener("finish", () => {
                            gameSection.style.display = "flex"
                            gameSectionClone.remove()
                        })
                    })
                }, 650)
            }
        })
    })
})


startBtn.addEventListener("click", function () {
    // startBtn.removeEventListener("click", arguments.callee);
    if (!startBtn.classList.contains("disabled")) {
        startBtn.classList.add("disabled")

        const gameSectionClone = gameSection.cloneNode(true)
        document.querySelector("main").appendChild(gameSectionClone)

        gameSectionClone.style.position = "absolute"
        gameSectionClone.style.transform = "scale(0%)"
        gameSectionClone.style.display = "flex"
        menuSection.animate({opacity: [1, 0]}, {duration: 300, fill: "both"}).addEventListener("finish", () => {
            menuSection.style.display = "none"
            menuSection.animate({opacity: 1}, {fill: "both"})

            gameSectionClone.style.position = null
            gameSectionClone.animate({transform: ["scale(0%)", "scale(100%)"]}, {duration: 500}).addEventListener("finish", () => {
                gameSectionClone.style.display = null
                gameSection.style.display = "flex"
            })
            gameSectionClone.style.transform = null
        })
    }
})
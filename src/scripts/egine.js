const state={
    score:{
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },
    cardSprites:{
        avatar:document.getElementById("card-image"),
        name:document.getElementById("card-name"),
        type:document.getElementById("card-type"),
    },
    fieldCards:{
        player:document.getElementById("player-field-card"),
        computer:document.getElementById("computer-field-card"),
    },
    actions:{
        button:document.getElementById("next-duel"),
    }
 };

const playerSide = {
    player1: "player-cards",
    computer: "computer-cards",
}

/*Numeração das Cartas */
const pathImages = "src/assets/icons/";
const cardData = [
    {
        id:0,
        name:"Blue Eyes White Dragon",
        type:"Paper",
        img: `${pathImages}dragon.png`,
        WinOf:[1],
        LouseOf:[2],
    },
    {
        id:1,
        name:"Dark Magician",
        type:"Rock",
        img: `${pathImages}magician.png`,
        WinOf:[2],
        LouseOf:[0],
    },
    {
        id:2,
        name:"Exodia",
        type:"Paper",
        img: `${pathImages}exodia.png`,
        WinOf:[0],
        LouseOf:[1],
    },
];

async function getRandomCardId(){
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function createCardImage(randomIdcard, fieldSide){
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", randomIdcard);
    cardImage.classList.add("card");

    if(fieldSide === playerSide.player1){
        cardImage.addEventListener("click", () =>{
            setCardsField(cardImage.getAttribute("data-id"));
        });
    }

    cardImage.addEventListener("mousehover", ()=>{
       drawSelectCard(randomIdcard); 
    });

    return cardImage;

    async function setCardsField(randomIdcard){
        await removeAllCardsImages();

        let computerCardsId = await getRandomCardId();

        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block";

        state.fieldCards.player.src = cardData[randomIdcard].img;
        state.fieldCards.computer.src = cardData[computerCardsId].img;
   
        let duelResults = await chekDuelResults(randomIdcard, computerCardsId); 
        
        await updateScore();
        await drawButtom(duelResults);
 
    }
}
    async function drawButtom(text){
        state.actions.button.innerText = text;
        state.actions.button.style.display = "block";
    }

async function updateScore(){
    state.score.scoreBox.innerText = `Win: ${state.score.
        playerScore} | Lose: ${state.score.computerScore}`;
}

    async function chekDuelResults(randomIdcard, computerCardsId){
        let duelResults = "Draw"
        let playercard = cardData[randomIdcard];

        if(playercard.WinOf.includes(computerCardsId)){
            duelResults = "Win";
            await playAudio("win");
            state.score.playerScore++;
        }
        if(playercard.LouseOf.includes(computerCardsId)){
            duelResults = "Lose";
            await playAudio("Lose");
            state.score.computerScore++;
        }
        return duelResults;
    }

async function removeAllCardsImages(){
    let cards = document.querySelector(".card-box.framed#computer-cards");
    let imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

     cards = document.querySelector(".card-box.framed#player-cards");
     imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
}

async function drawSelectCard(index){
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Attibute :" + cardData [index].type;

}
async function drawCards(cardNumbers, fieldSide){
    for(let i = 0; i < cardNumbers; i++){
        const randomIdcard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdcard, fieldSide);

        console.log(fieldSide)
        document.getElementById(fieldSide).appendChild(cardImage);
        
    }
}

async function resetDuel(){

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    initi();    
}


async function playAudio(status){
    const audio = new Audio (`./src/assets/audios/${status}.wave`);
    
    
    try{
        audio.play(status);
    }catch{}
    

}

function initi(){
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";


  drawCards(5, playerSide.player1);  
  drawCards(5, playerSide.computer);  

  const bgm = document.getElementById("bgm");
  bgm.play();
}

initi();
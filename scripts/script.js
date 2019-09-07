// 程式碼寫在這裡!

let inGame = false

$(document).ready(function () {
	renderCardBack();
	init_buttons();
})

//畫出牌背
function renderCardBack() {
	$('.card div').html('㊖');
}

function init_buttons() {
	$("#action-hit").click(evt => {
		evt.preventDefault()
		yourHandcardDeck.deck.push(deck.deal())
		yourHandcardDeck.renderCard("yourCard")
		checkWinner()
		showWinStamp()
	})

	$("#action-stand").click(evt => {
		evt.preventDefault()
		stand()
		dealerHandcardDeck.renderCard("dealerCard")
		checkWinner()
		showWinStamp()
	})

	$("#action-new-game").click(evt => NewGame())
}


function NewGame() {
	ResetGame()

	$('#action-hit').attr('disabled', !inGame)
	$('#action-stand').attr('disabled', !inGame)

	yourHandcardDeck.deck.push(deck.deal())
	dealerHandcardDeck.deck.push(deck.deal())
	yourHandcardDeck.deck.push(deck.deal())

	yourHandcardDeck.renderCard("yourCard")
	dealerHandcardDeck.renderCard("dealerCard")

	checkWinner()
	showWinStamp()
}

//初始化
function ResetGame() {
	inGame = true
	renderCardBack()
	$('.card div').prev().html('');
	deck = new Deck()
	deck.buildDeck()
	deck.shuffle()

	yourHandcardDeck = new Deck()
	dealerHandcardDeck = new Deck()

	$('.your-cards').removeClass('win')
	$('.dealer-cards').removeClass('win')

}

function stand() {
	let yourPoint = yourHandcardDeck.CalcPoint()
	let dealerPoint = dealerHandcardDeck.CalcPoint()

	while (true) {
		dealerPoint = dealerHandcardDeck.CalcPoint()
		if (dealerPoint < yourPoint) {
			dealerHandcardDeck.deck.push(deck.deal())
		} else {
			break;
		}
	}
}

//判定勝負
function checkWinner() {

	let yourPoint = yourHandcardDeck.CalcPoint()
	let dealerPoint = dealerHandcardDeck.CalcPoint()

	$('.your-cards h1').html(`你（${yourPoint}點）`);
	$('.dealer-cards h1').html(`莊家（${dealerPoint}點）`);

	switch (true) {
		// 1. 如果玩家 21 點，玩家贏
		case yourPoint == 21:
			winner = 1;
			break;

			// 2. 如果點數爆...
		case yourPoint > 21:
			winner = 2;
			break;

		case dealerPoint > 21:
			winner = 1;
			break;

			// 3. 平手
		case yourPoint == dealerPoint:
			winner = 3;
			break;

			// 0. 比點數
		case dealerPoint > yourPoint:
			winner = 2;
			break;

		default:
			winner = 0;
			break;
	}

	if (winner == 0) {
		inGame = true
	} else {
		inGame = false
		$('#action-hit').attr('disabled', !inGame)
		$('#action-stand').attr('disabled', !inGame)
		return winner
	}
}



function showWinStamp() {
	switch (winner) {
		case 1:
			$('.your-cards').addClass('win');
			break;

		case 2:
			$('.dealer-cards').addClass('win');
			break;

		case 3: // 平手
			break;

		default:
			break;
	}
}


class Card {
	constructor(suit, number) {
		this.suit = suit;
		this.number = number;
	}

	// 牌面
	cardNumber() {
		switch (this.number) {
			case 1:
				return 'A';
			case 11:
				return 'J';
			case 12:
				return 'Q';
			case 13:
				return 'K';
			default:
				return this.number;
		}
	}

	// 點數
	cardPoint() {
		switch (this.number) {
			case 1:
				return 11;
			case 11:
			case 12:
			case 13:
				return 10;
			default:
				return this.number;
		}
	}

	// 花色
	cardSuit() {
		switch (this.suit) {
			case 1:
				return '♠';
			case 2:
				return '♥';
			case 3:
				return '♣';
			case 4:
				return '♦';
		}
	}
}


class Deck {
	constructor() {
		this.deck = []
	}

	buildDeck() {
		for (let suit = 1; suit <= 4; suit++) {
			for (let number = 1; number <= 13; number++) {
				this.deck.push(new Card(suit, number))
			}
		}
		return this.deck
	}


	// 洗牌 https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
	shuffle() {
		let currentIndex = this.deck.length,
			temporaryValue, randomIndex;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {

			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex)
			currentIndex -= 1

			// And swap it with the current element.
			temporaryValue = this.deck[currentIndex]
			this.deck[currentIndex] = this.deck[randomIndex]
			this.deck[randomIndex] = temporaryValue
		}
	}

	//發牌
	deal() {
		return this.deck.pop()
	}

	//畫出牌面
	renderCard(html_Card_Id) {
		this.deck.forEach((card, i) => {
			let currentCard = $(`#${html_Card_Id}${i+1}`)
			currentCard.html(card.cardNumber())
			currentCard.prev().html(card.cardSuit())
		})
	}

	//計算點數
	CalcPoint() {
		let point = 0
		let aces = 0

		this.deck.forEach(card => {
			let cardpoint = card.cardPoint()
			point += cardpoint
			while (point > 21 && aces > 0) {
				point -= 10
				aces -= 1
			}
		})

		return point
	}
}
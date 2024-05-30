import { DeckReference, InitCards } from "@/protocol/cards";


export default function Game() {
    const cards = InitCards(4, 52);
    const deck = DeckReference()
    return (
        <div className="flex flex-col gap-2">
            <div>Cards: {JSON.stringify(cards)}</div>
            <div>Length Cards: {cards.length}</div>
            <div>{JSON.stringify(deck)}</div>
        </div>
    )

}
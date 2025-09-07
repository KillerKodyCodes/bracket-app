export interface Match {
    player1: string | null;
    player2: string | null;
    winner: number;
}

export interface Round {
    roundNumber: number;
    roundMatches: Match[];
}

export interface Standings {
    player: string;
    points: number;
}

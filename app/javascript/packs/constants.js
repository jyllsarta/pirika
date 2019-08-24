
const Constants = {
    notes: {
        "z": 0b0001,
        "x": 0b0010,
        "c": 0b0100,
        "v": 0b1000,
    },
    maxLife: 10000,
    dangerLine: 3333,
    safeLine: 9950,
    minDamagePerLife: 10,
    recoverPerNote: 150,
    recoverPerHealNote: 4000,
    dangerDamageReduceRate: 0.60,
    damageIncreaseSpeed: 0.14,
    badDamage: 300,
    displayNotes: 16,
    gameStates: {
        title: 0,
        inGame: 1,
        gameOver: 2,
        cleared: 3,
    },
    healNotesInterval: 25,
};

export default Constants;
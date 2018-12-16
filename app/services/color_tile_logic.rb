module ColorTileLogic
    class Board
        def initialize(row, column, seed)
            @row = row
            @column = column
            @seed = seed
            construct_board(seed)
            # TODO 色数と密度
        end

        def to_json
            @board.to_json
        end

        private

        def construct_board(seed)
            # 盤面生成
            @board = []
            @row.times{ @board.append(Array.new(@column))}

            # 一旦雑に動作確認
            @board[6][5] = 1
            @board[8][5] = 1
            @board[8][3] = 1
            @board[8][7] = 1
            @board[7][6] = 1
        end
    end

    # 別のとこ逃したほうがいいかも
    class SeededRandom
        def initialize(seed=rand(100000000000))
        end
        def next
        end
    end
end
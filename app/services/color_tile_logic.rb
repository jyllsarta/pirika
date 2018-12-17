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
        def initialize(seed=rand(1000000))
            @x = 123456789
            @y = 362436069
            @z = 521288629
            @w = seed
            10000.times {self.next} # 初期値依存性を捨てるために最初の方の乱数値は捨てる
        end

        def next
            t = (@x^(@x<<11))
            t &= 0xFFFFFFFF # for emurating 32bit int 
            @x = @y
            @y = @z
            @z = @w
            @w=(@w^(@w>>19))^(t^(t>>8))
            return @w
        end

        # rand_int(6) returns [0,1,2,3,4,5].example
        def rand_int(max)
            rand = self.next
            return rand / (0xFFFFFFFF/max)
        end
    end
end
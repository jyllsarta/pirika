module ColorTileLogic
    class Board

        class PositionAlreadySet < RuntimeError ;end
        class InsufficientPoints < RuntimeError ;end

        def initialize(row, column, colors, pairs, seed)
            @row = row
            @column = column
            @colors = colors
            @pairs = pairs
            @seed = SeededRandom.new(seed)
            construct_board(@seed)
            # TODO 色数と密度
        end

        def to_json
            {
                board: @board,
                seed: @seed,
                row: @row,
                column: @column,
                colors: @colors,
                pairs: @pairs
            }.to_json
        end

        private

        def construct_board(seed)
            # 盤面生成
            @board = []
            @column.times{ @board.append(Array.new(@row))}
            

            # 一旦雑に動作確認
            @pairs.times do
                put_random_color_pair
            end
        end

        def put_random_color_pair
            begin
                color = @seed.rand_int(6)
                x = @seed.rand_int(@row)
                y = @seed.rand_int(@column)
                raise PositionAlreadySet if @board[y][x]
                points = available_points(x, y)
                raise InsufficientPoints if points.length < 2
                r1 = @seed.rand_int(points.length)
                p1 = points[r1]
                @board[p1[1]][p1[0]] = color
                points.delete_at(r1)
                r2 = @seed.rand_int(points.length)
                p2 = points[r2]
                @board[p2[1]][p2[0]] = color
            rescue PositionAlreadySet
                puts "board #{x}, #{y} already set... retry"
                retry
            rescue InsufficientPoints
                puts "board #{x}, #{y} has insufficient available points... retry" and put_random_color_pair if points.length < 2
                retry
            end
        end

        def pick_random_free_space
            # みたいなので上のx=rand_int, y=rand_int をやめる
        end

        def set_pair_on(available_points)
            # r1, r2 にまかせている部分をここでまとめる
        end

        # @boardに対して、(x,y) からみて上下左右にブロックのない座標一覧を返す
        def available_points(x, y)
            points = []
            (0..(x-1)).to_a.reverse.each do |ix|
                break if @board[y][ix]
                points.append([ix,y])
            end
            (0..(y-1)).to_a.reverse.each do |iy|
                break if @board[iy][x]
                points.append([x,iy])
            end
            ((x+1)..(@row-1)).each do |ix|
                break if @board[y][ix]
                points.append([ix,y])
            end
            ((y+1)..(@column-1)).each do |iy|
                break if @board[iy][x]
                points.append([x,iy])
            end
            pp points
            return points
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
            @w = (@w^(@w>>19))^(t^(t>>8))
            return @w
        end

        # rand_int(6) returns [0,1,2,3,4,5].example
        def rand_int(max)
            rand = self.next
            return rand / (0xFFFFFFFF/max)
        end
    end
end
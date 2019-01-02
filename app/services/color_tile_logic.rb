module ColorTileLogic
    class Board

        class NoAvailablePoints < RuntimeError ;end

        attr_accessor :row, :column, :board

        def initialize(row, column, colors, pairs, seed)
            @row = row
            @column = column
            @colors = colors
            @pairs = pairs
            @seed = SeededRandom.new(seed)
            construct_board(@seed)
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

        def panels
            @board.reduce{ |parent, child| parent + child}
        end

        # 座標が存在するか
        def exists?(x, y)
            !!@board[y].try(:[], x)
        end

        # 座標が存在して、ブロックが置いてあるか
        def block?(x, y)
            exists?(x, y) &&  panel(x, y).block?
        end

        def panel(x, y)
            return nil if !exists?(x, y)
            @board[y][x]
        end

        private

        def construct_board(seed)
            # 盤面生成
            @board = []
            @column.times do |y|
                row = []
                @row.times do |x|
                    row.append(Panel.new(x, y))
                end
                @board.append(row)
            end
            # ペア生成
            @board[7][4].color_id = 2
            @board[4][8].color_id = 2

            @board[10][4].color_id = 2
            @board[12][4].color_id = 2

            10.times{put_block}
        end

        def puttable_panels
            return panels.select{|panel| Cross.new(self, panel).puttable?}
        end

        def put_block
            panels = puttable_panels
            raise NoAvailablePoints if panels.empty?

            points = Cross.new(self, panels.sample).available_panels

            p1 = points.sample
            p2 = (panels - [p1]).sample

            random_color = (1..@colors).to_a.sample

            pp [p1,p2]
            panel(p1.x, p1.y).color_id = random_color
            panel(p2.x, p2.y).color_id = random_color
        end

        def set_pair_on(available_points)
            # r1, r2 にまかせている部分をここでまとめる
        end
    end

    class Panel
        attr_accessor :color_id, :x, :y
        def initialize(x,y)
            @x = x
            @y = y
            @color_id = nil
        end

        def to_json
            @color_id
        end

        def block?
            !@color_id.nil?
        end
    end

    class Cross
        def initialize(board, panel)
            @board = board
            @panel = panel
        end

        # ブロック設置ができる基準点かどうか
        def puttable?
            x = @panel.x
            y = @panel.y
            # 上下左右を見て、3つ以上埋まってたら置けない
            [
                @board.block?(x-1, y),
                @board.block?(x, y-1),
                @board.block?(x+1, y),
                @board.block?(x, y+1),
            ].select{|x| x}.length < 3
        end

        # ブロック設置候補になるパネルのリストをかえす
        def available_panels
            points = []
            x = @panel.x
            y = @panel.y
            # 5マスまで奥にブロックを探しに行くが、画面端かブロックにぶつかったらそこでその方向の探索は終了
            distance = 2
            ((x-1-distance)..(x-1)).to_a.reverse.each do |ix|
                break if !@board.exists?(ix, y) || @board.block?(ix, y)
                points.append(@board.panel(ix, y))
            end
            ((y-1-distance)..(y-1)).to_a.reverse.each do |iy|
                break if !@board.exists?(x, iy) || @board.block?(x, iy)
                points.append(@board.panel(x, iy))
            end
            ((x+1)..(x+1+distance)).each do |ix|
                break if !@board.exists?(ix, y) || @board.block?(ix, y)
                points.append(@board.panel(ix, y))
            end
            ((y+1)..(y+1+distance)).each do |iy|
                break if !@board.exists?(x, iy) || @board.block?(x, iy)
                points.append(@board.panel(x, iy))
            end
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
module ColorTileLogic
    class Board

        class NoAvailablePoints < RuntimeError ;end
        class InsufficientPoints < RuntimeError ;end
        class PositionAlreadySet < RuntimeError ;end
        PICK_RETRY_MAX = 5

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
                seed: @seed.seed,
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
            exists?(x, y) && panel(x, y).block?
        end

        # 座標が存在して、ブロックがない
        def free?(x, y)
            exists?(x, y) && !panel(x, y).block?
        end

        def panel(x, y)
            return nil if !exists?(x, y)
            @board[y][x]
        end

        def score_by_click(x, y)
            return 0 if block?(x, y)
            Cross.new(@board, panel(x, y)).score
        end

        def click!(x, y)
            return if block?(x, y)
            Cross.new(@board, panel(x, y)).destruct
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
            @pairs.times{put_block}
        end

        # 試しに座標一つ指定してみて、そこ基準でブロックのペアを置けないならもう一度繰り返す
        def pick_puttable_panel
            retry_count = 0
            begin
                retry_count += 1
                return pick_available_panel_by_scan_all if retry_count > PICK_RETRY_MAX
                x = @seed.rand_int(@row)
                y = @seed.rand_int(@column)
                raise PositionAlreadySet unless free?(x, y)
                raise InsufficientPoints unless Cross.new(self, panel(x,y)).puttable?
            rescue PositionAlreadySet
                puts "board #{x}, #{y} already set... retry"
                retry
            rescue InsufficientPoints
                puts "board #{x}, #{y} has insufficient available points... retry"
                retry
            end
            panel(x, y)
        end

        # ブロックのペアを置ける場所をリストアップして、そこから一つ選ぶ
        def pick_available_panel_by_scan_all
            puts "achieved retry max. start scan"
            all_puttable_points = panels.select{|panel| Cross.new(self, panel).puttable?}
            raise NoAvailablePoints if all_puttable_points.empty?

            @seed.sample(all_puttable_points)
        end         

        def put_block
            panel = pick_puttable_panel

            points = Cross.new(self, panel).available_panels

            p1 = @seed.sample(points)
            p2 = @seed.sample(points - [p1])
            random_color = @seed.rand_int(@colors) + 1 # jsだと0はfalsyなので、色IDは1オリジンとする

            panel(p1.x, p1.y).color_id = random_color
            panel(p2.x, p2.y).color_id = random_color
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
        SEARCH_DISTANCE = 5

        def initialize(board, panel)
            @board = board
            @panel = panel
        end

        # ブロック設置ができる基準点かどうか
        def puttable?
            x = @panel.x
            y = @panel.y
            # 上下左右を見て、空いている方向が2つ以上あればそこには設置可能
            [
                @board.free?(x-1, y),
                @board.free?(x, y-1),
                @board.free?(x+1, y),
                @board.free?(x, y+1),
            ].select{|b| b}.length >= 2
        end

        # ブロック設置候補になるパネルのリストをかえす
        def available_panels
            points = []
            x = @panel.x
            y = @panel.y
            # SEARCH_DISTANCEマス先まで、前方に探索していって壁かブロックにぶつかったら終了
            distance = SEARCH_DISTANCE
            ((x-1-distance)..(x-1)).to_a.reverse.each do |ix|
                break unless @board.free?(ix, y)
                points.append(@board.panel(ix, y))
            end
            ((y-1-distance)..(y-1)).to_a.reverse.each do |iy|
                break unless @board.free?(x, iy)
                points.append(@board.panel(x, iy))
            end
            ((x+1)..(x+1+distance)).each do |ix|
                break unless @board.free?(ix, y)
                points.append(@board.panel(ix, y))
            end
            ((y+1)..(y+1+distance)).each do |iy|
                break unless @board.free?(x, iy)
                points.append(@board.panel(x, iy))
            end
            return points
        end
    end

    class SimulatorCross
        def initialize(board, panel)
            @board = board
            @panel = panel
            @up = find_first_block(up_panels);
            @down = find_first_block(down_panels);
            @left = find_first_block(left_panels);
            @right = find_first_block(right_panels);
        end

        def score
            paired_blocks.length ** 2 * 2
        end

        private

        def paired_blocks
            blocks.select{|block| count_color_in_blocks(block.color_id) >= 2}
        end

        def count_color_in_blocks(color_id)
            blocks.select{|block| block.color_id == color_id}.length
        end

        def blocks
            block = []
            block.append(@up) if @up
            block.append(@down) if @down
            block.append(@left) if @left
            block.append(@right) if @right
            block
        end

        def up_panels
            panels = [];
            (0..(@y-1)).to_a.reverse.each do |iy|
                panels.append(@board.panel(@x, iy));
            end
            return panels
        end

        def down_panels
            panels = [];
            ((@y+1)..@board.row).to_a.reverse.each do |iy|
                panels.append(@board.panel(@x, iy));
            end
            return panels
        end

        def left_panels
            panels = [];
            (0..(@x-1)).to_a.reverse.each do |ix|
                panels.append(@board.panel(ix, @y));
            end
            return panels
        end

        def right_panels
            panels = [];
            ((@x+1)..@board.column).to_a.reverse.each do |ix|
                panels.append(@board.panel(ix, @y));
            end
            return panels
        end

        def find_first_block(panels)
            panels.each do |panel|
                return panel if panel
            end
        end

    end

    # 別のとこ逃したほうがいいかも
    class SeededRandom
        attr_accessor :seed

        def initialize(seed=rand(1000000))
            @x = 123456789
            @y = 362436069
            @z = 521288629
            @w = seed
            @seed = seed
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

        # select random one from array
        def sample(array)
            array[rand_int(array.length)]
        end
    end

    class ColorTileSimulator
        def initialize(seed, clicklogs, x, y, colors, pairs)
            @seed = seed
            @clicklogs = clicklogs
            @x = x
            @y = y
            @colors = colors
            @pairs = pairs
        end

        def score
            @board = Board.new(@x, @y, @colors, @pairs, @seed)
            #TODO スコア計算
        end
    end
end
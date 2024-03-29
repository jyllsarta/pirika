module ColorTileLogic
  class Board
    class NoAvailablePoints < RuntimeError; end
    class InsufficientPoints < RuntimeError; end
    class PositionAlreadySet < RuntimeError; end
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
      return nil unless exists?(x, y)
      @board[y][x]
    end

    def destruct(x, y)
      @board[y][x].color_id = 0
    end

    def score_by_click(x, y)
      return 0 if block?(x, y)
      SimulatorCross.new(self, panel(x, y)).score
    end

    def click!(x, y)
      return if block?(x, y)
      SimulatorCross.new(self, panel(x, y)).destruct
    end

    def w
      @row
    end

    def h
      @column
    end

    def print_board
      @board.each do |row|
        puts row.map{|panel| panel.color_id || 0}.join(",")
      end
    end

    def apply_difficulty(difficulty_id)
      case difficulty_id
      when 1
        self.panels.map{|panel| panel.color_id = 0 if panel.color_id > 9}
        self.panels.map{|panel| panel.color_id += 1 if panel.color_id.odd?}
      when 2
        self.panels.map{|panel| panel.color_id = 0 if panel.color_id > 9}
      when 3
      # do nothing
      else
        raise NotImplementedError
      end
    end

    private

    def construct_board(_seed)
      # 盤面生成
      @board = []
      @column.times do |y|
        row = []
        @row.times do |x|
          row.append(Panel.new(x, y))
        end
        @board.append(row)
      end
      @pairs.times do |i|
        put_block(i % (@colors + 1))
      end
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
        #puts "board #{x}, #{y} already set... retry"
        retry
      rescue InsufficientPoints
        #puts "board #{x}, #{y} has insufficient available points... retry"
        retry
      end
      panel(x, y)
    end

    # ブロックのペアを置ける場所をリストアップして、そこから一つ選ぶ
    def pick_available_panel_by_scan_all
      #puts "achieved retry max. start scan"
      all_puttable_points = panels.select{|panel| Cross.new(self, panel).puttable?}
      raise NoAvailablePoints if all_puttable_points.empty?

      @seed.sample(all_puttable_points)
    end

    def put_block(color_id)
      panel = pick_puttable_panel

      points = Cross.new(self, panel).available_panels

      p1 = @seed.sample(points)
      p2 = @seed.sample(points - [p1])

      panel(p1.x, p1.y).color_id = color_id
      panel(p2.x, p2.y).color_id = color_id
    end
  end

  class Panel
    attr_accessor :color_id, :x, :y
    def initialize(x,y)
      @x = x
      @y = y
      @color_id = 0
    end

    def to_json
      @color_id
    end

    def block?
      @color_id != 0
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
        @board.free?(x - 1, y),
        @board.free?(x, y - 1),
        @board.free?(x + 1, y),
        @board.free?(x, y + 1),
      ].select{|b| b}.length >= 2
    end

    # ブロック設置候補になるパネルのリストをかえす
    def available_panels
      points = []
      x = @panel.x
      y = @panel.y
      # SEARCH_DISTANCEマス先まで、前方に探索していって壁かブロックにぶつかったら終了
      distance = SEARCH_DISTANCE
      ((x - 1 - distance)..(x - 1)).to_a.reverse_each do |ix|
        break unless @board.free?(ix, y)
        points.append(@board.panel(ix, y))
      end
      ((y - 1 - distance)..(y - 1)).to_a.reverse_each do |iy|
        break unless @board.free?(x, iy)
        points.append(@board.panel(x, iy))
      end
      ((x + 1)..(x + 1 + distance)).each do |ix|
        break unless @board.free?(ix, y)
        points.append(@board.panel(ix, y))
      end
      ((y + 1)..(y + 1 + distance)).each do |iy|
        break unless @board.free?(x, iy)
        points.append(@board.panel(x, iy))
      end
      points
    end
  end

  class SimulatorCross
    def initialize(board, panel)
      @board = board
      @panel = panel
      @up = find_first_block(up_panels)
      @down = find_first_block(down_panels)
      @left = find_first_block(left_panels)
      @right = find_first_block(right_panels)
    end

    def score
      paired_blocks.length**2 * 2
    end

    def destruct
      paired_blocks.map{|block| @board.destruct(block.x, block.y)}
    end

    private

    def paired_blocks
      blocks.select{|block| count_color_in_blocks(block.color_id) >= 2}
    end

    def count_color_in_blocks(color_id)
      blocks.select{|block| !block.color_id.nil? && block.color_id == color_id}.length
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
      panels = []
      (0..(@panel.y - 1)).to_a.reverse_each do |iy|
        panels.append(@board.panel(@panel.x, iy))
      end
      panels
    end

    def down_panels
      panels = []
      ((@panel.y + 1)..@board.h).to_a.each do |iy|
        panels.append(@board.panel(@panel.x, iy))
      end
      panels
    end

    def left_panels
      panels = []
      (0..(@panel.x - 1)).to_a.reverse_each do |ix|
        panels.append(@board.panel(ix, @panel.y))
      end
      panels
    end

    def right_panels
      panels = []
      ((@panel.x + 1)..@board.w).to_a.each do |ix|
        panels.append(@board.panel(ix, @panel.y))
      end
      panels
    end

    def find_first_block(panels)
      panels.each do |panel|
        return panel if !panel.try(:color_id).nil? && panel.try(:color_id) != 0
      end
      nil
    end
  end

  # 別のとこ逃したほうがいいかも
  class SeededRandom
    attr_accessor :seed

    def initialize(seed)
      @x = 123456789
      @y = 362436069
      @z = 521288629
      @w = seed
      @seed = seed
      10000.times {self.next} # 初期値依存性を捨てるために最初の方の乱数値は捨てる
    end

    def next
      t = (@x ^ (@x << 11))
      t &= 0xFFFFFFFF # for emurating 32bit int
      @x = @y
      @y = @z
      @z = @w
      @w = (@w ^ (@w >> 19)) ^ (t ^ (t >> 8))
      @w
    end

    # rand_int(6) returns [0,1,2,3,4,5].example
    def rand_int(max)
      rand = self.next
      rand / (0xFFFFFFFF / max)
    end

    # select random one from array
    def sample(array)
      array[rand_int(array.length)]
    end
  end

  class ColorTileSimulator
    def initialize(seed, clicklogs, w, h, colors, pairs, difficulty)
      @seed = seed
      @clicklogs = clicklogs
      @w = w
      @h = h
      @colors = colors
      @pairs = pairs
      @difficulty = difficulty
    end

    def score_rate(difficulty_id)
      case difficulty_id
      when 1
        1
      when 2
        1.5
      when 3
        2
      else
        raise NotImplementedError
      end
    end

    def score
      @board = Board.new(@w, @h, @colors, @pairs, @seed)
      @board.apply_difficulty(@difficulty)
      sum = 0
      @clicklogs.each do |_, click|
        x,y = click[:message].split(",").map(&:to_i)
        click_score = @board.score_by_click(x, y) * score_rate(@difficulty)
        @board.click!(x, y) if click_score > 0
        sum += click_score
      end
      sum
    end

    def extinct?
      @board = Board.new(@w, @h, @colors, @pairs, @seed)
      @board.apply_difficulty(@difficulty)
      @clicklogs.each do |_, click|
        x,y = click[:message].split(",").map(&:to_i)
        click_score = @board.score_by_click(x, y)
        @board.click!(x, y) if click_score > 0
      end
      @board.panels.all?{|panel| panel.color_id == 0}
    end
  end
end

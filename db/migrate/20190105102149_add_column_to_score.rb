class AddColumnToScore < ActiveRecord::Migration[5.1]
  def change
    add_column :scores, :seed, :integer
    add_column :scores, :score, :integer
    add_column :scores, :username, :string
    add_column :scores, :playlog, :text
  end
end

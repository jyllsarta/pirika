class AddExtincted < ActiveRecord::Migration[5.2]
  def change
    add_column :results, :extinct, :boolean
  end
end

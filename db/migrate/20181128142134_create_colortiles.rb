class CreateColortiles < ActiveRecord::Migration[5.1]
  def change
    create_table :colortiles do |t|

      t.timestamps
    end
  end
end

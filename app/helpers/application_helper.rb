module ApplicationHelper
  def full_title(content_title)
    if !content_title
      return "さーたはうす"
    end
    "#{content_title} | さーたはうす"
  end

  def screenshot_entries(directory_name)
    Rails.root.join("public", "images", "screenshot", directory_name).entries.reject(&:directory?).map do |filename|
      "/images/screenshot/#{directory_name}/#{filename}"
    end
  end
end

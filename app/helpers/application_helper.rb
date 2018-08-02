module ApplicationHelper
    def full_title(content_title)
        if !content_title
            return "さーたはうす"
        end
        "#{content_title} | さーたはうす"
    end
end

class ContactsController < ApplicationController

    require 'net/http'
    require 'uri'

    def new
        @contact = Contact.new
    end

    def create
        if params[:contact].nil?
            render :error
        end
        @name = params[:contact][:name]
        @email = params[:contact][:email]
        @content = params[:contact][:content]
        # require, permit使うほど仰々しい機能でないので...
        if @name.blank? || @content.blank? || @email.blank?
            flash.now[:danger] = "未入力項目があります..."
            @contact = Contact.new
            @contact.name = @name
            @contact.email = @email
            @contact.content = @content
            render :new
            return
        end
        contact = Contact.new({
            name: @name,
            email: @email,
            content: @content
        })
        if contact.save
            # mailer使うのも検討したけど
            url = "https://script.google.com/macros/s/AKfycbzbEZJMtB8uodJyYvn4QRdRFA3LQ4s8O9YtzPO_Yx-sMBf6WJT1/exec"
            query = {
                name: @name,
                email: @email,
                content: @content,
                isTest: false
            }
            res = Net::HTTP.post_form(URI.parse(url), query)
            if res.code == "200" #GASのほうでエラー出てる200、 うまくいくと302が返る(謎)
                redirect_to "/500.html"
                return
            end
        end
    end

end

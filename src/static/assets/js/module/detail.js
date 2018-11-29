define(['jquery'], function($) {
    var main = {
        $btn: $('#loadReviews'),
        $container: $('#reviewsContainer'),
        start: 0,
        count: 9,
        size: 10,
        isLoad: false,


        init: function() {
            this.bindEvent();
        },

        buildDOM: function(data) {
            var str = '';
            
            for (var i = 0, l = data.length; i < l; i++) {
                str += '<li>'
                    + '     <div class="reviews-user">'
                    + '         <img src="' + data[i].author.avatar + '" class="reviews-photo">'
                    + '         <span class="reviews-name">' + data[i].author.name + '</span>'
                    + '         <span class="reviews-date">' + data[i].created_at + '</span>'
                    + '     </div>'
                    + '     <h5 class="reviews-title">' + data[i].title + '</h5>'
                    + '     <p class="reviews-content">' + data[i].summary + '</p>'
                    + '     <p class="reviews-useful">'
                    + '         <span><i class="up"></i>' + data[i].useful_count + '</span>'
                    + '         <span><i class="down"></i>' + data[i].useless_count + '</span>'
                    + '     </p>'
                    + ' </li>';
            }

            return str;
        },

        loadReviews: function() {
            if (this.isLoad) return;

            $.ajax({
                url: '/_api/reviews/',
                type: 'GET',
                data: {
                    id: this.$btn.attr('data-id'),
                    start: this.start,
                    count: this.count
                },
                context: this,
                beforeSend: function() {
                    this.isLoad = true;
                },
                success: function(res) {
                    if (res.hasOwnProperty('reviews')) {
                        this.$container.append(this.buildDOM(res.reviews));
                    } else {
                        console.log(res);
                    }
                },
                complete: function(self) {
                    if (this.start < self.responseJSON.total) {
                        this.start = this.count + 1;
                        this.count += this.size;
                        this.isLoad = false;
                    } else {
                        this.$btn.html('没有啦');
                    }
                }
            })
        },

        bindEvent: function() {
            var that = this;

            this.$btn.on('click', function() {
                that.loadReviews()
            });
        }
    }

    main.init();
})
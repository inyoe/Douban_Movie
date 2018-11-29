define(['jquery'], function($) {
    var main = {
        $btn: $('#btnUpload'),
        $container: $('#uploadPreview'),
        isLoad: false,

        init: function() {
            this.bindEvent();
        },

        buildDOM: function(data) {
            var str = '';

            for (var i in data) {
                str += '<img src="' + data[i] + '">'
            }

            return str;
        },

        upload: function(files) {
            if (this.isLoad) return;

            var data = new FormData();
            data.append('name', 'myFiles');
            for (var i = 0, l = files.length; i < l; i++) {
                data.append('image_' + i, files[i]);
            }

            $.ajax({
                url: '/_api/upload/',
                type: 'post',
                processData: false,
                contentType: false,
                data: data,
                context: this,
                beforeSend: function() {
                    this.isLoad = true;
                },
                success: function (res) {
                    if (res.code === 0) {
                        this.$container.html(this.buildDOM(res._files))
                    }
                },
                complete: function() {
                    this.isLoad = false;
                }
            })
        },

        bindEvent: function() {
            var that = this;

            this.$btn.on('change', function() {
                that.upload($(this).get(0).files);
                $(this).val('');
            });

            this.$container.on('click', 'img', function() {
                window.open($(this).attr('src'));
            })
        }
    }

    main.init();
})
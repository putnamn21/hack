(function ($, undefined) {
    $.fn.zyComment = function (options, param) {
        var otherArgs = Array.prototype.slice.call(arguments, 1);
        if (typeof options == 'string') {
            var fn = this[0][options];
            if ($.isFunction(fn)) {
                return fn.apply(this, otherArgs);
            } else {
                throw ("zyComment - No such method: " + options);
            }
        }

        return this.each(function () {
            var para = {};
            var self = this;
            var fCode = 0;

            var defaults = {
                "width": "355",
                "height": "33",
                "agoComment": [], // past comment content
                "callback": function (comment) {
                    console.info("back comment index");
                    console.info(comment);
                }
            };

            para = $.extend(defaults, options);

            this.init = function () {
                this.createAgoCommentHtml(); // create html for past comments
            };

            this.createAgoCommentHtml = function () {

                var html = '';
                html += '<div id="commentItems" class="ui threaded comments" style="margin-bottom:20px;">';
                html += '	<div class="text" style="font-size:2rem;padding-bottom:10px;border-bottom: 1px solid #DFDFDF;"> Pure Knowledge Forum </div>';
                html += '</div>';
                $(self).append(html);

                $.each(para.agoComment, function (k, v) {

                    var topStyle = "";
                    if (k > 0) {
                        topStyle = "topStyle";
                    }

                    var item = '';
                    item += '<div id="comment' + v.id + '" class="comment">';
                    item += '	<a class="avatar">';
                    item += '		<img src="images/foot.png">';
                    item += '	</a>';
                    item += '	<div class="content ' + topStyle + '">';
                    item += '		<a class="author"> ' + v.userName + ' </a>';
                    item += '		<div class="metadata">';
                    item += '			<span class="date"> ' + v.time + ' </span>';
                    item += '		</div>';
                    item += '		<div class="text"> ' + v.content + ' </div>';
                    item += '		<div class="actions">';
                    item += '			<a class="reply" href="javascript:void(0)" selfID="' + v.id + '" >Reply</a>';
                    item += '		</div>';
                    item += '	</div>';
                    item += '</div>';

                    // validate if this comment is sub-comment
                    if (v.sortID == 0) { // no
                        $("#commentItems").append(item);
                    } else { // no
                        // validate if parent comment already had sub comment
                        if ($("#comment" + v.sortID).find(".comments").length == 0) { // no
                            var comments = '';
                            comments += '<div id="comments' + v.sortID + '" class="comments">';
                            comments += item;
                            comments += '</div>';

                            $("#comment" + v.sortID).append(comments);
                        } else { // yes
                            $("#comments" + v.sortID).append(item);
                        }
                    }
                });

                this.createFormCommentHtml(); // create html for submitting comments
            };


            this.createFormCommentHtml = function () {
                // add in parent container
                $(self).append('<div id="commentFrom"></div>');

                // organize code for form html
                var boxHtml = '';
                boxHtml += '<form id="replyBoxAri" class="ui reply form">';
                boxHtml += '	<div class="ui large form ">';
                boxHtml += '		<div class="two fields">';
                boxHtml += '			<div class="field" >';
                boxHtml += '				<input type="text" id="userName" />';
                boxHtml += '				<label class="userNameLabel" for="userName">Your Name</label>';
                boxHtml += '			</div>';
                boxHtml += '			<div class="field" >';
                boxHtml += '				<input type="text" id="userEmail" />';
                boxHtml += '				<label class="userEmailLabel" for="userName">E-mail</label>';
                boxHtml += '			</div>';
                boxHtml += '		</div>';
                boxHtml += '		<div class="contentField field" >';
                boxHtml += '			<textarea id="commentContent"></textarea>';
                boxHtml += '			<label class="commentContentLabel" for="commentContent">Content</label>';
                boxHtml += '		</div>';
                boxHtml += '		<div id="submitComment" class="ui button teal submit labeled icon">';
                boxHtml += '			<i class="icon edit"></i> Sumit Reply';
                boxHtml += '		</div>';
                boxHtml += '	</div>';
                boxHtml += '</form>';

                $("#commentFrom").append(boxHtml);

                // reset click event after html
                this.addEvent();
            };


            this.addEvent = function () {
                // reply event on the item
                this.replyClickEvent();

                // cancel reply event on the item
                this.cancelReplyClickEvent();

                // reply event
                this.addFormEvent();
            };


            this.replyClickEvent = function () {
                // reply button onclick
                $(self).find(".actions .reply").live("click", function () {
                    // set up id of the current reply
                    fCode = $(this).attr("selfid");

                    // remove previous reply button
                    $(self).find(".cancel").remove();

                    // remove all comment forms
                    self.removeAllCommentFrom();

                    // add button for cancelling reply
                    $(this).parent(".actions").append('<a class="cancel" href="javascript:void(0)">Cancel Reply</a>');

                    // add reply after a reply
                    self.addReplyCommentFrom($(this).attr("selfID"));

                    // submit event
                    $("#publicComment").die("click");
                    $("#publicComment").live("click", function () {
                        var result = {
                            "name": $("#userName").val(),
                            "email": $("#userEmail").val(),
                            "content": $("#commentContent").val()
                        };
                        para.callback(result);
                    });
                });

            };


            this.cancelReplyClickEvent = function () {
                $(self).find(".actions .cancel").die("click");
                $(self).find(".actions .cancel").live("click", function () {
                    // remove previous cancel reply button
                    $(self).find(".cancel").remove();

                    // remove all comment form
                    self.removeAllCommentFrom();

                    // add in reply form under root
                    self.addRootCommentFrom();
                });
            };


            this.addFormEvent = function () {
                $("textarea,input").die("focus");
                $("textarea,input").die("blur");
                //reply effect
                $("textarea,input").live("focus", function () {
                    // remove
                    $(this).next("label").removeClass("blur-foucs").addClass("foucs");
                }).live("blur", function () {
                    // if no input in the form
                    if ($(this).val() == '') {
                        // remove original effect
                        if ($(this).attr("id") == "commentContent") {
                            $(this).next("label").removeClass("foucs").addClass("areadefault");
                        } else {
                            $(this).next("label").removeClass("foucs").addClass("inputdefault");
                        }
                    } else { // with input, add effect
                        $(this).next("label").addClass("blur-foucs");
                    }
                });

                // submit event
                $("#submitComment").die("click");
                $("#submitComment").live("click", function () {
                    var result = {
                        "name": $("#userName").val(),
                        "email": $("#userEmail").val(),
                        "content": $("#commentContent").val()
                    };
                    para.callback(result);
                });
            };

            // remove all comment
            this.removeAllCommentFrom = function () {
                // remove reply after the comment
                if ($(self).find("#replyBox")[0]) {
                    // delete reply window
                    $(self).find("#replyBox").remove();
                }

                // delete box
                if ($(self).find("#replyBoxAri")[0]) {
                    $(self).find("#replyBoxAri").remove();
                }
            };

            // add in reply under a reply
            this.addReplyCommentFrom = function (id) {
                var boxHtml = '';
                boxHtml += '<form id="replyBox" class="ui reply form">';
                boxHtml += '	<div class="ui  form ">';
                //boxHtml += '		<div class="two fields">'
                boxHtml += '			<div class="field" >';
                boxHtml += '				<input type="text" id="userName" />';
                boxHtml += '				<label class="userNameLabel" for="userName">Your Name</label>';
                boxHtml += '			</div>';
                boxHtml += '			<div class="field" >';
                boxHtml += '				<input type="text" id="userEmail" />';
                boxHtml += '				<label class="userEmailLabel" for="userName">E-mail</label>';
                boxHtml += '			</div>';
                //boxHtml += '		</div>';
                boxHtml += '		<div class="contentField field" >';
                boxHtml += '			<textarea id="commentContent"></textarea>';
                boxHtml += '			<label class="commentContentLabel" for="commentContent">Content</label>';
                boxHtml += '		</div>';
                boxHtml += '		<div id="publicComment" class="ui button teal submit labeled icon">';
                boxHtml += '			<i class="icon edit"></i> Submit Comment';
                boxHtml += '		</div>';
                boxHtml += '	</div>';
                boxHtml += '</form>';

                $(self).find("#comment" + id).find(">.content").after(boxHtml);

            };

            // add reply under the root
            this.addRootCommentFrom = function () {
                var boxHtml = '';
                boxHtml += '<form id="replyBoxAri" class="ui reply form">';
                boxHtml += '	<div class="ui large form ">';
                boxHtml += '		<div class="two fields">';
                boxHtml += '			<div class="field" >';
                boxHtml += '				<input type="text" id="userName" />';
                boxHtml += '				<label class="userNameLabel" for="userName">Your Name</label>';
                boxHtml += '			</div>';
                boxHtml += '			<div class="field" >';
                boxHtml += '				<input type="text" id="userEmail" />';
                boxHtml += '				<label class="userEmailLabel" for="userName">E-mail</label>';
                boxHtml += '			</div>';
                boxHtml += '		</div>';
                boxHtml += '		<div class="contentField field" >';
                boxHtml += '			<textarea id="commentContent"></textarea>';
                boxHtml += '			<label class="commentContentLabel" for="commentContent">Content</label>';
                boxHtml += '		</div>';
                boxHtml += '		<div id="submitComment" class="ui button teal submit labeled icon">';
                boxHtml += '			<i class="icon edit"></i> Submit Comment';
                boxHtml += '		</div>';
                boxHtml += '	</div>';
                boxHtml += '</form>';

                $(self).find("#commentFrom").append(boxHtml);
            };

            // get id of the comment
            this.getCommentFId = function () {
                return parseInt(fCode);
            };

            // set content when successfully comment
            this.setCommentAfter = function (param) {
                // remove previous button for cancel reply
                $(self).find(".cancel").remove();
                // add in content for new comment
                self.addNewComment(param);
                // leave reply window as reply status
                self.removeAllCommentFrom();
                // add reply under the root
                self.addRootCommentFrom();
            };

            // add in content for new comment
            this.addNewComment = function (param) {
                var topStyle = "";
                if (parseInt(fCode) != 0) {
                    topStyle = "topStyle";
                }

                var item = '';
                item += '<div id="comment' + param.id + '" class="comment">';
                item += '	<a class="avatar">';
                item += '		<img src="images/foot.png">';
                item += '	</a>';
                item += '	<div class="content ' + topStyle + '">';
                item += '		<a class="author"> ' + param.name + ' </a>';
                item += '		<div class="metadata">';
                item += '			<span class="date"> ' + param.time + ' </span>';
                item += '		</div>';
                item += '		<div class="text"> ' + param.content + ' </div>';
                item += '		<div class="actions">';
                item += '			<a class="reply" href="javascript:void(0)" selfID="' + param.id + '" >Reply</a>';
                item += '		</div>';
                item += '	</div>';
                item += '</div>';

                if (parseInt(fCode) == 0) { // add to root
                    $("#commentItems").append(item);
                } else {
                    // validate if the parent comment has sub comment
                    if ($("#comment" + fCode).find(".comments").length == 0) { // no
                        var comments = '';
                        comments += '<div id="comments' + fCode + '" class="comments">';
                        comments += item;
                        comments += '</div>';

                        $("#comment" + fCode).append(comments);
                    } else { // yes
                        $("#comments" + fCode).append(item);
                    }
                }
            };


            // fire
            this.init();
        });
    };
})(jQuery);
$(document).ready(function () {
    loadComments();

    // 댓글 추가
    $('#commentBtn').on('click', function () {
        const commentText = $('#commentTxt').val();
        const commenterName = $('#nameTxt').val();
        submitComment(commentText, commenterName);
    });

    // Firebase에 댓글 추가
    function submitComment(comment, name) {
        $.ajax({
            url: 'https://project-aa48a-default-rtdb.asia-southeast1.firebasedatabase.app/comments.json',
            type: 'POST',
            data: JSON.stringify({
                text: comment,
                name: name,
                timestamp: Date.now()
            }),
            contentType: 'application/json',
            success: function () {
                $('#commentTxt').val('');
                $('#nameTxt').val('');
                loadComments(); // 모든 댓글 로드
            },
            error: function (error) {
                console.error('Error submitting comment:', error);
            }
        });
    }

    // Firebase에서 댓글 로드
    function loadComments() {
        $.ajax({
            url: 'https://project-aa48a-default-rtdb.asia-southeast1.firebasedatabase.app/comments.json',
            type: 'GET',
            success: function (data) {
                const commentsContainer = $('#comment');
                commentsContainer.empty();
                if (data) {
                    for (let key in data) {
                        const comment = data[key];
                        commentsContainer.append(`
                            <tr data-id="${key}">
                                <td>${key}</td>
                                <td>${comment.text}</td>
                                <td>${comment.name}</td>
                                <td><button class="editBtn">수정</button></td>
                                <td><button class="deleteBtn">삭제</button></td>
                            </tr>
                        `);
                    }
                } else {
                    commentsContainer.append(`<tr><td colspan="5">댓글이 없습니다.</td></tr>`);
                }
            },
            error: function (error) {
                console.error('Error loading comments:', error);
            }
        });
    }

    // 댓글 수정
    $(document).on('click', '.editBtn', function () {
        const row = $(this).closest('tr');
        const commentId = row.data('id');
        const commentText = row.find('td:eq(1)').text();
        const commentName = row.find('td:eq(2)').text();

        $('#commentTxt').val(commentText);
        $('#nameTxt').val(commentName);

        $('#commentBtn').off('click').on('click', function () {
            updateComment(commentId, $('#commentTxt').val(), $('#nameTxt').val());
        });
    });

    // 댓글 업데이트
    function updateComment(id, text, name) {
        $.ajax({
            url: `https://project-aa48a-default-rtdb.asia-southeast1.firebasedatabase.app/comments/${id}.json`,
            type: 'PUT',
            data: JSON.stringify({ text: text, name: name }),
            contentType: 'application/json',
            success: function () {
                $('#commentTxt').val('');
                $('#nameTxt').val('');
                loadComments();
            },
            error: function (error) {
                console.error('Error updating comment:', error);
            }
        });
    }

    // 댓글 삭제
    $(document).on('click', '.deleteBtn', function () {
        const commentId = $(this).closest('tr').data('id');
        deleteComment(commentId);
    });

    function deleteComment(id) {
        $.ajax({
            url: `https://project-aa48a-default-rtdb.asia-southeast1.firebasedatabase.app/comments/${id}.json`,
            type: 'DELETE',
            success: function () {
                loadComments();
            },
            error: function (error) {
                console.error('Error deleting comment:', error);
            }
        });
    }
});

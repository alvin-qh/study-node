import $ from "jquery";
import "bootstrap";
import FormValidation from "formvalidation";

import ns from "../common/ns";
import loadingImg from "../../images/loading.gif";

ns('routing.index', function () {
    function _resetAjaxForm() {
        $('.loading').hide();
        $('.btn-question').prop('disabled', false).removeClass('disabled');
    }

    // $('#login-form').formValidation();
    $('.loading>img').attr('src', loadingImg);
    console.log(FormValidation);

    // FormValidation.formValidation(
    //     document.getElementById('demoForm'),
    //     {
    //         fields: {
    //             ...
    //         },
    //         plugins: {
    //             bootstrap: new FormValidation.plugins.Bootstrap(),
    //             ...
    //         },
    //     }
    // );

    $('#question-form').formValidation().on('success.form.fv', e => {
        e.preventDefault();

        $('.loading').show('fast');

        const $question = $('input[name=question]');
        const $answer = $('div.answer');

        setTimeout(() => {
            $.get('/routing/question', {'question': $question.val()}, data => {
                $answer.show('fast').find('p.content').text(data.answer);
                _resetAjaxForm();
            }, 'jsonp').fail(function () {
                alert("Net work failed, please try again later");
                _resetAjaxForm();
            });
        }, 2000);
    });
});